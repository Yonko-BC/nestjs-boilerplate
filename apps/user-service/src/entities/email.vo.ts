import { DomainException } from 'libs/core/src/exceptions/domain.exception';

export class Email {
  private readonly value: string;
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(email: string) {
    if (!email) {
      throw new DomainException('email', 'Email is required', email);
    }

    if (!Email.EMAIL_REGEX.test(email)) {
      throw new DomainException('email', 'Invalid email format', email);
    }

    this.value = email.toLowerCase();
  }

  getValue(): string {
    return this.value;
  }
}
