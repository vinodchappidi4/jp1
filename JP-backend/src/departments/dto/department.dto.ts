import { IsString } from 'class-validator';

export class DepartmentDto {
  @IsString()
  departmentname: string;

  @IsString()
  coursename: string;
}
