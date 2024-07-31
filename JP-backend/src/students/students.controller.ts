import {
  Controller,
  Post,
  UseInterceptors,
  Body,
  UploadedFile,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { StudentDto } from './dto/student.dto';
import { Student } from './student.entity';
import { StudentsService } from './students.service';

@ApiTags('students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({
    status: 201,
    description: 'The student has been successfully created.',
    type: Student,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: StudentDto })
  @UseInterceptors(FileInterceptor('photo'))
  create(
    @Body() createStudentDto: StudentDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return this.studentsService.create(createStudentDto, photo);
  }

  @Get()
  @ApiOperation({ summary: 'Get all students' })
  @ApiResponse({
    status: 200,
    description: 'Return all students',
    type: [Student],
  })
  @ApiResponse({ status: 404, description: 'Students not found' })
  async findAll(): Promise<Student[]> {
    return this.studentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a student by ID' })
  @ApiResponse({ status: 200, description: 'The found student', type: Student })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Student> {
    return this.studentsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a student' })
  @ApiResponse({
    status: 200,
    description: 'The student has been successfully updated.',
    type: Student,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: StudentDto })
  @UseInterceptors(FileInterceptor('photo'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() studentDto: StudentDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return await this.studentsService.update(id, studentDto, photo);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a student by ID' })
  @ApiResponse({
    status: 200,
    description: 'The student has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.remove(id);
  }
}
