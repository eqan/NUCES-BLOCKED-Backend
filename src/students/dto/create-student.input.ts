import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateStudentInput {
  @IsNotEmpty()
  @IsString({ message: 'ID must be a String' })
  @Field()
  id: string;

  @IsString({ message: 'Name must be a String' })
  @Field()
  name: string;

  @IsString({ message: 'Email must be a String' })
  @IsEmail({ message: 'Must be an email' })
  @Field()
  email: string;

  @IsString()
  @Field()
  cgpa: string;

  @IsString()
  @Field()
  batch: string;
}
