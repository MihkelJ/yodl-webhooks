import {
  createConfig,
  createServer,
  DependsOnMethod,
  Routing,
} from "express-zod-api";
import { healthEndpoint } from "./routes/health.routes.js";
import {
  subscribeEndpoint,
  unsubscribeEndpoint,
} from "./routes/subscribe.routes.js";
import { txWebhook } from "./routes/txWebhook.routes.js";

const config = createConfig({
  http: {
    listen: process.env.PORT || 3000,
  },
  cors: false,
  logger: {
    level: "debug",
    color: true,
  },
});

const routing: Routing = {
  v1: {
    health: healthEndpoint,
    subscribe: new DependsOnMethod({
      post: subscribeEndpoint,
      delete: unsubscribeEndpoint,
    }),
    tx: txWebhook,
  },
};

const server = createServer(config, routing);

server.catch((err) => {
  console.error("Server error:", err);
  process.exit(1);
});
