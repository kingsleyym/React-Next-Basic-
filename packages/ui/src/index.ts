// Public API of @repo/ui. Import components/hooks from '@repo/ui'.
// The catalog (props + usage) is documented in docs/COMPONENTS.md.

export { cn } from './lib/cn';

// Components
export { Button, buttonVariants, type ButtonProps } from './components/button';
export { Spinner } from './components/spinner';
export { Input, type InputProps } from './components/input';
export { Textarea, type TextareaProps } from './components/textarea';
export { Label } from './components/label';
export { FormField, type FormFieldProps } from './components/form-field';
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './components/card';
export { Badge, type BadgeProps } from './components/badge';
export { Avatar, type AvatarProps } from './components/avatar';
export { Skeleton } from './components/skeleton';
export { EmptyState, type EmptyStateProps } from './components/empty-state';
export { ErrorState, type ErrorStateProps } from './components/error-state';
export { Dialog, type DialogProps } from './components/dialog';
export { ImageUpload, type ImageUploadProps } from './components/image-upload';
export { Pagination, type PaginationProps } from './components/pagination';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/tabs';
export {
  ToastProvider,
  useToast,
  type Toast,
  type ToastInput,
  type ToastVariant,
} from './components/toast';

// Hooks
export { useDisclosure } from './hooks/use-disclosure';
export { useDebounce } from './hooks/use-debounce';
export { usePagination, type UsePaginationOptions } from './hooks/use-pagination';
export { useUpload, type UseUploadOptions } from './hooks/use-upload';
