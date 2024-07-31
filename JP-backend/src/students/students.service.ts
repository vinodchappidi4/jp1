import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentDto } from './dto/student.dto';
import { Student } from './student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}

  async create(
    studentDto: StudentDto,
    photoFile?: Express.Multer.File,
  ): Promise<Student> {
    try {
      if (studentDto.dateOfBirth) {
        // Validate date format
        if (!this.isValidDateFormat(studentDto.dateOfBirth)) {
          throw new BadRequestException('Invalid date format. Use YYYY-MM-DD');
        }
      }
      const student = this.studentsRepository.create(studentDto);
      if (photoFile) {
        student.photo = photoFile.buffer;
      }
      return await this.studentsRepository.save(student);
    } catch (error) {
      if (error.code === '23505') {
        // Unique violation error code in PostgreSQL
        if (error.detail.includes('rollno')) {
          throw new ConflictException('Roll number must be unique');
        } else if (error.detail.includes('email')) {
          throw new ConflictException('Email must be unique');
        }
      }
      throw error;
    }
  }

  findAll(): Promise<Student[]> {
    return this.studentsRepository.find();
  }

  async findOne(id: number): Promise<Student> {
    const student = await this.studentsRepository.findOne({ where: { id } });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return student;
  }

  async update(
    id: number,
    studentDto: StudentDto,
    photoFile?: Express.Multer.File,
  ): Promise<Student> {
    const student = await this.findOne(id);
    try {
      if (studentDto.dateOfBirth) {
        // Validate date format
        if (!this.isValidDateFormat(studentDto.dateOfBirth)) {
          throw new BadRequestException('Invalid date format. Use YYYY-MM-DD');
        }
      }
      if (photoFile) {
        studentDto.photo = photoFile.buffer; // Update the filename
      }
      await this.studentsRepository.update(id, studentDto);
      return this.findOne(id);
    } catch (error) {
      if (error.code === '23505') {
        // Unique violation error code in PostgreSQL
        if (error.detail.includes('rollno')) {
          throw new ConflictException('Roll number must be unique');
        } else if (error.detail.includes('email')) {
          throw new ConflictException('Email must be unique');
        }
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const student = await this.findOne(id);
    await this.studentsRepository.delete(id);
  }
  private isValidDateFormat(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
  }
}
