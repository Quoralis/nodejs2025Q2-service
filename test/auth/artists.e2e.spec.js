"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
const endpoints_1 = require("../endpoints");
const http_status_codes_1 = require("http-status-codes");
const createArtistDto = {
    name: 'TEST_artist',
    grammy: true,
};
const randomUUID = '0a35dd62-e09f-444b-a628-f4e7c6954f57';
describe('artist (e2e)', () => {
    const commonHeaders = { Accept: 'application/json' };
    describe('GET all artists', () => {
        it('should get UNAUTHORIZED without token presented', async () => {
            await lib_1.request
                .get(endpoints_1.artistsRoutes.getAll)
                .set(commonHeaders)
                .expect(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        });
    });
    describe('GET artist by id', () => {
        it('should get UNAUTHORIZED without token presented', async () => {
            await lib_1.request
                .get(endpoints_1.artistsRoutes.getById(randomUUID))
                .set(commonHeaders)
                .expect(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        });
    });
    describe('POST', () => {
        it('should get UNAUTHORIZED without token presented', async () => {
            await lib_1.request
                .post(endpoints_1.artistsRoutes.create)
                .set(commonHeaders)
                .send(createArtistDto)
                .expect(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        });
    });
    describe('PUT', () => {
        it('should get UNAUTHORIZED without token presented', async () => {
            await lib_1.request
                .put(endpoints_1.artistsRoutes.update(randomUUID))
                .set(commonHeaders)
                .send({
                name: createArtistDto.name,
                grammy: false,
            })
                .expect(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        });
    });
    describe('DELETE', () => {
        it('should get UNAUTHORIZED without token presented', async () => {
            await lib_1.request
                .delete(endpoints_1.artistsRoutes.delete(randomUUID))
                .set(commonHeaders)
                .expect(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        });
    });
});
//# sourceMappingURL=artists.e2e.spec.js.map