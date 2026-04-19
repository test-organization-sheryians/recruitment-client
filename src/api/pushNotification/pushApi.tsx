import api from "@/config/axios";

export const sendSubscription = async (sub: PushSubscriptionJSON) => {
  return await api.post("/api/push/subscribe", sub);
};

export const removeSubscription = async (endpoint: string) => {
  await api.post("/api/push/unsubscribe", { endpoint });
};
