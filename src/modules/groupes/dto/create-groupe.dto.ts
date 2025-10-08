import { ApiProperty } from "@nestjs/swagger"
import { IsString,IsOptional } from "class-validator"

export class CreateGroupeDto {

    @ApiProperty({example : "My group"})
    @IsString()
    title: string

    @ApiProperty({example : "My family"})
    @IsOptional()
    @IsString()
    description?: string
}
