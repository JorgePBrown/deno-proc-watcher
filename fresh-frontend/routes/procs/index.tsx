import { PageProps } from "$fresh/server.ts";

export interface Proc {
    pid: number;
    name: string;
    ppid: number;
    uid: number;
}
export default async function ProcPage(props: PageProps) {
    const incomingUrl = new URL(props.url);
    const nameQuery = incomingUrl.searchParams.get("name");
    const url = new URL(`http://localhost:3000/procs`);
    if (nameQuery) url.searchParams.set("name", nameQuery);
    const res = await fetch(url);

    if (!res) return <p>An error occurred</p>;

    const procs: Proc[] = await res.json();

    return (
        <div>
            <form>
                <input type="text" name="name" value={nameQuery ?? ""} />
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
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
