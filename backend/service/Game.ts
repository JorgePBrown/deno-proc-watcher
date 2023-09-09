import { Game, IncomingGame } from "../model/Game.ts";
import dbClient from "../database.ts";
import { addToWatchList } from "../watch.ts";

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
