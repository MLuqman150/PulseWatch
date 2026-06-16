// import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Job } from "bullmq";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import axios from "axios";

// processor (handles jobs)
@Processor("website-monitoring")
export class MonitoringProcessor extends WorkerHost {
  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job) {
    console.log(job);
  }
}
