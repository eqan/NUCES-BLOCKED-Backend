import { Field, ObjectType } from '@nestjs/graphql';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { AdminContributionType } from '../enums/admin.contribution.enums';
import { Student } from '../students.entity';

@ObjectType()
@Entity('AdminContributions')
export abstract class AdminContributions {
  @Field()
  @PrimaryColumn({
    type: 'varchar',
    unique: true,
  })
  id: string;

  @Field(() => AdminContributionType)
  @Column({
    enum: AdminContributionType,
    default: AdminContributionType.CGPA,
  })
  type: AdminContributionType;

  @Field()
  @Column('text')
  contribution: string;

  @Field(() => Student)
  @OneToOne(() => Student, (student) => student.id)
  @JoinColumn({ name: 'id' })
  student: Student;

  @BeforeInsert()
  setId() {
    if (!this.id) {
      this.id = this.student.id;
    }
  }
}
