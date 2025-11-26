import { User } from './user.interface';
import { Artist } from './artist.interface';
import { Album } from './album.interface';
import { Track } from './track.interface';

export interface Db {
  users: User[];
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
