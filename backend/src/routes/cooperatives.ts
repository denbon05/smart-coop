import { Coop } from "@prisma/client";
import { FastifyInstance, FastifyRequest } from "fastify";

export default (app: FastifyInstance) => {
  app.post("/coop", async (req: FastifyRequest<{ Body: Coop }>, reply) => {
    const { id, location, name } = req.body;
    const res = await app.prisma.coop.create({
      data: {
        id,
        location,
        name,
      },
    });

    reply.send(res);
  });
};
