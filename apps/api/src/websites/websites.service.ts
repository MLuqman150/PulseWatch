import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateWebsiteDto } from "./dto/create-website.dto";
import { ConflictException, NotFoundException } from "@nestjs/common";

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
}
