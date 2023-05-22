import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { ProposalsResolver } from './proposals.resolver';
import { ProposalsService } from './proposals.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proposal } from './entities/proposals.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proposal]), forwardRef(() => AuthModule)],
  providers: [ProposalsResolver, ProposalsService, AuthService],
  exports: [ProposalsService],
})
export class ProposalsModule {}
