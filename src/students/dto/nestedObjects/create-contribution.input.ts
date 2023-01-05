import { Field, InputType } from '@nestjs/graphql';
import { IsString, ValidateNested } from 'class-validator';
import { ContributionsUnion } from './contribution.union.input';

@InputType()
export class CreateUpdateContributionInput {
  @IsString({ message: 'ID must be a String' })
  @Field()
  id: string;

  @ValidateNested()
  @Field(() => ContributionsUnion)
  contributions: ContributionsUnion;
}
