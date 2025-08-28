import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
// import { Types } from 'mongoose';

export class CreateEmployeeDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  companyId: string;
}
