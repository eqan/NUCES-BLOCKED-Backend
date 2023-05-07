import { registerEnumType } from '@nestjs/graphql';

export enum EligibilityStatusEnum {
  NOT_ELIGIBLE = 'NOT_ELIGIBLE',
  ELIGIBLE = 'ELIGIBLE',
  ALREADY_PUBLISHED = 'ALREADY_PUBLISHED',
  NOT_ALLOWED = 'NOT_ALLOWED',
  IN_PROGRESS = 'IN_PROGRESS',
}

registerEnumType(EligibilityStatusEnum, {
  name: 'EligibilityStatusEnum',
  description: 'Types of eligibility criterias',
});
