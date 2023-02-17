import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { SemesterResult } from './entities/semester-result.entity';
import { SemesterResultResolver } from './semester-result.resolver';
import { SemesterResultService } from './semester-result.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SemesterResult]),
    forwardRef(() => AuthModule),
  ],
  providers: [SemesterResultResolver, SemesterResultService, AuthService],
  exports: [SemesterResultService],
})
export class SemesterResultModule {}
