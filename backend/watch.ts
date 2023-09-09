import type { Game } from "./model/Game.ts";
import type { Session } from "./model/Session.ts";
import ps from "./ps.ts";
import { getGames } from "./service/Game.ts";
import { createSession, getRunningSessions, stopSession } from "./service/Session.ts";

const runningSessionsById: Map<number, Session> = new Map();
const runningSessionsByGameId: Map<number, Session> = new Map();
const watchList: Map<string, Game> = new Map();

(async function populateWatchList() {
    (await getGames()).filter((g) => g.watched).forEach(addToWatchList);
    (await getRunningSessions()).forEach((s) => runningSessionsByGameId.set(s.gameId, s));
})();

export function addToWatchList(game: Game) {
    watchList.set(game.name, game);
}

export function removeFromWatchList(game: Game) {
    watchList.delete(game.name);
}

async function watchLoop() {
    const procs = await ps();

    for (const proc of procs) {
        if (watchList.has(proc.name)) {
            const game = watchList.get(proc.name)!;

            if (!runningSessionsByGameId.has(game.id)) {
                console.log(`Starting new session for ${game}`);
                const session = await createSession({
                    gameId: game.id,
                });
                runningSessionsByGameId.set(game.id, session);
                runningSessionsById.set(session.id, session);
            }
        }
    }

    for (const game of watchList.values()) {
        if (procs.every((p) => p.cmd !== game.cmd)) {
            if (runningSessionsByGameId.has(game.id)) {
                console.log(`${game.name} stopped.`);
                const session = runningSessionsByGameId.get(game.id)!;

                await stopSession(session);

                runningSessionsByGameId.delete(game.id);
                runningSessionsById.delete(session.id);
            }
        }
    }
}

setInterval(watchLoop, 1000);
