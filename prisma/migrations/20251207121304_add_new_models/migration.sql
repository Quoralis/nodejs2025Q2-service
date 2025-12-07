/*
  Warnings:

  - The primary key for the `albums` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `artists` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `tracks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "albums" DROP CONSTRAINT "albums_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "albums_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "artists" DROP CONSTRAINT "artists_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "artists_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tracks" DROP CONSTRAINT "tracks_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "tracks_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "favorites" (
    "id" TEXT NOT NULL,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artist_favorites" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "favoritesId" TEXT NOT NULL,

    CONSTRAINT "artist_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "album_favorites" (
    "id" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "favoritesId" TEXT NOT NULL,

    CONSTRAINT "album_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "track_favorites" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "favoritesId" TEXT NOT NULL,

    CONSTRAINT "track_favorites_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "albums" ADD CONSTRAINT "albums_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist_favorites" ADD CONSTRAINT "artist_favorites_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist_favorites" ADD CONSTRAINT "artist_favorites_favoritesId_fkey" FOREIGN KEY ("favoritesId") REFERENCES "favorites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "album_favorites" ADD CONSTRAINT "album_favorites_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "album_favorites" ADD CONSTRAINT "album_favorites_favoritesId_fkey" FOREIGN KEY ("favoritesId") REFERENCES "favorites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "track_favorites" ADD CONSTRAINT "track_favorites_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "track_favorites" ADD CONSTRAINT "track_favorites_favoritesId_fkey" FOREIGN KEY ("favoritesId") REFERENCES "favorites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
