import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCompanyDto {
  @ApiProperty({ description: 'Company name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Address line 1', required: false })
  @IsOptional()
  @IsString()
  address1?: string;

  @ApiProperty({ description: 'Address line 2', required: false })
  @IsOptional()
  @IsString()
  address2?: string;

  @ApiProperty({ description: 'City', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ description: 'State', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ description: 'ZIP code', required: false })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiProperty({ 
    description: 'Contacts (JSON string array)',
    example: '[{"role":"CEO","name":"John Doe","email":"john@example.com","phone":"1234567890"}]',
    required: false
  })
  @IsOptional()
  @IsString()
  contacts?: string;
}