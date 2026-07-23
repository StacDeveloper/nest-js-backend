import { PrismaService } from "prisma/prisma.service";
import { JwtAuthService } from "./jwt-service";
import { LoginDto, registerDto } from "./dto/auth.dto";
import { ConflictException, NotFoundException, UnauthorizedException } from "@nestjs/common";

export class AuthService {
    constructor(private readonly primsa: PrismaService, private readonly jwtAuthService: JwtAuthService) { }

    async login(dto: LoginDto) {
        const user = await this.primsa.user.findUnique({ where: { email: dto.email } })
        if (!user) {
            throw new UnauthorizedException("User not found")
        }
        const valid = await this.jwtAuthService.verifyPassword(dto.password, user.passwordHash)
        if (!valid) {
            throw new UnauthorizedException("Password is not valid")
        }
        const token = await this.jwtAuthService.signToken({ userId: user.id, role: user.role })
        return { token }

    }
    async register(dto: registerDto) {
        const existing = await this.primsa.user.findUnique({ where: { email: dto.email } })
        if (existing) {
            throw new ConflictException("Email Id already exist, please use login")
        }
        const passwordHash = await this.jwtAuthService.hashPassword(dto.password)
        const user = await this.primsa.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                passwordHash,
                role: dto.role
            }
        })
        return user
    }

    async findMe(userId: string) {
        const user = await this.primsa.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, role: true }
        })
        if (!user) {
            throw new NotFoundException("User not found")
        }
        return user
    }
}