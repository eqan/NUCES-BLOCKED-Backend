import { Field, ObjectType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { Certificate } from 'src/students-certificates/entities/certificates.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';

/**Create students table in database
 *
 */
@ObjectType()
@Entity('Students')
@Unique(['id', 'email'])
export class Student extends BaseEntity {
  @Field()
  @PrimaryColumn({
    unique: true,
    type: 'text',
  })
  id: string;

  @Field()
  @IsEmail()
  @Column({ unique: true, type: 'text' })
  email: string;

  @Field()
  @Column({ type: 'text' })
  name: string;

  @Field(() => Certificate)
  @OneToOne(() => Certificate, (certificate) => certificate.id)
  certificate: Certificate;
}
