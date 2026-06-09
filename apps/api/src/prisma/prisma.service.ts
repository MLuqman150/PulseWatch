import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit,OnModuleDestroy {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL as string,
    });
    super({ adapter });
  }
  async onModuleInit() {
    await this.$connect();
    console.log("Prisma connected");
  }
  async onModuleDestroy() {
    await this.$disconnect();
    console.log("Prisma disconnected");
  }
}
