import { Module } from "@nestjs/common"
import { PrismaModule } from "prisma/prisma.module";
import { AuthModule } from "src/auth/auth.module";
import { EmailController } from "./email.controller";
import { EmailService } from "./email.service";

@Module({
    imports: [AuthModule, PrismaModule],
    providers: [EmailController],
    exports: [EmailService]
})
export class EmailModule { }