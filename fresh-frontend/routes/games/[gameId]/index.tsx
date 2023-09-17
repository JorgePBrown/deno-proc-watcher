import { RouteContext } from "$fresh/server.ts";

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

    return (
        <div>
            <h1>
                Game Time
            </h1>
            <p>
                {text}
            </p>
            <a href={`/games/${gameId}/sessions`}>Sessions</a>
            <br />
            <a href={`/games/${gameId}/unwatch`}>Unwatch</a>
        </div>
    );
}
