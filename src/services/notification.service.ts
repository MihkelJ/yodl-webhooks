import createHttpError from "http-errors";
import { isAddress } from "viem";
import prisma from "../lib/prisma.js";
import { sendNotification } from "../lib/webPush.js";

export async function processNotification(
  receiver: string,
  senderName: string,
  amount: string,
  currency: string
) {
  if (!isAddress(receiver)) {
    throw createHttpError(400, `Invalid receiver address: ${receiver}`);
  }

  const subscriptions = await prisma.subscription.findMany({
    where: { address: receiver },
  });

  if (subscriptions.length === 0) {
    throw createHttpError(
      400,
      `No subscription found for address: ${receiver}`
    );
  }

  const formattedAmount = `${amount} ${currency}`;

  // Process notifications and track failed subscriptions
  const results = await Promise.allSettled(
    subscriptions.map((subscription) =>
      sendNotification(subscription, {
        title: "New transaction",
        body: `Received ${formattedAmount} from ${senderName}`,
      })
    )
  );

  // Remove invalid subscriptions
  const failedSubscriptions = subscriptions.filter(
    (_, index) =>
      results[index].status === "rejected" &&
      results[index].reason?.statusCode === 410
  );

  if (failedSubscriptions.length > 0) {
    await prisma.subscription.deleteMany({
      where: {
        id: {
          in: failedSubscriptions.map((sub) => sub.id),
        },
      },
    });
  }
}
