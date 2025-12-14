export declare const usersRoutes: {
    getAll: string;
    getById: (userId: any) => string;
    create: string;
    update: (userId: any) => string;
    delete: (userId: any) => string;
};
export declare const artistsRoutes: {
    getAll: string;
    getById: (artistId: any) => string;
    create: string;
    update: (artistId: any) => string;
    delete: (artistId: any) => string;
};
export declare const albumsRoutes: {
    getAll: string;
    getById: (albumId: any) => string;
    create: string;
    update: (albumId: any) => string;
    delete: (albumId: any) => string;
};
export declare const tracksRoutes: {
    getAll: string;
    getById: (trackId: any) => string;
    create: string;
    update: (trackId: any) => string;
    delete: (trackId: any) => string;
};
export declare const favoritesRoutes: {
    getAll: string;
    artists: (artistId: any) => string;
    albums: (albumId: any) => string;
    tracks: (trackId: any) => string;
};
export declare const authRoutes: {
    signup: string;
    login: string;
    refresh: string;
};
