import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SemesterTypesEnum } from '../entities/enums/semester-types.enums';

@InputType()
export class CreateResultDto {
  @IsNotEmpty()
  @Field()
  @IsString()
  year: string;

  @IsNotEmpty()
  @IsEnum(SemesterTypesEnum)
  @Field(() => SemesterTypesEnum)
  type: SemesterTypesEnum;

  @IsString()
  @Field()
  url: string;
}
