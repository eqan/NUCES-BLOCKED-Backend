import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { PaginationParam } from 'src/core/pagination/pagination.dto';
import { ContributionTypeEnum } from '../entities/enums/contributions.enum';

@InputType()
export class FilterAllContributionDto extends PaginationParam {
  @Field(() => ContributionTypeEnum)
  contributionType: ContributionTypeEnum;

  @Field(() => String)
  contributor: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  studentId?: string;
}
