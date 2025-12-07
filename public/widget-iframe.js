/**
 * Universal Donation Widget
 * Embeds the actual donation component via iframe
 * 
 * Usage:
 * <script src="https://yourdomain.com/widget.js"></script>
 * 
 * Optional methods:
 * DonationWidget.open()
 * DonationWidget.close()
 * DonationWidget.setTheme('light' | 'dark')
 */

(function() {
  'use strict';

  // Auto-detect the widget's base URL from the script tag
  const currentScript = document.currentScript || document.querySelector('script[src*="widget.js"]');
  const WIDGET_BASE_URL = currentScript 
    ? new URL(currentScript.src).origin 
    : 'http://localhost:3000';

  class DonationWidget {
    constructor() {
      this.isOpen = false;
      this.container = null;
      this.shadowRoot = null;
      this.theme = 'light';
      this.observer = null;
      
      this.init();
    }

    init() {
      this.createButton();
      this.setupThemeDetection();
    }

    detectTheme() {
      const hasDarkClass = document.documentElement.classList.contains('dark') ||
                          document.body.classList.contains('dark');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return hasDarkClass || prefersDark ? 'dark' : 'light';
    }

    setupThemeDetection() {
      this.theme = this.detectTheme();
      
      this.observer = new MutationObserver(() => {
        const newTheme = this.detectTheme();
        if (newTheme !== this.theme) {
          this.theme = newTheme;
          this.updateTheme();
        }
      });
      
      this.observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
      
      this.observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
      });
      
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        this.theme = e.matches ? 'dark' : 'light';
        this.updateTheme();
      });
    }

    updateTheme() {
      if (this.shadowRoot) {
        const iframe = this.shadowRoot.querySelector('iframe');
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({ 
            type: 'SET_THEME', 
            theme: this.theme 
          }, WIDGET_BASE_URL);
        }
      }
    }

    createButton() {
      const appendButton = () => {
        this.container = document.createElement('div');
        this.container.id = 'donation-widget-container';
        this.shadowRoot = this.container.attachShadow({ mode: 'open' });
        
        const style = document.createElement('style');
        style.textContent = this.getStyles();
        this.shadowRoot.appendChild(style);
        
        const button = document.createElement('button');
        button.className = 'donation-button';
        button.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        `;
        button.onclick = () => this.open();
        
        this.shadowRoot.appendChild(button);
        document.body.appendChild(this.container);
      };
      
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', appendButton);
      } else {
        appendButton();
      }
    }

    getStyles() {
      return `
        .donation-button {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, box-shadow 0.2s;
          z-index: 9998;
        }
        
        .donation-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.2s;
          padding: 16px;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .modal-wrapper {
          background: transparent;
          border-radius: 16px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          animation: slideUp 0.3s;
          position: relative;
          overflow: hidden;
        }
        
        .close-button {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(0, 0, 0, 0.5);
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          z-index: 10000;
          transition: background 0.2s;
        }
        
        .close-button:hover {
          background: rgba(0, 0, 0, 0.7);
        }
        
        iframe {
          width: 100%;
          height: 85vh;
          max-height: 700px;
          border: none;
          border-radius: 16px;
          display: block;
          background: white;
        }
      `;
    }

    createModal() {
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.onclick = (e) => {
        if (e.target === overlay) this.close();
      };
      
      const wrapper = document.createElement('div');
      wrapper.className = 'modal-wrapper';
      
      const closeBtn = document.createElement('button');
      closeBtn.className = 'close-button';
      closeBtn.innerHTML = '&times;';
      closeBtn.onclick = () => this.close();
      
      const iframe = document.createElement('iframe');
      iframe.src = `${WIDGET_BASE_URL}/widget?theme=${this.theme}`;
      iframe.allow = 'clipboard-write';
      iframe.title = 'Donation Widget';
      
      // Send theme updates to iframe
      iframe.onload = () => {
        iframe.contentWindow.postMessage({ 
          type: 'SET_THEME', 
          theme: this.theme 
        }, WIDGET_BASE_URL);
      };
      
      wrapper.appendChild(closeBtn);
      wrapper.appendChild(iframe);
      overlay.appendChild(wrapper);
      
      return overlay;
    }

    open() {
      if (this.isOpen) return;
      
      const modalOverlay = this.createModal();
      this.shadowRoot.appendChild(modalOverlay);
      this.isOpen = true;
    }

    close() {
      const overlay = this.shadowRoot.querySelector('.modal-overlay');
      if (overlay) {
        overlay.remove();
        this.isOpen = false;
      }
    }

    setTheme(theme) {
      if (theme === 'light' || theme === 'dark') {
        this.theme = theme;
        this.updateTheme();
      }
    }

    destroy() {
      if (this.observer) {
        this.observer.disconnect();
      }
      if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }
    }
  }

  // Initialize widget after DOM is ready
  function initWidget() {
    const widgetInstance = new DonationWidget();
    
    // Expose global API
    window.DonationWidget = {
      open: () => widgetInstance.open(),
      close: () => widgetInstance.close(),
      setTheme: (theme) => widgetInstance.setTheme(theme),
      destroy: () => widgetInstance.destroy()
    };
  }

  // Check if DOM is already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
