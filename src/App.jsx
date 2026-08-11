import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import DropZone from './components/DropZone';
import MetadataBar from './components/MetadataBar';
import Previewer from './components/Previewer';
import { SAMPLE_MARKDOWN } from './components/SampleMarkdown';

export default function App() {
  const [markdownText, setMarkdownText] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [theme, setTheme] = useState(() => {
    // Detect system preferred or localStorage theme
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('markview-theme');
      if (savedTheme) return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'preview' | 'raw'
  const [error, setError] = useState(null);

  const previewRef = useRef(null);

  // Synchronize dark class on document element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('markview-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleFileSelect = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      setMarkdownText(text || '');
      setFileName(file.name);
      setFileSize(file.size);
      setError(null);
    };

    reader.onerror = () => {
      setError('An error occurred while reading the file. Please try again.');
    };

    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    setMarkdownText(SAMPLE_MARKDOWN);
    setFileName('sample.md');
    setFileSize(SAMPLE_MARKDOWN.length);
    setError(null);
  };

  const handleReset = () => {
    setMarkdownText('');
    setFileName('');
    setFileSize(0);
    setError(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900 transition-colors duration-200 dark:bg-zinc-950 dark:text-zinc-100">
      {/* App Header */}
      <Header theme={theme} toggleTheme={toggleTheme} />

      {/* Main Workspace Area */}
      <main className="flex flex-1 flex-col min-h-0 overflow-hidden">
        {markdownText ? (
          // Success State - Show Markdown Viewer Dashboard
          <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
            {/* Metadata and Controls Header */}
            <MetadataBar
              fileName={fileName}
              fileSize={fileSize}
              markdownText={markdownText}
              viewMode={viewMode}
              setViewMode={setViewMode}
              previewRef={previewRef}
              onReset={handleReset}
            />

            {/* Split / Preview / Raw Panes Container */}
            <div className="flex flex-1 overflow-hidden min-h-0">
              {/* Raw Monospace Source Pane */}
              {(viewMode === 'raw' || viewMode === 'split') && (
                <div
                  className={`flex-1 flex flex-col overflow-hidden border-r border-zinc-200 dark:border-zinc-800 ${
                    viewMode === 'split' ? 'hidden md:flex' : 'flex'
                  }`}
                >
                  <label htmlFor="raw-md-textarea" className="sr-only">Raw Markdown Source Code</label>
                  <textarea
                    id="raw-md-textarea"
                    readOnly
                    value={markdownText}
                    className="w-full flex-1 p-6 font-mono text-xs md:text-sm leading-relaxed bg-zinc-50/50 dark:bg-zinc-900/20 text-zinc-700 dark:text-zinc-300 outline-none resize-none overflow-y-auto border-none focus:ring-0"
                    placeholder="Raw markdown text..."
                  />
                </div>
              )}

              {/* Rendered Preview Pane */}
              {(viewMode === 'preview' || viewMode === 'split') && (
                <div className="flex-1 overflow-y-auto min-w-0">
                  <Previewer markdownText={markdownText} previewRef={previewRef} />
                </div>
              )}
            </div>
          </div>
        ) : (
          // Empty State - Show Drag & Drop Area
          <div className="flex flex-1 items-center justify-center p-6 md:p-12 overflow-y-auto">
            <DropZone
              onFileSelect={handleFileSelect}
              onLoadSample={handleLoadSample}
              error={error}
              setError={setError}
            />
          </div>
        )}
      </main>
    </div>
  );
}
