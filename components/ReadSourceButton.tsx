import React from "react";
import { Citation } from "@/lib/db/schema";

interface ReadSourceButtonProps {
  citations: Citation[];
  onOpenSource: (url: string) => void;
  className?: string;
}

/**
 * Button that shows when user gets a question wrong
 * Opens the specific URL that You.com used to generate the answer
 */
export function ReadSourceButton({
  citations,
  onOpenSource,
  className = "",
}: ReadSourceButtonProps) {
  if (!citations || citations.length === 0) {
    return null;
  }

  // Use the first citation as the primary source
  const primarySource = citations[0];

  return (
    <div className={`space-y-2 ${className}`}>
      <button
        onClick={() => onOpenSource(primarySource.url)}
        className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-lg group-hover:scale-110 transition-transform">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
          </div>

          <div className="text-left">
            <div className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              Read Source
            </div>
            <div className="text-xs text-blue-600/70 dark:text-blue-400/70 line-clamp-1">
              {primarySource.title}
            </div>
          </div>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
          />
        </svg>
      </button>

      {/* Additional citations */}
      {citations.length > 1 && (
        <div className="text-xs text-gray-600 dark:text-gray-400">
          <details className="cursor-pointer">
            <summary className="hover:text-blue-600 dark:hover:text-blue-400">
              + {citations.length - 1} more source
              {citations.length > 2 ? "s" : ""}
            </summary>
            <ul className="mt-2 space-y-1 pl-4">
              {citations.slice(1).map((citation, index) => (
                <li key={index}>
                  <button
                    onClick={() => onOpenSource(citation.url)}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-left"
                  >
                    {citation.title}
                  </button>
                </li>
              ))}
            </ul>
          </details>
        </div>
      )}
    </div>
  );
}
