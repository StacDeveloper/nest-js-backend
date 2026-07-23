import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"
import * as bcrypt from "bcryptjs"
export interface JwtPayLoad {
    userId: string;
    role: "ADMIN" | "STAFF";
}


@Injectable()
export class JwtAuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async hashPassword(plain: string): Promise<string> {
        return bcrypt.hash(plain, 10);
    }
    async verifyPassword(plain: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plain, hash)
    }
    async signToken(payLoad: JwtPayLoad): Promise<string> {
        return this.jwtService.signAsync(payLoad, {
            secret: this.configService.get<string>("JWT_SECRET"),
            expiresIn: "1d"
        })
    }
    async verifyToken(token: string): Promise<JwtPayLoad> {
        return this.jwtService.verifyAsync<JwtPayLoad>(token, {
            secret: this.configService.get<string>("JWT_SECRET")
        })
    }
}

