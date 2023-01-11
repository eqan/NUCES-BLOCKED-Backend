import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SocietyHeadsContributionType } from '../enums/societyhead.contribution.enums';
import { Student } from '../students.entity';

@ObjectType()
@Entity('SocietyHeadsContributions')
export abstract class SocietyHeadsContributions {
  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column('text')
  studentId: string;

  @Field(() => SocietyHeadsContributionType)
  @Column({
    enum: SocietyHeadsContributionType,
    default: SocietyHeadsContributionType.COMPETITION_ACHIEVEMENT,
  })
  type: SocietyHeadsContributionType;

  @Field()
  @Column('text')
  contribution: string;

  @Field()
  @Column({
    type: 'timestamptz',
  })
  date: Date;

  @Field(() => Student)
  @ManyToOne(() => Student, (student) => student.id)
  @JoinColumn({ name: 'studentId' })
  student: Student;
}
