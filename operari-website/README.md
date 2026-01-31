6. Documentation (README.md)
A comprehensive guide to deploying the Operari website to your live environment.
Operational Deployment Guide - Operari Website
1. Overview
This document provides the technical specifications and deployment procedures for the Operari production website (www.operari.co.uk).
2. Technical Stack
•	Frontend: HTML5, CSS3, Vanilla JavaScript (ES6 Modules).
•	Styling: CSS3 with CSS Variables, Flexbox/Grid layout, Keyframe animations.
•	Graphics: HTML5 Canvas API.
•	**External Dependencies: None (Self-contained).
3. Project Structure
Organize your files into a standard web structure:

/operari-website
├── README.md                  # <-- Technical Documentation
├── package.json               # <-- Dependencies
├── index.html                 # <-- Main HTML
├── css/
│   ├── style.css              # <-- Global Styles
│   └── modules/
│       ├── _variables.css   # <-- CSS Variables
│       ├── _header.css       # <-- Header Styling
│       ├── _hero.css         # <-- Hero Styling
│       ├── _about.css        # <-- About Styling
│       ├── _products.css     # <-- Product Cards Styling
│       └── _contact.css      # <-- Contact Styling
└── js/
    ├── main.js                # <-- Core JavaScript
    ├── modules/                # <-- Modular JS (Optional, but recommended for refactoring)
    │   ├── particle-network.js
    │   ├── magnetic-btns.js
    │   └── scroll-observer.js
    └── utils.js                # <-- Helper functions
└── assets/                 # <-- Static assets
    └── images/                # <-- Local images if preferred

## 4. Installation

### Prerequisites
1.  **Node.js:** Recommended (for local testing with live-server).
2. **Web Server:** Nginx, Apache, or cPanel.
3. **Git:** Optional, for version control.
4. **FTP Client:** FileZilla, WinSCP, or Cyberduck.

### Steps to Deploy to Live Environment

#### Step 1: Upload Files
1.  Connect to your server via SFTP/FTP/File Manager.
2.  3. Upload all files from the provided `operari-website` folder.
3.  Ensure the folder structure is preserved.

#### Step 2: Configuration (Nginx Example)
If you are using Nginx, create a configuration file (e.g., `/etc/nginx/sites-available/www.operari.co.uk.conf`):

```nginx
server {
    listen 80;
    server_name www.operari.co.uk;
    root /var/www/www.operari.co.uk/public_html/; # Ensure this matches your server root
    index index.html;
    error_page /404.html;
    # Deny access to .git/svn
    allow 127.0.0.1;

    # Security Headers
    X-Content-Type-Options "nosniff";
    X-Frame-Options "SAMEORIGIN"; # Avoid clickjacking
    X-XSS-Protection "1; mode: block"; # Sanitize input
    Content-Security-Policy "script-src 'self'"; # Reduce attack surface
    X-Content-Security-Policy "script-src 'unsafe-inline'; # Allow inline scripts (canvas logic)
    X-X-XSS-Protection "1; mode=block"; # Sanitize output
    X-XSS-Protection "1; script-src 'unsafe-inline'; # Sanitize output
    X-Content-Security-Policy "script-src 'unsafe-inline'; # Allow inline scripts


Step 3: SSL/TLS (Secure HTTPS)
1.	1 Add your SSL certificate (operari.co.uk.crt) and key (operari.co.key) to your server.
2.	Configure Nginx to listen on port 443 (HTTPS).
3.	Reload Nginx.
Step 4: Test Live URL
1.	Visit https://www.operari.co.uk.
2.	Verify the particle animation and magnetic buttons work.
3.	Submit the contact form to ensure the email logic functions (simulated).
4.	Test the 3D Tilt Cards on mobile/desktop responsiveness.
5. Modularization & Maintenance
CSS Architecture
•	Variables: Defined in css/_variables.css for easy theming.
•	Component-Based CSS: Styles are grouped by section in css/ folder.
•	Naming Conventions: Use BEM notation (Block__Element--Modifier).
•	Responsiveness: Media queries in css/style.css.
JavaScript Architecture
•	IIFE (Immediately Invoked Function Expression): Prevents pollution of the global scope.
•	State Management: Configuration object in App holds references to DOM elements.
•	Debouncing: Applied to expensive events like mousemove to improve performance.
Debugging Tips
•	Developer Tools: Chrome DevTools (F12).
•	Console Logging: Check for JavaScript errors (Red text).
•	Network Tab: Disable caching (Empty cache and hard reload).
•	Canvas Rendering: Verify ctx.clearRect is working.
•	Magnetic Effect: Ensure button position is relative in CSS, not fixed.
6. Operational Considerations
Performance
•	Minification: Ensure all external images are compressed (jpg, webp) before uploading.
•	CDN: Consider using a CDN for assets (Images, Fonts, Icons) to reduce latency.
•	Lazy Loading: For larger datasets (if any) or future growth.
Security
•	Input Sanitization: All form inputs are sanitized via JS.
•	Email Exposure: The contact form uses mailto: for simplicity. In a production environment, consider a backend service to handle form submissions securely.
Stability
•	Browser Testing: Verify animations run smoothly across Chrome, Firefox, Safari, and Edge.
•	Backward Compatibility: ES6 features supported by modern browsers.
7. URL
Once deployed, access your site at: https://www.operari.co.uk ```


