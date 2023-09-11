interface Game {
    id: number;
    name: string;
    cmd: string;
    watched: boolean;
}
export default async function GamePage() {
    const res = await fetch(`http://localhost:3000/games`);

    if (!res.ok) {
        return <p>An Error ocurred</p>;
    }

    const games: Game[] = await res.json();

    const watched = [];
    const unwatched = [];

    for (const game of games) {
        if (game.watched) watched.push(game);
        else unwatched.push(game);
    }

    return (
        <div>
            <h2>Watched</h2>
            <ul>
                {watched.map((g) => (
                    <li>
                        <a href={`/games/${g.id}`}>
                            <span>{g.name}</span>
                        </a>
                    </li>
                ))}
            </ul>
            <h2>Unwatched</h2>
            <ul>
                {unwatched.map((g) => (
                    <li>
                        <span>{g.name}</span>{" "}
                        <a href={`/games/${g.id}/watch`}>
                            <span>Watch again</span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
