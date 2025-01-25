import { Subscription } from "@prisma/client";
import webpush, { PushSubscription } from "web-push";

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  throw new Error("VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY must be set");
}

/**
 * Configure VAPID (Voluntary Application Server Identification) details for web push
 * This is required for push notifications to work in modern browsers
 * @see https://tools.ietf.org/html/draft-thomson-webpush-vapid
 *
 * @param {string} subject - A mailto: or URL string that browsers can use to contact you
 * @param {string} publicKey - VAPID public key from your environment variables
 * @param {string} privateKey - VAPID private key from your environment variables
 */
webpush.setVapidDetails(
  "mailto:your-email@example.com",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

/**
 * Sends a web push notification to a subscribed client
 * @param subscription - The subscription details from the database containing endpoint and keys
 * @param data - The notification content
 * @param data.title - The title of the notification
 * @param data.body - The body text of the notification
 * @returns Promise that resolves with the result of sending the notification
 * @throws Will throw an error if sending the notification fails
 */
export const sendNotification = async (
  subscription: Subscription,
  data: {
    title: string;
    body: string;
  }
) => {
  const pushSubscription: PushSubscription = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.p256dh,
      auth: subscription.auth,
    },
  };
  return await webpush.sendNotification(pushSubscription, JSON.stringify(data));
};
