import { Injectable } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcryptjs";
import { ConflictException } from "@nestjs/common";
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async register(body: RegisterDto) {
    const { email, password } = body;
    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new ConflictException(`User with this email: ${email} already exists.`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });
  }
}
