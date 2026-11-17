# itwindia.com Corporate Website

Corporate website for **ITW India Private Limited** (https://itwindia.com), the Indian arm of Illinois Tool Works Inc. (ITW).

## Architecture & Tech Stack

Designed specifically for standard cPanel shared Linux hosting:
- **Zero server dependencies**: Plain HTML5, vanilla JavaScript (ES6), and single hand-written CSS file. No Node.js runtime required on the host.
- **Python Page Generator**: `build.py` compiles templates and data into deployable static pages inside `public/`.
- **Form Processing**: `public/contact.php` provides PHP 8 email delivery with honeypot spam protection and optional SMTP configuration.

## Directory Structure

```text
├── build.py                  Python 3 page generator (HTML templates, sitemap, robots)
├── segments_data.py          Business segment data for the 7 ITW divisions
├── content/
│   └── privacy-statement.html Privacy Policy source text
├── tools/
│   ├── optimize_images.py    Generates WebP + progressive JPEGs (<700KB total budget)
│   ├── prepare_images.py     Original image preparation utility
│   └── fetch_itw_images.py   Asset retrieval script
├── docs/
│   └── IMAGE_LIST.md         Inventory of web-ready assets and budgets
└── public/                   Deployable directory for cPanel (public_html)
    ├── *.html                17 generated static pages
    ├── assets/
    │   ├── css/style.css     Styles and brand animations
    │   ├── js/main.js        Interactions, counters, donut charts, marquee, contact form
    │   └── img/              Optimized WebP, JPEG and PNG assets
    ├── contact.php           Enquiry form handler (honeypot + PHP mail/SMTP)
    ├── config.sample.php     Sample configuration for contact form
    ├── .htaccess             HTTPS redirects, canonical non-www, browser caching
    ├── sitemap.xml           XML Sitemap with lastmod timestamps
    └── robots.txt            Robots directives
```

## Build and Image Optimization

### 1. Optimize Assets
Requires Python 3 and Pillow:
```bash
pip install pillow
python tools/optimize_images.py
```
Enforces size constraints:
- Hero images: <= 120 KB
- Tiles & cards: <= 60 KB
- Total `assets/img/` folder: < 700 KB

### 2. Generate Pages
```bash
python build.py
```
Generates 17 static HTML pages, `sitemap.xml`, and `robots.txt` into `public/`.

## Deployment to GoDaddy cPanel

1. Upload the entire contents of `public/` into `public_html` via FTP or cPanel File Manager.
2. Enable "Show Hidden Files" in File Manager to ensure `.htaccess` is uploaded.
3. Copy `config.sample.php` to `config.php` inside `public_html/` and update `$cfg['to']` to `info@itwindia.com` (or set custom SMTP credentials).
4. Verify SSL padlock (HTTPS) and submit a test enquiry via the Contact form.
