import { registerEnumType } from '@nestjs/graphql';

export enum SemesterTypesEnum {
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  FALL = 'FALL',
}

registerEnumType(SemesterTypesEnum, {
  name: 'SemesterTypesEnum',
  description: 'Types of semesters',
});
