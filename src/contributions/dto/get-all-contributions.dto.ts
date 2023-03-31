import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { CareerCounsellorContributions } from '../entities/careercounsellor.contribution.entity';
import { SocietyHeadsContributions } from '../entities/societyhead.contribution.entity';
import { TeachersContributions } from '../entities/teacher.contribution.entity';

@ObjectType('GetAllContributions')
export class GetAllContributions {
  @IsOptional()
  @Field(() => [CareerCounsellorContributions], {
    nullable: true,
    defaultValue: null,
  })
  careerCounsellorContributions?: CareerCounsellorContributions[];

  @IsOptional()
  @Field(() => [SocietyHeadsContributions], {
    nullable: true,
    defaultValue: null,
  })
  societyHeadsContributions?: SocietyHeadsContributions[];

  @IsOptional()
  @Field(() => [TeachersContributions], { nullable: true, defaultValue: null })
  teachersContribution?: TeachersContributions[];

  @Field(() => Int)
  total: number;
}
