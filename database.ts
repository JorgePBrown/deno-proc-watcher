import { Client } from "https://deno.land/x/mysql@v2.12.0/mod.ts";

const client = await new Client().connect({
  hostname: "127.0.0.1",
  username: "root",
  db: "gamewatch",
  poolSize: 3, // connection limit
  password: "1234",
});
await client.execute(`CREATE DATABASE IF NOT EXISTS gamewatch`);
await client.execute(`USE gamewatch`);

await client.execute(`CREATE TABLE IF NOT EXISTS games(
id int(11) NOT NULL AUTO_INCREMENT,
name varchar(256) NOT NULL,
cmd varchar(256) NOT NULL,
PRIMARY KEY(id)
)`);

await client.execute(`CREATE TABLE IF NOT EXISTS sessions(
id int(11) NOT NULL AUTO_INCREMENT,
gameId int(11) NOT NULL,
start timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
end timestamp,
PRIMARY KEY(id),
FOREIGN KEY(gameId)
    REFERENCES games(id)
)`);
export default client;
