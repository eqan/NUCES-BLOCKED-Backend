import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Student } from '../entities/students.entity';

@ObjectType('GetAllStudents')
export class GetAllStudents {
  @Field(() => [Student])
  items: Student[];

  @Field(() => Int)
  total: number;
}
