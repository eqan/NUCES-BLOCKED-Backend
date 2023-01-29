import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { AdminContributions } from '../entities/admin.contribution.entity';
import { CareerCounsellorContributions } from '../entities/careercounsellor.contribution.entity';
import { SocietyHeadsContributions } from '../entities/societyhead.contribution.entity';
import { TeachersContributions } from '../entities/teacher.contribution.entity';

@ObjectType('GetAllContributions')
export class GetAllContributions {
  @IsOptional()
  @Field(() => [AdminContributions], { nullable: true })
  adminContributions?: AdminContributions[];

  @IsOptional()
  @Field(() => [CareerCounsellorContributions], { nullable: true })
  careerCounsellorContributions?: CareerCounsellorContributions[];

  @IsOptional()
  @Field(() => [SocietyHeadsContributions], { nullable: true })
  societyHeadsContributions?: SocietyHeadsContributions[];

  @IsOptional()
  @Field(() => [TeachersContributions], { nullable: true })
  teachersContribution?: TeachersContributions[];

  @Field(() => Int)
  total: number;
}
