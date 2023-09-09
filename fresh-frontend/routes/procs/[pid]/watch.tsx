import { Handlers, PageProps } from "$fresh/server.ts";
import { Proc } from "../index.tsx";

export const handler: Handlers = {
  async GET(req, ctx) {
    const incURL = new URL(req.url);

    if (incURL.searchParams.has("name")) {
      const procRes = await fetch(
        `http://localhost:3000/procs/${ctx.params.pid}`,
      );
      if (!procRes.ok) {
        return new Response(undefined, {
          status: 302,
          headers: { location: `/procs?error=not_found` },
        });
      }

      const proc: Proc = await procRes.json();

      const res = await fetch(`http://localhost:3000/games`, {
        method: "POST",
        body: JSON.stringify({
          name: incURL.searchParams.get("name"),
          cmd: proc.cmd,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        return ctx.render({ error: await res.text() });
      }

      return new Response(undefined, {
        status: 302,
        headers: { location: `/games` },
      });
    }

    return ctx.render();
  },
};

export default function ProcWatchPage(props: PageProps) {
  console.log(props);
  return (
    <form>
      <label>
        Name
      </label>
      <input type="text" name="name" />
      <button type="submit">Submit</button>
    </form>
  );
}
