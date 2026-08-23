import { type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Label } from './label';

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  /** Error message (e.g. from react-hook-form). Renders red text + spacing. */
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Wraps any input with a label, optional hint and an error message. Pair with
 * react-hook-form: pass `error={errors.field?.message}`. See docs/RECIPES.md
 * ("Form with validation").
 */
export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <Label htmlFor={htmlFor}>
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
