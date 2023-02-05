import { Field, Int, ObjectType } from '@nestjs/graphql';
import { SemesterResult } from '../entities/semester-result.entity';

@ObjectType('GetAllResults')
export class GetAllResults {
  @Field(() => [SemesterResult])
  items: SemesterResult[];

  @Field(() => Int)
  total: number;
}
