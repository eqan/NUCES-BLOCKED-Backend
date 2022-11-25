import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { UserTypes } from '../entities/enum/user.types.enums';

@InputType()
export class CreateUserInput {
  @IsString({ message: 'Name must be a String' })
  @Field()
  name: string;

  @IsString({ message: 'Email must be a String' })
  @IsEmail({ message: 'Must be an email' })
  @Field()
  email: string;

  @IsString({ message: 'Password must be a String' })
  @Field()
  password: string;

  @IsNotEmpty()
  @IsEnum(UserTypes)
  @Field(() => UserTypes)
  type: UserTypes;
}
