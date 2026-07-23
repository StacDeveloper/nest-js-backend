import { IsEmail, IsNotEmpty, IsOptional,IsString } from "class-validator"

export class CreateClientDTO {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsEmail()
    email: string

    @IsOptional()
    @IsString()
    company?: string
}