import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Delete,
  Param,
} from "@nestjs/common";
import { WebsitesService } from "./websites.service";
import { CreateWebsiteDto } from "./dto/create-website.dto";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import type { Request as ExpressRequest } from "express";

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    userId: string;
    email: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller("websites")
export class WebsitesController {
  constructor(private websitesService: WebsitesService) {}

  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() body: CreateWebsiteDto,
  ) {
    return await this.websitesService.create(req.user.userId, body);
  }

  @Get()
  async findAll(@Request() req: AuthenticatedRequest) {
    return await this.websitesService.findAll(req.user.userId);
  }

  @Delete(":id")
  async delete(
    @Request() req: AuthenticatedRequest,
    @Param("id") webId: string,
  ) {
    return await this.websitesService.delete(req.user.userId, webId);
  }
}
