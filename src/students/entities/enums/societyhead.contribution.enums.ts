import { registerEnumType } from '@nestjs/graphql';

export enum SocietyHeadsContributionType {
  UNIVERSITY_EVENT = 'University Event',
  COMPETITION_ACHIEVEMENT = 'COMPETITION_ACHIEVEMENT',
}

registerEnumType(SocietyHeadsContributionType, {
  name: 'SocietyHeadsContributionType',
  description: 'Types of society heads contributions',
});
