import { registerEnumType } from '@nestjs/graphql';

export enum AdminContributionType {
  CGPA = 'CGPA',
}

registerEnumType(AdminContributionType, {
  name: 'AdminContributionType',
  description: 'Types of admin contributions',
});
