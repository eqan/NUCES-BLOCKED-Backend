import { registerEnumType } from '@nestjs/graphql';

export enum TeacherContributionType {
  TA_SHIP = 'TA_SHIP',
  RESEARCH = 'RESEARCH',
}

registerEnumType(TeacherContributionType, {
  name: 'TeacherContributionType',
  description: 'Types of teachers contributions',
});
