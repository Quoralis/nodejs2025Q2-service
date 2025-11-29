import { Db } from '../types/db.interface';
import { timeNow } from '../helpers/time.helper';
import { randomUUID } from 'crypto';

export const db: Db = {
  users: [
    {
      id: randomUUID(),
      login: 'RS',
      password: '123',
      version: 0,
      createdAt: timeNow(),
      updatedAt: timeNow(),
    },
  ],
  albums: [
    {
      id: randomUUID(),
      name: 'Ten Summoner’s Tale',
      year: 1993,
      artistId: 'Sting',
    },
  ],
  artists: [
    {
      id: randomUUID(),
      name: 'Sting',
      grammy: true,
    },
  ],
  tracks: [
    {
      id: randomUUID(),
      name: 'Seven Days',
      artistId: 'Sting',
      albumId: 'Sting 3.0',
      duration: 300,
    },
  ],
};
