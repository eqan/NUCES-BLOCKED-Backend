import { Field, ObjectType } from '@nestjs/graphql';
import { Student } from 'src/students/entities/students.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@ObjectType()
@Entity('Certificate')
@Unique(['id', 'studentId'])
export class Certificate {
  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @CreateDateColumn()
  date: Date;

  @Field()
  @Column({ unique: true })
  url: string;

  @Field()
  @Column({ unique: true })
  studentId: string;

  @Field(() => Student)
  @OneToOne(() => Student, (student) => student.id)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @BeforeInsert()
  setDate() {
    if (!this.date) {
      this.date = new Date();
    }
  }
}
