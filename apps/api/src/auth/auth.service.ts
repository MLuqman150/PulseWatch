import { Injectable } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcryptjs";
import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(body: RegisterDto) {
    const { email, password } = body;
    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      console.log(userExists);
      throw new ConflictException(
        `User with this email: ${email} already exists.`,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const res = await this.prisma.user.create({
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
    return {
      message: "Registration Successful",
      user: res,
    };
  }

  async login(body: LoginDto) {
    const { email, password } = body;

    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!userExists) {
      throw new UnauthorizedException("Invalid Credentials");
    }

    // const hash = await bcrypt.hash(password, 10);
    const isMatch = await bcrypt.compare(password, userExists.password);

    if (!isMatch) {
      throw new UnauthorizedException("Invalid Credentials");
    }
    const payload = { email: userExists.email, sub: userExists.id };
    return {
      message: "Login Successful",
      access_token: this.jwtService.sign(payload),
    };
  }
}
