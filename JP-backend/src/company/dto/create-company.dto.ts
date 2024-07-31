import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ description: 'Company name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Address line 1' })
  @IsNotEmpty()
  @IsString()
  address1: string;

  @ApiProperty({ description: 'Address line 2' })
  @IsString()
  address2: string;

  @ApiProperty({ description: 'City' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ description: 'State' })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({ description: 'ZIP code' })
  @IsNotEmpty()
  @IsString()
  zipCode: string;
}
