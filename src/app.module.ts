import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { response } from 'express';
import { join } from 'path';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { ContributionsModule } from './contributions/contributions.module';
import { SemesterResultModule } from './semester-results/semester-result.module';
import { CertificatesModule } from './students-certificates/certificates.module';
import { StudentsModule } from './students/students.module';
import { UsersModule } from './users/users.module';
import { ProposalsModule } from './proposals/proposals.module';

@Module({
  imports: [
    /**
     * GraphQl Module
     * GraphQl Configuration
     */
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
      context: response,
      definitions: {
        path: join(process.cwd(), 'src/graphqlFile.ts'),
      },
    }),

    // Allows nestjs/schedule on all modules
    ScheduleModule.forRoot(),

    /**
     * TypeORM Module
     * TypeORM Configurations
     */
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),

    /**
     * Config Module
     * Custom Configurations Files
     */
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Modules
    UsersModule,
    StudentsModule,
    CertificatesModule,
    ContributionsModule,
    SemesterResultModule,
    ProposalsModule,
  ],
})
export class AppModule {}
