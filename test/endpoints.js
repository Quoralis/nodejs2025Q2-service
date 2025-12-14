"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = exports.favoritesRoutes = exports.tracksRoutes = exports.albumsRoutes = exports.artistsRoutes = exports.usersRoutes = void 0;
exports.usersRoutes = {
    getAll: '/user',
    getById: (userId) => `/user/${userId}`,
    create: '/user',
    update: (userId) => `/user/${userId}`,
    delete: (userId) => `/user/${userId}`,
};
exports.artistsRoutes = {
    getAll: '/artist',
    getById: (artistId) => `/artist/${artistId}`,
    create: '/artist',
    update: (artistId) => `/artist/${artistId}`,
    delete: (artistId) => `/artist/${artistId}`,
};
exports.albumsRoutes = {
    getAll: '/album',
    getById: (albumId) => `/album/${albumId}`,
    create: '/album',
    update: (albumId) => `/album/${albumId}`,
    delete: (albumId) => `/album/${albumId}`,
};
exports.tracksRoutes = {
    getAll: '/track',
    getById: (trackId) => `/track/${trackId}`,
    create: '/track',
    update: (trackId) => `/track/${trackId}`,
    delete: (trackId) => `/track/${trackId}`,
};
exports.favoritesRoutes = {
    getAll: '/favs',
    artists: (artistId) => `/favs/artist/${artistId}`,
    albums: (albumId) => `/favs/album/${albumId}`,
    tracks: (trackId) => `/favs/track/${trackId}`,
};
exports.authRoutes = {
    signup: '/auth/signup',
    login: '/auth/login',
    refresh: '/auth/refresh',
};
//# sourceMappingURL=endpoints.js.map