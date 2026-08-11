import { useState, useRef } from 'react';

export default function DropZone({ onFileSelect, onLoadSample, error, setError }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const validateAndProcessFile = (file) => {
    if (!file) return;

    // Verify it is a .md file
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'md' && file.type !== 'text/markdown') {
      setError('Invalid file type. Please upload a Markdown (.md) file.');
      return;
    }

    setError(null);
    onFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-4 md:py-8">
      {/* Drop Zone Box */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300 ${
          isDragActive
            ? 'border-brand-500 bg-brand-50/20 ring-4 ring-brand-500/10 dark:bg-brand-900/10'
            : 'border-zinc-300 bg-white hover:border-zinc-400 hover:bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".md"
          onChange={handleFileChange}
          className="hidden"
          id="markdown-file-input"
        />

        {/* Upload Icon */}
        <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-400 transition-colors group-hover:bg-zinc-100 group-hover:text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-500 dark:group-hover:bg-zinc-800 dark:group-hover:text-zinc-300 ${isDragActive ? 'bg-brand-50 text-brand-500 dark:bg-brand-950/30 dark:text-brand-400' : ''}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>

        <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Upload your Markdown file
        </h3>
        <p className="mb-6 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
          Drag and drop your <span className="font-mono bg-zinc-200/65 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs font-semibold text-zinc-700 dark:text-zinc-300">.md</span> file here, or click to browse.
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // Avoid triggering file select twice
            handleBrowseClick();
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-zinc-800 active:scale-95 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Browse Files
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 shrink-0"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Try a Sample Block */}
      <div className="mt-12 text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Don't have a Markdown file ready?
        </p>
        <button
          type="button"
          onClick={onLoadSample}
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
        >
          <span>Try a Sample Document</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
