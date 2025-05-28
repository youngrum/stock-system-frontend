// components/Loader.tsx
export default function Loader() {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0d113d] opacity-70 z-50">
        <div className="flex flex-col items-center">
          {/* SVG Spinner */}
          <svg
            className="animate-spin w-16 h-16"
            viewBox="0 0 50 50"
          >
            <defs>
              <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3D00B8" />
                <stop offset="100%" stopColor="#3070C3" />
              </linearGradient>
            </defs>
            <circle
              cx="25"
              cy="25"
              r="20"
              stroke="url(#spinner-gradient)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
          <span className="mt-4 text-lg font-semibold text-white drop-shadow">
            ローディング中...
          </span>
        </div>
      </div>
    );
  }
  