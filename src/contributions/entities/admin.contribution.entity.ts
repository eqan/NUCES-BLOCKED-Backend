import { Field, ObjectType } from '@nestjs/graphql';
import { Timestamps } from 'src/core/embed/timestamps.embed';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { AdminContributionEnum } from './enums/admin.contribution.enums';
import { Student } from '../../students/entities/students.entity';

@ObjectType()
@Entity('AdminContributions')
export abstract class AdminContributions extends Timestamps {
  @Field()
  @PrimaryColumn({
    type: 'varchar',
    unique: true,
  })
  id: string;

  @Field(() => AdminContributionEnum)
  @Column({
    enum: AdminContributionEnum,
    default: AdminContributionEnum.CGPA,
  })
  adminContributionType: AdminContributionEnum;

  @Field()
  @Column('float')
  contribution: number;

  @Field()
  @Column('text')
  contributor: string;

  @Field(() => Student, { nullable: true })
  @OneToOne(() => Student, (student) => student.id)
  @JoinColumn({ name: 'id' })
  student: Student;
}
