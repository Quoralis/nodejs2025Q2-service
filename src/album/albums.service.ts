import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateAlbumDto } from './dto/createAlbumDto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AlbumsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.albums.findMany();
  }

  async findById(id: string) {
    const album = await this.prisma.albums.findUnique({
      where: { id },
    });

    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

    return album;
  }

  async createAlbum(dto: CreateAlbumDto) {
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

    const newAlbum = await this.prisma.albums.create({
      data: {
        id: randomUUID(),
        name: dto.name,
        year: dto.year,
        artistId: dto.artistId ?? null,
      },
    });

    return newAlbum;
  }

  async updateAlbum(id: string, dto: CreateAlbumDto) {
    const existingAlbum = await this.prisma.albums.findUnique({
      where: { id },
    });

    if (!existingAlbum) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
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

    const updatedAlbum = await this.prisma.albums.update({
      where: { id },
      data: {
        name: dto.name,
        year: dto.year,
        artistId: dto.artistId ?? null,
      },
    });

    return updatedAlbum;
  }

  async deleteAlbum(id: string) {
    const existingAlbum = await this.prisma.albums.findUnique({
      where: { id },
    });

    if (!existingAlbum) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    await this.prisma.albums.delete({
      where: { id },
    });
  }
}
