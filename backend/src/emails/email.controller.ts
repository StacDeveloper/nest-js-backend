import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { EmailService } from "./email.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { SendEmailDto } from "./dto/email.dto";

@Controller("emails")
@UseGuards(JwtAuthGuard)
export class EmailController {
    constructor(private readonly EmailService: EmailService) { }

    @Post("send")
    async sendClientEmail(@Body() dto: SendEmailDto, @Req() req) {
        const message = await this.EmailService.sendClientEmail(dto, req.user.userId)
        return { success: true, message }
    }

    @Get("logs")
    async listEmailLogs(@Query("take") take?: string, @Query("cursor") cursor?: string) {
        const result = await this.EmailService.listEmailLogs(take ? parseInt(take) : 15, cursor);
        return { success: true, ...result }
    }
    @Get("logs/updates")
    async getEmailLogUpdates(@Query("since") since?: string) {
        const result = await this.EmailService.getEmailLogUpdates(since ? new Date(since) : new Date(0))
        return { success: true, ...result }
    }

}