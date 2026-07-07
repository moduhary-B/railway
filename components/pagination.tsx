'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  className = '' 
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const delta = 2; // Количество страниц вокруг текущей

    // Всегда показываем первую страницу
    pages.push(1);

    // Если есть разрыв между первой страницей и началом диапазона
    if (currentPage - delta > 2) {
      pages.push('...');
    }

    // Добавляем страницы вокруг текущей
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      pages.push(i);
    }

    // Если есть разрыв между концом диапазона и последней страницей
    if (currentPage + delta < totalPages - 1) {
      pages.push('...');
    }

    // Всегда показываем последнюю страницу (если она не первая)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Кнопка "Предыдущая" */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="border-[#c9a86e]/30 text-gray-300 hover:bg-[#c9a86e]/10 hover:border-[#c9a86e]/50 disabled:opacity-50"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {/* Номера страниц */}
      {visiblePages.map((page, index) => (
        <div key={index}>
          {page === '...' ? (
            <span className="px-3 py-2 text-gray-400">...</span>
          ) : (
            <Button
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page as number)}
              className={
                currentPage === page
                  ? "bg-gradient-to-r from-[#c9a86e] to-[#d4b876] text-[#0e1720] font-semibold"
                  : "border-[#c9a86e]/30 text-gray-300 hover:bg-[#c9a86e]/10 hover:border-[#c9a86e]/50"
              }
            >
              {page}
            </Button>
          )}
        </div>
      ))}

      {/* Кнопка "Следующая" */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="border-[#c9a86e]/30 text-gray-300 hover:bg-[#c9a86e]/10 hover:border-[#c9a86e]/50 disabled:opacity-50"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
} 