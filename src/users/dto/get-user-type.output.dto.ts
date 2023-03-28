import { Field, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { UserTypes } from '../entities/enum/user.types.enums';

@ObjectType('GetUserType')
export class GetUserType {
  @IsString({ message: 'Subtype must be a String' })
  @Field()
  subType: string;

  @IsEnum(UserTypes)
  @Field(() => UserTypes)
  type: UserTypes;
}
