import { Optional } from '@nestjs/common';
import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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

  @IsNumber()
  @Field()
  cgpa: number;
}
