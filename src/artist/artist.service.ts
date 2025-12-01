import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { db } from '../db/db';
import { Artist } from '../types/artist.interface';
import { randomUUID } from 'crypto';
import { CreateArtistDto } from './dto/createArtist.dto';

@Injectable()
export class ArtistService {
  findAllArtist() {
    return db.artists;
  }

  findById(id: string) {
    const artist = db.artists.find((a) => a.id === id);

    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    return artist;
  }

  createArtist(dto: CreateArtistDto) {
    const newArtist: Artist = {
      id: randomUUID(),
      ...dto,
    };

    db.artists.push(newArtist);
    return newArtist;
  }

  updateArtist(id: string, dto: CreateArtistDto) {
    const indexArtist = db.artists.findIndex((a) => a.id === id);

    if (indexArtist === -1) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    const updatedArtist: Artist = {
      id,
      ...dto,
    };

    db.artists.splice(indexArtist, 1, updatedArtist);
    return updatedArtist;
  }

  deleteArtist(id: string) {
    const indexArtist = db.artists.findIndex((a) => a.id === id);

    if (indexArtist === -1) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    db.albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });

    db.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });

    db.favorites.artists = db.favorites.artists.filter(
      (artistId) => artistId !== id,
    );

    db.artists.splice(indexArtist, 1);
  }
}
