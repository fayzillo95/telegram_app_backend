import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isPhoneNumber', async: false })
export class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    return /^[0-9]+$/.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Telefon raqam faqat raqamlardan iborat bo‘lishi kerak!';
  }
}
