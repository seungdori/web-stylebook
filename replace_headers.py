import os
import re

# The CSS to add to global-themes.css
global_css = """
/* --------------------------------------------------------
   Global Navigation Header Styles
   -------------------------------------------------------- */
body {
  padding-top: 56px !important;
}

.skip-link {
  position: fixed;
  top: -100%;
  left: 16px;
  z-index: 10000;
  background: #09090b;
  color: #fff;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: top 0.2s ease;
}

.skip-link:focus,
.skip-link:focus-visible {
  top: 16px;
}

[id] {
  scroll-margin-top: 72px;
}

.site-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(244, 244, 245, 0.9);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  padding: 0 24px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.site-nav__inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
}

.site-nav__logo {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  color: #09090b;
  text-decoration: none;
  letter-spacing: -0.02em;
}

.site-nav__links {
  display: flex;
  gap: 16px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.site-nav__links a {
  color: #71717a;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 9999px;
  transition: color 0.2s ease, background 0.2s ease;
}

.site-nav__links a:hover,
.site-nav__links a:focus-visible {
  color: #09090b;
  background: rgba(0, 0, 0, 0.05);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.03);
  color: #71717a;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  padding: 0;
  font-family: inherit;
}

.theme-toggle:hover {
  border-color: rgba(0, 0, 0, 0.14);
  color: #09090b;
  background: rgba(0, 0, 0, 0.06);
  transform: rotate(15deg);
}

.lang-dropdown {
  position: relative;
  flex-shrink: 0;
}

.lang-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 36px;
  padding: 0 12px;
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.03);
  color: #71717a;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.lang-toggle::after {
  content: '';
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid currentColor;
  margin-left: 2px;
  transition: transform 0.2s;
}

.lang-dropdown.open .lang-toggle::after {
  transform: rotate(180deg);
}

.lang-toggle:hover {
  border-color: rgba(0, 0, 0, 0.14);
  color: #09090b;
  background: rgba(0, 0, 0, 0.06);
}

.lang-menu {
  display: none;
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 130px;
  padding: 6px;
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  z-index: 10001;
  list-style: none;
  margin: 0;
}

.lang-dropdown.open .lang-menu {
  display: block;
  animation: langFadeIn 0.15s ease;
}

.lang-menu li {
  margin: 0;
}

.lang-menu button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #71717a;
  font-family: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
}

.lang-menu button:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #09090b;
}

.lang-menu button.active {
  color: #09090b;
  font-weight: 600;
}

.lang-menu button.active::before {
  content: '✓';
  font-size: 0.75rem;
}

@keyframes langFadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
"""

with open('assets/global-themes.css', 'r') as f:
    text = f.read()

if "Global Navigation Header Styles" not in text:
    with open('assets/global-themes.css', 'a') as f:
        f.write(global_css)


def get_nav_html(is_root):
    prefix = "." if is_root else ".."
    pages_prefix = "./pages" if is_root else "."
    
    return f"""  <a class="skip-link" href="#main-content" data-i18n="skip">Skip to content</a>

  <nav class="site-nav" role="navigation" aria-label="Main navigation">
    <div class="site-nav__inner">
      <a class="site-nav__logo" href="{prefix}/index.html">Web Stylebook</a>
      <ul class="site-nav__links">
        <li><a href="{prefix}/index.html#styles" data-i18n="nav.styles">스타일</a></li>
        <li><a href="{pages_prefix}/compare.html" data-i18n="nav.compare">스타일 비교</a></li>
        <li><a href="{pages_prefix}/color-system.html" data-i18n="nav.tips">색상 조합</a></li>
        <li><a href="{pages_prefix}/prompt-workflow.html" data-i18n="nav.workflow">프롬프트 생성기</a></li>
        <li><a href="{pages_prefix}/prompt-tips.html" data-i18n="nav.more-tips">팁</a></li>
      </ul>
      <div class="nav-actions">
        <div class="lang-dropdown" id="lang-dropdown">
          <button class="lang-toggle" id="lang-toggle" data-i18n-aria="lang.toggle.aria"
            aria-label="Switch language">English</button>
          <ul class="lang-menu" role="menu">
            <li><button role="menuitem" data-lang-select="en">English</button></li>
            <li><button role="menuitem" data-lang-select="ko">한국어</button></li>
            <li><button role="menuitem" data-lang-select="ja">日本語</button></li>
          </ul>
        </div>
        <button class="theme-toggle" id="global-theme-reset" aria-label="Reset Global Theme" data-color="Reset Global Theme"
          title="Reset Global Theme">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      </div>
    </div>
  </nav>"""

nav_regex = re.compile(r'<nav class="site-nav"[^>]*>.*?</nav>?', re.DOTALL)
header_top_regex = re.compile(r'<header class="top"[^>]*>.*?</header>', re.DOTALL)
skip_link_regex = re.compile(r'<a class="skip-link"[^>]*>.*?</a>\s*', re.DOTALL)
page_back_link_regex = re.compile(r'<a class="page-back-link".*?</a>\n?', re.DOTALL)

def process_file(filepath):
    is_root = os.path.dirname(filepath) == '.' or os.path.dirname(filepath) == '' or os.path.dirname(filepath).endswith('showcase')
    try:
        with open(filepath, 'r') as f:
            content = f.read()

        original_content = content
        nav_html = get_nav_html(is_root)
        
        # Remove old skip-link if exists (to be replaced with new one inside nav_html)
        content = skip_link_regex.sub('', content)
        
        # Remove legacy back button on subpages
        content = page_back_link_regex.sub('', content)

        if re.search(nav_regex, content):
            content = nav_regex.sub(nav_html, content)
        elif re.search(header_top_regex, content):
            content = header_top_regex.sub(nav_html, content)
        else:
            # If neither is found, inject after <body> tags
            # Special case to ignore test copy files
            if 'test_copy' in filepath: return
            content = re.sub(r'(<body[^>]*>)', r'\1\n' + nav_html, content)
            
        if content != original_content:
            with open(filepath, 'w') as f:
                f.write(content)
            print(f"Updated {filepath}")
    except PermissionError:
        print(f"Permission denied for {filepath}")

for root, dirs, files in os.walk('.'):
    # skip node_modules, etc
    if 'node_modules' in root or '.git' in root:
        continue
    for file in files:
        if file.endswith('.html'):
            process_file(os.path.join(root, file))

