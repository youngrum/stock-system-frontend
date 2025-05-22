import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center mt-6 gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="disabled:text-gray-400"
      >
        <ChevronLeft />
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index)}
          disabled={index === currentPage}
          className={`px-3 py-1 border rounded ${
            index === currentPage ? "text-gray-400 bg-gray-100" : "hover:bg-gray-200"
          }`}
        >
          {index + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="disabled:text-gray-400"
      >
        <ChevronRight />
      </button>
    </div>
  );
}
