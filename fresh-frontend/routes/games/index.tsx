interface Game {
    id: number;
    name: string;
    cmd: string;
}
export default async function GamePage() {
    const res = await fetch(`http://localhost:3000/games`);

    if (!res.ok) {
        return <p>An Error ocurred</p>;
    }

    const games: Game[] = await res.json();

    return (
        <ul>
            {games.map((g) => (
                <li>
                    <a href={`/games/${g.id}`}>
                        <span>{g.name}</span>
                    </a>
                </li>
            ))}
        </ul>
    );
}
