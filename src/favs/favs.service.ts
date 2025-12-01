import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { db } from '../db/db';

@Injectable()
export class FavsService {
  findAllFavs() {
    const artists = db.favorites.artists
      .map((id) => db.artists.find((a) => a.id === id))
      .filter(Boolean);

    const albums = db.favorites.albums
      .map((id) => db.albums.find((a) => a.id === id))
      .filter(Boolean);

    const tracks = db.favorites.tracks
      .map((id) => db.tracks.find((t) => t.id === id))
      .filter(Boolean);

    return { artists, albums, tracks };
  }

  addTrackToFavs(id: string) {
    const track = db.tracks.find((t) => t.id === id);
    if (!track) {
      throw new HttpException(
        'Track not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    if (!db.favorites.tracks.includes(id)) {
      db.favorites.tracks.push(id);
    }
    return { message: 'Track added to favorites' };
  }

  deleteTrackFromFavs(id: string) {
    const index = db.favorites.tracks.indexOf(id);
    if (index === -1) {
      throw new HttpException('Track is not favorite', HttpStatus.NOT_FOUND);
    }
    db.favorites.tracks.splice(index, 1);
  }

  addArtistToFavs(id: string) {
    const artist = db.artists.find((a) => a.id === id);
    if (!artist) {
      throw new HttpException(
        'Artist not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    db.favorites.artists.push(id);
    return { message: 'Artist added to favorites' };
  }

  deleteArtistFromFavs(id: string) {
    const index = db.favorites.artists.indexOf(id);
    if (index === -1) {
      throw new HttpException('Artist is not favorite', HttpStatus.NOT_FOUND);
    }
    db.favorites.artists.splice(index, 1);
  }

  addAlbumToFavs(id: string) {
    const album = db.albums.find((a) => a.id === id);
    if (!album) {
      throw new HttpException(
        'Album not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    if (!db.favorites.albums.includes(id)) {
      db.favorites.albums.push(id);
    }
    return { message: 'Album added to favorites' };
  }

  deleteAlbumFromFavs(id: string) {
    const index = db.favorites.albums.indexOf(id);
    if (index === -1) {
      throw new HttpException('Album is not favorite', HttpStatus.NOT_FOUND);
    }
    db.favorites.albums.splice(index, 1);
  }
}
