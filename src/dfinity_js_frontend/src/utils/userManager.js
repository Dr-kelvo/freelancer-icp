export async function createUser(user) {
  return window.canister.serviceManager.addUser(user);
}

export async function updateUser(user) {
  return window.canister.serviceManager.updateUser(user);
}

export async function followUser(userId) {
  return window.canister.serviceManager.followUser(userId);
}

export async function getUserByClient() {
  try {
    return await window.canister.serviceManager.getUserByClient();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function getUsers() {
  try {
    return await window.canister.serviceManager.getUsers();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}
