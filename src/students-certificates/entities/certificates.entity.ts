import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Timestamps } from 'src/core/embed/timestamps.embed';
import { Student } from 'src/students/entities/students.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';

@ObjectType()
@Entity('Certificate')
@Unique(['id'])
export class Certificate extends Timestamps {
  @IsNotEmpty()
  @Field()
  @PrimaryColumn({ type: 'text' })
  id: string;

  @IsNotEmpty()
  @Field()
  @Column({ unique: true })
  url: string;

  @Field(() => Student, { nullable: true })
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
