// company.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from './company.controller';
import { ContactController } from './contact.controller';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { CompanyContact } from './company-contact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, CompanyContact])],
  controllers: [CompanyController, ContactController],
  providers: [CompanyService],
})
export class CompanyModule {}