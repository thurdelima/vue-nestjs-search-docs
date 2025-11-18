import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Document } from './src/documents/entities/document.entity';
import { User } from './src/users/entities/user.entity';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'cpf_cnpj_db',
  entities: [Document, User],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});

