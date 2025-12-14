"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
const http_status_codes_1 = require("http-status-codes");
const endpoints_1 = require("../endpoints");
const randomUUID = '0a35dd62-e09f-444b-a628-f4e7c6954f57';
describe('Favorites (e2e)', () => {
    const commonHeaders = { Accept: 'application/json' };
    describe('GET all favorites', () => {
        it('should get UNAUTHORIZED without token presented', async () => {
            await lib_1.request
                .get(endpoints_1.favoritesRoutes.getAll)
                .set(commonHeaders)
                .expect(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        });
    });
    describe('POST album to favorites', () => {
        it('should get UNAUTHORIZED without token presented', async () => {
            await lib_1.request
                .post(endpoints_1.favoritesRoutes.albums(randomUUID))
                .set(commonHeaders)
                .expect(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        });
    });
    describe('POST artist to favorites', () => {
        it('should get UNAUTHORIZED without token presented', async () => {
            await lib_1.request
                .post(endpoints_1.favoritesRoutes.artists(randomUUID))
                .set(commonHeaders)
                .expect(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        });
    });
    describe('POST track to favorites', () => {
        it('should get UNAUTHORIZED without token presented', async () => {
            await lib_1.request
                .post(endpoints_1.favoritesRoutes.tracks(randomUUID))
                .set(commonHeaders)
                .expect(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        });
    });
    describe('DELETE album from favorites', () => {
        it('should get UNAUTHORIZED without token presented', async () => {
            await lib_1.request
                .delete(endpoints_1.favoritesRoutes.albums(randomUUID))
                .set(commonHeaders)
                .expect(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        });
    });
    describe('DELETE artist from favorites', () => {
        it('should get UNAUTHORIZED without token presented', async () => {
            await lib_1.request
                .delete(endpoints_1.favoritesRoutes.artists(randomUUID))
                .set(commonHeaders)
                .expect(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        });
    });
    describe('DELETE track from favorites', () => {
        it('should get UNAUTHORIZED without token presented', async () => {
            await lib_1.request
                .delete(endpoints_1.favoritesRoutes.tracks(randomUUID))
                .set(commonHeaders)
                .expect(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        });
    });
});
//# sourceMappingURL=favorites.e2e.spec.js.map