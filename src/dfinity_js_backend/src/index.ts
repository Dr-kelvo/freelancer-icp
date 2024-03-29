import {
  query,
  update,
  text,
  Record,
  StableBTreeMap,
  Variant,
  Vec,
  Ok,
  Err,
  ic,
  Opt,
  None,
  Some,
  Principal,
  Duration,
  nat64,
  bool,
  Result,
  Canister,
} from "azle";
import {
  Ledger,
  binaryAddressFromPrincipal,
  hexAddressFromPrincipal,
} from "azle/canisters/ledger";
//@ts-ignore
import { hashCode } from "hashcode";
// Importing UUID v4 for generating unique identifiers
// @ts-ignore
import { v4 as uuidv4 } from "uuid";

/**
 * This type represents an service that can be listed on an service manager.
 * It contains basic properties needed to define an service.
 */
const Service = Record({
  id: text,
  title: text,
  description: text,
  category: text,
  status: text,
  user: Principal,
  freelancer: Opt(text),
  cost: nat64,
  terms: text,
  deadline: text,
  createdAt: text,
  updatedAt: Opt(text),
});

// Payload structure for creating an service
const ServicePayload = Record({
  title: text,
  description: text,
  category: text,
  terms: text,
  deadline: text,
});

// Payload structure for updating an service
const UpdateServicePayload = Record({
  id: text,
  description: text,
});

// Structure representing a user
const User = Record({
  id: text,
  principal: Principal,
  userName: text,
  email: text,
  expertise: text,
  bio: text,
  imageUrl: text,
  skills: Vec(text),
  services: Vec(text),
  portfolios: Vec(text),
});

// Payload structure for creating a user
const UserPayload = Record({
  userName: text,
  email: text,
  expertise: text,
  bio: text,
  imageUrl: text,
  skills: Vec(text),
  portfolios: Vec(text),
});

// Payload structure for updating a user
const UpdateUserPayload = Record({
  id: text,
  userName: text,
  email: text,
  expertise: text,
  bio: text,
  imageUrl: text,
  portfolios: Vec(text),
});

export const SubscriptionStatus = Variant({
  SubscriptionPending: text,
  Completed: text,
});

export const ReserveSubscription = Record({
  price: nat64,
  status: text,
  freelancer: Principal,
  paid_at_block: Opt(nat64),
  memo: nat64,
});

// bid
const Bid = Record({
  id: text,
  serviceId: text,
  amount: nat64,
  description: text,
  freelancerId: text,
});

// Variant representing different error types
const ErrorType = Variant({
  NotFound: text,
  InvalidPayload: text,
  SubscriptionFailed: text,
  SubscriptionCompleted: text,
});

/**
 * `servicesStorage` - a key-value data structure used to store services by users.
 * {@link StableBTreeMap} is a self-balancing tree that acts as durable data storage across canister upgrades.
 * For this contract, `StableBTreeMap` is chosen for the following reasons:
 * - `insert`, `get`, and `remove` operations have constant time complexity (O(1)).
 * - Data stored in the map survives canister upgrades, unlike using HashMap where data is lost after an upgrade.
 *
 * Breakdown of the `StableBTreeMap(text, Service)` data structure:
 * - The key of the map is an `serviceId`.
 * - The value in this map is an service (`Service`) related to a given key (`serviceId`).
 *
 * Constructor values:
 * 1) 0 - memory id where to initialize a map.
 * 2) 16 - maximum size of the key in bytes.
 * 3) 1024 - maximum size of the value in bytes.
 * Values 2 and 3 are not used directly in the constructor but are utilized by the Azle compiler during compile time.
 */
const servicesStorage = StableBTreeMap(0, text, Service);
const bidsStorage = StableBTreeMap(2, text, Bid);
const usersStorage = StableBTreeMap(3, text, User);
const pendingSubscriptions = StableBTreeMap(4, nat64, ReserveSubscription);
const persistedSubscriptions = StableBTreeMap(
  7,
  Principal,
  ReserveSubscription
);

const SUBSCRIPTION_RESERVATION_PERIOD = 120n; // reservation period in seconds

const icpCanister = Ledger(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"));

// Exporting default Canister module
export default Canister({
  // Function to add an service
  addService: update(
    [ServicePayload],
    Result(Service, ErrorType),
    (payload) => {
      // Check if the payload is a valid object
      if (typeof payload !== "object" || Object.keys(payload).length === 0) {
        return Err({ InvalidPayload: "invalid payload" });
      }
      // Create an service with a unique id generated using UUID v4
      const service = {
        id: uuidv4(),
        status: "pending",
        user: ic.caller(),
        createdAt: new Date().toISOString(),
        cost: 0n,
        freelancer: None,
        updatedAt: None,
        ...payload,
      };

      // add service to the user
      // get user with the same principal
      const userOpt = usersStorage.values().filter((user) => {
        return user.principal.toText() === ic.caller().toText();
      });

      // add service to the user
      const user = userOpt[0];
      const updatedUser = {
        ...user,
        services: [...user.services, service.id],
      };
      usersStorage.insert(user.id, updatedUser);

      // Insert the service into the servicesStorage
      servicesStorage.insert(service.id, service);
      return Ok(service);
    }
  ),

  // get all services
  getServices: query([], Vec(Service), () => {
    return servicesStorage.values();
  }),

  // Function get service by id
  getService: query([text], Result(Service, ErrorType), (id) => {
    const serviceOpt = servicesStorage.get(id);
    if ("None" in serviceOpt) {
      return Err({ NotFound: `service with id=${id} not found` });
    }
    return Ok(serviceOpt.Some);
  }),

  // Function to update an service
  updateService: update(
    [UpdateServicePayload],
    Result(Service, ErrorType),
    (payload) => {
      const serviceOpt = servicesStorage.get(payload.id);
      if ("None" in serviceOpt) {
        return Err({ NotFound: `service with id=${payload.id} not found` });
      }
      const service = serviceOpt.Some;
      const updatedService = {
        ...service,
        ...payload,
      };
      servicesStorage.insert(service.id, updatedService);
      return Ok(updatedService);
    }
  ),

  // Function to add a bid
  addBid: update(
    [text, text, nat64],
    Result(Bid, ErrorType),
    (serviceId, description, amount) => {
      const serviceOpt = servicesStorage.get(serviceId);

      if ("None" in serviceOpt) {
        return Err({ NotFound: `service with id=${serviceId} not found` });
      }

      const userArr = usersStorage.values().filter((user) => {
        return user.principal.toText() === ic.caller().toText();
      });

      if (userArr.length === 0) {
        return Err({
          NotFound: `user with principal=${ic.caller()} not found`,
        });
      }

      const user = userArr[0];

      const bid = {
        id: uuidv4(),
        serviceId,
        amount,
        description,
        freelancerId: user.id,
      };
      bidsStorage.insert(bid.id, bid);
      return Ok(bid);
    }
  ),

  // get all bids
  getBids: query([], Vec(Bid), () => {
    return bidsStorage.values();
  }),

  // getOrderBids
  getServiceBids: query([text], Vec(Bid), (serviceId) => {
    return bidsStorage.values().filter((bid) => {
      return bid.serviceId === serviceId;
    });
  }),

  // Function get bid for function
  getBid: query([text], Result(Bid, ErrorType), (id) => {
    const bidOpt = bidsStorage.get(id);
    if ("None" in bidOpt) {
      return Err({ NotFound: `bid with id=${id} not found` });
    }
    return Ok(bidOpt.Some);
  }),

  // Function to update service with selected freelancerId and status and cost
  selectBid: update([text], Result(Service, ErrorType), (bidId) => {
    const bidOpt = bidsStorage.get(bidId);
    if ("None" in bidOpt) {
      return Err({ NotFound: `bid with id=${bidId} not found` });
    }
    const bid = bidOpt.Some;

    const serviceOpt = servicesStorage.get(bid.serviceId);
    if ("None" in serviceOpt) {
      return Err({ NotFound: `service with id=${bid.serviceId} not found` });
    }

    const service = serviceOpt.Some;
    service.freelancer = Some(bid.freelancerId);
    service.cost = bid.amount;
    service.status = "assigned";
    service.updatedAt = Some(new Date().toISOString());
    servicesStorage.insert(service.id, service);
    return Ok(service);
  }),

  // Function to add a user
  addUser: update([UserPayload], Result(User, ErrorType), (payload) => {
    // Check if the payload is a valid object
    if (typeof payload !== "object" || Object.keys(payload).length === 0) {
      return Err({ NotFound: "invalid payload" });
    }
    // Create a user with a unique id generated using UUID v4
    const user = {
      id: uuidv4(),
      principal: ic.caller(),
      services: [],
      ...payload,
    };
    // Insert the user into the usersStorage
    usersStorage.insert(user.id, user);
    return Ok(user);
  }),

  // get all users
  getUsers: query([], Vec(User), () => {
    return usersStorage.values();
  }),

  // Function get user by id
  getUser: query([text], Result(User, ErrorType), (id) => {
    const userOpt = usersStorage.get(id);
    if ("None" in userOpt) {
      return Err({ NotFound: `user with id=${id} not found` });
    }
    const user = userOpt.Some;
    return Ok(user);
  }),

  // get user by owner
  getUserByOwner: query([], Result(User, ErrorType), () => {
    const principal = ic.caller();
    const userOpt = usersStorage.values().filter((user) => {
      return user.principal.toText() === principal.toText();
    });
    if (userOpt.length === 0) {
      return Err({ NotFound: `user with principal=${principal} not found` });
    }
    return Ok(userOpt[0]);
  }),

  // get services reserved by a user
  getUserServices: query([text], Vec(Service), (id) => {
    const userOpt = usersStorage.get(id);
    if ("None" in userOpt) {
      return [];
    }
    const user = userOpt.Some;
    return servicesStorage.values().filter((service) => {
      return user.services.includes(service.id);
    });
  }),

  // Function to update a user
  updateUser: update(
    [UpdateUserPayload],
    Result(User, ErrorType),
    (payload) => {
      const userOpt = usersStorage.get(payload.id);
      if ("None" in userOpt) {
        return Err({ NotFound: `user with id=${payload.id} not found` });
      }
      const user = userOpt.Some;
      const updatedUser = {
        ...user,
        ...payload,
      };
      usersStorage.insert(user.id, updatedUser);
      return Ok(updatedUser);
    }
  ),

  // get user services
  getActiveServices: query([], Vec(Service), () => {
    const userOpt = usersStorage.values().filter((user) => {
      return user.principal.toText() === ic.caller().toText();
    });
    if (userOpt.length === 0) {
      return [];
    }
    const user = userOpt[0];

    const services = servicesStorage.values().filter((service) => {
      return (
        service.user.toText() === ic.caller().toText() ||
        service.freelancer.Some === user.id
      );
    });

    return services;
  }),

  createSubscriptionPay: update(
    [text],
    Result(ReserveSubscription, ErrorType),
    (serviceId) => {
      const serviceOpt = servicesStorage.get(serviceId);
      if ("None" in serviceOpt) {
        return Err({
          NotFound: `cannot reserve Subscription: Service  with id=${serviceId} not available`,
        });
      }
      const service = serviceOpt.Some;

      const cost = service.cost;

      const freelancerId = service.freelancer.Some;
      // get freelancer
      const freelancerUserOpt = usersStorage.values().filter((user) => {
        return user.id === freelancerId;
      });

      const freelancerUser = freelancerUserOpt[0].principal;

      const reserveSubscription = {
        price: cost,
        status: "pending",
        freelancer: freelancerUser,
        paid_at_block: None,
        memo: generateCorrelationId(serviceId),
      };

      // reduce the available units
      const updatedService = {
        ...service,
        status: "completed",
      };

      service.updatedAt = Some(new Date().toISOString());

      servicesStorage.insert(service.id, updatedService);

      pendingSubscriptions.insert(
        reserveSubscription.memo,
        reserveSubscription
      );
      discardByTimeout(
        reserveSubscription.memo,
        SUBSCRIPTION_RESERVATION_PERIOD
      );
      return Ok(reserveSubscription);
    }
  ),

  completeSubscription: update(
    [Principal, text, nat64, nat64, nat64],
    Result(ReserveSubscription, ErrorType),
    async (reservor, serviceId, reservePrice, block, memo) => {
      const subscriptionVerified = await verifySubscriptionInternal(
        reservor,
        reservePrice,
        block,
        memo
      );
      if (!subscriptionVerified) {
        return Err({
          NotFound: `cannot complete the reserve: cannot verify the subscription, memo=${memo}`,
        });
      }
      const pendingReservePayOpt = pendingSubscriptions.remove(memo);
      if ("None" in pendingReservePayOpt) {
        return Err({
          NotFound: `cannot complete the reserve: there is no pending reserve with id=${serviceId}`,
        });
      }
      const reservedPay = pendingReservePayOpt.Some;
      const updatedReserveSubscription = {
        ...reservedPay,
        status: "completed",
        paid_at_block: Some(block),
      };
      const serviceOpt = servicesStorage.get(serviceId);
      if ("None" in serviceOpt) {
        throw Error(`Book with id=${serviceId} not found`);
      }
      const service = serviceOpt.Some;
      servicesStorage.insert(service.id, service);
      persistedSubscriptions.insert(ic.caller(), updatedReserveSubscription);
      return Ok(updatedReserveSubscription);
    }
  ),

  verifySubscription: query(
    [Principal, nat64, nat64, nat64],
    bool,
    async (receiver, amount, block, memo) => {
      return await verifySubscriptionInternal(receiver, amount, block, memo);
    }
  ),

  /*
        a helper function to get address from the principal
        the address is later used in the transfer method
    */
  getAddressFromPrincipal: query([Principal], text, (principal) => {
    return hexAddressFromPrincipal(principal, 0);
  }),
});

/*
    a hash function that is used to generate correlation ids for services.
    also, we use that in the verifySubscription function where we check if the used has actually paid the service
*/
function hash(input: any): nat64 {
  return BigInt(Math.abs(hashCode().value(input)));
}

// A workaround to make the uuid package work with Azle
globalThis.crypto = {
  // @ts-ignore
  getRandomValues: () => {
    let array = new Uint8Array(32);
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  },
};

// HELPER FUNCTIONS
function generateCorrelationId(serviceId: text): nat64 {
  const correlationId = `${serviceId}_${ic.caller().toText()}_${ic.time()}`;
  return hash(correlationId);
}

function discardByTimeout(memo: nat64, delay: Duration) {
  ic.setTimer(delay, () => {
    const service = pendingSubscriptions.remove(memo);
    console.log(`Reserve discarded ${service}`);
  });
}
async function verifySubscriptionInternal(
  receiver: Principal,
  amount: nat64,
  block: nat64,
  memo: nat64
): Promise<bool> {
  const blockData = await ic.call(icpCanister.query_blocks, {
    args: [{ start: block, length: 1n }],
  });
  const tx = blockData.blocks.find((block) => {
    if ("None" in block.transaction.operation) {
      return false;
    }
    const operation = block.transaction.operation.Some;
    const senderAddress = binaryAddressFromPrincipal(ic.caller(), 0);
    const receiverAddress = binaryAddressFromPrincipal(receiver, 0);
    return (
      block.transaction.memo === memo &&
      hash(senderAddress) === hash(operation.Transfer?.from) &&
      hash(receiverAddress) === hash(operation.Transfer?.to) &&
      amount === operation.Transfer?.amount.e8s
    );
  });
  return tx ? true : false;
}
