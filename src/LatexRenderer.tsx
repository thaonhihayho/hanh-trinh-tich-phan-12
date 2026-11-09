import React, { useEffect, useState } from 'react';

interface LatexRendererProps {
  content: string;
  className?: string;
}

export const LatexRenderer: React.FC<LatexRendererProps> = ({
  content,
  className = '',
}) => {
  const [katexLoaded, setKatexLoaded] = useState<boolean>(
    Boolean((window as any).katex)
  );

  useEffect(() => {
    if ((window as any).katex) {
      setKatexLoaded(true);
      return;
    }
    const existingCss = document.querySelector('link[href*="katex.min.css"]');
    if (!existingCss) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href =
        'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css';
      document.head.appendChild(link);
    }
    const timer = setInterval(() => {
      if ((window as any).katex) {
        setKatexLoaded(true);
        clearInterval(timer);
      }
    }, 200);
    return () => clearInterval(timer);
  }, []);

  if (!content) return null;

  const renderMathTokens = (segment: string, keyPrefix: string) => {
    const katex = (window as any).katex;
    const tokens = segment.split(/(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/g);

    return tokens.map((token, tIdx) => {
      if (token.startsWith('$$') && token.endsWith('$$')) {
        const math = token.slice(2, -2).trim();
        if (katexLoaded && katex) {
          try {
            const html = katex.renderToString(math, {
              displayMode: true,
              throwOnError: false,
            });
            return (
              <span
                key={`${keyPrefix}-b-${tIdx}`}
                className="block my-2"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch {
            return <code key={`${keyPrefix}-b-${tIdx}`}>{token}</code>;
          }
        }
        return (
          <div
            key={`${keyPrefix}-b-${tIdx}`}
            className="font-mono text-indigo-800 my-1"
          >
            {math}
          </div>
        );
      }

      if (token.startsWith('$') && token.endsWith('$')) {
        const math = token.slice(1, -1).trim();
        if (katexLoaded && katex) {
          try {
            const html = katex.renderToString(math, {
              displayMode: false,
              throwOnError: false,
            });
            return (
              <span
                key={`${keyPrefix}-i-${tIdx}`}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch {
            return <code key={`${keyPrefix}-i-${tIdx}`}>{token}</code>;
          }
        }
        return (
          <span
            key={`${keyPrefix}-i-${tIdx}`}
            className="font-mono text-indigo-800"
          >
            {math}
          </span>
        );
      }

      return <span key={`${keyPrefix}-t-${tIdx}`}>{token}</span>;
    });
  };

  const renderFormattedText = (rawText: string) => {
    const paragraphs = rawText.split('\n');

    return paragraphs.map((para, pIdx) => {
      if (!para.trim()) return <div key={pIdx} className="h-2" />;

      // Xử lý in đậm **...** trước để bên trong **...** chứa công thức $...$ không bị lộ dấu **
      const boldSegments = para.split(/(\*\*[\s\S]+?\*\*)/g);

      return (
        <div key={pIdx} className="mb-1.5">
          {boldSegments.map((seg, sIdx) => {
            if (seg.startsWith('**') && seg.endsWith('**')) {
              const inner = seg.slice(2, -2);
              return (
                <strong key={sIdx} className="font-bold">
                  {renderMathTokens(inner, `${pIdx}-${sIdx}`)}
                </strong>
              );
            }
            return (
              <React.Fragment key={sIdx}>
                {renderMathTokens(seg, `${pIdx}-${sIdx}`)}
              </React.Fragment>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div
      className={`math-content ${className}`}
      style={{
        fontFamily: "'Times New Roman', Times, serif",
        fontSize: '12pt',
        lineHeight: 1.65,
      }}
    >
      {renderFormattedText(content)}
    </div>
  );
};
