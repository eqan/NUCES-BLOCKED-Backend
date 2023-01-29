import { registerEnumType } from '@nestjs/graphql';

export enum SocietyHeadContributionEnum {
  UNIVERSITY_EVENT = 'University Event',
  COMPETITION_ACHIEVEMENT = 'COMPETITION_ACHIEVEMENT',
}

registerEnumType(SocietyHeadContributionEnum, {
  name: 'SocietyHeadsContributionType',
  description: 'Types of society heads contributions',
});
