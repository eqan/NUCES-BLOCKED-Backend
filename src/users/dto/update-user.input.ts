import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AdminEntity } from '../entities/admin.users.entity';

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
  @Field(() => AdminEntity, { nullable: true })
  AdminEntiy?: AdminEntity;
}
