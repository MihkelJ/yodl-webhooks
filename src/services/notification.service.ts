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

  const subscription = await prisma.subscription.findFirst({
    where: { address: receiver },
  });

  if (!subscription) {
    throw createHttpError(
      400,
      `No subscription found for address: ${receiver}`
    );
  }

  const formattedAmount = `${amount} ${currency}`;
  await sendNotification(subscription, {
    title: "New transaction",
    body: `Received ${formattedAmount} from ${senderName}`,
  });
}
