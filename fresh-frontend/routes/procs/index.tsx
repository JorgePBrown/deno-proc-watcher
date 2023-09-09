import { PageProps } from "$fresh/server.ts";

export interface Proc {
    pid: number;
    name: string;
    cmd: string;
    ppid: number;
    uid: number;
    cpu: number;
    memory: number;
}
export default async function ProcPage(props: PageProps) {
    const incomingUrl = new URL(props.url);
    const cmdQuery = incomingUrl.searchParams.get("cmd");
    const url = new URL(`http://localhost:3000/procs`);
    if (cmdQuery) url.searchParams.set("cmd", cmdQuery);
    const res = await fetch(url);

    if (!res) return <p>An error occurred</p>;

    const procs: Proc[] = await res.json();

    return (
        <div>
            <form>
                <input type="text" name="cmd" value={cmdQuery ?? ""} />
                <button type="submit">Search</button>
            </form>
            <ul>
                {procs.map((p) => {
                    return (
                        <li>
                            <a href={`/procs/${p.pid}`}>
                                <p>
                                    {p.name}
                                </p>
                                <p>
                                    {p.cmd}
                                </p>
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
