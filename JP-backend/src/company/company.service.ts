import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    file: Express.Multer.File,
  ): Promise<Company> {
    const company = new Company();
    company.name = createCompanyDto.name;
    company.address1 = createCompanyDto.address1;
    company.address2 = createCompanyDto.address2;
    company.city = createCompanyDto.city;
    company.state = createCompanyDto.state;
    company.zipCode = createCompanyDto.zipCode;
    if (file) {
      company.logo = file.buffer; // Store image as binary data (Bytea)
    }

    return this.companyRepository.save(company);
  }

  async findAll(): Promise<Company[]> {
    return this.companyRepository.find();
  }

  async findOne(id: number): Promise<Company> {
    return this.companyRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateCompanyDto: CreateCompanyDto,
    file?: Express.Multer.File,
  ): Promise<Company> {
    const existingCompany = await this.companyRepository.findOne({
      where: { id },
    });
    if (!existingCompany) {
      throw new Error(`Company with ID ${id} not found.`);
    }

    existingCompany.name = updateCompanyDto.name;
    existingCompany.address1 = updateCompanyDto.address1;
    existingCompany.address2 = updateCompanyDto.address2;
    existingCompany.city = updateCompanyDto.city;
    existingCompany.state = updateCompanyDto.state;
    existingCompany.zipCode = updateCompanyDto.zipCode;
    if (file) {
      existingCompany.logo = file.buffer; // Update image if new one is provided
    }

    return this.companyRepository.save(existingCompany);
  }

  async delete(id: number): Promise<void> {
    const result = await this.companyRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Company with ID ${id} not found.`);
    }
  }
}
