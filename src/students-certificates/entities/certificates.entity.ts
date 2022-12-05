import { Field, ObjectType } from '@nestjs/graphql';
import { Students } from 'src/students/entities/students.entity';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';

/**Create certificates table in database
 *
 */
@ObjectType()
@Entity('Certificates')
@Unique(['id', 'url'])
export class Certificates extends BaseEntity {
  @Field()
  @PrimaryColumn({
    unique: true,
    type: 'text',
  })
  id: string;

  @Field()
  @CreateDateColumn()
  date: Date;

  @Field()
  @Column({ type: 'text', unique: true })
  url: string;

  @OneToOne(() => Students, { cascade: true })
  @JoinColumn({ name: 'id' })
  student: Students;

  @BeforeInsert()
  newid() {
    this.id = this.student.id;
  }
}
