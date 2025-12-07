/**
 * Server-side API route to serve the donation widget as an embeddable iframe
 * This allows the widget to use the actual Next.js component
 */

import { NextResponse } from "next/server";

export async function GET() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      overflow: hidden; 
      background: transparent;
    }
  </style>
</head>
<body>
  <div id="widget-root"></div>
  <script>
    // Communicate with parent window
    window.parent.postMessage({ type: 'WIDGET_READY' }, '*');
    
    // Listen for theme changes from parent
    window.addEventListener('message', (event) => {
      if (event.data.type === 'SET_THEME') {
        document.documentElement.classList.toggle('dark', event.data.theme === 'dark');
      }
    });
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
