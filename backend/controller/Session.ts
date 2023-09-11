import { FastifyInstance } from "npm:fastify";
import { getGameSessions } from "../service/Session.ts";

export default class SessionController {
    constructor(fastify: FastifyInstance) {
        fastify.get(
            "/sessions",
            {
                schema: {
                    querystring: {
                        type: "object",
                        properties: { gameId: { type: "number" } },
                    },
                },
            },
            async (request, reply) => {
                const { gameId } = request.query;

                if (!gameId) {
                    reply.status(400).send("Missing gameId query");
                    return;
                }

                const sessions = await getGameSessions(+gameId);

                reply.send(sessions);
            },
        );
    }
}
