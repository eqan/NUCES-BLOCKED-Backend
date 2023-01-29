import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AdminContributions } from 'src/contributions/entities/admin.contribution.entity';
import { CareerCounsellorContributions } from 'src/contributions/entities/careercounsellor.contribution.entity';
import { SocietyHeadsContributions } from 'src/contributions/entities/societyhead.contribution.entity';
import { TeachersContributions } from 'src/contributions/entities/teacher.contribution.entity';
import { Student } from 'src/students/entities/students.entity';
import { ContributionsResolver } from './contributions.resolver';
import { ContributionsService } from './contributions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student,
      AdminContributions,
      CareerCounsellorContributions,
      SocietyHeadsContributions,
      TeachersContributions,
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [ContributionsResolver, ContributionsService],
  exports: [ContributionsService],
})
export class ContributionsModule {}
