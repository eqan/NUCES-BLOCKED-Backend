import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { UserTypes } from '../entities/enum/user.types.enums';

@InputType()
export class UpdateUsersInput {
  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  name: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  password: string;

  @IsOptional()
  @IsEnum(UserTypes)
  @Field(() => UserTypes)
  type: UserTypes;

  @IsOptional()
  @IsUrl({ message: 'Must be a valid URL' })
  @Field({ nullable: true })
  imgUrl: string;
}
