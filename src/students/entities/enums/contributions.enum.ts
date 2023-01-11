import { registerEnumType } from '@nestjs/graphql';

export enum ContributionType {
  ADMIN = 'ADMIN',
  SOCIETY_HEAD = 'SOCIETY_HEAD',
  TEACHER = 'TEACHER',
  CAREER_COUNSELLOR = 'CAREER_COUNSELLOR',
}

registerEnumType(ContributionType, {
  name: 'ContributionType',
  description: 'Types Of Contributions',
});
