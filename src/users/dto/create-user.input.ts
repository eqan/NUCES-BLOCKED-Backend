import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserTypes } from '../entities/enum/user.types.enums';
import { CreateAdminEntity } from './nestedObjects/admin.entity.dto';

@InputType('CreateUserInput')
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

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAdminEntity)
  @Field(() => CreateAdminEntity, { nullable: true })
  AdminInformation?: CreateAdminEntity;
}
