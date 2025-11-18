import { isValidCPF } from '../../../utils/cpf-cnpj-validator.util';

export function generateValidCPF(): string {
  let cpf: string;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    const digits: number[] = [];
    
    for (let i = 0; i < 9; i++) {
      digits.push(Math.floor(Math.random() * 10));
    }

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += digits[i] * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    digits.push(remainder);

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += digits[i] * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    digits.push(remainder);

    cpf = digits.join('');

    attempts++;
    if (attempts >= maxAttempts) {
      throw new Error('Não foi possível gerar um CPF válido após várias tentativas');
    }
  } while (!isValidCPF(cpf) || /^(\d)\1{10}$/.test(cpf));

  return cpf;
}

