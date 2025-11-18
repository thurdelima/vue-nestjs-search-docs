import { isValidCNPJ } from '../../../utils/cpf-cnpj-validator.util';

export function generateValidCNPJ(): string {
  let cnpj: string;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    const digits: number[] = [];
    
    for (let i = 0; i < 12; i++) {
      digits.push(Math.floor(Math.random() * 10));
    }

    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += digits[i] * weights1[i];
    }
    let remainder = sum % 11;
    const digit1 = remainder < 2 ? 0 : 11 - remainder;
    digits.push(digit1);

    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += digits[i] * weights2[i];
    }
    remainder = sum % 11;
    const digit2 = remainder < 2 ? 0 : 11 - remainder;
    digits.push(digit2);

    cnpj = digits.join('');

    attempts++;
    if (attempts >= maxAttempts) {
      throw new Error('Não foi possível gerar um CNPJ válido após várias tentativas');
    }
  } while (!isValidCNPJ(cnpj) || /^(\d)\1{13}$/.test(cnpj));

  return cnpj;
}

