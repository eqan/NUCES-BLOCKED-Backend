import { Field, ObjectType } from '@nestjs/graphql';
import { AdminContributions } from 'src/students/entities/nestedObjects/admin.contribution.entity';
import { CareerCounsellorContributions } from 'src/students/entities/nestedObjects/careercounsellor.contribution.entity';
import { SocietyHeadsContributions } from 'src/students/entities/nestedObjects/societyhead.contribution.entity';
import { TeachersContributions } from 'src/students/entities/nestedObjects/teacher.contribution.entity';

@ObjectType()
export class ContributionsUnion {
  @Field(() => AdminContributions, { nullable: true })
  AdminContributions: AdminContributions;

  @Field(() => CareerCounsellorContributions, { nullable: true })
  CareerCounsellorContributions: CareerCounsellorContributions[];

  @Field(() => TeachersContributions, { nullable: true })
  TeachersContributions: TeachersContributions;

  @Field(() => SocietyHeadsContributions, { nullable: true })
  SocietyHeadsContributions: SocietyHeadsContributions;
}
