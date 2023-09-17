import { RouteContext } from "$fresh/server.ts";
import type { Game } from "../index.tsx";

interface GameTimeResponse {
    time: number;
}
export function durationToString(time: number): string {
    const hours = time / (1000 * 60 * 60);
    const flooredHours = Math.floor(hours);

    const leftOverMinutes = Math.floor((hours - flooredHours) * 60);

    let text = "";

    if (flooredHours > 0) {
        text += flooredHours === 1
            ? "1 hour and "
            : `${flooredHours} hours and `;
    }

    text += `${leftOverMinutes} minutes`;
    return text;
}

export default async function GamePage(_req: Request, ctx: RouteContext) {
    const { gameId } = ctx.params;

    const res = await fetch(`http://localhost:3000/games/${gameId}/time`);

    if (!res.ok) return <p>An error occurred</p>;

    const { time }: GameTimeResponse = await res.json();

    const text = durationToString(time);

    const gameRes = await fetch(`http://localhost:3000/games/${gameId}`);

    if (!gameRes.ok) return <p>An error occurred</p>;

    const game: Game = await gameRes.json();

    const toggleWatch = game.watched
        ? <a href={`/games/${gameId}/unwatch`}>Unwatch</a>
        : <a href={`/games/${gameId}/watch`}>Watch</a>;

    return (
        <div>
            <h1>
                {game.name}
            </h1>
            <h2>
                Game Time
            </h2>
            <p>
                {text}
            </p>
            <a href={`/games/${gameId}/sessions`}>Sessions</a>
            <br />
            {toggleWatch}
        </div>
    );
}
