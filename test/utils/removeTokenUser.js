"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const endpoints_1 = require("../endpoints");
const removeTokenUser = async (request, userId, commonHeaders) => {
    await request.delete(endpoints_1.usersRoutes.delete(userId)).set(commonHeaders);
};
exports.default = removeTokenUser;
//# sourceMappingURL=removeTokenUser.js.map