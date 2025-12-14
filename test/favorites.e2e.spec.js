"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("./lib");
const http_status_codes_1 = require("http-status-codes");
const utils_1 = require("./utils");
const endpoints_1 = require("./endpoints");
const createAlbumDto = {
    name: 'TEST_ALBUM',
    year: 2022,
    artistId: null,
};
const createArtistDto = {
    name: 'TEST_artist',
    grammy: true,
};
const createTrackDto = {
    name: 'Test track',
    duration: 335,
    artistId: null,
    albumId: null,
};
const randomUUID = '0a35dd62-e09f-444b-a628-f4e7c6954f57';
describe('Favorites (e2e)', () => {
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
    describe('GET (basic)', () => {
        it('should correctly get all favorites (at least empty)', async () => {
            const response = await unauthorizedRequest
                .get(endpoints_1.favoritesRoutes.getAll)
                .set(commonHeaders);
            expect(response.status).toBe(http_status_codes_1.StatusCodes.OK);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty('artists');
            expect(response.body).toHaveProperty('albums');
            expect(response.body).toHaveProperty('tracks');
            expect(response.body.artists).toBeInstanceOf(Array);
            expect(response.body.albums).toBeInstanceOf(Array);
            expect(response.body.tracks).toBeInstanceOf(Array);
        });
    });
    describe('GET (advanced)', () => {
        it('should correctly get all favorites entities', async () => {
            const createArtistResponse = await unauthorizedRequest
                .post(endpoints_1.artistsRoutes.create)
                .set(commonHeaders)
                .send(createArtistDto);
            expect(createArtistResponse.status).toBe(http_status_codes_1.StatusCodes.CREATED);
            const { body: { id: artistId }, } = createArtistResponse;
            const createAlbumResponse = await unauthorizedRequest
                .post(endpoints_1.albumsRoutes.create)
                .set(commonHeaders)
                .send(Object.assign(Object.assign({}, createAlbumDto), { artistId }));
            expect(createAlbumResponse.status).toBe(http_status_codes_1.StatusCodes.CREATED);
            const { body: { id: albumId }, } = createAlbumResponse;
            const createTrackResponse = await unauthorizedRequest
                .post(endpoints_1.tracksRoutes.create)
                .set(commonHeaders)
                .send(Object.assign(Object.assign({}, createTrackDto), { artistId, albumId }));
            expect(createTrackResponse.status).toBe(http_status_codes_1.StatusCodes.CREATED);
            const { body: { id: trackId }, } = createTrackResponse;
            const addTrackToFavoritesResponse = await unauthorizedRequest
                .post(endpoints_1.favoritesRoutes.tracks(trackId))
                .set(commonHeaders);
            expect(addTrackToFavoritesResponse.status).toBe(http_status_codes_1.StatusCodes.CREATED);
            const addAlbumToFavoritesResponse = await unauthorizedRequest
                .post(endpoints_1.favoritesRoutes.albums(albumId))
                .set(commonHeaders);
            expect(addAlbumToFavoritesResponse.status).toBe(http_status_codes_1.StatusCodes.CREATED);
            const addArtistToFavoritesResponse = await unauthorizedRequest
                .post(endpoints_1.favoritesRoutes.artists(artistId))
                .set(commonHeaders);
            expect(addArtistToFavoritesResponse.status).toBe(http_status_codes_1.StatusCodes.CREATED);
            const response = await unauthorizedRequest
                .get(endpoints_1.favoritesRoutes.getAll)
                .set(commonHeaders);
            expect(response.status).toBe(http_status_codes_1.StatusCodes.OK);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body.artists).toContainEqual({
                id: artistId,
                name: createArtistDto.name,
                grammy: createArtistDto.grammy,
            });
            expect(response.body.albums).toContainEqual({
                id: albumId,
                name: createAlbumDto.name,
                year: createAlbumDto.year,
                artistId,
            });
            expect(response.body.tracks).toContainEqual({
                id: trackId,
                name: createTrackDto.name,
                duration: createTrackDto.duration,
                artistId,
                albumId,
            });
            const deleteArtistResponse = await unauthorizedRequest
                .delete(endpoints_1.artistsRoutes.delete(artistId))
                .set(commonHeaders);
            expect(deleteArtistResponse.status).toBe(http_status_codes_1.StatusCodes.NO_CONTENT);
            const deleteAlbumResponse = await unauthorizedRequest
                .delete(endpoints_1.albumsRoutes.delete(albumId))
                .set(commonHeaders);
            expect(deleteAlbumResponse.status).toBe(http_status_codes_1.StatusCodes.NO_CONTENT);
            const deleteTrackResponse = await unauthorizedRequest
                .delete(endpoints_1.tracksRoutes.delete(trackId))
                .set(commonHeaders);
            expect(deleteTrackResponse.status).toBe(http_status_codes_1.StatusCodes.NO_CONTENT);
            const responseAfterDeletion = await unauthorizedRequest
                .get(endpoints_1.favoritesRoutes.getAll)
                .set(commonHeaders);
            expect(responseAfterDeletion.status).toBe(http_status_codes_1.StatusCodes.OK);
            const artistSearchRes = responseAfterDeletion.body.artists.find((artist) => artist.id === artistId);
            const albumSearchRes = responseAfterDeletion.body.albums.find((album) => album.id === albumId);
            const trackSearchRes = responseAfterDeletion.body.tracks.find((track) => track.id === trackId);
            expect(artistSearchRes).toBeUndefined();
            expect(albumSearchRes).toBeUndefined();
            expect(trackSearchRes).toBeUndefined();
        });
    });
    describe('POST', () => {
        it('should correctly add artist to favorites', async () => {
            const createArtistResponse = await unauthorizedRequest
                .post(endpoints_1.artistsRoutes.create)
                .set(commonHeaders)
                .send(createArtistDto);
            expect(createArtistResponse.status).toBe(http_status_codes_1.StatusCodes.CREATED);
            const { body: { id: artistId }, } = createArtistResponse;
            const addArtistToFavoritesResponse = await unauthorizedRequest
                .post(endpoints_1.favoritesRoutes.artists(artistId))
                .set(commonHeaders);
            expect(addArtistToFavoritesResponse.status).toBe(http_status_codes_1.StatusCodes.CREATED);
            const response = await unauthorizedRequest
                .get(endpoints_1.favoritesRoutes.getAll)
                .set(commonHeaders);
            expect(response.status).toBe(http_status_codes_1.StatusCodes.OK);
            expect(response.body.artists).toContainEqual({
                id: artistId,
                name: createArtistDto.name,
                grammy: createArtistDto.grammy,
            });
        });
        it('should correctly add album to favorites', async () => {
            const createAlbumResponse = await unauthorizedRequest
                .post(endpoints_1.albumsRoutes.create)
                .set(commonHeaders)
                .send(createAlbumDto);
            expect(createAlbumResponse.status).toBe(http_status_codes_1.StatusCodes.CREATED);
            const { body: { id: albumId }, } = createAlbumResponse;
            const addAlbumToFavoritesResponse = await unauthorizedRequest
                .post(endpoints_1.favoritesRoutes.albums(albumId))
                .set(commonHeaders);
            expect(addAlbumToFavoritesResponse.status).toBe(http_status_codes_1.StatusCodes.CREATED);
            const response = await unauthorizedRequest
                .get(endpoints_1.favoritesRoutes.getAll)
                .set(commonHeaders);
            expect(response.status).toBe(http_status_codes_1.StatusCodes.OK);
            expect(response.body.albums).toContainEqual({
                id: albumId,
                name: createAlbumDto.name,
                year: createAlbumDto.year,
                artistId: createAlbumDto.artistId,
            });
        });
        it('should correctly add track to favorites', async () => {
            const createTrackResponse = await unauthorizedRequest
                .post(endpoints_1.tracksRoutes.create)
                .set(commonHeaders)
                .send(createTrackDto);
            expect(createTrackResponse.status).toBe(http_status_codes_1.StatusCodes.CREATED);
            const { body: { id: trackId }, } = createTrackResponse;
            const addTrackToFavoritesResponse = await unauthorizedRequest
                .post(endpoints_1.favoritesRoutes.tracks(trackId))
                .set(commonHeaders);
            expect(addTrackToFavoritesResponse.status).toBe(http_status_codes_1.StatusCodes.CREATED);
            const response = await unauthorizedRequest
                .get(endpoints_1.favoritesRoutes.getAll)
                .set(commonHeaders);
            expect(response.status).toBe(http_status_codes_1.StatusCodes.OK);
            expect(response.body.tracks).toContainEqual({
                id: trackId,
                name: createTrackDto.name,
                duration: createTrackDto.duration,
                artistId: createTrackDto.artistId,
                albumId: createTrackDto.albumId,
            });
        });
        it('should respond with BAD_REQUEST in case of invalid id', async () => {
            const artistsResponse = await unauthorizedRequest
                .post(endpoints_1.favoritesRoutes.artists('invalid'))
                .set(commonHeaders);
            expect(artistsResponse.status).toBe(http_status_codes_1.StatusCodes.BAD_REQUEST);
            const albumsResponse = await unauthorizedRequest
                .post(endpoints_1.favoritesRoutes.albums('invalid'))
                .set(commonHeaders);
            expect(albumsResponse.status).toBe(http_status_codes_1.StatusCodes.BAD_REQUEST);
            const tracksResponse = await unauthorizedRequest
                .post(endpoints_1.favoritesRoutes.tracks('invalid'))
                .set(commonHeaders);
            expect(tracksResponse.status).toBe(http_status_codes_1.StatusCodes.BAD_REQUEST);
        });
        it('should respond with UNPROCESSABLE_ENTITY in case of entity absence', async () => {
            const artistsResponse = await unauthorizedRequest
                .post(endpoints_1.favoritesRoutes.artists(randomUUID))
                .set(commonHeaders);
            expect(artistsResponse.status).toBe(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY);
            const albumsResponse = await unauthorizedRequest
                .post(endpoints_1.favoritesRoutes.albums(randomUUID))
                .set(commonHeaders);
            expect(albumsResponse.status).toBe(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY);
            const tracksResponse = await unauthorizedRequest
                .post(endpoints_1.favoritesRoutes.tracks(randomUUID))
                .set(commonHeaders);
            expect(tracksResponse.status).toBe(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY);
        });
    });
    describe('DELETE', () => {
        it('should correctly delete album from favorites', async () => {
            const createAlbumResponse = await unauthorizedRequest
                .post(endpoints_1.albumsRoutes.create)
                .set(commonHeaders)
                .send(createAlbumDto);
            expect(createAlbumResponse.status).toBe(http_status_codes_1.StatusCodes.CREATED);
            const { body: { id: albumId }, } = createAlbumResponse;
            const addAlbumToFavoritesResponse = await unauthorizedRequest
                .post(endpoints_1.favoritesRoutes.albums(albumId))
                .set(commonHeaders);
            expect(addAlbumToFavoritesResponse.status).toBe(http_status_codes_1.StatusCodes.CREATED);
            const deleteAlbumFromFavoritesResponse = await unauthorizedRequest
                .delete(endpoints_1.favoritesRoutes.albums(albumId))
                .set(commonHeaders);
            expect(deleteAlbumFromFavoritesResponse.status).toBe(http_status_codes_1.StatusCodes.NO_CONTENT);
            const response = await unauthorizedRequest
                .get(endpoints_1.favoritesRoutes.getAll)
                .set(commonHeaders);
            expect(response.status).toBe(http_status_codes_1.StatusCodes.OK);
            const albumSearchResult = response.body.albums.find((album) => album.id === albumId);
            expect(albumSearchResult).toBeUndefined();
            const cleanupResponse = await unauthorizedRequest
                .delete(endpoints_1.albumsRoutes.delete(albumId))
                .set(commonHeaders);
            expect(cleanupResponse.status).toBe(http_status_codes_1.StatusCodes.NO_CONTENT);
        });
        it('should correctly delete artist from favorites', async () => {
            const createArtistResponse = await unauthorizedRequest
                .post(endpoints_1.artistsRoutes.create)
                .set(commonHeaders)
                .send(createArtistDto);
            expect(createArtistResponse.status).toBe(http_status_codes_1.StatusCodes.CREATED);
            const { body: { id: artistId }, } = createArtistResponse;
            const addArtistToFavoritesResponse = await unauthorizedRequest
                .post(endpoints_1.favoritesRoutes.artists(artistId))
                .set(commonHeaders);
            expect(addArtistToFavoritesResponse.status).toBe(http_status_codes_1.StatusCodes.CREATED);
            const deleteArtistFromFavoritesResponse = await unauthorizedRequest
                .delete(endpoints_1.favoritesRoutes.artists(artistId))
                .set(commonHeaders);
            expect(deleteArtistFromFavoritesResponse.status).toBe(http_status_codes_1.StatusCodes.NO_CONTENT);
            const response = await unauthorizedRequest
                .get(endpoints_1.favoritesRoutes.getAll)
                .set(commonHeaders);
            expect(response.status).toBe(http_status_codes_1.StatusCodes.OK);
            const artistSearchResult = response.body.artists.find((artist) => artist.id === artistId);
            expect(artistSearchResult).toBeUndefined();
            const cleanupResponse = await unauthorizedRequest
                .delete(endpoints_1.artistsRoutes.delete(artistId))
                .set(commonHeaders);
            expect(cleanupResponse.status).toBe(http_status_codes_1.StatusCodes.NO_CONTENT);
        });
        it('should correctly delete track from favorites', async () => {
            const createTrackResponse = await unauthorizedRequest
                .post(endpoints_1.tracksRoutes.create)
                .set(commonHeaders)
                .send(createTrackDto);
            expect(createTrackResponse.status).toBe(http_status_codes_1.StatusCodes.CREATED);
            const { body: { id: trackId }, } = createTrackResponse;
            const addTrackToFavoritesResponse = await unauthorizedRequest
                .post(endpoints_1.favoritesRoutes.tracks(trackId))
                .set(commonHeaders);
            expect(addTrackToFavoritesResponse.status).toBe(http_status_codes_1.StatusCodes.CREATED);
            const deleteTrackFromFavoritesResponse = await unauthorizedRequest
                .delete(endpoints_1.favoritesRoutes.tracks(trackId))
                .set(commonHeaders);
            expect(deleteTrackFromFavoritesResponse.status).toBe(http_status_codes_1.StatusCodes.NO_CONTENT);
            const response = await unauthorizedRequest
                .get(endpoints_1.favoritesRoutes.getAll)
                .set(commonHeaders);
            expect(response.status).toBe(http_status_codes_1.StatusCodes.OK);
            const trackSearchResult = response.body.tracks.find((track) => track.id === trackId);
            expect(trackSearchResult).toBeUndefined();
            const cleanupResponse = await unauthorizedRequest
                .delete(endpoints_1.tracksRoutes.delete(trackId))
                .set(commonHeaders);
            expect(cleanupResponse.status).toBe(http_status_codes_1.StatusCodes.NO_CONTENT);
        });
        it('should respond with BAD_REQUEST status code in case of invalid id', async () => {
            const response = await unauthorizedRequest
                .delete(endpoints_1.albumsRoutes.delete('some-invalid-id'))
                .set(commonHeaders);
            expect(response.status).toBe(http_status_codes_1.StatusCodes.BAD_REQUEST);
        });
        it("should respond with NOT_FOUND status code in case if entity doesn't exist", async () => {
            const albumsDeletionFromFavoritesResponse = await unauthorizedRequest
                .delete(endpoints_1.albumsRoutes.delete(randomUUID))
                .set(commonHeaders);
            expect(albumsDeletionFromFavoritesResponse.status).toBe(http_status_codes_1.StatusCodes.NOT_FOUND);
            const artistsDeletionFromFavoritesResponse = await unauthorizedRequest
                .delete(endpoints_1.artistsRoutes.delete(randomUUID))
                .set(commonHeaders);
            expect(artistsDeletionFromFavoritesResponse.status).toBe(http_status_codes_1.StatusCodes.NOT_FOUND);
            const tracksDeletionFromFavoritesResponse = await unauthorizedRequest
                .delete(endpoints_1.tracksRoutes.delete(randomUUID))
                .set(commonHeaders);
            expect(tracksDeletionFromFavoritesResponse.status).toBe(http_status_codes_1.StatusCodes.NOT_FOUND);
        });
    });
});
//# sourceMappingURL=favorites.e2e.spec.js.map