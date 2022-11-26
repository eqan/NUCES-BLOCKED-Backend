import { registerEnumType } from '@nestjs/graphql';

export enum SystemErrors {
  CREATE_USER = 'E01: Unable To Create User',
  GET_USER_DATA_BY_ID = 'E02: Unable To Fetch User Data By ID',
  LOGIN_AUTHORIZATION = 'E03: Authorization and access token generation failed because of invalid data',
  UPDATE_USER = 'E04: Unable To Update User',
  DELETE_USER = 'E05: Unable To Delete User',
  FIND_USERS = 'E06: Unable To Find All Users',
  COOKIES_NOT_FOUND = 'E07: Unable to retrieve cookies',
  USER_NOT_FOUND = 'E8: User not found!',
  EMAIL_OR_PASSWORD_INCORRECT = 'E9: Email Or Password Incorrect!',
  USER_ALREADY_PRESENT = 'E10: User With this email already created!',
  CREATE_STUDENT = 'E11: Unable To Create Student',
  UPDATE_STUDENT = 'E12: Unable To Update Student',
  DELETE_STUDENT = 'E13: Unable To Delete Student',
  FIND_STUDENT = 'E14: Unable To Find All Student',
  GET_STUDENT_DATA_BY_ID = 'E15: Unable To Fetch Student Data By ID',
}

registerEnumType(SystemErrors, {
  name: 'ErrorTypesEnum',
});
