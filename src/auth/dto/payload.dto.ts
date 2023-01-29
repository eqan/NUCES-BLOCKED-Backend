import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { UserTypes } from 'src/users/entities/enum/user.types.enums';

@ArgsType()
@InputType()
export class PayLoadDto {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  name: string;

  @Field(() => UserTypes)
  role: UserTypes;

  @Field(() => Int)
  sub: number;
}
