import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Students } from '../entities/students.entity';

@ObjectType('GetAllStudents')
export class GetAllStudents {
  @Field(() => [Students])
  items: Students[];

  @Field(() => Int)
  total: number;
}
