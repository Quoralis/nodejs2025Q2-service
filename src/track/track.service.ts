import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/createTrack.dto';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async findAllTracks() {
    return this.prisma.tracks.findMany();
  }

  async findById(id: string) {
    const track = await this.prisma.tracks.findUnique({
      where: { id },
    });

    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    return track;
  }

  async createTrack(dto: CreateTrackDto) {
    if (dto.artistId) {
      const artistExists = await this.prisma.artists.findUnique({
        where: { id: dto.artistId },
      });

      if (!artistExists) {
        throw new HttpException(
          'Artist not found',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    if (dto.albumId) {
      const albumExists = await this.prisma.albums.findUnique({
        where: { id: dto.albumId },
      });

      if (!albumExists) {
        throw new HttpException(
          'Album not found',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    const newTrack = await this.prisma.tracks.create({
      data: {
        id: randomUUID(),
        name: dto.name,
        duration: dto.duration,
        artistId: dto.artistId ?? null,
        albumId: dto.albumId ?? null,
      },
    });

    return newTrack;
  }

  async updateTrack(id: string, dto: CreateTrackDto) {
    const existingTrack = await this.prisma.tracks.findUnique({
      where: { id },
    });

    if (!existingTrack) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    if (dto.artistId) {
      const artistExists = await this.prisma.artists.findUnique({
        where: { id: dto.artistId },
      });

      if (!artistExists) {
        throw new HttpException(
          'Artist not found',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    if (dto.albumId) {
      const albumExists = await this.prisma.albums.findUnique({
        where: { id: dto.albumId },
      });

      if (!albumExists) {
        throw new HttpException(
          'Album not found',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    const updatedTrack = await this.prisma.tracks.update({
      where: { id },
      data: {
        name: dto.name,
        duration: dto.duration,
        artistId: dto.artistId ?? null,
        albumId: dto.albumId ?? null,
      },
    });

    return updatedTrack;
  }

  async deleteTrack(id: string) {
    const existingTrack = await this.prisma.tracks.findUnique({
      where: { id },
    });

    if (!existingTrack) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.trackFavorite.deleteMany({
      where: { trackId: id },
    });

    await this.prisma.tracks.delete({
      where: { id },
    });
  }
}
