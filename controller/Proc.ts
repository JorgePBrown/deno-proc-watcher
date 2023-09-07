import { FastifyInstance } from "npm:fastify";
import ps from "../ps.ts";

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

      if (request.query.name) {
        procs = procs.filter((p) => p.name.includes(request.query.name));
      }
      if (request.query.cmd) {
        procs = procs.filter((p) => p.cmd.includes(request.query.cmd));
      }
      if (request.query.ppid) {
        procs = procs.filter((p) => p.ppid === +request.query.ppid);
      }
      if (request.query.pid) {
        procs = procs.filter((p) => p.pid === +request.query.pid);
      }
      await reply.send(procs);
    });
  }
}
