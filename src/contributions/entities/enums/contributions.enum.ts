import { registerEnumType } from '@nestjs/graphql';

export enum ContributionTypeEnum {
  SOCIETY_HEAD = 'SOCIETY_HEAD',
  TEACHER = 'TEACHER',
  CAREER_COUNSELLOR = 'CAREER_COUNSELLOR',
}

registerEnumType(ContributionTypeEnum, {
  name: 'ContributionType',
  description: 'Types Of Contributions',
});
