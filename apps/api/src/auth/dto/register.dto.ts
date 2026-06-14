import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from "class-validator";

export class RegisterDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, {message: 'The password should have atleast 8 characters'})
  @MaxLength(32, {message: 'The password cannot have more than 32 characters'})
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/, {message: 'The password should have an uppercase, lowercase letter, number and a special character'})
  password: string;
}