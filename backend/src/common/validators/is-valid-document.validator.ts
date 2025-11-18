import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { isValidDocument } from '../../utils/cpf-cnpj-validator.util';

@ValidatorConstraint({ async: false })
export class IsValidDocumentConstraint implements ValidatorConstraintInterface {
  validate(document: any, args: ValidationArguments) {
    if (typeof document !== 'string') {
      return false;
    }
    return isValidDocument(document);
  }

  defaultMessage(args: ValidationArguments) {
    return 'O documento CPF/CNPJ informado é inválido';
  }
}

export function IsValidDocument(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidDocumentConstraint,
    });
  };
}

