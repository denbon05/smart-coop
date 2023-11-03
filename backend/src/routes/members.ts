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
      async (
        req: FastifyRequest<{ Querystring: { id: Member["id"] } }>,
        reply,
      ) => {
        const res = await app.prisma.member.findFirst({
          where: {
            id: req.query.id,
          },
          include: {
            coop: true,
          },
        });

        reply.send(res);
      },
    )

    .get(
      "/members",
      async (
        req: FastifyRequest<{
          Querystring: { coopId: string };
        }>,
      ) => {
        const { coopId } = req.query;

        return app.prisma.member.findMany({
          where: { coopId },
        });
      },
    );
};
