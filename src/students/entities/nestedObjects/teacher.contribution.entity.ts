import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { TeacherContributionType } from '../enums/teacher.contribution.enums';
import { Student } from '../students.entity';

@ObjectType()
@Entity('TeachersContributions')
export abstract class TeachersContributions {
  @Field()
  @PrimaryColumn({
    type: 'varchar',
    unique: true,
  })
  id: string;

  @Field()
  @Column('text')
  studentId: string;

  @Field(() => TeacherContributionType)
  @Column({
    enum: TeacherContributionType,
    default: TeacherContributionType.TA_SHIP,
  })
  type: TeacherContributionType;

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
