import { Field, ObjectType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserTypes } from './enum/user.types.enums';

/**Create users table in database
 *
 */
@ObjectType()
@Entity('Users')
@Unique(['id', 'email'])
export class Users extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Field()
  @IsEmail()
  @Column({ unique: true, type: 'text' })
  email: string;

  @Field()
  @Column({ type: 'text' })
  name: string;

  @Field()
  @Column({ type: 'text' })
  password: string;

  @Field()
  @Column({ type: 'text' })
  imgUrl: string;

  @Field()
  @Column({
    type: 'enum',
    enumName: 'UserTypeEnum',
    enum: UserTypes,
    default: null,
  })
  type: UserTypes;
}
