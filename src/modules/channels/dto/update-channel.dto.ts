import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateChannelDto } from './create-channel.dto';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateChannelDto extends PartialType(CreateChannelDto) {
  @ApiProperty({
    example: 'New Channel Title',
    description: 'Updated title of the channel',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'This is the updated channel description',
    description: 'Updated channel description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'https://example.com/new-channel',
    description: 'New public URL of the channel',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  publicUrl?: string;

  @ApiProperty({
    example: 'https://example.com/private/new-channel',
    description: 'New private URL of the channel',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  privateUrl?: string;
}
