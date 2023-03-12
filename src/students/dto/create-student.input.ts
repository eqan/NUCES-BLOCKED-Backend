import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateStudentInput {
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

  @IsNumber()
  @Field()
  cgpa: number;
}
