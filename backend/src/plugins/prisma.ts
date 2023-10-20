import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";

const prismaPlugin = async (server: FastifyInstance) => {
  const prisma = new PrismaClient({
    // log: ["error", "warn"],
    log: ["query", "info"],
  });

  await prisma.$connect();

  server.decorate("prisma", prisma);

  server.addHook("onClose", async (server) => {
    server.log.info("disconnecting Prisma from DB");
    await server.prisma.$disconnect();
  });
};

export default fp(prismaPlugin);
