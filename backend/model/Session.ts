import { z } from "https://deno.land/x/zod@v3.22.2/mod.ts";

export const Session = z.object({
    id: z.number(),
    gameId: z.number(),
    start: z.date(),
    end: z.date().optional(),
});
export type Session = z.infer<typeof Session>;
