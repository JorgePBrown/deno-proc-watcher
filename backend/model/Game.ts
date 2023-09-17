import { z } from "https://deno.land/x/zod@v3.22.2/mod.ts";

export const IncomingGame = z.object({
    name: z.string(),
});
export type IncomingGame = z.infer<typeof IncomingGame>;

export const Game = z.object({
    id: z.number(),
    name: z.string(),
    watched: z.boolean(),
});
export type Game = z.infer<typeof Game>;
