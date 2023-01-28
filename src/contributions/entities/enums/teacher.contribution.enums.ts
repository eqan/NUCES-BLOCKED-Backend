import { registerEnumType } from '@nestjs/graphql';

export enum TeacherContributionEnum {
  TA_SHIP = 'TA_SHIP',
  RESEARCH = 'RESEARCH',
}

registerEnumType(TeacherContributionEnum, {
  name: 'TeacherContributionType',
  description: 'Types of teachers contributions',
});
