import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  it('should validate successfully with valid data', async () => {
    const dto = new CreateUserDto();
    dto.email = 'valid@example.com';
    dto.password = 'strongPassword';

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('should fail when email is invalid', async () => {
    const dto = new CreateUserDto();
    dto.email = 'invalid-email';
    dto.password = 'strongPassword';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
  });

  it('should fail when password is too short', async () => {
    const dto = new CreateUserDto();
    dto.email = 'valid@example.com';
    dto.password = '123';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('password');
  });

  it('should fail when fields are empty', async () => {
    const dto = new CreateUserDto();
    dto.email = '';
    dto.password = '';

    const errors = await validate(dto);

    const fields = errors.map((error) => error.property);
    expect(fields).toEqual(expect.arrayContaining(['email', 'password']));
  });
});
