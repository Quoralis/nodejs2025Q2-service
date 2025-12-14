"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const endpoints_1 = require("../endpoints");
const createUserDto = {
    login: 'TEST_AUTH_LOGIN',
    password: 'Tu6!@#%&',
};
const getTokenAndUserId = async (request) => {
    const { body: { id: mockUserId }, } = await request
        .post(endpoints_1.authRoutes.signup)
        .set('Accept', 'application/json')
        .send(createUserDto);
    const { body: { accessToken, refreshToken }, } = await request
        .post(endpoints_1.authRoutes.login)
        .set('Accept', 'application/json')
        .send(createUserDto);
    if (mockUserId === undefined || accessToken === undefined) {
        throw new Error('Authorization is not implemented');
    }
    const token = `Bearer ${accessToken}`;
    return {
        token,
        accessToken,
        refreshToken,
        mockUserId,
        login: createUserDto.login,
    };
};
exports.default = getTokenAndUserId;
//# sourceMappingURL=getTokenAndUserId.js.map