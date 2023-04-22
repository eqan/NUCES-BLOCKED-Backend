import { Optional } from '@nestjs/common';
import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { EligibilityStatusEnum } from '../entities/enums/status.enum';

@InputType()
export class UpdateStudentInput {
  @Optional()
  @IsString()
  @Field({ nullable: true })
  id: string;

  @IsOptional()
  @IsEmail()
  @Field({ nullable: true })
  email: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  name: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  cgpa: string;

  @IsOptional()
  @IsString()
  @Field()
  batch: string;

  @IsOptional()
  @IsEnum(EligibilityStatusEnum)
  @Field(() => EligibilityStatusEnum)
  eligibilityStatus: EligibilityStatusEnum;
}
