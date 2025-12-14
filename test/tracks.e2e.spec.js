"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const http_status_codes_1 = require("http-status-codes");
const lib_1 = require("./lib");
const utils_1 = require("./utils");
const endpoints_1 = require("./endpoints");
const createTrackDto = {
    name: 'TEST_TRACK',
    duration: 199,
    artistId: null,
    albumId: null,
};
const randomUUID = '0a35dd62-e09f-444b-a628-f4e7c6954f57';
describe('Tracks (e2e)', () => {
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
        it('should correctly get all tracks', async () => {
            const response = await unauthorizedRequest
                .get(endpoints_1.tracksRoutes.getAll)
                .set(commonHeaders);
            expect(response.status).toBe(http_status_codes_1.StatusCodes.OK);
            expect(response.body).toBeInstanceOf(Array);
        });
        it('should correctly get track by id', async () => {
            const creationResponse = await unauthorizedRequest
                .post(endpoints_1.tracksRoutes.create)
                .set(commonHeaders)
                .send(createTrackDto);
            const { id } = creationResponse.body;
            expect(creationResponse.statusCode).toBe(http_status_codes_1.StatusCodes.CREATED);
            const searchResponse = await unauthorizedRequest
                .get(endpoints_1.tracksRoutes.getById(id))
                .set(commonHeaders);
            expect(searchResponse.statusCode).toBe(http_status_codes_1.StatusCodes.OK);
            expect(searchResponse.body).toBeInstanceOf(Object);
            const cleanupResponse = await unauthorizedRequest
                .delete(endpoints_1.tracksRoutes.delete(id))
                .set(commonHeaders);
            expect(cleanupResponse.statusCode).toBe(http_status_codes_1.StatusCodes.NO_CONTENT);
        });
        it('should respond with BAD_REQUEST status code in case of invalid id', async () => {
            const response = await unauthorizedRequest
                .get(endpoints_1.tracksRoutes.getById('some-invalid-id'))
                .set(commonHeaders);
            expect(response.status).toBe(http_status_codes_1.StatusCodes.BAD_REQUEST);
        });
        it("should respond with NOT_FOUND status code in case if track doesn't exist", async () => {
            const response = await unauthorizedRequest
                .get(endpoints_1.tracksRoutes.getById(randomUUID))
                .set(commonHeaders);
            expect(response.status).toBe(http_status_codes_1.StatusCodes.NOT_FOUND);
        });
    });
    describe('POST', () => {
        it('should correctly create track', async () => {
            const response = await unauthorizedRequest
                .post(endpoints_1.tracksRoutes.create)
                .set(commonHeaders)
                .send(createTrackDto);
            expect(response.status).toBe(http_status_codes_1.StatusCodes.CREATED);
            const { id, name, duration, artistId, albumId } = response.body;
            expect((0, uuid_1.validate)(id)).toBe(true);
            expect(name).toBe(createTrackDto.name);
            expect(duration).toBe(createTrackDto.duration);
            expect(artistId).toBe(createTrackDto.artistId);
            expect(albumId).toBe(createTrackDto.albumId);
            const cleanupResponse = await unauthorizedRequest
                .delete(endpoints_1.tracksRoutes.delete(id))
                .set(commonHeaders);
            expect(cleanupResponse.statusCode).toBe(http_status_codes_1.StatusCodes.NO_CONTENT);
        });
        it('should respond with BAD_REQUEST in case of invalid required data', async () => {
            const responses = await Promise.all([
                unauthorizedRequest
                    .post(endpoints_1.tracksRoutes.create)
                    .set(commonHeaders)
                    .send({}),
                unauthorizedRequest.post(endpoints_1.tracksRoutes.create).set(commonHeaders).send({
                    name: 'TEST_TRACK',
                }),
                unauthorizedRequest.post(endpoints_1.tracksRoutes.create).set(commonHeaders).send({
                    duration: 99,
                }),
                unauthorizedRequest.post(endpoints_1.tracksRoutes.create).set(commonHeaders).send({
                    name: null,
                    duration: '99',
                }),
            ]);
            expect(responses.every(({ statusCode }) => statusCode === http_status_codes_1.StatusCodes.BAD_REQUEST)).toBe(true);
        });
    });
    describe('PUT', () => {
        it('should correctly update track match', async () => {
            const creationResponse = await unauthorizedRequest
                .post(endpoints_1.tracksRoutes.create)
                .set(commonHeaders)
                .send(createTrackDto);
            const { id: createdId } = creationResponse.body;
            expect(creationResponse.status).toBe(http_status_codes_1.StatusCodes.CREATED);
            const { statusCode } = await unauthorizedRequest
                .put(endpoints_1.tracksRoutes.update(createdId))
                .set(commonHeaders)
                .send({
                name: createTrackDto.name,
                duration: 188,
                artistId: createTrackDto.artistId,
                albumId: createTrackDto.albumId,
            });
            expect(statusCode).toBe(http_status_codes_1.StatusCodes.OK);
            const updatedTrackResponse = await unauthorizedRequest
                .get(endpoints_1.tracksRoutes.getById(createdId))
                .set(commonHeaders);
            const { id: updatedId, name, duration, artistId, albumId, } = updatedTrackResponse.body;
            expect(name).toBe(createTrackDto.name);
            expect(artistId).toBe(createTrackDto.artistId);
            expect(albumId).toBe(createTrackDto.albumId);
            expect(typeof duration).toBe('number');
            expect((0, uuid_1.validate)(updatedId)).toBe(true);
            expect(createdId).toBe(updatedId);
            const cleanupResponse = await unauthorizedRequest
                .delete(endpoints_1.tracksRoutes.delete(createdId))
                .set(commonHeaders);
            expect(cleanupResponse.statusCode).toBe(http_status_codes_1.StatusCodes.NO_CONTENT);
        });
        it('should respond with BAD_REQUEST status code in case of invalid id', async () => {
            const response = await unauthorizedRequest
                .put(endpoints_1.tracksRoutes.update('some-invalid-id'))
                .set(commonHeaders)
                .send({
                name: createTrackDto.name,
                duration: 188,
                artistId: createTrackDto.artistId,
                albumId: createTrackDto.albumId,
            });
            expect(response.status).toBe(http_status_codes_1.StatusCodes.BAD_REQUEST);
        });
        it('should respond with BAD_REQUEST status code in case of invalid dto', async () => {
            const creationResponse = await unauthorizedRequest
                .post(endpoints_1.tracksRoutes.create)
                .set(commonHeaders)
                .send(createTrackDto);
            const { id: createdId } = creationResponse.body;
            expect(creationResponse.status).toBe(http_status_codes_1.StatusCodes.CREATED);
            const response = await unauthorizedRequest
                .put(endpoints_1.tracksRoutes.update(createdId))
                .set(commonHeaders)
                .send({
                name: null,
                duration: '188',
                artistId: 123,
                albumId: 123,
            });
            expect(response.status).toBe(http_status_codes_1.StatusCodes.BAD_REQUEST);
        });
        it("should respond with NOT_FOUND status code in case if track doesn't exist", async () => {
            const response = await unauthorizedRequest
                .put(endpoints_1.tracksRoutes.update(randomUUID))
                .set(commonHeaders)
                .send({
                name: createTrackDto.name,
                duration: 188,
                artistId: createTrackDto.artistId,
                albumId: createTrackDto.albumId,
            });
            expect(response.status).toBe(http_status_codes_1.StatusCodes.NOT_FOUND);
        });
    });
    describe('DELETE', () => {
        it('should correctly delete track', async () => {
            const response = await unauthorizedRequest
                .post(endpoints_1.tracksRoutes.create)
                .set(commonHeaders)
                .send(createTrackDto);
            const { id } = response.body;
            expect(response.status).toBe(http_status_codes_1.StatusCodes.CREATED);
            const cleanupResponse = await unauthorizedRequest
                .delete(endpoints_1.tracksRoutes.delete(id))
                .set(commonHeaders);
            expect(cleanupResponse.statusCode).toBe(http_status_codes_1.StatusCodes.NO_CONTENT);
            const searchResponse = await unauthorizedRequest
                .get(endpoints_1.tracksRoutes.getById(id))
                .set(commonHeaders);
            expect(searchResponse.statusCode).toBe(http_status_codes_1.StatusCodes.NOT_FOUND);
        });
        it('should respond with BAD_REQUEST status code in case of invalid id', async () => {
            const response = await unauthorizedRequest
                .delete(endpoints_1.tracksRoutes.delete('some-invalid-id'))
                .set(commonHeaders);
            expect(response.status).toBe(http_status_codes_1.StatusCodes.BAD_REQUEST);
        });
        it("should respond with NOT_FOUND status code in case if track doesn't exist", async () => {
            const response = await unauthorizedRequest
                .delete(endpoints_1.tracksRoutes.delete(randomUUID))
                .set(commonHeaders);
            expect(response.status).toBe(http_status_codes_1.StatusCodes.NOT_FOUND);
        });
    });
});
//# sourceMappingURL=tracks.e2e.spec.js.map