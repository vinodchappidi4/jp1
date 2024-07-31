// contact.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { ContactDto } from './contact.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('contacts')
@Controller('contacts')
export class ContactController {
  constructor(private readonly companyService: CompanyService) {}

  @Post(':companyId')
  @ApiOperation({ summary: 'Create a new contact for a company' })
  @ApiResponse({ status: 201, description: 'Contact created successfully.' })
  async create(
    @Param('companyId') companyId: number,
    @Body() contactDto: ContactDto,
  ) {
    return this.companyService.addContact(companyId, contactDto);
  }

  @Get('company/:companyId')
  @ApiOperation({ summary: 'Get contacts by company ID' })
  @ApiResponse({
    status: 200,
    description: 'Contacts for the specified company.',
  })
  async findByCompanyId(@Param('companyId') companyId: number) {
    return this.companyService.getContactsByCompanyId(companyId);
  }

  @Get(':id/company')
  @ApiOperation({ summary: 'Get contact with company details' })
  @ApiResponse({ status: 200, description: 'Contact with company details.' })
  async findOneWithCompany(@Param('id') id: number) {
    return this.companyService.getContact(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update contact by ID' })
  @ApiResponse({ status: 200, description: 'Contact updated successfully.' })
  async update(@Param('id') id: number, @Body() contactDto: ContactDto) {
    return this.companyService.updateContact(id, contactDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete contact by ID' })
  @ApiResponse({ status: 200, description: 'Contact deleted successfully.' })
  async delete(@Param('id') id: number) {
    return this.companyService.deleteContact(id);
  }
}
