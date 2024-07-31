import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsString, Matches } from 'class-validator';

@Entity('company')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  name: string;

  @Column()
  @IsString()
  address1: string;

  @Column({ nullable: true })
  @IsString()
  address2: string;

  @Column()
  @IsString()
  city: string;

  @Column()
  @IsString()
  state: string;

  @Column()
  @IsString()
  @Matches(/^\d{6}$/, { message: 'ZIP Code must be exactly 6 digits' })
  zipCode: string;

  @Column({ type: 'bytea', nullable: true })
  logo: Buffer;
}
