import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ClientService } from "./client.service";
import { CreateClientDTO } from "./dto/create-client.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Controller("clients")
@UseGuards(JwtAuthGuard)
export class ClientController {
    constructor(private readonly clientService: ClientService) { }

    @Get("getAllClients")
    async listClients() {
        const data = await this.clientService.listClients()
        return { success: true, data }
    }
    @Post("create-client")
    async createClient(@Body() dto: CreateClientDTO) {
        const data = await this.clientService.createClient(dto)
        return { success: true, data }
    }
    @Get("getClientById/:id")
    async getParticularClient(@Param("id") id: string) {
        const data = await this.clientService.getParticularClient(id)
        return { success: true, data }
    }
}
