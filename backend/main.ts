import Fastify from "npm:fastify";
import GameController from "./controller/Game.ts";
import ProcController from "./controller/Proc.ts";
import { finishAllSessions } from "./service/Session.ts";

if (!Deno.env.has("DEV")) {
    globalThis.addEventListener("unload", async () => {
        await finishAllSessions();
    });
} else {
    console.log("RUNNING IN DEV MODE");
}

const fastify = Fastify({
    logger: true,
});

new GameController(fastify);
new ProcController(fastify);

// Run the server!
fastify.listen({ port: 3000 }, function (err, _address) {
    if (err) {
        fastify.log.error(err);
        Deno.exit(1);
    }
    // Server is now listening on ${address}
});
