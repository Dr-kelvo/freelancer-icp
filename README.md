# Social-Fi

The provided code is an implementation of a backend system for managing service and users, including features for adding, updating, and retrieving service and user information. It also includes functionality for subscription processing and verification. Here's a breakdown of the main components and functionalities:

## Overview

### Libraries and Imports

- The code imports various modules from the "azle" package, which likely provides utility functions and data structures for building internet computer (IC) canisters.
- It also imports functionalities related to the Ledger canister for handling subscription transactions.

### Data Structures and Types

- **Service**: Represents service that can be listed on a service manager. It includes properties such as ID, title, description, client, available units, subscription fee, etc.
- **User**: Represents an user with properties like ID, username, email, expertise, bio, profile picture, followers, and services.
- **SubscriptionStatus**: Defines the status of a subscription transaction, such as pending or completed.
- **ReserveSubscription**: Represents a subscription reservation with details like price, status, seller, paid timestamp, and memo.
- **ErrorType**: Defines different error types for error handling.

### Storage

- The system uses `StableBTreeMap` for storing service, users, pending subscriptions, and persisted subscriptions. This provides a durable data storage solution across canister upgrades.
- Separate maps are used for different types of data to ensure data isolation and efficient retrieval.

### Functions

- **addService**: Adds a new service item to the system. It generates a unique ID using UUID v4 and associates the service with the caller (client).
- **getServices**: Retrieves all service items stored in the system.
- **getService**: Retrieves a specific service item by its ID.
- **updateService**: Updates the details of an existing service item.
- **addUser**: Adds a new user to the system with associated details.
- **getUsers**: Retrieves all users along with their associated service.
- **getUser**: Retrieves a specific user by their ID.
- **updateUser**: Updates the details of an existing user.
- **createSubscriptionPay**: Initiates a subscription reservation for a service item. It reduces the available units of the service and adds the reserved subscription to the pending subscriptions map.
- **completeSubscription**: Completes a subscription transaction by verifying the subscription details and updating the subscription status. It also persists the subscription details for future reference.
- **verifySubscription**: Verifies a subscription transaction by checking the transaction details against the provided parameters.
- **getAddressFromPrincipal**: Retrieves the address from the principal for use in subscription transactions.

### Helper Functions

- **hash**: Generates a hash value for input data, used for generating correlation IDs for services.
- **generateCorrelationId**: Generates a correlation ID for service based on service ID, caller principal, and current timestamp.
- **discardByTimeout**: Discards a subscription reservation after a specified timeout period.
- **verifySubscriptionInternal**: Internally verifies a subscription transaction by fetching block data and checking transaction details.

## Things to be explained in the course

1. What is Ledger? More details here: <https://internetcomputer.org/docs/current/developer-docs/integrations/ledger/>
2. What is Internet Identity? More details here: <https://internetcomputer.org/internet-identity>
3. What is Principal, Identity, Address? <https://internetcomputer.org/internet-identity> | <https://yumieventManager.medium.com/whats-the-difference-between-principal-id-and-account-id-3c908afdc1f9>
4. Canister-to-canister communication and how multi-canister development is done? <https://medium.com/icp-league/explore-backend-multi-canister-development-on-ic-680064b06320>

## How to deploy canisters implemented in the course

### Ledger canister

`./deploy-local-ledger.sh` - deploys a local Ledger canister. IC works differently when run locally so there is no default network token available and you have to deploy it yourself. Remember that it's not a token like ERC-20 in Ethereum, it's a native token for ICP, just deployed separately.
This canister is described in the `dfx.json`:

```markdown
 "ledger_canister": {
   "type": "custom",
   "candid": "https://raw.githubuserservice.com/dfinity/ic/928caf66c35627efe407006230beee60ad38f090/rs/rosetta-api/icp_ledger/ledger.did",
   "wasm": "https://download.dfinity.systems/ic/928caf66c35627efe407006230beee60ad38f090/canisters/ledger-canister.wasm.gz",
   "remote": {
     "id": {
       "ic": "ryjl3-tyaaa-aaaaa-aaaba-cai"
     }
   }
 }
```

`remote.id.ic` - that is the principal of the Ledger canister and it will be available by this principal when you work with the ledger.

Also, in the scope of this script, a minter identity is created which can be used for minting tokens
for the testing purposes.
Additionally, the default identity is pre-populated with 1000_000_000_000 e8s which is equal to 10_000 * 10**8 ICP.
The decimals value for ICP is 10**8.

List identities:
`dfx identity list`

Switch to the minter identity:
`dfx identity use minter`

Transfer ICP:
`dfx ledger transfer <ADDRESS>  --memo 0 --icp 100 --fee 0`
where:

- `--memo` is some correlation id that can be set to identify some particular transactions (we use that in the eventManager canister).
- `--icp` is the transfer amount
- `--fee` is the transaction fee. In this case it's 0 because we make this transfer as the minter idenity thus this transaction is of type MINT, not TRANSFER.
- `<ADDRESS>` is the address of the recipient. To get the address from the principal, you can get it directly from the wallet icon top right or use the helper function from the eventManager canister - `getAddressFromPrincipal(principal: Principal)`, it can be called via the Candid UI.

### Internet identity canister

`dfx deploy internet_identity` - that is the canister that handles the authentication flow. Once it's deployed, the `js-agent` library will be talking to it to register identities. There is UI that acts as a wallet where you can select existing identities
or create a new one.

### eventManager canister

`dfx deploy dfinity_js_backend` - deploys the eventManager canister where the business logic is implemented.
Basically, it implements functions like add, view, update, delete, and buy events + a set of helper functions.

Do not forget to run `dfx generate dfinity_js_backend` anytime you add/remove functions in the canister or when you change the signatures.
Otherwise, these changes won't be reflected in IDL's and won't work when called using the JS agent.

### eventManager frontend canister

`dfx deploy dfinity_js_frontend` - deployes the frontend app for the `dfinity_js_backend` canister on IC.
