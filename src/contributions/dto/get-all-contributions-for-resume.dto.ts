import { Field, ObjectType } from '@nestjs/graphql';
import { CareerCounsellorContributions } from '../entities/careercounsellor.contribution.entity';
import { SocietyHeadsContributions } from '../entities/societyhead.contribution.entity';
import { TeachersContributions } from '../entities/teacher.contribution.entity';

@ObjectType()
export class IndexAllContributionsForResumeDTO {
  @Field(() => [CareerCounsellorContributions], {
    nullable: true,
    defaultValue: [],
  })
  careerCounsellorContributions?: CareerCounsellorContributions[];

  @Field(() => [SocietyHeadsContributions], {
    nullable: true,
    defaultValue: [],
  })
  societyHeadsContributions?: SocietyHeadsContributions[];

  @Field(() => [TeachersContributions], {
    nullable: true,
    defaultValue: [],
  })
  teachersContribution?: TeachersContributions[];
}
