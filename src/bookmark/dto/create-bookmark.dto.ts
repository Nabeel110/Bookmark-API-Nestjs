import { IsDefined, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBookmarkDto {

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    link: string;

}