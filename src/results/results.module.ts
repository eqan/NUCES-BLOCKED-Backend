import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { Result } from './entities/results.entity';
import { ResultsResolver } from './results.resolver';
import { ResultsService } from './results.service';

@Module({
  imports: [TypeOrmModule.forFeature([Result]), forwardRef(() => AuthModule)],
  providers: [ResultsResolver, ResultsService, AuthService],
  exports: [ResultsService],
})
export class ResultsModule {}
