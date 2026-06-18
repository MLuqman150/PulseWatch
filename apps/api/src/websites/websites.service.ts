import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateWebsiteDto } from "./dto/create-website.dto";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { WebsiteStatus } from "@prisma/client";

@Injectable()
export class WebsitesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateWebsiteDto) {
    const { url } = dto;
    const urlExists = await this.prisma.website.findFirst({
      where: { url, userId },
    });
    if (urlExists) {
      throw new ConflictException("Website with this URL already exists");
    }
    const res = await this.prisma.website.create({
      data: {
        userId,
        url,
      },
      select: {
        id: true,
        userId: true,
        url: true,
        createdAt: true,
      },
    });

    return {
      message: "Website added successfully",
      website: res,
    };
  }

  async findAll(userId: string) {
    const res = await this.prisma.website.findMany({
      where: { userId },
      select: {
        id: true,
        userId: true,
        url: true,
        createdAt: true,
      },
    });

    return {
      message: "Websites fetched Successfully",
      websites: res,
    };
  }

  async delete(userId: string, websiteId: string) {
    const websiteExists = await this.prisma.website.findFirst({
      where: { id: websiteId, userId },
    });

    if (!websiteExists) {
      throw new NotFoundException("No website found.");
    }

    const res = await this.prisma.website.delete({
      where: {
        id: websiteId,
        userId: userId,
      },
    });

    return {
      message: "Website removed successfully",
      deletedWebsite: res,
    };
  }

  async getStats(userId: string, websiteId: string) {
    const webExists = await this.prisma.website.findFirst({
      where: {
        AND: [{ id: websiteId }, { userId: userId }],
      },
    });

    if (!webExists) {
      throw new NotFoundException("The requested website don't exists.");
    }

    const totalChecks = await this.prisma.websiteChecks.count({
      where: {
        websiteId: websiteId,
      },
    });

    const totalUp = await this.prisma.websiteChecks.count({
      where: { websiteId, status: WebsiteStatus.UP },
    });

    const avgRespTime = await this.prisma.websiteChecks.aggregate({
      where: { websiteId },
      _avg: {
        responseTime: true,
      },
    });

    const lastChecked = await this.prisma.websiteChecks.findFirst({
      where: { websiteId },
      orderBy: {
        checkedAt: "desc",
      },
    });

    const uptime = totalChecks == 0 ? 0 : (totalUp / totalChecks) * 100;

    return {
      message: "Website status fetched",
      totalChecks,
      totalUp,
      uptime,
      avgRespTime,
      lastChecked,
    };
  }

  async getHistory(userId: string, websiteId: string) {
    const webExists = await this.prisma.website.findFirst({
      where: {
        AND: [{ id: websiteId }, { userId: userId }],
      },
    });

    if (!webExists) {
      throw new NotFoundException("The requested website don't exists.");
    }

    const timeLimit = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const history = await this.prisma.websiteChecks.findMany({
      where: {
        websiteId,
        checkedAt: {
          gte: timeLimit,
        },
      },
      include: {
        website: true,
      },
    });

    return {
      message: "History for the last 24 hours",
      history,
    };
  }
}
