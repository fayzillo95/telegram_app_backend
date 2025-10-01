import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'Unique username of the user',
  })
  username: string;

  @ApiProperty({
    example: 'John',
    description: 'First name of the user',
  })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the user',
  })
  lastName: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email address of the user',
  })
  email: string;

  @ApiProperty({
    example: 'strongPassword123!',
    description: 'Password for account login',
  })
  password: string;
  @ApiProperty({
    example: 'DsCSXSxDcasxS123',
    description: 'Unique soketId of the user',
  })
  clientId: string;


}
