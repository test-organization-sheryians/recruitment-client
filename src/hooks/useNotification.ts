import { useState, useEffect, useCallback } from "react";
import {
  removeSubscription,
  sendSubscription,
} from "@/api/pushNotification/pushApi";

// Convert base64 VAPID public key to the Uint8Array format the browser expects
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  console.log("key base64 ho rahi hai");
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  console.log("base64 hua ...", rawData);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

type NotificationPermissionType = "default" | "granted" | "denied";

export function useNotification() {
  const [permission, setPermission] =
    useState<NotificationPermissionType>("default");
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    navigator.serviceWorker.ready.then(
      async (reg: ServiceWorkerRegistration) => {
        const existing: PushSubscription | null =
          await reg.pushManager.getSubscription();
        setIsSubscribed(!!existing);
        setPermission(Notification.permission as NotificationPermissionType);
      },
    );
  }, []);

  const subscribe = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const reg: ServiceWorkerRegistration =
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      await navigator.serviceWorker.ready;

      const perm: NotificationPermission =
        await Notification.requestPermission();
      setPermission(perm);

      if (perm !== "granted") {
        throw new Error("Notification permission denied");
      }

      const subscription: PushSubscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,

        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
        ) as unknown as BufferSource,
      });

      const res = await sendSubscription(subscription.toJSON());

      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed to save subscription on server");
      }

      setIsSubscribed(true);
    } catch (err: any) {
      setError(err.message);
      console.error("Subscribe error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const unsubscribe = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const reg: ServiceWorkerRegistration =
        await navigator.serviceWorker.ready;
      const subscription: PushSubscription | null =
        await reg.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();

        await removeSubscription(subscription.endpoint);
      }

      setIsSubscribed(false);
    } catch (err: any) {
      setError(err.message);
      console.error("Unsubscribe error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    permission,
    isSubscribed,
    setIsSubscribed,
    isLoading,
    error,
    subscribe,
    unsubscribe,
  };
}
