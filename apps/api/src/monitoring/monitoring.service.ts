import { Injectable, Logger } from "@nestjs/common";
import { Queue } from "bullmq";
import { InjectQueue } from "@nestjs/bullmq";
import { PrismaService } from "../prisma/prisma.service";
import { Cron } from "@nestjs/schedule";

// scheduler (adds jobs to the queue)
@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);
  constructor(
    @InjectQueue("website-monitoring") private monitoringQueue: Queue,
    private prisma: PrismaService,
  ) {}

  // @Cron("*/10 * * * * *")
  @Cron("*/5 * * * *")
  async checkAllWebsites() {
    const websites = await this.prisma.website.findMany();

    for (const website of websites) {
      const payload = { websiteId: website.id, url: website.url };

      await this.monitoringQueue.add("check-website", payload);
      this.logger.log(`Added job to queue for website: ${website.url}`);
    }
    this.logger.log(`Added ${websites.length} jobs to queue`);
  }
}
