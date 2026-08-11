import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Robust React Error Boundary to capture and display rendering errors gracefully
class MarkdownErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Markdown parser/renderer exception:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/30 p-8 text-center dark:border-red-900/30 dark:bg-red-950/10">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3 className="mb-2 text-md font-semibold text-red-900 dark:text-red-200">
            Parsing Error
          </h3>
          <p className="max-w-md text-xs text-red-600 dark:text-red-400">
            We encountered an issue rendering this file. Ensure the Markdown is correctly structured and doesn't contain malformed formatting.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Custom Component to handle individual code block copying and state feedback
function CodeBlock({ className, children, ...props }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text';

  const handleCopy = async () => {
    const codeText = typeof children === 'string'
      ? children
      : Array.isArray(children)
        ? children.map(child => typeof child === 'string' ? child : '').join('')
        : String(children);

    try {
      await navigator.clipboard.writeText(codeText.replace(/\n$/, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code block:', err);
    }
  };

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-950 dark:border-zinc-850 dark:bg-zinc-900 shadow-sm">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-zinc-200/50 bg-zinc-50/50 px-4 py-2 dark:border-zinc-800/80 dark:bg-zinc-950/80">
        <span className="font-mono text-xs font-semibold text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
          {language}
        </span>
        <button
          onClick={handleCopy}
          type="button"
          className={`transition-colors p-1 rounded hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 ${
            copied ? 'text-green-500' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
          }`}
          title={copied ? 'Copied!' : 'Copy Code'}
        >
          {copied ? (
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
          ) : (
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
          )}
        </button>
      </div>
      {/* Pre container */}
      <div className="overflow-x-auto p-4">
        <pre className="font-mono text-sm leading-relaxed text-zinc-850 dark:text-zinc-150">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    </div>
  );
}

export default function Previewer({ markdownText, previewRef }) {
  // Custom element renderers for Tailwind integration & scrollability
  const customRenderers = {
    // Wrap tables in responsive horizontal-scroll container
    table: (props) => {
      const cleanProps = { ...props };
      delete cleanProps.node;
      return (
        <div className="w-full overflow-x-auto my-6 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm">
          <table className="min-w-full" {...cleanProps} />
        </div>
      );
    },
    // Render custom code blocks and inline code
    code: (props) => {
      const cleanProps = { ...props };
      delete cleanProps.node;
      const { className, children } = props;
      const isInline = !className;

      if (isInline) {
        return (
          <code
            className="px-1.5 py-0.5 rounded bg-zinc-150 text-red-600 dark:bg-zinc-800 dark:text-rose-300 font-mono text-xs font-medium"
            {...cleanProps}
          >
            {children}
          </code>
        );
      }

      return <CodeBlock className={className} {...cleanProps}>{children}</CodeBlock>;
    },
    // Standard target="_blank" safety implementation for hyperlinks
    a: (props) => {
      const cleanProps = { ...props };
      delete cleanProps.node;
      const { href, children } = props;
      const isExternal = href && (href.startsWith('http://') || href.startsWith('https://'));
      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          {...cleanProps}
        >
          {children}
        </a>
      );
    },
  };

  return (
    <div className="h-full w-full bg-white px-6 py-6 transition-colors dark:bg-zinc-950 sm:px-8">
      <MarkdownErrorBoundary>
        <div ref={previewRef} className="prose-previewer w-full max-w-4xl mx-auto">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={customRenderers}
          >
            {markdownText}
          </ReactMarkdown>
        </div>
      </MarkdownErrorBoundary>
    </div>
  );
}
