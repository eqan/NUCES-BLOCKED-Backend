import { Field, ObjectType } from '@nestjs/graphql';
import { Students } from 'src/students/entities/students.entity';
import {
  BaseEntity,
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
@Unique(['id', 'rollNumber', 'url'])
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
  @Column({ type: 'text' })
  name: string;

  @Field()
  @Column({ type: 'text', unique: true })
  rollNumber: string;

  @Field()
  @Column({ type: 'text', unique: true })
  url: string;

  @OneToOne(() => Students, { cascade: true })
  @JoinColumn({ name: 'rollNumber' })
  student: Students;
}
