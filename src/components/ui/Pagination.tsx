import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number; // 表示する最大ページ数
};

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  maxVisiblePages = 7 
}: Props) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    // 総ページ数が最大表示数以下の場合は全て表示
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    const halfVisible = Math.floor(maxVisiblePages / 2);
    let start = Math.max(0, currentPage - halfVisible);
    const end = Math.min(totalPages - 1, start + maxVisiblePages - 1);

    // 末尾の調整
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(0, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();
  const showStartEllipsis = visiblePages[0] > 0;
  const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages - 1;

  return (
    <div className="flex justify-center items-center mt-6 gap-1">
      {/* 前へボタン */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="p-2 rounded disabled:text-gray-400 hover:bg-gray-100 disabled:hover:bg-transparent"
        aria-label="前のページ"
      >
        <ChevronLeft size={20} />
      </button>

      {/* 最初のページ */}
      {showStartEllipsis && (
        <>
          <button
            onClick={() => onPageChange(0)}
            className="px-3 py-2 rounded hover:bg-gray-100 min-w-[40px]"
          >
            1
          </button>
          <span className="px-2 text-gray-500">...</span>
        </>
      )}

      {/* 表示ページ */}
      {visiblePages.map((pageIndex) => (
        <button
          key={pageIndex}
          onClick={() => onPageChange(pageIndex)}
          disabled={pageIndex === currentPage}
          className={`px-3 py-2 rounded min-w-[40px] ${
            pageIndex === currentPage
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          {pageIndex + 1}
        </button>
      ))}

      {/* 最後のページ */}
      {showEndEllipsis && (
        <>
          <span className="px-2 text-gray-500">...</span>
          <button
            onClick={() => onPageChange(totalPages - 1)}
            className="px-3 py-2 rounded hover:bg-gray-100 min-w-[40px]"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* 次へボタン */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="p-2 rounded disabled:text-gray-400 hover:bg-gray-100 disabled:hover:bg-transparent"
        aria-label="次のページ"
      >
        <ChevronRight size={20} />
      </button>

      {/* ページ情報表示 */}
      <div className="ml-4 text-sm text-gray-600">
        {currentPage + 1} / {totalPages} ページ
      </div>
    </div>
  );
}