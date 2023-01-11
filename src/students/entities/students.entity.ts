import { Field, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsOptional, ValidateNested } from 'class-validator';
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
import { ContributionType } from './enums/contributions.enum';
import { AdminContributions } from './nestedObjects/admin.contribution.entity';
import { CareerCounsellorContributions } from './nestedObjects/careercounsellor.contribution.entity';
import { SocietyHeadsContributions } from './nestedObjects/societyhead.contribution.entity';
import { TeachersContributions } from './nestedObjects/teacher.contribution.entity';

/**Create students table in database
 *
 */
@ObjectType()
@Entity('Students')
@Unique(['id', 'email'])
export class Student extends BaseEntity {
  @Field()
  @PrimaryColumn({
    unique: true,
    type: 'text',
  })
  id: string;

  @Field()
  @IsEmail()
  @Column({ unique: true, type: 'text' })
  email: string;

  @Field()
  @Column({ type: 'text' })
  name: string;

  @Field(() => Certificate)
  @OneToOne(() => Certificate, (certificate) => certificate.id)
  certificate: Certificate;

  @Field(() => ContributionType, { nullable: true })
  @Column({
    enum: ContributionType,
    default: null,
    nullable: true,
  })
  contributionType: ContributionType;

  @IsOptional()
  @ValidateNested()
  @Field(() => AdminContributions, { nullable: true })
  @OneToOne(() => AdminContributions, (contribution) => contribution.id)
  AdminContributions: AdminContributions;

  @IsOptional()
  @ValidateNested()
  @Field(() => CareerCounsellorContributions, { nullable: true })
  @OneToMany(
    () => CareerCounsellorContributions,
    (contributions) => contributions.studentId,
  )
  CareerCounsellorContributions: CareerCounsellorContributions[];

  @IsOptional()
  @ValidateNested()
  @Field(() => TeachersContributions, { nullable: true })
  @OneToMany(
    () => TeachersContributions,
    (contributions) => contributions.studentId,
  )
  TeachersContributions: TeachersContributions[];

  @IsOptional()
  @ValidateNested()
  @Field(() => SocietyHeadsContributions, { nullable: true })
  @OneToMany(
    () => SocietyHeadsContributions,
    (contributions) => contributions.studentId,
  )
  SocietyHeadsContributions: SocietyHeadsContributions[];
}
