import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { Certificate } from './entities/certificates.entity';
import { CertificatesResolver } from './certificates.resolver';
import { CertificatesService } from './certificates.service';
import { Student } from 'src/students/entities/students.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Certificate, Student]),
    forwardRef(() => AuthModule),
  ],
  providers: [CertificatesResolver, CertificatesService, AuthService],
  exports: [CertificatesService],
})
export class CertificatesModule {}
