import { Field, ObjectType } from '@nestjs/graphql';
import { Student } from 'src/students/entities/students.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@ObjectType()
@Entity('Certificate')
@Unique(['id'])
export class Certificate {
  @Field()
  @PrimaryColumn({ type: 'text' })
  id: string;

  @Field()
  @CreateDateColumn()
  date: Date;

  @Field()
  @Column({ unique: true })
  url: string;

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

  @BeforeInsert()
  setDate() {
    if (!this.date) {
      this.date = new Date();
    }
  }
}
