import { registerEnumType } from '@nestjs/graphql';

export enum AdminContributionEnum {
  CGPA = 'CGPA',
}

registerEnumType(AdminContributionEnum, {
  name: 'AdminContributionType',
  description: 'Types of admin contributions',
});
