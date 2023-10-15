import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import prismaPlugin from "./plugins/prisma";
import registerRoutes from "./routes";

const app = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  // connectionTimeout: 5000, // 5 seconds
});

export default () => {
  app.register(prismaPlugin);
  app.register(fastifyCors, { origin: "*" });

  app.after(() => {
    registerRoutes(app);
  });

  return app;
};
