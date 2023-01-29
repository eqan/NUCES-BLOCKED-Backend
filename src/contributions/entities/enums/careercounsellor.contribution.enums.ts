import { registerEnumType } from '@nestjs/graphql';

export enum CareerCounsellorContributionEnum {
  EXCHANGE_PROGRAM = 'EXCHANGE_PROGRAM',
  INTERNSHIP = 'INTERNSHIP',
  FELLOWSHIP_PROGRAM = 'FELLOWSHIP_PROGRAM',
}

registerEnumType(CareerCounsellorContributionEnum, {
  name: 'CareerCounsellorContributionType',
  description: 'Types of Career Counsellor contributions',
});
