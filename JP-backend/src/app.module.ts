import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsModule } from './students/students.module';
import { DepartmentsModule } from './departments/departments.module';
import { Department } from './departments/department.entity';
import { Student } from './students/student.entity';
import { CompanyModule } from './company/company/company.module';
import { Company } from './company/company/company.entity';
import { CompanyContact } from './company/company/company-contact.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postsql',
      database: 'JP',
      autoLoadEntities: true,
      entities: [Student, Department, Company, CompanyContact],
      synchronize: true,
    }),
    StudentsModule,
    DepartmentsModule,
    CompanyModule,
  ],
})
export class AppModule {}
