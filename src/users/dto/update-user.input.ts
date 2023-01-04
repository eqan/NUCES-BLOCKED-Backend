import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateAdminEntity } from './nestedObjects/admin.entity.dto';

@InputType()
export class UpdateUsersInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  id: string;

  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  name: string;

  @IsOptional()
  @ValidateNested()
  @Field(() => CreateAdminEntity, { nullable: true })
  AdminEntity?: CreateAdminEntity;
}
