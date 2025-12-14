"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
const http_status_codes_1 = require("http-status-codes");
const endpoints_1 = require("../endpoints");
const createTrackDto = {
    name: 'TEST_TRACK',
    duration: 199,
    artistId: null,
    albumId: null,
};
const randomUUID = '0a35dd62-e09f-444b-a628-f4e7c6954f57';
describe('Tracks (e2e)', () => {
    const commonHeaders = { Accept: 'application/json' };
    describe('GET all tracks', () => {
        it('should get UNAUTHORIZED without token presented', async () => {
            await lib_1.request
                .get(endpoints_1.tracksRoutes.getAll)
                .set(commonHeaders)
                .expect(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        });
    });
    describe('GET track by id', () => {
        it('should get UNAUTHORIZED without token presented', async () => {
            await lib_1.request
                .get(endpoints_1.tracksRoutes.getById(randomUUID))
                .set(commonHeaders)
                .expect(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        });
    });
    describe('POST', () => {
        it('should get UNAUTHORIZED without token presented', async () => {
            await lib_1.request
                .post(endpoints_1.tracksRoutes.create)
                .set(commonHeaders)
                .send(createTrackDto)
                .expect(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        });
    });
    describe('PUT', () => {
        it('should get UNAUTHORIZED without token presented', async () => {
            await lib_1.request
                .put(endpoints_1.tracksRoutes.update(randomUUID))
                .set(commonHeaders)
                .send({
                name: createTrackDto.name,
                duration: 188,
                artistId: createTrackDto.artistId,
                albumId: createTrackDto.albumId,
            })
                .expect(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        });
    });
    describe('DELETE', () => {
        it('should get UNAUTHORIZED without token presented', async () => {
            await lib_1.request
                .delete(endpoints_1.tracksRoutes.delete(randomUUID))
                .set(commonHeaders)
                .expect(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        });
    });
});
//# sourceMappingURL=tracks.e2e.spec.js.map