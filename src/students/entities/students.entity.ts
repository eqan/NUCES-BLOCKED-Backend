import { Field, ObjectType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Timestamps } from 'src/core/embed/timestamps.embed';
import { Certificate } from 'src/students-certificates/entities/certificates.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { CareerCounsellorContributions } from '../../contributions/entities/careercounsellor.contribution.entity';
import { SocietyHeadsContributions } from '../../contributions/entities/societyhead.contribution.entity';
import { TeachersContributions } from '../../contributions/entities/teacher.contribution.entity';

/**Create students table in database
 *
 */
@ObjectType()
@Entity('Students')
@Unique(['id', 'email'])
export class Student extends Timestamps {
  @IsNotEmpty()
  @Field()
  @PrimaryColumn({
    unique: true,
    type: 'text',
  })
  id: string;

  @IsNotEmpty()
  @Field()
  @IsEmail()
  @Column({ unique: true, type: 'text' })
  email: string;

  @IsNotEmpty()
  @Field()
  @Column({ type: 'text' })
  name: string;

  @Field()
  @Column({ type: 'text' })
  cgpa: string;

  @IsOptional()
  @ValidateNested()
  @Field(() => Certificate, { nullable: true })
  @OneToOne(() => Certificate, (certificate) => certificate.id)
  certificate: Certificate;

  // @IsOptional()
  // @ValidateNested()
  // @Field(() => AdminContributions, { nullable: true })
  // @OneToOne(() => AdminContributions, (contribution) => contribution.id)
  // AdminContributions: AdminContributions;

  @IsOptional()
  @ValidateNested()
  @Field(() => [CareerCounsellorContributions], { nullable: true })
  @OneToMany(
    () => CareerCounsellorContributions,
    (contributions) => contributions.studentId,
  )
  CareerCounsellorContributions: CareerCounsellorContributions[];

  @IsOptional()
  @ValidateNested()
  @Field(() => [TeachersContributions], { nullable: true })
  @OneToMany(
    () => TeachersContributions,
    (contributions) => contributions.studentId,
  )
  TeachersContributions: TeachersContributions[];

  @IsOptional()
  @ValidateNested()
  @Field(() => [SocietyHeadsContributions], { nullable: true })
  @OneToMany(
    () => SocietyHeadsContributions,
    (contributions) => contributions.studentId,
  )
  SocietyHeadsContributions: SocietyHeadsContributions[];

  @BeforeInsert()
  @BeforeUpdate()
  checkCGPA() {
    if (parseFloat(this.cgpa) >= 0 && parseFloat(this.cgpa) <= 4)
      this.cgpa = this.cgpa;
    else throw new Error('Invalid CGPA value. It must be between 0 and 4.0');
  }
}
