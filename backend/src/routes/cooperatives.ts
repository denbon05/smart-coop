import { Coop } from "@prisma/client";
import { FastifyInstance, FastifyRequest } from "fastify";

export default (app: FastifyInstance) => {
  app
    .post("/coop", async (req: FastifyRequest<{ Body: Coop }>, reply) => {
      const { id, location, name } = req.body;
      const res = await app.prisma.coop.create({
        data: {
          id,
          location,
          name,
        },
      });

      reply.send(res);
    })

    .get(
      "/coops",
      async (
        req: FastifyRequest<{ Querystring: { value: string } }>,
        reply,
      ) => {
        const { value } = req.query;

        const res = await app.prisma.coop.findMany({
          where: {
            OR: [
              {
                location: {
                  contains: value,
                  mode: "insensitive",
                },
              },
              {
                name: {
                  contains: value,
                  mode: "insensitive",
                },
              },
            ],
          },
        });

        reply.send(res);
      },
    )

    .get("/coop", (req: FastifyRequest<{ Querystring: { id: string } }>) => {
      const { id } = req.query;

      return app.prisma.coop.findUnique({
        include: {
          members: true,
        },
        where: {
          id,
        },
      });
    });
};
