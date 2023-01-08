import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
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
  @ValidateNested()
  @Type(() => CreateAdminEntity)
  @Field(() => CreateAdminEntity, { nullable: true })
  AdminInformation?: CreateAdminEntity;
}
