"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
const http_status_codes_1 = require("http-status-codes");
const endpoints_1 = require("../endpoints");
const createUserDto = {
    login: 'TEST_LOGIN',
    password: 'TEST_PASSWORD',
};
const randomUUID = '0a35dd62-e09f-444b-a628-f4e7c6954f57';
describe('Users (e2e)', () => {
    const commonHeaders = { Accept: 'application/json' };
    describe('GET all users', () => {
        it('should get UNAUTHORIZED without token presented', async () => {
            await lib_1.request
                .get(endpoints_1.usersRoutes.getAll)
                .set(commonHeaders)
                .expect(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        });
    });
    describe('GET user by id', () => {
        it('should get UNAUTHORIZED without token presented', async () => {
            await lib_1.request
                .get(endpoints_1.usersRoutes.getById(randomUUID))
                .set(commonHeaders)
                .expect(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        });
    });
    describe('POST', () => {
        it('should get UNAUTHORIZED without token presented', async () => {
            await lib_1.request
                .post(endpoints_1.usersRoutes.create)
                .set(commonHeaders)
                .send(createUserDto)
                .expect(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        });
    });
    describe('PUT', () => {
        it('should get UNAUTHORIZED without token presented', async () => {
            await lib_1.request
                .put(endpoints_1.usersRoutes.update(randomUUID))
                .set(commonHeaders)
                .send({
                oldPassword: createUserDto.password,
                newPassword: 'NEW_PASSWORD',
            })
                .expect(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        });
    });
    describe('DELETE', () => {
        it('should get UNAUTHORIZED without token presented', async () => {
            await lib_1.request
                .delete(endpoints_1.usersRoutes.delete(randomUUID))
                .set(commonHeaders)
                .expect(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        });
    });
});
//# sourceMappingURL=users.e2e.spec.js.map