// company.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Company } from './company.entity';
import { CompanyContact } from './company-contact.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ContactDto } from './contact.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(CompanyContact)
    private companyContactRepository: Repository<CompanyContact>,
  ) {}
  async create(
    createCompanyDto: CreateCompanyDto,
    file?: Express.Multer.File,
  ): Promise<Company> {
    const { contacts: contactsString, ...companyData } = createCompanyDto;

    const company = this.companyRepository.create(companyData);
    if (file) {
      company.logo = file.buffer;
    }

    const savedCompany = await this.companyRepository.save(company);

    if (contactsString) {
      const contacts = JSON.parse(contactsString);
      if (Array.isArray(contacts) && contacts.length > 0) {
        const companyContacts: DeepPartial<CompanyContact>[] = contacts.map(
          (contactData) => ({
            ...contactData,
            company: savedCompany,
          }),
        );
        await this.companyContactRepository.save(companyContacts);
      }
    }

    return this.companyRepository.findOne({
      where: { id: savedCompany.id },
      relations: ['contacts'],
    });
  }

  async findAll(): Promise<Company[]> {
    return this.companyRepository.find({ relations: ['contacts'] });
  }

  async findOne(id: number): Promise<Company> {
    return this.companyRepository.findOne({
      where: { id },
      relations: ['contacts'],
    });
  }

  async update(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
    file?: Express.Multer.File,
  ): Promise<Company> {
    const existingCompany = await this.companyRepository.findOne({
      where: { id },
      relations: ['contacts'],
    });
    if (!existingCompany) {
      throw new Error(`Company with ID ${id} not found.`);
    }

    // Update company fields
    Object.assign(existingCompany, updateCompanyDto);
    if (file) {
      existingCompany.logo = file.buffer;
    }

    // Update contacts
    if (updateCompanyDto.contacts) {
      const contacts = JSON.parse(updateCompanyDto.contacts);
      if (Array.isArray(contacts)) {
        // Remove existing contacts
        await this.companyContactRepository.remove(existingCompany.contacts);

        // Create new contacts
        const newContacts: DeepPartial<CompanyContact>[] = contacts.map(
          (contactDto) => ({
            ...contactDto,
            company: existingCompany,
          }),
        );

        const savedContacts =
          await this.companyContactRepository.save(newContacts);
        existingCompany.contacts = savedContacts;
      }
    }

    return this.companyRepository.save(existingCompany);
  }

  async delete(id: number): Promise<void> {
    const result = await this.companyRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Company with ID ${id} not found.`);
    }
  }
  async addContact(
    companyId: number,
    contactDto: ContactDto,
  ): Promise<CompanyContact> {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });
    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found.`);
    }

    const contact = this.companyContactRepository.create({
      ...contactDto,
      company,
    });

    return this.companyContactRepository.save(contact);
  }

  async getContact(id: number): Promise<CompanyContact> {
    const contact = await this.companyContactRepository.findOne({
      where: { id },
      relations: ['company'],
      select: {
        id: true,
        role: true,
        name: true,
        email: true,
        phone: true,
        company: {
          id: true,
        },
      },
    });

    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found.`);
    }

    return contact;
  }

  async getContactsByCompanyId(companyId: number): Promise<CompanyContact[]> {
    const contacts = await this.companyContactRepository.find({
      where: { company: { id: companyId } },
      relations: ['company'],
      select: {
        id: true,
        role: true,
        name: true,
        email: true,
        phone: true,
        company: {
          id: true,
        },
      },
    });

    if (contacts.length === 0) {
      throw new NotFoundException(
        `No contacts found for company with ID ${companyId}`,
      );
    }

    return contacts;
  }

  async updateContact(
    id: number,
    contactDto: ContactDto,
  ): Promise<CompanyContact> {
    const contact = await this.getContact(id);
    Object.assign(contact, contactDto);
    return this.companyContactRepository.save(contact);
  }

  async deleteContact(id: number): Promise<void> {
    const result = await this.companyContactRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Contact with ID ${id} not found.`);
    }
  }
}
