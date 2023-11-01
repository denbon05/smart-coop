import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { config } from "dotenv";
import { resolve } from "path";

const mode = process.env.NODE_ENV ?? "development";

if (mode !== "production") {
  config({
    debug: true,
    path: resolve(__dirname, "..", "..", `.env.${mode}`),
  });
}

const prismaPlugin = async (server: FastifyInstance) => {
  const prisma = new PrismaClient({
    // log: ["error", "warn"],
    log: ["query", "info"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  await prisma.$connect();

  server.decorate("prisma", prisma);

  server.addHook("onClose", async (server) => {
    server.log.info("disconnecting Prisma from DB");
    await server.prisma.$disconnect();
  });
};

export default fp(prismaPlugin);
