"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
require("dotenv/config");
const refreshTokenSecurityKey = process.env.JWT_SECRET_REFRESH_KEY || '';
const generateRefreshToken = (payload, options) => {
    return (0, jsonwebtoken_1.sign)(payload, refreshTokenSecurityKey, options);
};
exports.default = generateRefreshToken;
//# sourceMappingURL=tokens.js.map