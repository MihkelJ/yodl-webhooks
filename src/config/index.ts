import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().transform(Number).default("3000"),
  DATABASE_URL: z.string().url(),
  YODL_INDEXER_URL: z.string().url(),
  VAPID_PUBLIC_KEY: z.string(),
  VAPID_PRIVATE_KEY: z.string(),
  YODL_ADDRESS: z.string(),
});

function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      JSON.stringify(parsed.error.format(), null, 4)
    );
    process.exit(1);
  }

  return parsed.data;
}

const env = validateEnv();

export const config = {
  env: env.NODE_ENV,
  isProduction: env.NODE_ENV === "production",
  isDevelopment: env.NODE_ENV === "development",
  isTest: env.NODE_ENV === "test",
  server: {
    port: env.PORT,
  },
  db: {
    url: env.DATABASE_URL,
  },
  yodl: {
    indexerUrl: env.YODL_INDEXER_URL,
    address: env.YODL_ADDRESS,
  },
  webPush: {
    publicKey: env.VAPID_PUBLIC_KEY,
    privateKey: env.VAPID_PRIVATE_KEY,
  },
} as const;
