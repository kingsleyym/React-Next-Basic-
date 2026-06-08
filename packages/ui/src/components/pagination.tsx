import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

export interface PaginationProps {
  page: number;
  pageCount: number;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

/** Prev/next pager. Drive it with the `usePagination` hook. */
export function Pagination({ page, pageCount, canPrev, canNext, onPrev, onNext }: PaginationProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Button variant="outline" size="sm" onClick={onPrev} disabled={!canPrev} leftIcon={<ChevronLeft size={16} />}>
        Prev
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {page} of {pageCount}
      </span>
      <Button variant="outline" size="sm" onClick={onNext} disabled={!canNext} rightIcon={<ChevronRight size={16} />}>
        Next
      </Button>
    </div>
  );
}
