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
export async function addBid(serviceId, description, amount) {
  return window.canister.serviceManager.addBid(serviceId, description, amount);
}

// getActiveServices
export async function getActiveServices() {
  try {
    return await window.canister.serviceManager.getActiveServices();
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

export async function payBid(serviceId) {
  const serviceManagerCanister = window.canister.serviceManager;
  const orderResponse = await serviceManagerCanister.createSubscriptionPay(
    serviceId
  );

  console.log(orderResponse);
  const freelancerPrincipal = Principal.from(orderResponse.Ok.freelancer);
  const freelancerAddress =
    await serviceManagerCanister.getAddressFromPrincipal(freelancerPrincipal);
  const block = await transferICP(
    freelancerAddress,
    orderResponse.Ok.price,
    orderResponse.Ok.memo
  );
  await serviceManagerCanister.completeSubscription(
    freelancerPrincipal,
    serviceId,
    orderResponse.Ok.price,
    block,
    orderResponse.Ok.memo
  );
}
