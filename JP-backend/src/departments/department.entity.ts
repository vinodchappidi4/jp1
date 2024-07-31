import { Student } from 'src/students/student.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('department')
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  departmentname: string;

  @Column({ unique: true })
  coursename: string;

  @OneToMany(() => Student, (student) => student.department)
  students: Student[];
}
