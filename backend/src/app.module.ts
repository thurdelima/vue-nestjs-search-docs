import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { DocumentsModule } from './documents/documents.module';
import { StatusModule } from './status/status.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { StatusService } from './status/status.service';
import { databaseConfig } from './config/database.config';
import { loggerConfig } from './config/logger.config';
import { QueryCountInterceptor } from './common/interceptors/query-count.interceptor';

@Module({
  imports: [
    LoggerModule.forRoot(loggerConfig),
    TypeOrmModule.forRoot(databaseConfig),
    DocumentsModule,
    StatusModule,
    UsersModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: (statusService) => new QueryCountInterceptor(statusService),
      inject: [StatusService],
    },
  ],
})
export class AppModule {}

