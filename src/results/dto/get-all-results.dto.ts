import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Result } from '../entities/results.entity';

@ObjectType('GetAllResults')
export class GetAllResults {
  @Field(() => [Result])
  items: Result[];

  @Field(() => Int)
  total: number;
}
