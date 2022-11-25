import { registerEnumType } from '@nestjs/graphql';

export enum UserTypes {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  CAREER_COUNSELLOR = 'CAREER_COUNSELLOR',
  SOCIETY_HEAD = 'SOCIETY_HEAD',
  REGULAR_USER = 'REGULAR_USER',
}
registerEnumType(UserTypes, {
  name: 'UserTypeEnum',
});
