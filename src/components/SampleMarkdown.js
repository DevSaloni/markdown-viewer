export const SAMPLE_MARKDOWN = `# MarkView - Premium Markdown Viewer

Welcome to **MarkView**, a modern, responsive frontend Markdown viewer! This editor tool lets you drop, browse, preview, and copy rendered Markdown seamlessly completely in your browser.

Here is a quick overview of all the Markdown styles supported.

## Text Formatting

You can write text with standard formatting:
- **Bold text** using double asterisks.
- *Italic text* using single asterisks.
- ~~Strikethrough text~~ using double tildes.
- \`Inline code\` with backticks.
- Combining them: **_Bold and Italic_** or ~~*Italic and Strikethrough*~~.

Here is a link to [MarkView on GitHub](https://github.com/vitejs/vite) (opens in a new tab).

---

## Lists Configuration

### Unordered Lists (with Nesting)
- Main Category A
  - Sub-category A.1
    - Detailed item A.1.a
    - Detailed item A.1.b
  - Sub-category A.2
- Main Category B
  - Sub-category B.1

### Ordered Lists
1. First step: Drag and drop a \`.md\` file
2. Second step: Preview the rendered markup
3. Third step: Copy the output to your clipboard
   1. Rich HTML version
   2. Plain text Markdown version

---

## Table Example

Below is a structured table showing rendering compatibility:

| Feature | Support | Performance | Responsive Scroll |
| :--- | :---: | :---: | :---: |
| React 19 Rendering | Yes | Fast | Yes |
| Custom Styles | Yes | Tailwind CSS v4 | Yes |
| Drag & Drop Area | Yes | HTML5 API | Yes |
| Light / Dark Toggle | Yes | Sync Classes | Yes |
| Multi-format Copy | Yes | Clipboard API | Yes |

---

## Blockquotes

> "Markdown is a text-to-HTML conversion tool for web writers. Markdown allows you to write using an easy-to-read, easy-to-write plain text format, then convert it to structurally valid XHTML (or HTML)."
> 
> — *John Gruber, creator of Markdown*

---

## Code Blocks

Here is a block of JavaScript code demonstrating the browser clipboard copy functionality:

\`\`\`javascript
async function copyToClipboard(markdownText, renderedHtml) {
  const htmlBlob = new Blob([renderedHtml], { type: 'text/html' });
  const plainBlob = new Blob([markdownText], { type: 'text/plain' });
  
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': htmlBlob,
        'text/plain': plainBlob
      })
    ]);
    console.log('Successfully copied in multiple formats!');
  } catch (error) {
    console.error('Clipboard write failed:', error);
  }
}
\`\`\`

Here is a CSS code snippet:

\`\`\`css
.prose-previewer pre {
  margin: 1.5rem 0;
  padding: 1rem;
  background-color: #1e1e2e;
  border-radius: 6px;
  overflow-x: auto;
}
\`\`\`
`;
