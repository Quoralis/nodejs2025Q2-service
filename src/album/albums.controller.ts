import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/createAlbumDto';

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  getAllAlbums() {
    return this.albumsService.findAll();
  }

  @Get(':id')
  getAlbum(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.albumsService.findById(id);
  }

  @Post()
  @HttpCode(201)
  createAlbum(@Body() dto: CreateAlbumDto) {
    return this.albumsService.createAlbum(dto);
  }

  @Put(':id')
  @HttpCode(200)
  updateAlbum(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: CreateAlbumDto,
  ) {
    return this.albumsService.updateAlbum(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteAlbum(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.albumsService.deleteAlbum(id);
  }
}
