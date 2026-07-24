import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtAuthService } from "../jwt-service";
import { Request } from "express";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtAuthService: JwtAuthService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>()
        const authHeaders = request.headers["authorization"]
        if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
            throw new UnauthorizedException("No token provided")
        }
        const token = authHeaders.split(" ")[1]
        try {
            const payload = await this.jwtAuthService.verifyToken(token);
            request.user = payload
            return true
        } catch (error) {
            throw new UnauthorizedException("Invalid or expired token")
        }
    }
}