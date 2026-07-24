import { IsNotEmpty, IsString } from "class-validator";

export class SendEmailDto {
    @IsString()
    @IsNotEmpty()
    clientId: string

    @IsString()
    @IsNotEmpty()
    subject: string

    @IsString()
    @IsNotEmpty()
    body: string
}