import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { ContributionTypeEnum } from '../entities/enums/contributions.enum';

@ArgsType()
@InputType()
export class GetContributionInput {
  @IsOptional()
  @Field(() => String, { nullable: true })
  contributionId: string;

  @Field(() => ContributionTypeEnum)
  contributionType: ContributionTypeEnum;

  @Field(() => String)
  studentId: string;
}
