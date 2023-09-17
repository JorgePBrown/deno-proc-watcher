import { FastifyInstance } from "npm:fastify";
import ps from "../ps.ts";
import { ProcessDescriptor } from "npm:ps-list";

export default class ProcController {
    constructor(fastify: FastifyInstance) {
        fastify.get("/procs", {
            schema: {
                query: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        pid: { type: "number" },
                        ppid: { type: "number" },
                    },
                },
                response: {
                    200: {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "required": [
                                "pid",
                                "name",
                                "ppid",
                            ],
                            "properties": {
                                "pid": {
                                    "type": "integer",
                                },
                                "name": {
                                    "type": "string",
                                },
                                "ppid": {
                                    "type": "integer",
                                },
                                "uid": {
                                    "type": "integer",
                                },
                                "cpu": {
                                    "type": "integer",
                                },
                                "memory": {
                                    "type": "number",
                                },
                            },
                        },
                    },
                },
            },
        }, async (request, reply) => {
            let procs = await ps();

            function sfilterProcs(key: keyof ProcessDescriptor) {
                if (request.query[key]) {
                    procs = procs.filter((p) => p[key].toLowerCase().includes(request.query[key].toLowerCase()));
                }
            }
            function nfilterProcs(key: keyof ProcessDescriptor) {
                if (request.query[key]) {
                    procs = procs.filter((p) => p[key] === +request.query[key]);
                }
            }
            sfilterProcs("name");
            nfilterProcs("ppid");
            nfilterProcs("pid");

            await reply.send(procs);
        });

        fastify.get("/procs/:id", async (request, reply) => {
            const id = +request.params.id;

            const procs = await ps();

            reply.send(procs.find((p) => p.pid === id));
        });
    }
}
