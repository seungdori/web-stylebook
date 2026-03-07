// Mobile hamburger menu toggle (guard against duplicate bindings)
(() => {
  const burger = document.getElementById('nav-burger');
  const navLinks = document.querySelector('.site-nav__links');
  if (!burger || !navLinks || burger._burgerInit) return;
  burger._burgerInit = true;

  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.site-nav__inner')) {
      navLinks.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
})();

(() => {
  const copyButtons = document.querySelectorAll('[data-copy-target]');
  const fallbackCopyText = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);

    // iOS Safari requires range selection
    const isIOS = navigator.userAgent.match(/ipad|iphone/i);
    if (isIOS) {
      const target = document.createRange();
      target.selectNodeContents(textarea);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(target);
      textarea.setSelectionRange(0, 999999);
    } else {
      textarea.select();
    }

    try {
      const copied = document.execCommand('copy');
      if (!copied) {
        throw new Error('Clipboard copy command failed');
      }
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const copyText = async (text) => {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function' && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
      }
    } catch (e) {
      console.warn("navigator.clipboard failed, falling back", e);
    }
    fallbackCopyText(text);
  };

  copyButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const targetId = button.getAttribute('data-copy-target');
      const target = document.getElementById(targetId);

      if (!target) {
        return;
      }

      const text = (target.textContent || '').trim();
      try {
        await copyText(text);
        const original = button.innerText;
        button.innerText = window.i18n ? window.i18n.t('copy.success') : 'Copied!';
        button.disabled = true;
        setTimeout(() => {
          button.innerText = original;
          button.disabled = false;
        }, 1200);
      } catch (_error) {
        button.innerText = window.i18n ? window.i18n.t('copy.fail') : 'Copy failed';
      }
    });
  });

  const form = document.getElementById('prompt-builder');
  const output = document.getElementById('generated-prompt');

  if (!form || !output) {
    return;
  }

  const updatePrompt = () => {
    const style = form.querySelector('[name="style"]').value;
    const tone = form.querySelector('[name="tone"]').value;
    const layout = form.querySelector('[name="layout"]').value;
    const motion = form.querySelector('[name="motion"]').value;
    const keywords = form.querySelector('[name="keywords"]').value.trim();

    const isKo = window.i18n && window.i18n.getCurrentLang() === 'ko';
    let lines;
    if (isKo) {
      const keywordLine = keywords
        ? `핵심 키워드: ${keywords}.`
        : '핵심 키워드: 대비, 계층, 리듬, 브랜드 개성.';
      lines = [
        '당신은 시니어 제품 디자이너다.',
        `웹 랜딩 페이지를 ${style} 스타일로 설계해줘.`,
        `톤앤매너는 ${tone}로 유지하고,`,
        `레이아웃은 ${layout} 구조를 사용해줘.`,
        `모션은 ${motion} 수준으로 적용해줘.`,
        keywordLine,
        '색상 팔레트(HEX), 타이포 스케일, 컴포넌트 규칙, 섹션별 와이어 설명까지 포함해줘.',
        '결과는 바로 구현 가능한 HTML/CSS 기준으로 작성해줘.'
      ];
    } else {
      const keywordLine = keywords
        ? `Key keywords: ${keywords}.`
        : 'Key keywords: contrast, hierarchy, rhythm, brand personality.';
      lines = [
        'You are a senior product designer.',
        `Design a web landing page in ${style} style.`,
        `Maintain a ${tone} tone and manner,`,
        `use a ${layout} layout structure,`,
        `and apply ${motion} level motion.`,
        keywordLine,
        'Include color palette (HEX), typo scale, component rules, and section wireframe descriptions.',
        'Write the result as implementation-ready HTML/CSS.'
      ];
    }
    output.innerText = lines.join(' ');
  };

  form.addEventListener('change', updatePrompt);
  form.addEventListener('input', updatePrompt);

  updatePrompt();
})();
