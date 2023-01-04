import { Field, ObjectType } from '@nestjs/graphql';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CareerCounsellorContributionType } from '../enums/careercounsellor.contribution.enums';
import { Student } from '../students.entity';

@ObjectType()
@Entity('CareerCounsellorContributions')
export abstract class CareerCounsellorContributions {
  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column('text')
  studentId: string;

  @Field(() => CareerCounsellorContributionType)
  @Column({
    enum: CareerCounsellorContributionType,
    default: CareerCounsellorContributionType.EXCHANGE_PROGRAM,
  })
  type: CareerCounsellorContributionType;

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

  @BeforeInsert()
  setId() {
    if (!this.id) {
      this.id = this.student.id;
    }
  }
}
