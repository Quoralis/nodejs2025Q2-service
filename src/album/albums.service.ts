import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { db } from '../db/db';
import { randomUUID } from 'crypto';
import { CreateAlbumDto } from './dto/createAlbumDto';

@Injectable()
export class AlbumsService {
  findAll() {
    return db.albums;
  }

  findById(id: string) {
    const album = db.albums.find((a) => a.id === id);

    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

    return album;
  }

  createAlbum(dto: CreateAlbumDto) {
    if (dto.artistId) {
      const artistExists = db.artists.some((a) => a.id === dto.artistId);
      if (!artistExists) {
        throw new HttpException(
          'Artist not found',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    const newAlbum = {
      id: randomUUID(),
      ...dto,
    };

    db.albums.push(newAlbum);
    return newAlbum;
  }

  updateAlbum(id: string, dto: CreateAlbumDto) {
    const indexAlbum = db.albums.findIndex((a) => a.id === id);

    if (indexAlbum === -1) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

    if (dto.artistId) {
      const artistExists = db.artists.some((a) => a.id === dto.artistId);
      if (!artistExists) {
        throw new HttpException(
          'Artist not found',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    const updatedAlbum = {
      id,
      ...dto,
    };

    db.albums.splice(indexAlbum, 1, updatedAlbum);
    return updatedAlbum;
  }

  deleteAlbum(id: string) {
    const indexAlbum = db.albums.findIndex((a) => a.id === id);

    if (indexAlbum === -1) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

    db.tracks.forEach((t) => {
      if (t.albumId === id) {
        t.albumId = null;
      }
    });

    db.albums.splice(indexAlbum, 1);
  }
}
