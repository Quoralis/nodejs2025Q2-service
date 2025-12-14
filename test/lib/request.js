"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
require("dotenv/config");
const port = process.env.PORT || 4000;
const host = `localhost:${port}`;
const _request = request(host);
exports.default = _request;
//# sourceMappingURL=request.js.map