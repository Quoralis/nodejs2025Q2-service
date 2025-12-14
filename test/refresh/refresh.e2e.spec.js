"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("../lib/request");
const endpoints_1 = require("../endpoints");
const utils_1 = require("../utils");
const common_1 = require("@nestjs/common");
const jsonwebtoken_1 = require("jsonwebtoken");
const uuid_1 = require("uuid");
describe('Refresh (e2e)', () => {
    let userTokens;
    const headers = { Accept: 'application/json' };
    const verifyToken = async (token) => {
        const payload = (0, jsonwebtoken_1.decode)(token, { json: true });
        if (!payload) {
            throw new Error('Token is not valid!');
        }
        const { userId, login, exp } = payload;
        expect(payload).toBeInstanceOf(Object);
        expect(login).toBeDefined();
        expect(typeof login).toBe('string');
        expect(userId).toBeDefined();
        expect(typeof userId).toBe('string');
        expect((0, uuid_1.validate)(userId)).toBeTruthy();
        expect(exp).toBeDefined();
        expect(typeof exp).toBe('number');
        expect(exp).toBeGreaterThan(0);
        return payload;
    };
    beforeAll(async () => {
        if (utils_1.shouldAuthorizationBeTested) {
            const { accessToken, refreshToken, mockUserId, login, token } = await (0, utils_1.getTokenAndUserId)(request_1.default);
            userTokens = { userId: mockUserId, login, accessToken, refreshToken };
            headers['Authorization'] = token;
        }
    });
    afterAll(async () => {
        if (userTokens) {
            (0, utils_1.removeTokenUser)(request_1.default, userTokens.userId, headers);
            delete headers['Authorization'];
        }
    });
    describe('Refresh', () => {
        it('should correctly get new tokens pair', async () => {
            const response = await request_1.default
                .post(endpoints_1.authRoutes.refresh)
                .send({ refreshToken: userTokens.refreshToken });
            expect(response.statusCode).toBe(common_1.HttpStatus.OK);
            expect(response.body).toBeInstanceOf(Object);
            const { accessToken, refreshToken } = response.body;
            expect(accessToken).toBeDefined();
            expect(typeof accessToken).toBe('string');
            expect(refreshToken).toBeDefined();
            expect(typeof refreshToken).toBe('string');
            const accessTokenPayload = await verifyToken(accessToken);
            const refreshTokenPayload = await verifyToken(refreshToken);
            expect(refreshTokenPayload.exp).toBeGreaterThan(accessTokenPayload.exp);
        });
        it('should fail with 403 (invalid refresh token)', async () => {
            const invalidRefreshToken = Math.random().toString();
            const response = await request_1.default
                .post(endpoints_1.authRoutes.refresh)
                .send({ refreshToken: invalidRefreshToken });
            expect(response.statusCode).toBe(common_1.HttpStatus.FORBIDDEN);
        });
        it('should fail with 401 (no refresh token)', async () => {
            const response = await request_1.default.post(endpoints_1.authRoutes.refresh).send();
            expect(response.statusCode).toBe(common_1.HttpStatus.UNAUTHORIZED);
        });
        it('should fail with 403 (expired refresh token)', async () => {
            const payload = {
                userId: userTokens.userId,
                login: userTokens.login,
            };
            const refreshToken = (0, utils_1.generateRefreshToken)(payload, { expiresIn: '0s' });
            const response = await request_1.default
                .post(endpoints_1.authRoutes.refresh)
                .send({ refreshToken });
            expect(response.statusCode).toBe(common_1.HttpStatus.FORBIDDEN);
        });
    });
});
//# sourceMappingURL=refresh.e2e.spec.js.map