import { Module } from "@nestjs/common";
import { MonitoringService } from "./monitoring.service";
import { PrismaModule } from "../prisma/prisma.module";
import { BullModule } from "@nestjs/bullmq";
import { MonitoringProcessor } from "./monitoring.processor";

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: "website-monitoring",
    }),
  ],
  providers: [MonitoringService, MonitoringProcessor],
  exports: [BullModule],
})
export class MonitoringModule {}
