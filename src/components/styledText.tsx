import React from 'react';

const StyledText = ({ text }) => {
    return (
        <div>
            <style>
                {`
/* Headings */
.styled-text h1 {
  font-size: 2rem;
  margin-top: 1.5em;
  margin-bottom: 0.6em;
  color: #222;
  border-bottom: 2px solid #eaeaea;
  padding-bottom: 0.3em;
}

.styled-text h2 {
  font-size: 1.6rem;
  margin-top: 1.3em;
  margin-bottom: 0.5em;
  color: #333;
}

.styled-text h3 {
  font-size: 1.3rem;
  margin-top: 1.1em;
  margin-bottom: 0.4em;
  color: #444;
}

/* Paragraphs */
.styled-text p {
  margin: 0.5em 0 1em;
}

/* Lists */
.styled-text ul,
.styled-text ol {
  margin: 0.8em 0 1em 2em;
}

.styled-text li {
  margin-bottom: 0.4em;
}

/* Links */
.styled-text a {
  color: #007bff;
  text-decoration: none;
  border-bottom: 1px dotted #007bff;
}

.styled-text a:hover {
  text-decoration: underline;
}

/* Inline code */
.styled-text code {
  background-color: #f5f5f5;
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
  color: #d63384;
  font-size: 0.95em;
}

/* Code blocks */
.styled-text pre {
  background-color: #1e1e1e;
  color: #e4e4e4;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Fira Code', monospace;
  margin: 1.5em 0;
  font-size: 0.9rem;
}

/* Highlighting keywords (optional basic syntax) */
.styled-text pre code .keyword {
  color: #569cd6;
}
.styled-text pre code .string {
  color: #ce9178;
}
.styled-text pre code .function {
  color: #dcdcaa;
}

/* Blockquotes */
.styled-text blockquote {
  border-left: 4px solid #ccc;
  margin: 1em 0;
  padding-left: 1em;
  color: #666;
  font-style: italic;
}

/* Horizontal rules */
.styled-text hr {
  border: none;
  border-top: 1px solid #ddd;
  margin: 2em 0;
}

        `}
            </style>
            <div className="styled-text" dangerouslySetInnerHTML={{ __html: text }} />
        </div>
    );
};

export default StyledText;
