// import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Job } from "bullmq";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import axios from "axios";
import { WebsiteStatus } from "@prisma/client";

type webData = {
  websiteId: string;
  url: string;
};

// processor (handles jobs)
@Processor("website-monitoring")
export class MonitoringProcessor extends WorkerHost {
  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job) {
    const { websiteId, url } = job.data as webData;
    try {
      const startTime = Date.now();
      await axios.get(url, { timeout: 10000 });
      const responseTime = Date.now() - startTime;
      const status: WebsiteStatus =
        responseTime < 2000 ? WebsiteStatus.UP : WebsiteStatus.DEGRADED;

      const check = await this.prisma.websiteChecks.create({
        data: {
          websiteId,
          status,
          responseTime,
        },
      });
      console.log(`Website checked: ${url} with status: ${status}`);
      return {
        message: "Website Checked",
        statusCheck: check,
      };
    } catch (e: any) {
      const status: WebsiteStatus = WebsiteStatus.DOWN;
      const check = await this.prisma.websiteChecks.create({
        data: {
          websiteId,
          status,
        },
      });
      console.log(`Website down: ${url} with error: ${e}`);
      return {
        message: `Website down with error: ${e}`,
        statusCheck: check,
      };
    }
  }
}
