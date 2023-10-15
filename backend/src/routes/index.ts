import { FastifyInstance } from "fastify";
import cooperatives from "./cooperatives";
import members from "./members";

export default (app: FastifyInstance) => {
  const routes = [cooperatives, members];

  routes.forEach((registerRoutes) => {
    registerRoutes(app);
  });
};
