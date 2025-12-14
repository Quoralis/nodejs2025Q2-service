"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("./lib");
const http_status_codes_1 = require("http-status-codes");
const endpoints_1 = require("./endpoints");
const uuid_1 = require("uuid");
const utils_1 = require("./utils");
const createAlbumDto = {
    name: 'TEST_ALBUM',
    year: 2022,
    artistId: null,
};
const createArtistDto = {
    name: 'TEST_artist',
    grammy: true,
};
const randomUUID = '0a35dd62-e09f-444b-a628-f4e7c6954f57';
describe('Album (e2e)', () => {
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
        it('should correctly get all albums', async () => {
            const response = await unauthorizedRequest
                .get(endpoints_1.albumsRoutes.getAll)
                .set(commonHeaders);
            expect(response.status).toBe(http_status_codes_1.StatusCodes.OK);
            expect(response.body).toBeInstanceOf(Array);
        });
        it('should correctly get album by id', async () => {
            const creationResponse = await unauthorizedRequest
                .post(endpoints_1.albumsRoutes.create)
                .set(commonHeaders)
                .send(createAlbumDto);
            const { id } = creationResponse.body;
            expect(creationResponse.statusCode).toBe(http_status_codes_1.StatusCodes.CREATED);
            const searchResponse = await unauthorizedRequest
                .get(endpoints_1.albumsRoutes.getById(id))
                .set(commonHeaders);
            expect(searchResponse.statusCode).toBe(http_status_codes_1.StatusCodes.OK);
            expect(searchResponse.body).toBeInstanceOf(Object);
            const cleanupResponse = await unauthorizedRequest
                .delete(endpoints_1.albumsRoutes.delete(id))
                .set(commonHeaders);
            expect(cleanupResponse.statusCode).toBe(http_status_codes_1.StatusCodes.NO_CONTENT);
        });
        it('should respond with BAD_REQUEST status code in case of invalid id', async () => {
            const response = await unauthorizedRequest
                .get(endpoints_1.albumsRoutes.getById('some-invalid-id'))
                .set(commonHeaders);
            expect(response.status).toBe(http_status_codes_1.StatusCodes.BAD_REQUEST);
        });
        it("should respond with NOT_FOUND status code in case if album doesn't exist", async () => {
            const response = await unauthorizedRequest
                .get(endpoints_1.albumsRoutes.getById(randomUUID))
                .set(commonHeaders);
            expect(response.status).toBe(http_status_codes_1.StatusCodes.NOT_FOUND);
        });
    });
    describe('POST', () => {
        it('should correctly create album', async () => {
            const response = await unauthorizedRequest
                .post(endpoints_1.albumsRoutes.create)
                .set(commonHeaders)
                .send(createAlbumDto);
            const { id, name, year, artistId } = response.body;
            expect(response.status).toBe(http_status_codes_1.StatusCodes.CREATED);
            expect(name).toBe(createAlbumDto.name);
            expect(year).toBe(createAlbumDto.year);
            expect(artistId).toBe(createAlbumDto.artistId);
            expect((0, uuid_1.validate)(id)).toBe(true);
            const cleanupResponse = await unauthorizedRequest
                .delete(endpoints_1.albumsRoutes.delete(id))
                .set(commonHeaders);
            expect(cleanupResponse.statusCode).toBe(http_status_codes_1.StatusCodes.NO_CONTENT);
        });
        it('should respond with BAD_REQUEST in case of invalid required data', async () => {
            const responses = await Promise.all([
                unauthorizedRequest
                    .post(endpoints_1.albumsRoutes.create)
                    .set(commonHeaders)
                    .send({}),
                unauthorizedRequest.post(endpoints_1.albumsRoutes.create).set(commonHeaders).send({
                    name: 'TEST_ALBUM',
                }),
                unauthorizedRequest.post(endpoints_1.albumsRoutes.create).set(commonHeaders).send({
                    year: 2022,
                }),
                unauthorizedRequest.post(endpoints_1.albumsRoutes.create).set(commonHeaders).send({
                    name: null,
                    year: '2022',
                }),
            ]);
            expect(responses.every(({ statusCode }) => statusCode === http_status_codes_1.StatusCodes.BAD_REQUEST)).toBe(true);
        });
    });
    describe('PUT', () => {
        it('should correctly update album', async () => {
            const creationResponse = await unauthorizedRequest
                .post(endpoints_1.albumsRoutes.create)
                .set(commonHeaders)
                .send(createAlbumDto);
            const { id: createdId } = creationResponse.body;
            expect(creationResponse.status).toBe(http_status_codes_1.StatusCodes.CREATED);
            const updatedYear = 2021;
            const creationArtistResponse = await unauthorizedRequest
                .post(endpoints_1.artistsRoutes.create)
                .set(commonHeaders)
                .send(createArtistDto);
            expect(creationArtistResponse.statusCode).toBe(http_status_codes_1.StatusCodes.CREATED);
            const { id: updateArtistId } = creationArtistResponse.body;
            const { statusCode } = await unauthorizedRequest
                .put(endpoints_1.albumsRoutes.update(createdId))
                .set(commonHeaders)
                .send({
                name: createAlbumDto.name,
                year: updatedYear,
                artistId: updateArtistId,
            });
            expect(statusCode).toBe(http_status_codes_1.StatusCodes.OK);
            const updatedAlbumResponse = await unauthorizedRequest
                .get(endpoints_1.albumsRoutes.getById(createdId))
                .set(commonHeaders);
            const { id: updatedId, name, year, artistId } = updatedAlbumResponse.body;
            expect(name).toBe(createAlbumDto.name);
            expect(year).toBe(updatedYear);
            expect(artistId).toBe(updateArtistId);
            expect((0, uuid_1.validate)(updatedId)).toBe(true);
            expect(createdId).toBe(updatedId);
            const cleanupResponse = await unauthorizedRequest
                .delete(endpoints_1.albumsRoutes.delete(createdId))
                .set(commonHeaders);
            expect(cleanupResponse.statusCode).toBe(http_status_codes_1.StatusCodes.NO_CONTENT);
        });
        it('should respond with BAD_REQUEST status code in case of invalid id', async () => {
            const response = await unauthorizedRequest
                .put(endpoints_1.albumsRoutes.update('some-invalid-id'))
                .set(commonHeaders)
                .send({
                name: createAlbumDto.name,
                year: 2021,
                artistId: createAlbumDto.artistId,
            });
            expect(response.status).toBe(http_status_codes_1.StatusCodes.BAD_REQUEST);
        });
        it('should respond with BAD_REQUEST status code in case of invalid dto', async () => {
            const creationResponse = await unauthorizedRequest
                .post(endpoints_1.albumsRoutes.create)
                .set(commonHeaders)
                .send(createAlbumDto);
            const { id: createdId } = creationResponse.body;
            expect(creationResponse.status).toBe(http_status_codes_1.StatusCodes.CREATED);
            const response = await unauthorizedRequest
                .put(endpoints_1.albumsRoutes.update(createdId))
                .set(commonHeaders)
                .send({
                name: true,
                year: '2021',
                artistId: 123,
            });
            expect(response.status).toBe(http_status_codes_1.StatusCodes.BAD_REQUEST);
        });
        it("should respond with NOT_FOUND status code in case if album doesn't exist", async () => {
            const response = await unauthorizedRequest
                .put(endpoints_1.albumsRoutes.update(randomUUID))
                .set(commonHeaders)
                .send({
                name: createAlbumDto.name,
                year: 2021,
                artistId: createAlbumDto.artistId,
            });
            expect(response.status).toBe(http_status_codes_1.StatusCodes.NOT_FOUND);
        });
    });
    describe('DELETE', () => {
        it('should correctly delete album', async () => {
            const response = await unauthorizedRequest
                .post(endpoints_1.albumsRoutes.create)
                .set(commonHeaders)
                .send(createAlbumDto);
            const { id } = response.body;
            expect(response.status).toBe(http_status_codes_1.StatusCodes.CREATED);
            const cleanupResponse = await unauthorizedRequest
                .delete(endpoints_1.albumsRoutes.delete(id))
                .set(commonHeaders);
            expect(cleanupResponse.statusCode).toBe(http_status_codes_1.StatusCodes.NO_CONTENT);
            const searchResponse = await unauthorizedRequest
                .get(endpoints_1.albumsRoutes.getById(id))
                .set(commonHeaders);
            expect(searchResponse.statusCode).toBe(http_status_codes_1.StatusCodes.NOT_FOUND);
        });
        it('should respond with BAD_REQUEST status code in case of invalid id', async () => {
            const response = await unauthorizedRequest
                .delete(endpoints_1.albumsRoutes.delete('some-invalid-id'))
                .set(commonHeaders);
            expect(response.status).toBe(http_status_codes_1.StatusCodes.BAD_REQUEST);
        });
        it("should respond with NOT_FOUND status code in case if album doesn't exist", async () => {
            const response = await unauthorizedRequest
                .delete(endpoints_1.albumsRoutes.delete(randomUUID))
                .set(commonHeaders);
            expect(response.status).toBe(http_status_codes_1.StatusCodes.NOT_FOUND);
        });
        it('should set track.albumId = null after delete', async () => {
            const response = await unauthorizedRequest
                .post(endpoints_1.albumsRoutes.create)
                .set(commonHeaders)
                .send(createAlbumDto);
            const { id } = response.body;
            expect(response.status).toBe(http_status_codes_1.StatusCodes.CREATED);
            const createTrackDto = {
                name: 'TEST_TRACK',
                duration: 199,
                artistId: null,
                albumId: id,
            };
            const creationTrackResponse = await unauthorizedRequest
                .post(endpoints_1.tracksRoutes.create)
                .set(commonHeaders)
                .send(createTrackDto);
            const { id: trackId } = creationTrackResponse.body;
            expect(creationTrackResponse.statusCode).toBe(http_status_codes_1.StatusCodes.CREATED);
            const deleteResponse = await unauthorizedRequest
                .delete(endpoints_1.albumsRoutes.delete(id))
                .set(commonHeaders);
            expect(deleteResponse.statusCode).toBe(http_status_codes_1.StatusCodes.NO_CONTENT);
            const searchTrackResponse = await unauthorizedRequest
                .get(endpoints_1.tracksRoutes.getById(trackId))
                .set(commonHeaders);
            expect(searchTrackResponse.statusCode).toBe(http_status_codes_1.StatusCodes.OK);
            const { albumId } = searchTrackResponse.body;
            expect(albumId).toBe(null);
        });
    });
});
//# sourceMappingURL=albums.e2e.spec.js.map