import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  
  @ApiProperty({
    description: 'Yangi username (ixtiyoriy)',
    example: 'new_username',
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'Yangi email manzil (ixtiyoriy)',
    example: 'example@mail.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}
