import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AdminContributions } from './entities/nestedObjects/admin.contribution.entity';
import { CareerCounsellorContributions } from './entities/nestedObjects/careercounsellor.contribution.entity';
import { SocietyHeadsContributions } from './entities/nestedObjects/societyhead.contribution.entity';
import { TeachersContributions } from './entities/nestedObjects/teacher.contribution.entity';
import { Student } from './entities/students.entity';
import { StudentsResolver } from './students.resolver';
import { StudentsService } from './students.service';

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
  providers: [StudentsResolver, StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
