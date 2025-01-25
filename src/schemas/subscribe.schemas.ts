import { z } from "zod";

// Shared push subscription validation
export const pushSubscriptionSchema = z.object({
  endpoint: z.string(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
});

export const unsubscribeInputSchema = pushSubscriptionSchema.pick({
  endpoint: true,
});
