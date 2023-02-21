import { Field, ObjectType } from '@nestjs/graphql';
import { Timestamps } from 'src/core/embed/timestamps.embed';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CareerCounsellorContributionEnum } from './enums/careercounsellor.contribution.enums';
import { Student } from '../../students/entities/students.entity';

@ObjectType()
@Entity('CareerCounsellorContributions')
export abstract class CareerCounsellorContributions extends Timestamps {
  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column('text')
  studentId: string;

  @Field(() => CareerCounsellorContributionEnum)
  @Column({
    enum: CareerCounsellorContributionEnum,
  })
  careerCounsellorContributionType: CareerCounsellorContributionEnum;

  @Field()
  @Column('text')
  contribution: string;

  @Field(() => Student, { nullable: true })
  @ManyToOne(() => Student, (student) => student.id)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @BeforeInsert()
  @BeforeUpdate()
  checkCGPA() {
    if (!this.careerCounsellorContributionType)
      throw new Error('No contribution type was defined!');
  }
}
