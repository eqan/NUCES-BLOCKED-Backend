import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { EligibilityStatusEnum } from 'src/students/entities/enums/status.enum';

@InputType()
export class IndexContributionsOnStudentIdAndEligibilityInput {
  @IsString()
  @Field()
  studentId: string;

  @IsEnum(EligibilityStatusEnum)
  @Field(() => EligibilityStatusEnum)
  eligibility: EligibilityStatusEnum;
}
