import { defaultEndpointsFactory } from "express-zod-api";
import createHttpError from "http-errors";
import prisma from "../lib/prisma.js";
import {
  addressInput,
  statusResponseSchema,
} from "../schemas/common.schemas.js";
import {
  pushSubscriptionSchema,
  unsubscribeInputSchema,
} from "../schemas/subscribe.schemas.js";

export const subscribeEndpoint = defaultEndpointsFactory.build({
  handler: async ({ input }) => {
    const isUnique = await prisma.subscription.findUnique({
      where: { endpoint: input.pushSubscription.endpoint },
    });

    if (isUnique) {
      throw createHttpError(400, "Subscription already exists");
    }

    await prisma.subscription.create({
      data: {
        address: input.address,
        endpoint: input.pushSubscription.endpoint,
        p256dh: input.pushSubscription.keys.p256dh,
        auth: input.pushSubscription.keys.auth,
      },
    });

    return { status: "OK" };
  },
  output: statusResponseSchema,
  input: addressInput.extend({
    pushSubscription: pushSubscriptionSchema,
  }),
  description: "Subscribe to notifications for the given address",
});

export const unsubscribeEndpoint = defaultEndpointsFactory.build({
  handler: async ({ input }) => {
    await prisma.subscription.delete({
      where: {
        endpoint: input.endpoint,
      },
    });

    return { status: "OK" };
  },
  output: statusResponseSchema,
  input: unsubscribeInputSchema,
  description: "Unsubscribe from notifications for the given endpoint",
});
