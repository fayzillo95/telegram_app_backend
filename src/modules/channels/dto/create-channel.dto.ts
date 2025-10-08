import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";


export class CreateChannelDto {
    @ApiProperty({example : ""})
    @IsString()
    title : string

    @ApiProperty({example : ""})
    @IsOptional()
    @IsString()
    description? : string
}

