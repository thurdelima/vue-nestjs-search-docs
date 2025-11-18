import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { User } from '../../users/entities/user.entity';
import { Document, DocumentType } from '../../documents/entities/document.entity';
import { generateValidCPF } from './generators/cpf-generator.util';
import { generateValidCNPJ } from './generators/cnpj-generator.util';

config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'cpf_cnpj_db',
  entities: [User, Document],
  synchronize: false,
  logging: false,
});

async function seed() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...\n');

    await dataSource.initialize();
    console.log('✅ Conectado ao banco de dados\n');

    const userRepository = dataSource.getRepository(User);
    const documentRepository = dataSource.getRepository(Document);

    const userEmail = 'example@email.com';
    const userPassword = 'senha123';
    const saltRounds = 10;

    console.log('👤 Criando usuário...');
    const existingUser = await userRepository.findOne({
      where: { email: userEmail, isDeleted: false },
    });

    if (existingUser) {
      console.log(`   ⚠️  Usuário ${userEmail} já existe, pulando criação\n`);
    } else {
      const hashedPassword = await bcrypt.hash(userPassword, saltRounds);
      const user = userRepository.create({
        email: userEmail,
        password: hashedPassword,
        isDeleted: false,
      });
      const savedUser = await userRepository.save(user);
      console.log(`   ✅ Usuário criado: ${savedUser.email} (ID: ${savedUser.id})\n`);
    }

    console.log('📄 Criando documentos CPF...');
    const cpfCount = 5;
    let createdCpfCount = 0;

    for (let i = 0; i < cpfCount; i++) {
      let cpf: string;
      let exists = true;
      let attempts = 0;
      const maxAttempts = 50;

      while (exists && attempts < maxAttempts) {
        cpf = generateValidCPF();
        const existing = await documentRepository.findOne({
          where: { number: cpf, isDeleted: false },
        });
        exists = !!existing;
        attempts++;
      }

      if (attempts >= maxAttempts) {
        console.log(`   ⚠️  Não foi possível criar CPF ${i + 1} (muitas duplicatas)`);
        continue;
      }

      const document = documentRepository.create({
        number: cpf!,
        type: DocumentType.CPF,
        isDeleted: false,
      });
      await documentRepository.save(document);
      createdCpfCount++;
      console.log(`   ✅ CPF ${i + 1} criado: ${cpf}`);
    }
    console.log(`   📊 Total de CPFs criados: ${createdCpfCount}/${cpfCount}\n`);

    console.log('📄 Criando documentos CNPJ...');
    const cnpjCount = 5;
    let createdCnpjCount = 0;

    for (let i = 0; i < cnpjCount; i++) {
      let cnpj: string;
      let exists = true;
      let attempts = 0;
      const maxAttempts = 50;

      while (exists && attempts < maxAttempts) {
        cnpj = generateValidCNPJ();
        const existing = await documentRepository.findOne({
          where: { number: cnpj, isDeleted: false },
        });
        exists = !!existing;
        attempts++;
      }

      if (attempts >= maxAttempts) {
        console.log(`   ⚠️  Não foi possível criar CNPJ ${i + 1} (muitas duplicatas)`);
        continue;
      }

      const document = documentRepository.create({
        number: cnpj!,
        type: DocumentType.CNPJ,
        isDeleted: false,
      });
      await documentRepository.save(document);
      createdCnpjCount++;
      console.log(`   ✅ CNPJ ${i + 1} criado: ${cnpj}`);
    }
    console.log(`   📊 Total de CNPJs criados: ${createdCnpjCount}/${cnpjCount}\n`);

    console.log('✅ Seed concluído com sucesso!');
    console.log(`   - Usuário: ${userEmail}`);
    console.log(`   - CPFs: ${createdCpfCount}`);
    console.log(`   - CNPJs: ${createdCnpjCount}`);

    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(1);
  }
}

seed();

