import { Db } from '../types/db.interface';
import { timeNow } from '../helpers/time.helper';

export const db: Db = {
  users: [
    {
      id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
      login: 'RS',
      password: '123',
      version: 0,
      createdAt: timeNow(),
      updatedAt: timeNow(),
    },
  ],
  albums: [],
  artists: [],
  tracks: [],
};
