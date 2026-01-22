import React from "react";

interface LiveSourceBadgeProps {
  sourceUrl: string;
  className?: string;
}

/**
 * Badge that displays the source domain of the generated content
 * Shows "Generated from [domain]" with a live indicator
 */
export function LiveSourceBadge({
  sourceUrl,
  className = "",
}: LiveSourceBadgeProps) {
  // Extract domain from URL
  const getDomain = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace("www.", "");
    } catch {
      return "unknown source";
    }
  };

  const domain = getDomain(sourceUrl);

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 ${className}`}
    >
      {/* Live indicator pulse */}
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </div>

      <span className="text-xs font-medium text-green-700 dark:text-green-300">
        Generated from{" "}
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          {domain}
        </span>
      </span>
    </div>
  );
}
