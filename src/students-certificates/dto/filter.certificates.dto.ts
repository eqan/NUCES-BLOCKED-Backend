import { Field, InputType } from '@nestjs/graphql';
import { PaginationParam } from './pagination.dto';

@InputType()
export class FilterCertificateInput extends PaginationParam {
  @Field()
  id: string;
}
