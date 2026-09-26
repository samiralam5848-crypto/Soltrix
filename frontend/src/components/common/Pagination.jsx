import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function Pagination({ currentPage = 1, totalPages = 1, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-4 py-8">
      <button
        disabled={currentPage <= 1}
        onClick={() => onPageChange && onPageChange(currentPage - 1)}
        className="nike-btn-white flex items-center space-x-1.5 py-2 px-3 text-xs disabled:opacity-40 cursor-pointer"
        aria-label="Previous Page"
      >
        <ArrowLeft size={14} />
        <span>Prev</span>
      </button>

      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">
        Page {currentPage} of {totalPages}
      </span>

      <button
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange && onPageChange(currentPage + 1)}
        className="nike-btn-white flex items-center space-x-1.5 py-2 px-3 text-xs disabled:opacity-40 cursor-pointer"
        aria-label="Next Page"
      >
        <span>Next</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
