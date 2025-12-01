import { Artist } from './artist.interface';
import { Album } from './album.interface';
import { Track } from './track.interface';

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
