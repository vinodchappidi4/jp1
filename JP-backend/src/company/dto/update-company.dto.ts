import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCompanyDto {
  @ApiProperty({ description: 'Company name' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Address line 1' })
  @IsOptional()
  @IsString()
  address1: string;

  @ApiProperty({ description: 'Address line 2' })
  @IsOptional()
  @IsString()
  address2: string;

  @ApiProperty({ description: 'City' })
  @IsOptional()
  @IsString()
  city: string;

  @ApiProperty({ description: 'State' })
  @IsOptional()
  @IsString()
  state: string;

  @ApiProperty({ description: 'ZIP code' })
  @IsOptional()
  @IsString()
  zipCode: string;
}
