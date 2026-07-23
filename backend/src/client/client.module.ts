import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { ClientController } from "./client.controller";
import { ClientService } from "./client.service";

@Module({
    imports: [AuthModule],
    exports: [ClientController],
    providers: [ClientService]
})

export class ClientModule { }