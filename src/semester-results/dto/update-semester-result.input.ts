import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { SemesterTypesEnum } from '../entities/enums/semester-types.enums';

@InputType()
export class UpdateResultsInput {
  @IsString()
  @Field()
  id: string;

  @IsUrl()
  @Field()
  url: string;
}
