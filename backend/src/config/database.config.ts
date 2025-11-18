import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Document } from '../documents/entities/document.entity';
import { User } from '../users/entities/user.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'cpf_cnpj_db',
  entities: [Document, User],
  synchronize: process.env.NODE_ENV !== 'production', // true em dev, false em prod
  logging: process.env.NODE_ENV === 'development',
  migrations: ['dist/migrations/*.js'],
  migrationsRun: false, // Executar migrations manualmente
  migrationsTableName: 'migrations',
};

