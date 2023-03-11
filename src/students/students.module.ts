import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Certificate } from 'src/students-certificates/entities/certificates.entity';
import { CareerCounsellorContributions } from '../contributions/entities/careercounsellor.contribution.entity';
import { SocietyHeadsContributions } from '../contributions/entities/societyhead.contribution.entity';
import { TeachersContributions } from '../contributions/entities/teacher.contribution.entity';
import { Student } from './entities/students.entity';
import { StudentsResolver } from './students.resolver';
import { StudentsService } from './students.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student,
      CareerCounsellorContributions,
      SocietyHeadsContributions,
      TeachersContributions,
      Certificate,
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [StudentsResolver, StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
