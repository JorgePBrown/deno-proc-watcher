import Fastify from "npm:fastify";
import GameController from "./controller/Game.ts";
import ProcController from "./controller/Proc.ts";

const fastify = Fastify({
  logger: true,
});

new GameController(fastify);
new ProcController(fastify);

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    Deno.exit(1);
  }
  // Server is now listening on ${address}
});
