import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Express } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';

@ApiTags('company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new company with optional contacts' })
  @ApiResponse({ status: 201, description: 'Company created successfully.' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.companyService.create(createCompanyDto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all companies with contacts' })
  @ApiResponse({ status: 200, description: 'List of companies with contacts.' })
  async findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get company by ID with contacts' })
  @ApiResponse({ status: 200, description: 'Company details with contacts.' })
  async findOne(@Param('id') id: number) {
    return this.companyService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update company by ID with contacts' })
  @ApiResponse({ status: 200, description: 'Company updated successfully.' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo'))
  async update(
    @Param('id') id: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.companyService.update(id, updateCompanyDto, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete company by ID' })
  @ApiResponse({ status: 200, description: 'Company deleted successfully.' })
  async delete(@Param('id') id: number) {
    return this.companyService.delete(id);
  }
}