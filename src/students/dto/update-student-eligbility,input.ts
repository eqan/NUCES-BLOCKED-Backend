import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { EligibilityStatusEnum } from '../entities/enums/status.enum';

@InputType()
export class UpdateStudentEligibilityInput {
  @IsOptional()
  @IsEnum(EligibilityStatusEnum)
  @Field(() => EligibilityStatusEnum)
  from: EligibilityStatusEnum;

  @IsOptional()
  @IsEnum(EligibilityStatusEnum)
  @Field(() => EligibilityStatusEnum)
  to: EligibilityStatusEnum;
}
