import React, { useEffect, useState } from 'react';

interface FileContent {
  type: 'text' | 'image';
  content?: string;
  url?: string;
  mimeType?: string;
  size?: number;
}

interface PreviewProps {
  fileMap: Record<string, FileContent>;
  mainHtmlPath: string | null;
}

const Preview: React.FC<PreviewProps> = ({ fileMap, mainHtmlPath }) => {
  const [processedHtml, setProcessedHtml] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Helper function to process image URLs in content
  const processImageUrls = (content: string): string => {
    // Process CSS url() patterns
    content = content.replace(/url\(['"]?([^'"()]+)['"]?\)/g, (match, url) => {
      const normalizedPath = url.startsWith('./') ? url : `./${url}`;
      const fileContent = fileMap[normalizedPath];

      if (fileContent) {
        if (fileContent.type === 'image' && fileContent.url) {
          return `url("${fileContent.url}")`;
        } else if (fileContent.type === 'text' && fileContent.content) {
          const base64 = btoa(fileContent.content);
          const mimeType = getMimeType(normalizedPath);
          return `url("data:${mimeType};base64,${base64}")`;
        }
      }
      return match; // Keep original if not found
    });

    // Process JavaScript string literals that might contain image paths
    content = content.replace(
      /(['"])(\.\/[^'"]+\.(png|jpg|jpeg|gif|svg))(['"])/g,
      (match, quote1, path, ext, quote2) => {
        const normalizedPath = path.startsWith('./') ? path : `./${path}`;
        const fileContent = fileMap[normalizedPath];

        if (fileContent) {
          if (fileContent.type === 'image' && fileContent.url) {
            return `${quote1}${fileContent.url}${quote2}`;
          } else if (fileContent.type === 'text' && fileContent.content) {
            const base64 = btoa(fileContent.content);
            const mimeType = getMimeType(normalizedPath);
            return `${quote1}data:${mimeType};base64,${base64}${quote2}`;
          }
        }
        return match; // Keep original if not found
      }
    );

    return content;
  };

  useEffect(() => {
    if (!mainHtmlPath || !fileMap[mainHtmlPath]) {
      setError('No HTML file selected or file not found');
      return;
    }

    try {
      // Create a temporary DOM element to parse the HTML
      const parser = new DOMParser();
      const htmlContent = fileMap[mainHtmlPath].content || '';
      const doc = parser.parseFromString(htmlContent, 'text/html');

      // Process CSS files
      const cssLinks = doc.querySelectorAll('link[rel="stylesheet"]');
      cssLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href) {
          // Handle relative paths
          const normalizedPath = href.startsWith('./') ? href : `./${href}`;
          const fileContent = fileMap[normalizedPath];
          if (fileContent && fileContent.type === 'text' && fileContent.content) {
            const style = document.createElement('style');
            // Process image URLs in CSS content
            style.textContent = processImageUrls(fileContent.content);
            link.parentNode?.replaceChild(style, link);
          } else {
            console.warn(`CSS file not found: ${normalizedPath}`);
          }
        }
      });

      // Process script files
      const scripts = doc.querySelectorAll('script[src]');
      scripts.forEach((script) => {
        const src = script.getAttribute('src');
        if (src) {
          // Handle relative paths
          const normalizedPath = src.startsWith('./') ? src : `./${src}`;
          const fileContent = fileMap[normalizedPath];
          if (fileContent && fileContent.type === 'text' && fileContent.content) {
            const inlineScript = document.createElement('script');
            // Process image URLs in JavaScript content
            inlineScript.textContent = processImageUrls(fileContent.content);
            script.parentNode?.replaceChild(inlineScript, script);
          } else {
            console.warn(`Script file not found: ${normalizedPath}`);
          }
        }
      });

      // Process image sources
      const images = doc.querySelectorAll('img[src]');
      images.forEach((img) => {
        const src = img.getAttribute('src');
        if (src) {
          // Handle relative paths
          const normalizedPath = src.startsWith('./') ? src : `./${src}`;
          const fileContent = fileMap[normalizedPath];

          if (fileContent) {
            if (fileContent.type === 'image' && fileContent.url) {
              // Use the image URL directly if available
              img.setAttribute('src', fileContent.url);
            } else if (fileContent.type === 'text' && fileContent.content) {
              // Convert text content to base64 for legacy support
              const base64 = btoa(fileContent.content);
              const mimeType = getMimeType(normalizedPath);
              img.setAttribute('src', `data:${mimeType};base64,${base64}`);
            }
          } else {
            // If the image is not in fileMap, keep the original src
            // This allows external images to still work
            console.warn(`Image file not found in sandbox: ${normalizedPath}, using original src`);
          }
        }
      });

      setProcessedHtml(doc.documentElement.outerHTML);
      setError(null);
    } catch (err) {
      setError('Error processing HTML file');
      console.error('Error processing HTML:', err);
    }
  }, [fileMap, mainHtmlPath]);

  // Helper function to determine MIME type based on file extension
  const getMimeType = (path: string): string => {
    const extension = path.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'gif':
        return 'image/gif';
      case 'svg':
        return 'image/svg+xml';
      default:
        return 'application/octet-stream';
    }
  };

  if (error) {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-auto overflow-hidden bg-white">
      <iframe
        key={processedHtml} // Add key to force iframe refresh when content changes
        srcDoc={processedHtml}
        title="preview"
        className="h-full w-full flex-auto overflow-hidden border-0"
        sandbox="allow-scripts allow-same-origin allow-modals"
      />
    </div>
  );
};

export default Preview;
