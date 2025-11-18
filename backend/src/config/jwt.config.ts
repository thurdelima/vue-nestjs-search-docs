import { JwtModuleOptions } from '@nestjs/jwt';

export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const jwtConfig: JwtModuleOptions = {
  secret: JWT_SECRET,
  signOptions: {
    expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as any,
  },
};

