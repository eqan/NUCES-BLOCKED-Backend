import { Field, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';
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
  @IsNotEmpty()
  @Field()
  @PrimaryGeneratedColumn('increment')
  id: string;

  @IsNotEmpty()
  @Field()
  @IsEmail()
  @Column({ unique: true, type: 'text' })
  email: string;

  @IsNotEmpty()
  @Field()
  @Column({ type: 'text' })
  name: string;

  @IsNotEmpty()
  @Field()
  @Column({ type: 'text' })
  password: string;

  @IsNotEmpty()
  @Field()
  @Column({ type: 'text' })
  imgUrl: string;

  @IsNotEmpty()
  @Field()
  @Column({
    type: 'enum',
    enumName: 'UserTypeEnum',
    enum: UserTypes,
    default: null,
  })
  type: UserTypes;

  @IsNotEmpty()
  @Field()
  @Column({ type: 'text' })
  subType: string;
}
