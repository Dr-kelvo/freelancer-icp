# Decentralized Freelancer

This canister implements a marketplace for freelance services. Users can list services, freelancers can bid on those services, and users can select a freelancer to complete the work. Leveraging blockchain technology, a decentralized freelance marketplace can provide a more efficient, transparent, and inclusive environment for connecting users with freelance talent while reducing reliance on intermediaries and improving trust and security in the freelance economy.

## Data Structures

The canister uses several Azle data structures to store information:

* `StableBTreeMap`: This is a self-balancing tree used to store services by user ID, user information, bids, and user information.
* `Vec`: This is a vector data structure used to store lists of service IDs, user IDs, and bid IDs within the corresponding data structures.
* `Option`: This is used to represent optional values, which can be either `Some(value)` or `None`.

## Canister Functions

The canister provides a variety of functions for managing services, users, bids, and subscriptions:

## Services

* `addService`: Adds a new service for the current user.
* `getServices`: Retrieves all services listed on the marketplace.
* `getService`: Retrieves a specific service by its ID.
* `updateService`: Updates an existing service.
* `servicestatus`: Updates the status of a service.

## Bids

* `addBid`: Allows a user to submit a bid on a service.
* `getBids`: Retrieves all bids on the marketplace.
* `getServiceBids`: Retrieves all bids for a specific service.
* `getBid`: Retrieves a specific bid by its ID.
* `selectBid`: Assigns a selected bid to a service, marking it complete.

## Users

* `addUser`: Adds a new user to the marketplace.
* `getUsers`: Retrieves all users registered on the marketplace.
* `getUser`: Retrieves a specific user by their ID.
* `getUserByUser`: Retrieves the user information for the currently logged-in user.
* `getUserServices`: Retrieves all services associated with a specific user.
* `updateUser`: Updates an existing user's information.

## Users

* `getUser`: Retrieves the user information for the currently logged-in user.

## Following Users

* `getFollowingUsers`: Retrieves a list of users that the current user is following.
* `getActiveServices`: Retrieves a list of services from users that the current user is following.

## Subscriptions

* `createSubscriptionPay`: Reserves a service by paying for it.
* `completeSubscription`: Completes a subscription by verifying payment.
* `verifySubscription`: Verifies a subscription payment.

## Helper Functions

* `getAddressFromPrincipal`: Retrieves the address associated with a principal.

## Additional Notes

* The code utilizes the `ic` object to interact with the Dfinity network, including calling other canisters and managing timers.
* The code implements a mechanism to discard pending subscriptions after a certain timeout period.
* The `uuid` package is used to generate unique IDs for services, users, and bids.

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

* `--memo` is some correlation id that can be set to identify some particular transactions (we use that in the eventManager canister).
* `--icp` is the transfer amount
* `--fee` is the transaction fee. In this case it's 0 because we make this transfer as the minter idenity thus this transaction is of type MINT, not TRANSFER.
* `<ADDRESS>` is the address of the recipient. To get the address from the principal, you can get it directly from the wallet icon top right or use the helper function from the eventManager canister - `getAddressFromPrincipal(principal: Principal)`, it can be called via the Candid UI.

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
