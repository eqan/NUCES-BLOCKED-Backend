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
    ScheduleModule.forRoot(),

    // BullModule.forRootAsync({
    //   useClass: BullConfig,
    // }),
    /**
     * Redis Module
     * Redis Configuration
     */
    // RedisModule.forRootAsync({
    //   useFactory: (configService: ConfigService) => configService.get('redis'), // or use async method
    //   //useFactory: async (configService: ConfigService) => configService.get('redis'),
    //   inject: [ConfigService],
    // }),
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
  ],
})
export class AppModule {}
