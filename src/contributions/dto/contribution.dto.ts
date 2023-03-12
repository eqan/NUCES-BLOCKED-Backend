import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { AdminContributionEnum } from 'src/contributions/entities/enums/admin.contribution.enums';
import { CareerCounsellorContributionEnum } from 'src/contributions/entities/enums/careercounsellor.contribution.enums';
import { ContributionTypeEnum } from 'src/contributions/entities/enums/contributions.enum';
import { SocietyHeadContributionEnum } from 'src/contributions/entities/enums/societyhead.contribution.enums';
import { TeacherContributionEnum } from 'src/contributions/entities/enums/teacher.contribution.enums';

// @ObjectType('AdminContribution')
// @InputType('AdminContribution')
// export class AdminContribution {
//   @Field(() => ContributionTypeEnum, {
//     defaultValue: ContributionTypeEnum.ADMIN,
//   })
//   @Type(() => () => ContributionTypeEnum.ADMIN)
//   readonly contributionType: ContributionTypeEnum.ADMIN;

//   @Field(() => AdminContributionEnum, {
//     defaultValue: AdminContributionEnum.CGPA,
//   })
//   @Type(() => () => AdminContributionEnum.CGPA)
//   adminContributionType: AdminContributionEnum.CGPA;
// }

@ObjectType('CareerCounsellorContribution')
@InputType('CareerCounsellorContribution')
export class CareerCounsellorContribution {
  @Field(() => ContributionTypeEnum, {
    defaultValue: ContributionTypeEnum.CAREER_COUNSELLOR,
  })
  @Type(() => () => ContributionTypeEnum.CAREER_COUNSELLOR)
  readonly contributionType: ContributionTypeEnum.CAREER_COUNSELLOR;

  @Field(() => CareerCounsellorContributionEnum)
  @Type(() => () => CareerCounsellorContributionEnum)
  careerCounsellorContributionType: CareerCounsellorContributionEnum;
}

@ObjectType('SocietyHeadContribution')
@InputType('SocietyHeadContribution')
export class SocietyHeadContribution {
  @Field(() => ContributionTypeEnum, {
    defaultValue: ContributionTypeEnum.SOCIETY_HEAD,
  })
  @Type(() => () => ContributionTypeEnum.SOCIETY_HEAD)
  readonly contributionType: ContributionTypeEnum.SOCIETY_HEAD;

  @Field(() => SocietyHeadContributionEnum)
  @Type(() => () => SocietyHeadContributionEnum)
  societyHeadContributionType: SocietyHeadContributionEnum;
}

@ObjectType('TeacherContribution')
@InputType('TeacherContribution')
export class TeacherContribution {
  @Field(() => ContributionTypeEnum, {
    defaultValue: ContributionTypeEnum.TEACHER,
  })
  @Type(() => () => ContributionTypeEnum.TEACHER)
  readonly contributionType: ContributionTypeEnum.TEACHER;

  @Field(() => TeacherContributionEnum)
  @Type(() => () => TeacherContributionEnum)
  teacherContribution: TeacherContributionEnum;
}

export type ContributionInput =
  | CareerCounsellorContribution
  | SocietyHeadContribution
  | TeacherContribution;

@InputType('ContributionTypeInput')
export class ContributionTypeInput {
  @Field(() => ContributionTypeEnum)
  type: ContributionTypeEnum;

  @Field(() => ContributionTypeEnum)
  contributionType: ContributionTypeEnum;

  @Field(() => TeacherContributionEnum, {
    nullable: true,
  })
  @Type(() => () => TeacherContributionEnum)
  teacherContributionType?: TeacherContributionEnum;

  @Field(() => SocietyHeadContributionEnum, {
    nullable: true,
  })
  @Type(() => () => SocietyHeadContributionEnum)
  societyHeadContributionType?: SocietyHeadContributionEnum;

  @Field(() => CareerCounsellorContributionEnum, {
    nullable: true,
  })
  @Type(() => () => CareerCounsellorContributionEnum)
  careerCounsellorContributionType?: CareerCounsellorContributionEnum;

  @Field(() => AdminContributionEnum, {
    defaultValue: AdminContributionEnum.CGPA,
    nullable: true,
  })
  @Type(() => () => AdminContributionEnum.CGPA)
  adminContributionType?: AdminContributionEnum.CGPA;
}

@ObjectType('ContributionDto')
@InputType('ContributionDto')
export class ContributionDto {
  @Field(() => ContributionTypeInput)
  @Type(() => ContributionTypeInput, {
    discriminator: {
      property: 'type',
      subTypes: [
        // { value: AdminContribution, name: ContributionTypeEnum.ADMIN },
        {
          value: SocietyHeadContribution,
          name: ContributionTypeEnum.SOCIETY_HEAD,
        },
        {
          value: CareerCounsellorContribution,
          name: ContributionTypeEnum.CAREER_COUNSELLOR,
        },
        { value: TeacherContribution, name: ContributionTypeEnum.TEACHER },
      ],
    },
  })
  contributionType: ContributionTypeInput;

  @IsOptional()
  @Field({ nullable: true })
  @IsString()
  title?: string;

  @Field()
  @IsString()
  contribution: string;

  @Field()
  @IsString()
  contributor: string;

  @Field()
  @IsString()
  studentId: string;
}
