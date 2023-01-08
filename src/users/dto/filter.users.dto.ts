import { Field, InputType } from '@nestjs/graphql';
import { PaginationParam } from './pagination.dto';

@InputType()
export class FilterUserDto extends PaginationParam {
  @Field({ nullable: true, defaultValue: undefined })
  id?: string;
}
