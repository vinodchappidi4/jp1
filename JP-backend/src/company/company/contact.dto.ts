// contact.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ContactDto {
  @ApiProperty({ description: 'Contact role' })
  @IsNotEmpty()
  @IsString()
  role: string;

  @ApiProperty({ description: 'Contact name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Contact email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Contact phone', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}