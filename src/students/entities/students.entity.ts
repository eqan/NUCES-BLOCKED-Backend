import { Field, ObjectType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { BaseEntity, Column, Entity, PrimaryColumn, Unique } from 'typeorm';

/**Create students table in database
 *
 */
@ObjectType()
@Entity('Students')
@Unique(['id', 'email'])
export class Students extends BaseEntity {
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
}
