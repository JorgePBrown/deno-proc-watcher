import { FastifyInstance } from "npm:fastify";
import { IncomingGame } from "../model/Game.ts";
import { createGame, getGame, getGames, rewatchGame, unwatchGame } from "../service/Game.ts";
import { getGameRuntime } from "../service/Session.ts";

export default class GameController {
    constructor(fastify: FastifyInstance) {
        fastify.get("/games", async (_request, reply) => {
            const games = await getGames();
            reply.send(games);
        });

        fastify.get("/games/:gameId", async (request, reply) => {
            const { gameId } = request.params;
            const game = await getGame(+gameId);
            reply.send(game);
        });

        fastify.get("/games/:gameId/time", async (request, reply) => {
            const { gameId } = request.params;
            const gameTime = await getGameRuntime(+gameId);
            reply.send({ time: gameTime });
        });

        fastify.delete("/games/:gameId", async (request, reply) => {
            const { gameId } = request.params;
            await unwatchGame(+gameId);
            reply.status(204).send();
        });

        fastify.patch("/games/:gameId/watch", async (request, reply) => {
            const { gameId } = request.params;
            const game = await rewatchGame(+gameId);
            reply.status(200).send(game);
        });

        fastify.post("/games", async (request, reply) => {
            const { success, error, data } = IncomingGame.safeParse(request.body);
            if (success) {
                const game = await createGame(data);
                await reply.send(game);
            } else {
                await reply.send(error);
            }
        });
    }
}
