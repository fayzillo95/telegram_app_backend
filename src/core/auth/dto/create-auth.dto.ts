import { ApiBody, ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class CreateAuthDto {
    @ApiProperty({example : "example@gmail.com"})
    @IsEmail()
    email : string
}
