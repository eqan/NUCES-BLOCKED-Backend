import { Field, ObjectType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Certificate } from 'src/students-certificates/entities/certificates.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { AdminContributions } from '../../contributions/entities/admin.contribution.entity';
import { CareerCounsellorContributions } from '../../contributions/entities/careercounsellor.contribution.entity';
import { SocietyHeadsContributions } from '../../contributions/entities/societyhead.contribution.entity';
import { TeachersContributions } from '../../contributions/entities/teacher.contribution.entity';

/**Create students table in database
 *
 */
@ObjectType()
@Entity('Students')
@Unique(['id', 'email'])
export class Student extends BaseEntity {
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

  @IsOptional()
  @ValidateNested()
  @Field(() => Certificate, { nullable: true })
  @OneToOne(() => Certificate, (certificate) => certificate.id)
  certificate: Certificate;

  @IsOptional()
  @ValidateNested()
  @Field(() => AdminContributions, { nullable: true })
  @OneToOne(() => AdminContributions, (contribution) => contribution.id)
  AdminContributions: AdminContributions;

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
}
