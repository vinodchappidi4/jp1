import { Department } from 'src/departments/department.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  ManyToOne,
} from 'typeorm';

@Entity('student')
@Unique(['rollno'])
@Unique(['email'])
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  rollno: string;

  @Column({ unique: true })
  email: string;

  @Column()
  mobilenumber: string;

  @Column()
  category: string;

  @Column({ type: 'bytea', nullable: true })
  photo: Buffer;

  @ManyToOne(() => Department, (department) => department.students, {
    nullable: true,
  })
  department: Department;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ type: 'text', nullable: true })
  permanentAddress: string;

  @Column({ type: 'text', nullable: true })
  currentAddress: string;

  @Column({ nullable: true })
  degree: string;

  @Column({ nullable: true })
  departname: string;

  @Column({ type: 'text', nullable: true })
  technicalSkills: string;

  @Column({ nullable: true })
  projectName: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
