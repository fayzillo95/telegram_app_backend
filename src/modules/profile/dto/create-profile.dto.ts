import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsOptional } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ example: 'fayzillo123', description: 'Unique username of the user' })
  @IsString()
  @Length(3, 20, { message: 'Username must be between 3 and 20 characters' })
  username: string;

  @ApiProperty({ example: 'Fayzillo', description: 'First name of the user' })
  @IsString()
  @Length(2, 30, { message: 'First name must be between 2 and 30 characters' })
  firstName: string;

  @ApiProperty({ example: 'Ummatov', description: 'Last name of the user' })
  @IsString()
  @Length(2, 30, { message: 'Last name must be between 2 and 30 characters' })
  lastName: string;

  @ApiProperty({ example: 'Software Engineer from Uzbekistan', description: 'Short bio about the user', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 160, { message: 'Bio must be maximum 160 characters' })
  bio?: string;
}
