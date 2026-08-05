import { z } from 'zod';

export const RegisterUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  phone: z.string().min(10, { message: 'Valid phone number is required' }),
  role: z.enum(['PASSENGER', 'DRIVER']).default('PASSENGER'),
});

export const LoginUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export type RegisterUserDTO = z.infer<typeof RegisterUserSchema>;
export type LoginUserDTO = z.infer<typeof LoginUserSchema>;
