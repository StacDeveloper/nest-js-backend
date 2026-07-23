import { Body, Post, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, registerDto } from "./dto/auth.dto";
import { Response } from "express";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

export class AuthController {
    constructor(private readonly authSertice: AuthService) { }

    @Post("login")
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
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
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie("token")
        return { success: true }
    }
    @UseGuards(JwtAuthGuard)
    @Get("me")
    async findMe(@Request() req:Request){
        const userId = await req.user.userId as string
        return {success:true, data:await this.authSertice.findMe(userId)}
    }   
}