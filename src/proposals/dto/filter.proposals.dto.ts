import { Field, InputType } from '@nestjs/graphql';
import { PaginationParam } from 'src/core/pagination/pagination.dto';

@InputType()
export class FilterProposalInput extends PaginationParam {
  @Field()
  id: string;
}
