import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator"

export class LoginDto {
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}

type Role = "ADMIN" | "STAFF"
export class registerDto {
    @IsString()
    @MinLength(1)
    name: string

    @IsEmail()
    email: string

    @IsString()
    @MinLength(6)
    password: string

    @IsOptional()
    @IsEnum()
    role: Role = "STAFF"
}