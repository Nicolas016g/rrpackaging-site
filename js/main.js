/**
 * R.R Packaging Parts - Main JS
 * Carousel, mobile menu, form handling
 */

document.addEventListener('DOMContentLoaded', function () {

  var htmlLang = (document.documentElement.getAttribute('lang') || 'pt-BR').toLowerCase();
  var isEn = htmlLang.indexOf('en') === 0;
  var isEs = htmlLang.indexOf('es') === 0;

  // ========== Mobile menu (overlay, outside click, × icon) ==========
  var menuToggle = document.querySelector('.menu-toggle');
  var navMain = document.querySelector('.nav-main');

  function menuLabels() {
    var lang = (document.documentElement.getAttribute('lang') || 'pt-BR').toLowerCase();
    if (lang.indexOf('en') === 0) return { open: 'Open menu', close: 'Close menu' };
    if (lang.indexOf('es') === 0) return { open: 'Abrir menú', close: 'Cerrar menú' };
    return { open: 'Abrir menu', close: 'Fechar menu' };
  }

  function setMenuOpen(open) {
    if (!navMain || !menuToggle) return;
    var labels = menuLabels();
    navMain.classList.toggle('open', open);
    menuToggle.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuToggle.setAttribute('aria-label', open ? labels.close : labels.open);
    menuToggle.textContent = open ? '×' : '☰';
    document.body.classList.toggle('nav-menu-open', open);
    var overlay = document.querySelector('.nav-overlay');
    if (overlay) overlay.classList.toggle('visible', open);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  if (menuToggle && navMain) {
    var overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(overlay, document.body.firstElementChild);

    menuToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      setMenuOpen(!navMain.classList.contains('open'));
    });

    overlay.addEventListener('click', closeMenu);

    document.querySelectorAll('.nav-main a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 992) closeMenu();
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMain.classList.contains('open')) closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 992) closeMenu();
    });
  }

  // ========== Hero carousel ==========
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.carousel-dots span');

  if (slides.length > 1 && dots.length) {
    let current = 0;
    const total = slides.length;

    function goTo(index) {
      slides.forEach(function (s) { s.classList.remove('active'); });
      dots.forEach(function (d) { d.classList.remove('active'); });
      current = (index + total) % total;
      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); });
    });

    let interval = setInterval(function () {
      goTo(current + 1);
    }, 6000);

    var heroEl = document.querySelector('.hero');
    if (heroEl) {
      heroEl.addEventListener('mouseenter', function () {
        clearInterval(interval);
      });
      heroEl.addEventListener('mouseleave', function () {
        interval = setInterval(function () { goTo(current + 1); }, 6000);
      });
    }

    goTo(0);
  }

  // ========== Form submit (placeholder - sem backend) ==========
  var formSending = isEn ? 'Sending...' : isEs ? 'Enviando...' : 'Enviando...';
  var formSent = isEn ? 'Message sent!' : isEs ? '¡Mensaje enviado!' : 'Mensagem enviada!';

  document.querySelectorAll('form[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        var orig = btn.textContent;
        btn.textContent = formSending;
        btn.disabled = true;
        setTimeout(function () {
          btn.textContent = formSent;
          form.reset();
          setTimeout(function () {
            btn.textContent = orig;
            btn.disabled = false;
          }, 2500);
        }, 800);
      }
    });
  });

  // Active nav link by current page
  var path = window.location.pathname || '/';
  var page = path.split('/').pop() || '';
  if (!page || page === 'Site') page = '/';

  function normalizeHref(href) {
    if (!href) return '';
    if (href.indexOf('http://') === 0 || href.indexOf('https://') === 0) return '';
    if (href.indexOf('#') === 0) return '';
    try {
      var u = new URL(href, window.location.origin);
      var p = u.pathname || '/';
      if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
      return p;
    } catch (e) {
      return '';
    }
  }

  var currentPath = window.location.pathname || '/';
  if (currentPath.length > 1 && currentPath.endsWith('/')) currentPath = currentPath.slice(0, -1);
  document.querySelectorAll('.nav-main a[href]').forEach(function (a) {
    var href = a.getAttribute('href');
    var normalized = normalizeHref(href);
    if (normalized && normalized === currentPath) a.classList.add('active');
  });

  // Back to top + WhatsApp flutuante: mostrar/ocultar juntos ao rolar
  var backToTop = document.querySelector('.back-to-top');
  var floatWa = document.querySelector('.floating-whatsapp');
  if (backToTop || floatWa) {
    function toggleFloatingNav() {
      var show = window.pageYOffset > 300;
      if (backToTop) backToTop.classList.toggle('visible', show);
      if (floatWa) floatWa.classList.toggle('visible', show);
    }
    window.addEventListener('scroll', toggleFloatingNav);
    toggleFloatingNav();
  }

  // Services tabs
  var tabBtns = document.querySelectorAll('.services-tab-btn');
  var tabPanels = document.querySelectorAll('.services-tab-panel');
  function openServiceTabByPanelId(panelId) {
    if (!panelId) return false;
    var targetBtn = document.querySelector('.services-tab-btn[aria-controls="' + panelId + '"]');
    if (!targetBtn) return false;
    targetBtn.click();
    return true;
  }

  function openServiceTabFromHash() {
    var hash = window.location.hash ? window.location.hash.replace('#', '') : '';
    if (!hash) return;
    openServiceTabByPanelId(hash);
  }

  tabBtns.forEach(function (btn, index) {
    btn.addEventListener('click', function () {
      tabBtns.forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      tabPanels.forEach(function (p) {
        p.classList.remove('active');
        p.setAttribute('hidden', '');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      if (tabPanels[index]) {
        tabPanels[index].classList.add('active');
        tabPanels[index].removeAttribute('hidden');
      }
    });
  });

  if (tabBtns.length && tabPanels.length) {
    openServiceTabFromHash();
    window.addEventListener('hashchange', openServiceTabFromHash);
  }

  // Subtítulos de seção: centralizar só quando couber em uma linha
  function sectionSubtitleLineHeightPx(el) {
    var cs = window.getComputedStyle(el);
    var lh = cs.lineHeight;
    if (!lh || lh === 'normal') {
      return parseFloat(cs.fontSize) * 1.25;
    }
    return parseFloat(lh);
  }

  function updateSectionSubtitleSingleLine() {
    document.querySelectorAll('.section-subtitle').forEach(function (el) {
      if (!el.textContent || !el.textContent.trim()) return;
      el.classList.remove('section-subtitle-single-line');
      void el.offsetHeight;
      var lh = sectionSubtitleLineHeightPx(el);
      if (el.scrollHeight <= lh * 1.28) {
        el.classList.add('section-subtitle-single-line');
      }
    });
  }

  updateSectionSubtitleSingleLine();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      updateSectionSubtitleSingleLine();
    });
  }
  var subtitleResizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(subtitleResizeTimer);
    subtitleResizeTimer = setTimeout(updateSectionSubtitleSingleLine, 120);
  });

  var soonTitle = isEn ? 'Coming soon' : isEs ? 'Próximamente' : 'Em breve';
  var soonSuffix = isEn ? ' — Coming soon' : isEs ? ' — Próximamente' : ' — Em breve';

  // Redes sociais inativas — tooltip e sem navegação
  document.querySelectorAll('.social-links a').forEach(function (el) {
    el.classList.add('social-soon');
    el.setAttribute('title', soonTitle);
    el.setAttribute('aria-disabled', 'true');
    el.setAttribute('role', 'button');
    var prev = el.getAttribute('aria-label') || '';
    if (prev && prev.indexOf(soonSuffix) === -1) {
      el.setAttribute('aria-label', prev + soonSuffix);
    }
    el.addEventListener('click', function (e) {
      e.preventDefault();
    });
  });
});
