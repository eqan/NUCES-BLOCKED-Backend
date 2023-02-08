import { forwardRef, Module } from '@nestjs/common';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule, RedisService } from 'nestjs-redis';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { SemesterResult } from './entities/semester-result.entity';
import { SemesterCron } from './semester-result-cron.service';
import { SemesterResultResolver } from './semester-result.resolver';
import { SemesterResultService } from './semester-result.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SemesterResult]),
    forwardRef(() => AuthModule),
  ],
  providers: [
    SemesterResultResolver,
    SchedulerRegistry,
    RedisService,
    SemesterCron,
    SemesterResultService,
    AuthService,
  ],
  exports: [SemesterResultService],
})
export class SemesterResultModule {}
