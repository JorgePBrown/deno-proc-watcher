import { Handlers, PageProps } from "$fresh/server.ts";

export const handler: Handlers = {
    async GET(_req, ctx) {
        const { gameId } = ctx.params;

        const res = await fetch(`http://localhost:3000/games/${gameId}`, {
            method: "DELETE",
        });

        if (!res.ok) return ctx.render({ error: await res.text() });

        return ctx.render();
    },
};

export default function UnwatchPage(props: PageProps) {
    const error = props.data?.error;

    return (
        <div>
            {error
                ? (
                    <p>
                        Error unwatching: {error}
                    </p>
                )
                : <p>Stopped watching!</p>}
            <a href="/games">Back to games</a>
        </div>
    );
}
