import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Name must be a string' })
  @Length(5, 50, { message: 'Name must be between 5 and 50 characters' })
  name: string;

  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, {
    message:
      'Password must contain at least one uppercase letter, one number, and one special character',
  })
  @Length(8, 50, { message: 'Password must be between 8 and 50 characters' })
  password: string;
}
