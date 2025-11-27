import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { db } from '../db/db';
import { CreateTrackDto } from './dto/createTrack.dto';
import { Track } from '../types/track.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class TrackService {
  findAllTracks() {
    return db.tracks;
  }

  findById(id: string) {
    const track = db.tracks.find((track) => track.id === id);
    if (!track)
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    return track;
  }

  createTrack(dto: CreateTrackDto) {
    const newTrack: Track = {
      id: randomUUID(),
      ...dto,
    };
    db.tracks.push(newTrack);
    return newTrack;
  }

  updateTrack(id: string, dto: CreateTrackDto) {
    const indexTrack = db.tracks.findIndex((track) => track.id === id);
    if (indexTrack === -1)
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    const updatedTrack = {
      id: id,
      ...dto,
    };
    db.tracks[indexTrack] = updatedTrack;
    return updatedTrack;
  }
  deleteTrack(id: string) {
    const indexTrack = db.tracks.findIndex((track) => track.id === id);
    if (indexTrack == -1) throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    db.tracks.splice(indexTrack, 1);
  }
}
