"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full">
      {/* Left line */}
      <div className="flex-1 h-px bg-border" />

      {/* Pagination controls */}
      <div className="flex items-center gap-4 px-[93px]">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-10 h-10 rounded-full border border-border bg-bg flex items-center justify-center hover:bg-bg-subtle transition-colors disabled:opacity-30"
        >
          <ChevronLeft size={24} className="text-text-primary" />
        </button>

        {/* Page indicators — vertical bars */}
        <div className="flex items-center gap-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-0.5 rounded-full transition-all duration-200 ${
                page === currentPage
                  ? "h-10 bg-amber"
                  : "h-8 bg-cream hover:bg-brown-light"
              }`}
              aria-label={`Page ${page}`}
            />
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-10 h-10 rounded-full border border-border bg-bg flex items-center justify-center hover:bg-bg-subtle transition-colors disabled:opacity-30"
        >
          <ChevronRight size={24} className="text-text-primary" />
        </button>
      </div>

      {/* Right line */}
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}
