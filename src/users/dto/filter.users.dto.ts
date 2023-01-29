import { Field, InputType } from '@nestjs/graphql';
import { PaginationParam } from 'src/core/pagination/pagination.dto';

@InputType()
export class FilterUserDto extends PaginationParam {
  @Field({ nullable: true, defaultValue: undefined })
  id?: string;
}
