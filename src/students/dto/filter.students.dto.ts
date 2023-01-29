import { Field, InputType } from '@nestjs/graphql';
import { PaginationParam } from '../../core/pagination/pagination.dto';

@InputType()
export class FilterStudentDto extends PaginationParam {
  @Field({ nullable: true })
  id?: string;
}
