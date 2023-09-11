import { Game, IncomingGame } from "../model/Game.ts";
import dbClient from "../database.ts";
import { addToWatchList, removeFromWatchList } from "../watch.ts";
import { finishGameSessions } from "./Session.ts";

export async function createGame(
    { name, cmd }: IncomingGame,
): Promise<Game> {
    const existingGame = await dbClient.query(
        `SELECT id FROM games WHERE name = ?`,
        [name],
    );

    if (existingGame.length === 0) {
        const { affectedRows, lastInsertId } = await dbClient.execute(
            `INSERT INTO games(name, cmd, watched) VALUES (?, ?, true)`,
            [name, cmd],
        );

        if (affectedRows! <= 0) {
            throw new Error(`Problem inserting game (${name}, ${cmd})`);
        }

        const game = {
            name,
            cmd,
            id: lastInsertId!,
            watched: true,
        };

        addToWatchList(game);

        return game;
    }

    return existingGame[0];
}

export async function getGames(): Promise<Game[]> {
    const games = await dbClient.query(
        `SELECT id, name, cmd, watched FROM games`,
    );
    return games;
}

export async function unwatchGame(gameId: number): Promise<void> {
    const { affectedRows } = await dbClient.execute(
        `UPDATE games SET watched = false WHERE id = ?`,
        [
            gameId,
        ],
    );

    const [game] = await dbClient.query(
        `SELECT id, name FROM games WHERE id = ?`,
        [
            gameId,
        ],
    );

    if (affectedRows! <= 0) throw new Error(`Problem unwatching game ${gameId}.`);

    await finishGameSessions(gameId);

    removeFromWatchList(game);
}

export async function rewatchGame(gameId: number): Promise<Game> {
    const { affectedRows } = await dbClient.execute(
        `UPDATE games SET watched = true WHERE id = ?`,
        [
            gameId,
        ],
    );

    const [game] = await dbClient.query(
        `SELECT id, name, cmd, watched FROM games WHERE id = ?`,
        [
            gameId,
        ],
    );

    if (affectedRows! <= 0) throw new Error(`Problem rewatching game ${gameId}.`);

    addToWatchList(game);

    return game;
}
