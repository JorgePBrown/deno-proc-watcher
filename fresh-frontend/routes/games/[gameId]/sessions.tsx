import { Handlers, PageProps } from "$fresh/server.ts";
import { durationToString } from "./index.tsx";

export const handler: Handlers = {
    async GET(_req, ctx) {
        const { gameId } = ctx.params;
        const res = await fetch(
            `http://localhost:3000/sessions?gameId=${gameId}`,
        );

        if (!res.ok) {
            return ctx.render({ error: await res.text() });
        }

        const sessions = await res.json();

        return ctx.render({ sessions });
    },
};
export default function GameSessionsPage(props: PageProps) {
    return (
        <ul>
            {props.data.sessions.map((s) => {
                return (
                    <li>
                        <p>
                            {new Date(s.start).toLocaleString()}
                        </p>
                        <p>
                            Duration: {durationToString(
                                new Date(s.end) - new Date(s.start),
                            )}
                        </p>
                    </li>
                );
            })}
        </ul>
    );
}
