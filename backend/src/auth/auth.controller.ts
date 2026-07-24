import { Body, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, registerDto } from "./dto/auth.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { JwtPayLoad } from "./jwt-service";

export class AuthController {
    constructor(private readonly authSertice: AuthService) { }

    @Post("login")
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res) {
        const { token } = await this.authSertice.login(dto)
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return { success: true, message: "Login Successful" }
    }
    @Post("register")
    async register(@Body() dto: registerDto) {
        const user = await this.authSertice.register(dto)
        return { success: true, data: user, message: "New user created" }
    }
    @Post("logout")
    async logout(@Res({ passthrough: true }) res) {
        res.clearCookie("token")
        return { success: true }
    }
    @UseGuards(JwtAuthGuard)
    @Get("me")
    async findMe(@Req() req: Request) {
        const userId = await req.user.userId
        return { success: true, data: await this.authSertice.findMe(userId) }
    }
}