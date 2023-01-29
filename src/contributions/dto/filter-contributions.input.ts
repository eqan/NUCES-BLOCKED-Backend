import { Field, InputType } from '@nestjs/graphql';
import { PaginationParam } from 'src/core/pagination/pagination.dto';
import { ContributionTypeEnum } from '../entities/enums/contributions.enum';

@InputType()
export class FilterAllContributionDto extends PaginationParam {
  @Field(() => ContributionTypeEnum)
  contributionType: ContributionTypeEnum;

  @Field(() => String)
  studentId: string;
}
