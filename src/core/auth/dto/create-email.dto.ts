import { ApiBody, ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class CreateOtpDto {
    @ApiProperty({example : "example@gmail.com"})
    @IsEmail()
    email : string
}
