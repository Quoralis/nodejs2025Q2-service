"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const http_status_codes_1 = require("http-status-codes");
const lib_1 = require("./lib");
const utils_1 = require("./utils");
const endpoints_1 = require("./endpoints");
const createUserDto = {
    login: 'TEST_LOGIN',
    password: 'TEST_PASSWORD',
};
const randomUUID = '0a35dd62-e09f-444b-a628-f4e7c6954f57';
describe('Users (e2e)', () => {
    const unauthorizedRequest = lib_1.request;
    const commonHeaders = { Accept: 'application/json' };
    let mockUserId;
    beforeAll(async () => {
        if (utils_1.shouldAuthorizationBeTested) {
            const result = await (0, utils_1.getTokenAndUserId)(unauthorizedRequest);
            commonHeaders['Authorization'] = result.token;
            mockUserId = result.mockUserId;
        }
    });
    afterAll(async () => {
        if (mockUserId) {
            await (0, utils_1.removeTokenUser)(unauthorizedRequest, mockUserId, commonHeaders);
        }
        if (commonHeaders['Authorization']) {
            delete commonHeaders['Authorization'];
        }
    });
    describe('GET', () => {
        it('should correctly get all users', async () => {
            const response = await unauthorizedRequest
                .get(endpoints_1.usersRoutes.getAll)
                .set(commonHeaders);
            expect(response.status).toBe(http_status_codes_1.StatusCodes.OK);
            expect(response.body).toBeInstanceOf(Array);
        });
        it('should correctly get user by id', async () => {
            const creationResponse = await unauthorizedRequest
                .post(endpoints_1.usersRoutes.create)
                .set(commonHeaders)
                .send(createUserDto);
            const { id } = creationResponse.body;
            expect(creationResponse.statusCode).toBe(http_status_codes_1.StatusCodes.CREATED);
            const searchResponse = await unauthorizedRequest
                .get(endpoints_1.usersRoutes.getById(id))
                .set(commonHeaders);
            expect(searchResponse.statusCode).toBe(http_status_codes_1.StatusCodes.OK);
            expect(searchResponse.body).toBeInstanceOf(Object);
            const cleanupResponse = await unauthorizedRequest
                .delete(endpoints_1.usersRoutes.delete(id))
                .set(commonHeaders);
            expect(cleanupResponse.statusCode).toBe(http_status_codes_1.StatusCodes.NO_CONTENT);
        });
        it('should respond with BAD_REQUEST status code in case of invalid id', async () => {
            const response = await unauthorizedRequest
                .get(endpoints_1.usersRoutes.getById('some-invalid-id'))
                .set(commonHeaders);
            expect(response.status).toBe(http_status_codes_1.StatusCodes.BAD_REQUEST);
        });
        it("should respond with NOT_FOUND status code in case if user doesn't exist", async () => {
            const response = await unauthorizedRequest
                .get(endpoints_1.usersRoutes.getById(randomUUID))
                .set(commonHeaders);
            expect(response.status).toBe(http_status_codes_1.StatusCodes.NOT_FOUND);
        });
    });
    describe('POST', () => {
        it('should correctly create user', async () => {
            const response = await unauthorizedRequest
                .post(endpoints_1.usersRoutes.create)
                .set(commonHeaders)
                .send(createUserDto);
            const { id, version, login, createdAt, updatedAt } = response.body;
            expect(response.status).toBe(http_status_codes_1.StatusCodes.CREATED);
            expect(login).toBe(createUserDto.login);
            expect(response.body).not.toHaveProperty('password');
            expect((0, uuid_1.validate)(id)).toBe(true);
            expect(version).toBe(1);
            expect(typeof createdAt).toBe('number');
            expect(typeof updatedAt).toBe('number');
            expect(createdAt === updatedAt).toBe(true);
            const cleanupResponse = await unauthorizedRequest
                .delete(endpoints_1.usersRoutes.delete(id))
                .set(commonHeaders);
            expect(cleanupResponse.statusCode).toBe(http_status_codes_1.StatusCodes.NO_CONTENT);
        });
        it('should respond with BAD_REQUEST in case of invalid required data', async () => {
            const responses = await Promise.all([
                unauthorizedRequest
                    .post(endpoints_1.usersRoutes.create)
                    .set(commonHeaders)
                    .send({}),
                unauthorizedRequest
                    .post(endpoints_1.usersRoutes.create)
                    .set(commonHeaders)
                    .send({ login: 'TEST_LOGIN' }),
                unauthorizedRequest
                    .post(endpoints_1.usersRoutes.create)
                    .set(commonHeaders)
                    .send({ password: 'TEST_PASSWORD' }),
                unauthorizedRequest
                    .post(endpoints_1.usersRoutes.create)
                    .set(commonHeaders)
                    .send({ login: null, password: 12345 }),
            ]);
            expect(responses.every(({ statusCode }) => statusCode === http_status_codes_1.StatusCodes.BAD_REQUEST)).toBe(true);
        });
    });
    describe('PUT', () => {
        it('should correctly update user password match', async () => {
            const creationResponse = await unauthorizedRequest
                .post(endpoints_1.usersRoutes.create)
                .set(commonHeaders)
                .send(createUserDto);
            const { id: createdId } = creationResponse.body;
            expect(creationResponse.status).toBe(http_status_codes_1.StatusCodes.CREATED);
            const updateResponse = await unauthorizedRequest
                .put(endpoints_1.usersRoutes.update(createdId))
                .set(commonHeaders)
                .send({
                oldPassword: createUserDto.password,
                newPassword: 'NEW_PASSWORD',
            });
            expect(updateResponse.statusCode).toBe(http_status_codes_1.StatusCodes.OK);
            const updatedUserResponse = await unauthorizedRequest
                .get(endpoints_1.usersRoutes.getById(createdId))
                .set(commonHeaders);
            const { id: updatedId, version, login, createdAt, updatedAt, } = updatedUserResponse.body;
            expect(login).toBe(createUserDto.login);
            expect(updateResponse.body).not.toHaveProperty('password');
            expect((0, uuid_1.validate)(updatedId)).toBe(true);
            expect(createdId).toBe(updatedId);
            expect(version).toBe(2);
            expect(typeof createdAt).toBe('number');
            expect(typeof updatedAt).toBe('number');
            expect(createdAt === updatedAt).toBe(false);
            const updateResponse2 = await unauthorizedRequest
                .put(endpoints_1.usersRoutes.update(createdId))
                .set(commonHeaders)
                .send({
                oldPassword: createUserDto.password,
                newPassword: 'NEW_PASSWORD',
            });
            expect(updateResponse2.statusCode).toBe(http_status_codes_1.StatusCodes.FORBIDDEN);
            const cleanupResponse = await unauthorizedRequest
                .delete(endpoints_1.usersRoutes.delete(createdId))
                .set(commonHeaders);
            expect(cleanupResponse.statusCode).toBe(http_status_codes_1.StatusCodes.NO_CONTENT);
        });
        it('should respond with BAD_REQUEST status code in case of invalid id', async () => {
            const response = await unauthorizedRequest
                .put(endpoints_1.usersRoutes.update('some-invalid-id'))
                .set(commonHeaders)
                .send({
                oldPassword: 'test',
                newPassword: 'fake',
            });
            expect(response.status).toBe(http_status_codes_1.StatusCodes.BAD_REQUEST);
        });
        it('should respond with BAD_REQUEST status code in case of invalid dto', async () => {
            const response = await unauthorizedRequest
                .put(endpoints_1.usersRoutes.update(randomUUID))
                .set(commonHeaders)
                .send({});
            expect(response.status).toBe(http_status_codes_1.StatusCodes.BAD_REQUEST);
        });
        it("should respond with NOT_FOUND status code in case if user doesn't exist", async () => {
            const response = await unauthorizedRequest
                .put(endpoints_1.usersRoutes.update(randomUUID))
                .set(commonHeaders)
                .send({
                oldPassword: 'test',
                newPassword: 'fake',
            });
            expect(response.status).toBe(http_status_codes_1.StatusCodes.NOT_FOUND);
        });
    });
    describe('DELETE', () => {
        it('should correctly delete user', async () => {
            const response = await unauthorizedRequest
                .post(endpoints_1.usersRoutes.create)
                .set(commonHeaders)
                .send(createUserDto);
            const { id } = response.body;
            expect(response.status).toBe(http_status_codes_1.StatusCodes.CREATED);
            const cleanupResponse = await unauthorizedRequest
                .delete(endpoints_1.usersRoutes.delete(id))
                .set(commonHeaders);
            expect(cleanupResponse.statusCode).toBe(http_status_codes_1.StatusCodes.NO_CONTENT);
            const searchResponse = await unauthorizedRequest
                .get(endpoints_1.usersRoutes.getById(id))
                .set(commonHeaders);
            expect(searchResponse.statusCode).toBe(http_status_codes_1.StatusCodes.NOT_FOUND);
        });
        it('should respond with BAD_REQUEST status code in case of invalid id', async () => {
            const response = await unauthorizedRequest
                .delete(endpoints_1.usersRoutes.delete('some-invalid-id'))
                .set(commonHeaders);
            expect(response.status).toBe(http_status_codes_1.StatusCodes.BAD_REQUEST);
        });
        it("should respond with NOT_FOUND status code in case if user doesn't exist", async () => {
            const response = await unauthorizedRequest
                .delete(endpoints_1.usersRoutes.delete(randomUUID))
                .set(commonHeaders);
            expect(response.status).toBe(http_status_codes_1.StatusCodes.NOT_FOUND);
        });
    });
});
//# sourceMappingURL=users.e2e.spec.js.map