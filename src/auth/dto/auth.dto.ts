import { IsDefined, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
    @IsEmail()
    @IsDefined()
    @IsNotEmpty()
    email: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    password: string;
}