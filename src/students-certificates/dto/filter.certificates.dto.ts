import { Field, InputType } from '@nestjs/graphql';
import { PaginationParam } from './pagination.dto';

@InputType()
export class FilterCertificateInput extends PaginationParam {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  studentId?: string;
}
