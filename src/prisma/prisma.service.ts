import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    let retries = 5;

    while (retries > 0) {
      try {
        await this.$connect();
        console.log('Prisma connected successfully!');
        break;
      } catch (err) {
        retries--;
        console.log(`Prisma connection failed. Retries left: ${retries}`);
        await new Promise((res) => setTimeout(res, 2000));
      }
    }

    if (retries === 0) {
      throw new Error('Prisma failed to connect after several retries');
    }
  }
}
