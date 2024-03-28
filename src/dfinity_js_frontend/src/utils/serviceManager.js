import { Principal } from "@dfinity/principal";
import { transferICP } from "./ledger";

export async function createService(service) {
  return window.canister.serviceManager.addService(service);
}

export async function updateService(service) {
  return window.canister.serviceManager.updateService(service);
}

// servicestatus;
export async function servicestatus(service) {
  return window.canister.serviceManager.servicestatus(service);
}

// selectBid
export async function selectBid(bidId) {
  return window.canister.serviceManager.selectBid(bidId);
}

// getBids;
export async function getBids() {
  return window.canister.serviceManager.getBids();
}

// getServiceBids
export async function getServiceBids(serviceId) {
  return window.canister.serviceManager.getServiceBids(serviceId);
}

// getBid;
export async function getBid(bidId) {
  return window.canister.serviceManager.getBid(bidId);
}

// addBid
export async function addBid(serviceId, amount) {
  return window.canister.serviceManager.addBid(serviceId, description, amount);
}

// getFollowingUsers
export async function getFollowingUsers() {
  try {
    return await window.canister.serviceManager.getFollowingUsers();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

// getFollowingServices
export async function getFollowingServices() {
  try {
    return await window.canister.serviceManager.getFollowingServices();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function getServices() {
  try {
    return await window.canister.serviceManager.getServices();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

// getAddressFromPrincipal
export async function getAddressFromPrincipal(principal) {
  return await window.canister.serviceManager.getAddressFromPrincipal(
    principal
  );
}

export async function subscribe(serviceId) {
  const serviceManagerCanister = window.canister.serviceManager;
  const orderResponse = await serviceManagerCanister.createSubscriptionPay(
    serviceId
  );

  console.log(orderResponse);
  const sellerPrincipal = Principal.from(orderResponse.Ok.seller);
  const sellerAddress = await serviceManagerCanister.getAddressFromPrincipal(
    sellerPrincipal
  );
  const block = await transferICP(
    sellerAddress,
    orderResponse.Ok.price,
    orderResponse.Ok.memo
  );
  await serviceManagerCanister.completeSubscription(
    sellerPrincipal,
    serviceId,
    orderResponse.Ok.price,
    block,
    orderResponse.Ok.memo
  );
}
