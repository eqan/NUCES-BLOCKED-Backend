import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Proposal } from '../entities/proposals.entity';

@ObjectType('GetAllProposals')
export class GetAllProposals {
  @Field(() => [Proposal])
  items: Proposal[];

  @Field(() => Int)
  total: number;
}
