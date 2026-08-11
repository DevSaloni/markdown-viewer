import { useState } from 'react';

export default function MetadataBar({
  fileName,
  fileSize,
  markdownText,
  viewMode,
  setViewMode,
  previewRef,
  onReset,
}) {
  const [copied, setCopied] = useState(false);

  // Helper to format file size
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    if (!bytes) return 'Sample File';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Helper to compute stats
  const getStats = (text) => {
    if (!text) return { words: 0, time: 0 };
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const time = Math.max(1, Math.ceil(words / 200)); // ~200 words per minute reading speed
    return { words, time };
  };

  const { words, time } = getStats(markdownText);

  // Core multi-format clipboard write
  const handleCopy = async () => {
    if (!previewRef || !previewRef.current) {
      // Fallback if preview elements are missing
      try {
        await navigator.clipboard.writeText(markdownText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text', err);
      }
      return;
    }

    const htmlContent = previewRef.current.innerHTML;

    try {
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
      const textBlob = new Blob([markdownText], { type: 'text/plain' });
      const markdownBlob = new Blob([markdownText], { type: 'text/markdown' });

      const clipboardData = {
        'text/html': htmlBlob,
        'text/plain': textBlob,
      };

      try {
        clipboardData['text/markdown'] = markdownBlob;
        await navigator.clipboard.write([new ClipboardItem(clipboardData)]);
      } catch {
        // Fallback for browsers that don't support custom/markdown mime types
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': htmlBlob,
            'text/plain': textBlob,
          }),
        ]);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('ClipboardItem write failed, falling back to text copy:', err);
      try {
        await navigator.clipboard.writeText(markdownText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Copy fallback failed:', fallbackErr);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 border-b border-zinc-200 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50 sm:flex-row sm:items-center sm:justify-between">
      {/* File Info / Meta details */}
      <div className="flex flex-col gap-1.5 min-w-0">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4.5 w-4.5 text-zinc-500 dark:text-zinc-400 shrink-0"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <h2
            className="truncate text-sm font-semibold text-zinc-850 dark:text-zinc-100"
            title={fileName || 'Sample Markdown'}
          >
            {fileName || 'Sample Markdown'}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
          <span>{formatSize(fileSize)}</span>
          <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
          <span>{words.toLocaleString()} words</span>
          <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
          <span>~{time} min read</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Toggle Panel Mode (Hidden on small mobile screens since it will default to preview) */}
        <div className="hidden items-center rounded-lg bg-zinc-200/60 p-0.5 dark:bg-zinc-800 sm:flex">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
              viewMode === 'split'
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white'
                : 'text-zinc-650 hover:text-zinc-900 dark:text-zinc-450 dark:hover:text-zinc-200'
            }`}
          >
            Split
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
              viewMode === 'preview'
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white'
                : 'text-zinc-650 hover:text-zinc-900 dark:text-zinc-450 dark:hover:text-zinc-200'
            }`}
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => setViewMode('raw')}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
              viewMode === 'raw'
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white'
                : 'text-zinc-650 hover:text-zinc-900 dark:text-zinc-450 dark:hover:text-zinc-200'
            }`}
          >
            Raw Source
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all active:scale-95 ${
              copied
                ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-900/30 dark:bg-green-950/20 dark:text-green-400'
                : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white'
            }`}
          >
            {copied ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Copied</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>Copy Rich Text</span>
              </>
            )}
          </button>

          {/* Reset / Upload Another */}
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-red-600 active:scale-95 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-red-400"
            title="Upload a different markdown file"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M16 3h5v5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 21H3v-5" />
            </svg>
            <span className="hidden sm:inline">Upload New</span>
          </button>
        </div>
      </div>
    </div>
  );
}
