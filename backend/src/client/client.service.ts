import { ConflictException, Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "prisma/prisma.service"
import { CreateClientDTO } from "./dto/create-client.dto"

@Injectable()
export class ClientService {
    constructor(private readonly prisma: PrismaService) { }

    async listClients() {
        return this.prisma.client.findMany({ orderBy: { createdAt: "desc" } })
    }
    async createClient(dto: CreateClientDTO) {
        const existing = await this.prisma.client.findUnique({ where: { email: dto.email } })
        if (existing) {
            throw new ConflictException("Client already exist with this email-id")
        }
        return this.prisma.client.create({ data: dto })
    }
    async getParticularClient(id: string) {
        const client = await this.prisma.client.findUnique({ where: { id }, include: { emailLogs: { orderBy: { createdAt: "desc" } } } })
        if (!client) {
            throw new NotFoundException("Client not found")
        }
        return client
    }

}