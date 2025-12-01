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
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/createTrack.dto';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  getAllTracks() {
    return this.trackService.findAllTracks();
  }

  @Get(':id')
  getOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.trackService.findById(id);
  }

  @Post()
  @HttpCode(201)
  createTrack(@Body() dto: CreateTrackDto) {
    return this.trackService.createTrack(dto);
  }

  @Put(':id')
  @HttpCode(200)
  updateTrack(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: CreateTrackDto,
  ) {
    return this.trackService.updateTrack(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.trackService.deleteTrack(id);
  }
}
