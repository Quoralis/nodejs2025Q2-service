import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateArtistDto } from './dto/createArtist.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async findAllArtist() {
    return this.prisma.artists.findMany({
      select: {
        id: true,
        name: true,
        grammy: true,
      },
    });
  }

  async findById(id: string) {
    const artist = await this.prisma.artists.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        grammy: true,
      },
    });

    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    return artist;
  }

  async createArtist(dto: CreateArtistDto) {
    const newArtist = await this.prisma.artists.create({
      data: {
        id: randomUUID(), // можно и не задавать вручную, Prisma сам сгенерит
        name: dto.name,
        grammy: dto.grammy,
      },
      select: {
        id: true,
        name: true,
        grammy: true,
      },
    });

    return newArtist;
  }

  async updateArtist(id: string, dto: CreateArtistDto) {
    const existingArtist = await this.prisma.artists.findUnique({
      where: { id },
    });

    if (!existingArtist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    const updatedArtist = await this.prisma.artists.update({
      where: { id },
      data: {
        name: dto.name,
        grammy: dto.grammy,
      },
      select: {
        id: true,
        name: true,
        grammy: true,
      },
    });

    return updatedArtist;
  }

  async deleteArtist(id: string) {
    const existingArtist = await this.prisma.artists.findUnique({
      where: { id },
    });

    if (!existingArtist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.artists.delete({
      where: { id },
    });
  }
}
