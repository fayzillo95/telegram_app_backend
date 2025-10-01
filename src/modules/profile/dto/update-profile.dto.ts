import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateProfileDto } from './create-profile.dto';
import { IsString, Length, IsOptional } from 'class-validator';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  @ApiPropertyOptional({ example: 'fayzillo_updated', description: 'New username of the user' })
  @IsOptional()
  @IsString()
  @Length(3, 20, { message: 'Username must be between 3 and 20 characters' })
  username?: string;

  @ApiPropertyOptional({ example: 'Ali', description: 'Updated first name' })
  @IsOptional()
  @IsString()
  @Length(2, 30, { message: 'First name must be between 2 and 30 characters' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'Valiyev', description: 'Updated last name' })
  @IsOptional()
  @IsString()
  @Length(2, 30, { message: 'Last name must be between 2 and 30 characters' })
  lastName?: string;

  @ApiPropertyOptional({ example: 'Full-stack developer at Google', description: 'Updated bio of the user' })
  @IsOptional()
  @IsString()
  @Length(0, 160, { message: 'Bio must be maximum 160 characters' })
  bio?: string;
}
