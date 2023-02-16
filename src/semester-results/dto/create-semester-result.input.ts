import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { SemesterTypesEnum } from '../entities/enums/semester-types.enums';

@InputType()
export class CreateResultDto {
  @IsNotEmpty()
  @IsNumber()
  @Field()
  year: number;

  @IsNotEmpty()
  @IsEnum(SemesterTypesEnum)
  @Field(() => SemesterTypesEnum)
  type: SemesterTypesEnum;

  @IsUrl()
  @Field()
  url: string;
}
