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
                        cmd: { type: "string" },
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
                                "cmd",
                                "ppid",
                                "uid",
                                "cpu",
                                "memory",
                            ],
                            "properties": {
                                "pid": {
                                    "type": "integer",
                                },
                                "name": {
                                    "type": "string",
                                },
                                "cmd": {
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
            sfilterProcs("cmd");
            nfilterProcs("ppid");
            nfilterProcs("pid");

            await reply.send(procs);
        });
    }
}
