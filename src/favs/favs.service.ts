import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FavsService {
  constructor(private prisma: PrismaService) {}

  private async getOrCreateFavorites() {
    let favorites = await this.prisma.favorites.findFirst();
    if (!favorites) {
      favorites = await this.prisma.favorites.create({ data: {} });
    }
    return favorites;
  }

  async findAllFavs() {
    const favorites = await this.getOrCreateFavorites();

    const artists = await this.prisma.artists.findMany({
      where: { artistFavorites: { some: { favoritesId: favorites.id } } },
    });

    const albums = await this.prisma.albums.findMany({
      where: { albumFavorites: { some: { favoritesId: favorites.id } } },
    });

    const tracks = await this.prisma.tracks.findMany({
      where: { trackFavorites: { some: { favoritesId: favorites.id } } },
    });

    return { artists, albums, tracks };
  }

  async addTrackToFavs(id: string) {
    const existingTrack = await this.prisma.tracks.findUnique({
      where: { id },
    });
    if (!existingTrack) {
      throw new HttpException(
        'Track not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const favorites = await this.getOrCreateFavorites();

    const trackAlreadyInFav = await this.prisma.trackFavorite.findFirst({
      where: { trackId: id, favoritesId: favorites.id },
    });

    if (!trackAlreadyInFav) {
      await this.prisma.trackFavorite.create({
        data: { trackId: id, favoritesId: favorites.id },
      });
    }

    return { message: 'Track added to favorites' };
  }

  async deleteTrackFromFavs(id: string) {
    const favorites = await this.getOrCreateFavorites();

    const existing = await this.prisma.trackFavorite.findFirst({
      where: { trackId: id, favoritesId: favorites.id },
    });

    if (!existing) {
      throw new HttpException('Track is not favorite', HttpStatus.NOT_FOUND);
    }

    await this.prisma.trackFavorite.delete({ where: { id: existing.id } });
  }

  async addArtistToFavs(id: string) {
    const artist = await this.prisma.artists.findUnique({ where: { id } });
    if (!artist) {
      throw new HttpException(
        'Artist not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const favorites = await this.getOrCreateFavorites();

    const existing = await this.prisma.artistFavorite.findFirst({
      where: { artistId: id, favoritesId: favorites.id },
    });

    if (!existing) {
      await this.prisma.artistFavorite.create({
        data: { artistId: id, favoritesId: favorites.id },
      });
    }

    return { message: 'Artist added to favorites' };
  }

  async deleteArtistFromFavs(id: string) {
    const favorites = await this.getOrCreateFavorites();

    const existing = await this.prisma.artistFavorite.findFirst({
      where: { artistId: id, favoritesId: favorites.id },
    });

    if (!existing) {
      throw new HttpException('Artist is not favorite', HttpStatus.NOT_FOUND);
    }

    await this.prisma.artistFavorite.delete({ where: { id: existing.id } });
  }

  async addAlbumToFavs(id: string) {
    const album = await this.prisma.albums.findUnique({ where: { id } });
    if (!album) {
      throw new HttpException(
        'Album not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const favorites = await this.getOrCreateFavorites();

    const existing = await this.prisma.albumFavorite.findFirst({
      where: { albumId: id, favoritesId: favorites.id },
    });

    if (!existing) {
      await this.prisma.albumFavorite.create({
        data: { albumId: id, favoritesId: favorites.id },
      });
    }

    return { message: 'Album added to favorites' };
  }

  async deleteAlbumFromFavs(id: string) {
    const favorites = await this.getOrCreateFavorites();

    const existing = await this.prisma.albumFavorite.findFirst({
      where: { albumId: id, favoritesId: favorites.id },
    });

    if (!existing) {
      throw new HttpException('Album is not favorite', HttpStatus.NOT_FOUND);
    }

    await this.prisma.albumFavorite.delete({ where: { id: existing.id } });
  }
}
