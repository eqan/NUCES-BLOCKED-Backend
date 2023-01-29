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
import { SocietyHeadContributionEnum } from './enums/societyhead.contribution.enums';
import { Student } from '../../students/entities/students.entity';

@ObjectType()
@Entity('SocietyHeadsContributions')
export abstract class SocietyHeadsContributions extends Timestamps {
  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column('text')
  studentId: string;

  @Field(() => SocietyHeadContributionEnum)
  @Column({
    enum: SocietyHeadContributionEnum,
  })
  societyHeadContributionType: SocietyHeadContributionEnum;

  @Field()
  @Column('text')
  contribution: string;

  @Field(() => Student)
  @ManyToOne(() => Student, (student) => student.id)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @BeforeInsert()
  @BeforeUpdate()
  checkCGPA() {
    if (!this.societyHeadContributionType)
      throw new Error('No contribution type was defined!');
  }
}
