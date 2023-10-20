import type { Member } from "@prisma/client";
import { FastifyInstance, FastifyRequest } from "fastify";

export default (app: FastifyInstance) => {
  app
    .post("/member", async (req: FastifyRequest<{ Body: Member }>, reply) => {
      const { id, location, name, coopId } = req.body;
      const res = await app.prisma.member.create({
        data: {
          id,
          location,
          name,
          coopId,
        },
      });

      reply.send(res);
    })

    .get(
      "/member",
      async (req: FastifyRequest<{ Params: { id: Member["id"] } }>, reply) => {
        const res = await app.prisma.member.findFirst({
          where: {
            id: req.params.id,
          },
          include: {
            coop: true,
          },
        });

        return res;
      },
    );
};
