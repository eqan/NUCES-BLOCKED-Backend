import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class LoginUserInput {
  @IsEmail()
  @Field(() => String, { description: 'email of the user' })
  email: string;

  @IsString()
  @Field(() => String, { description: 'password of the user' })
  password: string;
}
