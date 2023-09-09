import { Session } from "../model/Session.ts";
import dbClient from "../database.ts";

type CreateSessionParams = { gameId: number };
export async function createSession(
    { gameId }: CreateSessionParams,
): Promise<Session> {
    const { affectedRows, lastInsertId } = await dbClient.execute(
        `INSERT INTO sessions(gameId, start) VALUES (?, NOW())`,
        [gameId],
    );

    if (affectedRows! <= 0) {
        throw new Error(`Problem inserting session (${gameId})`);
    }

    return {
        gameId,
        start: new Date(),
        id: lastInsertId!,
    };
}

export async function stopSession(
    session: Session,
): Promise<void> {
    const { affectedRows } = await dbClient.execute(
        `UPDATE sessions SET end = NOW() WHERE id = ?`,
        [session.id],
    );

    if (affectedRows! <= 0) {
        throw new Error(`Problem stopping session ${session}`);
    }
}

export async function getRunningSessions(): Promise<Session[]> {
    const sessions = await dbClient.query(
        `SELECT id, gameId, start FROM sessions WHERE end IS NULL`,
    );

    return sessions;
}

export async function getGameRuntime(gameId: number): Promise<number> {
    const sessions: Required<Pick<Session, "start" | "end">>[] = await dbClient
        .query(
            `SELECT start, end FROM sessions WHERE end IS NOT NULL AND gameId = ?`,
            [gameId],
        );

    return sessions.reduce((acc, { start, end }) => {
        const diff = end.getTime() - start.getTime();
        return acc + diff;
    }, 0);
}
