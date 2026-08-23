import { z } from 'zod';

/** Validation schemas for auth forms. Zod = source of truth for form types too. */
export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'At least 6 characters'),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const signupSchema = loginSchema.extend({
  name: z.string().min(1, 'Enter your name'),
});
export type SignupValues = z.infer<typeof signupSchema>;
