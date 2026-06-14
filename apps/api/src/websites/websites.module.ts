import { Module } from "@nestjs/common";
import { WebsitesController } from "./websites.controller";
import { WebsitesService } from "./websites.service";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [WebsitesController],
  providers: [WebsitesService],
})
export class WebsitesModule {}
