import { Handlers, PageProps } from "$fresh/server.ts";

export const handler: Handlers = {
    async GET(_req, ctx) {
        const { gameId } = ctx.params;

        const res = await fetch(`http://localhost:3000/games/${gameId}/watch`, {
            method: "PATCH",
        });

        if (!res.ok) return ctx.render({ error: await res.text() });

        const game = await res.json();

        return ctx.render({ game });
    },
};

export default function UnwatchPage(props: PageProps) {
    const { game, error } = props.data;

    return (
        <div>
            {error
                ? (
                    <p>
                        Error unwatching: {error}
                    </p>
                )
                : <p>Now watching {game.name} again!</p>}
            <a href="/games">Back to games</a>
        </div>
    );
}
