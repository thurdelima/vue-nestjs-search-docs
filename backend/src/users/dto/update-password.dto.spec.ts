import { validate } from 'class-validator';
import { UpdatePasswordDto } from './update-password.dto';

describe('UpdatePasswordDto', () => {
  it('should validate successfully with valid data', async () => {
    const dto = new UpdatePasswordDto();
    dto.currentPassword = 'currentPassword123';
    dto.newPassword = 'newPassword123';

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('should fail when currentPassword is empty', async () => {
    const dto = new UpdatePasswordDto();
    dto.currentPassword = '';
    dto.newPassword = 'newPassword123';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('currentPassword');
  });

  it('should fail when currentPassword is null', async () => {
    const dto = new UpdatePasswordDto();
    dto.currentPassword = null as any;
    dto.newPassword = 'newPassword123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === 'currentPassword')).toBe(true);
  });

  it('should fail when newPassword is empty', async () => {
    const dto = new UpdatePasswordDto();
    dto.currentPassword = 'currentPassword123';
    dto.newPassword = '';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('newPassword');
  });

  it('should fail when newPassword is null', async () => {
    const dto = new UpdatePasswordDto();
    dto.currentPassword = 'currentPassword123';
    dto.newPassword = null as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === 'newPassword')).toBe(true);
  });

  it('should fail when newPassword is too short (less than 6 characters)', async () => {
    const dto = new UpdatePasswordDto();
    dto.currentPassword = 'currentPassword123';
    dto.newPassword = '12345'; // 5 caracteres

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('newPassword');
  });

  it('should pass when newPassword has exactly 6 characters', async () => {
    const dto = new UpdatePasswordDto();
    dto.currentPassword = 'currentPassword123';
    dto.newPassword = '123456'; // Exatamente 6 caracteres

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('should fail when both fields are empty', async () => {
    const dto = new UpdatePasswordDto();
    dto.currentPassword = '';
    dto.newPassword = '';

    const errors = await validate(dto);

    const fields = errors.map((error) => error.property);
    expect(fields).toEqual(expect.arrayContaining(['currentPassword', 'newPassword']));
  });

  it('should accept currentPassword with any length (no min length restriction)', async () => {
    const dto = new UpdatePasswordDto();
    dto.currentPassword = '123'; // Senha curta, mas válida para currentPassword
    dto.newPassword = 'newPassword123';

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });
});

