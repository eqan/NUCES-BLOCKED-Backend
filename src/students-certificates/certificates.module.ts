import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { Certificate } from './entities/certificates.entity';
import { CertificatessResolver } from './certificates.resolver';
import { CertificatesService } from './certificates.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Certificate]),
    forwardRef(() => AuthModule),
  ],
  providers: [CertificatessResolver, CertificatesService, AuthService],
  exports: [CertificatesService],
})
export class CertificatesModule {}
