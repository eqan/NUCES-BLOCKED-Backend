import { GraphQLScalarType } from 'graphql';
import {
  dataValidationSchema,
  validate,
} from '../constants/contribution.constants.validation-schema';

export const ContributionScalar = new GraphQLScalarType({
  name: 'CONTRIBUTIONS_SCALAR',
  description: 'A simple contributions Parser',
  serialize: (value) => validate(value, dataValidationSchema),
  parseValue: (value) => validate(value, dataValidationSchema),
});
