import { Field, InputType } from '@nestjs/graphql';
import { PaginationParam } from 'src/core/pagination/pagination.dto';

@InputType()
export class FilterResultInput extends PaginationParam {
  @Field()
  id: string;
}
