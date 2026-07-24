import { PrismaService } from "prisma/prisma.service";
import { SendEmailDto } from "./dto/email.dto";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class EmailService {
    constructor(private readonly prisma: PrismaService) { }

    async sendClientEmail(dto: SendEmailDto, userId: string) {
        const client = await this.prisma.client.findUnique({
            where: { id: dto.clientId }
        })
        if (!client) throw new BadRequestException("Client not found")
        const log = await this.prisma.emailLog.create({
            data: {
                clientId: dto.clientId,
                sentById: userId,
                subject: dto.subject,
                body: dto.body
            }
        })
        const result = await sendEmail({ to: client.email, subject: dto.subject, body: dto.body })
        const updated = await this.prisma.emailLog.update({
            where: { id: log.id },
            data: result.error ? { status: "Failed", errorMessage: result.error }
                : { status: "SENT", resendId: result.resendId }
        })
        if (result.error) {
            await this.prisma.notification.create({
                data: {
                    type: "EMAIL_FAILED",
                    message: `Failed to send "${dto.subject}" to ${client.name}: ${result.error}`,
                    clientId: dto.clientId,
                    assignedToId: userId
                }
            })
        }
        return updated
    }

    async listEmailLogs(take: number, cursor?: string) {
        const logs = await this.prisma.emailLog.findMany({
            orderBy: { createdAt: "desc" },
            include: { client: true, sentBy: { select: { id: true, name: true } } },
            take: take + 1,
            ...(cursor && { cursor: { id: cursor }, skip: 1 })
        })
        const hasMore = logs.length > take
        const data = hasMore ? logs.slice(0, take) : logs
        const nextCursor = hasMore ? data[data.length - 1].id : null
        return { data, nextCursor, hasMore }
    }

    async getEmailLogUpdates(since: Date) {
        const logs = await this.prisma.emailLog.findMany({
            where: { updatedAt: { gt: since } },
            orderBy: { createdAt: "desc" },
            include: { client: true }
        })
        return { data: logs, serverTime: new Date().toDateString() }
    }
}