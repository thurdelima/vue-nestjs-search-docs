import { validate } from 'class-validator';
import { LoginDto } from './login.dto';

describe('LoginDto', () => {
  it('should validate successfully with valid data', async () => {
    const dto = new LoginDto();
    dto.email = 'valid@example.com';
    dto.password = 'anyPassword';

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('should fail when email is invalid', async () => {
    const dto = new LoginDto();
    dto.email = 'invalid-email';
    dto.password = 'anyPassword';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
  });

  it('should fail when email is empty', async () => {
    const dto = new LoginDto();
    dto.email = '';
    dto.password = 'anyPassword';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
  });

  it('should fail when password is empty', async () => {
    const dto = new LoginDto();
    dto.email = 'valid@example.com';
    dto.password = '';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('password');
  });

  it('should fail when both fields are empty', async () => {
    const dto = new LoginDto();
    dto.email = '';
    dto.password = '';

    const errors = await validate(dto);

    const fields = errors.map((error) => error.property);
    expect(fields).toEqual(expect.arrayContaining(['email', 'password']));
  });

  it('should fail when email is null', async () => {
    const dto = new LoginDto();
    dto.email = null as any;
    dto.password = 'anyPassword';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === 'email')).toBe(true);
  });

  it('should fail when password is null', async () => {
    const dto = new LoginDto();
    dto.email = 'valid@example.com';
    dto.password = null as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === 'password')).toBe(true);
  });

  it('should accept password with any length (no min length restriction)', async () => {
    const dto = new LoginDto();
    dto.email = 'valid@example.com';
    dto.password = '123'; // Senha curta, mas válida para login

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });
});

