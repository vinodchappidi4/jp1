import {
  IsString,
  IsEmail,
  Length,
  Matches,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StudentDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the student' })
  @IsString()
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Name must contain only alphabets and spaces',
  })
  name: string;

  @ApiProperty({
    example: 'S12345',
    description: 'The unique roll number of the student',
  })
  @IsString()
  rollno: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the student',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '1234567890',
    description: 'The mobile number of the student',
  })
  @IsString()
  @Length(10, 10, { message: 'Mobile number must be exactly 10 digits' })
  @Matches(/^\d+$/, { message: 'Mobile number must contain only digits' })
  mobilenumber: string;

  @ApiProperty({
    example: 'General',
    description: 'The category of the student',
  })
  @IsString()
  category: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'The photo of the student',
  })
  photo?: Buffer;

  @ApiProperty({
    example: '1990-01-01',
    required: false,
    description: 'The date of birth of the student (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiProperty({
    example: 'Male',
    required: false,
    description: 'The gender of the student',
  })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiProperty({
    example: '123 Main St, City, Country',
    required: false,
    description: 'The permanent address of the student',
  })
  @IsString()
  @IsOptional()
  permanentAddress?: string;

  @ApiProperty({
    example: '456 Elm St, City, Country',
    required: false,
    description: 'The current address of the student',
  })
  @IsString()
  @IsOptional()
  currentAddress?: string;

  @ApiProperty({ required: false, example: 'Bachelor of Science' })
  @IsString()
  @IsOptional()
  degree?: string;

  @ApiProperty({ required: false, example: 'Computer Science' })
  @IsString()
  @IsOptional()
  departname?: string;

  @ApiProperty({
    example: 'JavaScript, Python, React',
    required: false,
    description: 'The technical skills of the student',
  })
  @IsString()
  @IsOptional()
  technicalSkills?: string;

  @ApiProperty({
    example: 'E-commerce Website',
    required: false,
    description: 'The name of the project',
  })
  @IsString()
  @IsOptional()
  projectName?: string;

  @ApiProperty({
    example: 'Developed a full-stack e-commerce website using MERN stack',
    required: false,
    description: 'The description of the project',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
