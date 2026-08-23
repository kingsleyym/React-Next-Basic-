'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FormField,
  Input,
  useToast,
} from '@repo/ui';
import { isAppError } from '@repo/core';
import { useAuth } from '../hooks/use-auth';
import { loginSchema, type LoginValues } from '../schema';

/**
 * Reference form: react-hook-form + Zod + the UI kit. Copy this shape for every
 * form (validation, error toast, Button loading state). See docs/RECIPES.md
 * ("Form with validation").
 */
export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'demo@example.com', password: 'password' },
  });

  async function onSubmit(values: LoginValues) {
    try {
      await login.mutateAsync(values);
      toast({ title: 'Welcome back!', variant: 'success' });
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: isAppError(error) ? error.message : 'Please try again',
        variant: 'error',
      });
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Demo: demo@example.com / password</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField label="Email" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" invalid={!!errors.email} {...register('email')} />
          </FormField>
          <FormField label="Password" htmlFor="password" error={errors.password?.message}>
            <Input
              id="password"
              type="password"
              invalid={!!errors.password}
              {...register('password')}
            />
          </FormField>
          <Button type="submit" loading={login.isPending} className="w-full">
            Sign in
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
