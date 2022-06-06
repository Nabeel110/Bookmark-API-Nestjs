import { IsDefined, IsOptional, IsString } from "class-validator";

export class EditBookmarkDto {

    @IsString()
    @IsOptional()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsDefined()
    @IsString()
    @IsOptional()
    link?: string;

}