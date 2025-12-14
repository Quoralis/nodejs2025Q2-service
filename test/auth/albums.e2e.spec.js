"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
const endpoints_1 = require("../endpoints");
const http_status_codes_1 = require("http-status-codes");
const createAlbumDto = {
    name: 'TEST_ALBUM',
    year: 2022,
    artistId: null,
};
const randomUUID = '0a35dd62-e09f-444b-a628-f4e7c6954f57';
describe('Album (e2e)', () => {
    const commonHeaders = { Accept: 'application/json' };
    describe('GET all albums', () => {
        it('should get UNAUTHORIZED without token presented', async () => {
            await lib_1.request.get(endpoints_1.albumsRoutes.getAll).expect(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        });
    });
    describe('GET album by id', () => {
        it('should get UNAUTHORIZED without token presented', async () => {
            await lib_1.request
                .get(endpoints_1.albumsRoutes.getById(randomUUID))
                .expect(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        });
    });
    describe('POST', () => {
        it('should get UNAUTHORIZED without token presented', async () => {
            await lib_1.request
                .post(endpoints_1.albumsRoutes.create)
                .set(commonHeaders)
                .send(createAlbumDto)
                .expect(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        });
    });
    describe('PUT', () => {
        it('should get UNAUTHORIZED without token presented', async () => {
            const updatedYear = 2021;
            await lib_1.request
                .put(endpoints_1.albumsRoutes.update(randomUUID))
                .set(commonHeaders)
                .send({
                name: createAlbumDto.name,
                year: updatedYear,
                artistId: randomUUID,
            })
                .expect(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        });
    });
    describe('DELETE', () => {
        it('should get UNAUTHORIZED without token presented', async () => {
            await lib_1.request
                .delete(endpoints_1.albumsRoutes.delete(randomUUID))
                .set(commonHeaders)
                .expect(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        });
    });
});
//# sourceMappingURL=albums.e2e.spec.js.map