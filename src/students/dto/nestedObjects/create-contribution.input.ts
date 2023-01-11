import { Field, InputType } from '@nestjs/graphql';
import { IsString, ValidateNested } from 'class-validator';
import { GraphQLScalarType } from 'graphql';
import {
  dataValidationSchema,
  validate,
} from '../constants/contribution.constants.validation-schema';

export const CustomAssetScalar = new GraphQLScalarType({
  name: 'CONTRIBUTIONS_SCALAR',
  description: 'A simple contributions Parser',
  serialize: (value) => validate(value, dataValidationSchema),
  parseValue: (value) => validate(value, dataValidationSchema),
});

@InputType()
export class CreateUpdateContributionInput {
  @IsString({ message: 'ID must be a String' })
  @Field()
  studentId: string;

  @ValidateNested()
  @Field(() => dataValidationSchema)
  contributions: JSON;
}
