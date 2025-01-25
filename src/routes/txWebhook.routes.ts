import { defaultEndpointsFactory } from "express-zod-api";
import createHttpError from "http-errors";
import authMiddleware from "../middlewares/auth.middlewares.js";
import { statusResponseSchema } from "../schemas/common.schemas.js";
import { txInputSchema } from "../schemas/tx.schemas.js";
import { processNotification } from "../services/notification.service.js";
import { fetchTransaction } from "../services/transaction.service.js";

export const txWebhook = defaultEndpointsFactory
  .addMiddleware(authMiddleware)
  .build({
    method: "post",
    handler: async ({ input, logger }) => {
      try {
        const data = await fetchTransaction(input.txHash);

        const payment = data.yodlPayments[0];
        const receiver = payment.receiver.address;
        const sender = payment.sender;
        const senderName = sender.ensPrimaryName ?? sender.address;

        if (!receiver) {
          throw createHttpError(400, "No receiver found in transaction");
        }

        await processNotification(
          receiver,
          senderName,
          payment.invoiceAmount,
          payment.invoiceCurrency
        );

        return { status: "OK", data };
      } catch (error) {
        logger.error("Transaction processing failed", {
          error: error instanceof Error ? error.message : "Unknown error",
          txHash: input.txHash,
        });
        throw createHttpError(500, "Transaction processing failed");
      }
    },
    output: statusResponseSchema,
    input: txInputSchema,
    description: "Sends a transaction to the given address",
  });
