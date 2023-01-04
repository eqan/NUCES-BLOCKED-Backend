import { registerEnumType } from '@nestjs/graphql';

export enum CareerCounsellorContributionType {
  EXCHANGE_PROGRAM = 'EXCHANGE_PROGRAM',
  INTERNSHIP = 'INTERNSHIP',
  FELLOWSHIP_PROGRAM = 'FELLOWSHIP_PROGRAM',
}

registerEnumType(CareerCounsellorContributionType, {
  name: 'CareerCounsellorContributionType',
  description: 'Types of Career Counsellor contributions',
});
