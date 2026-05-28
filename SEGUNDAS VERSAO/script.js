(() => {
  'use strict';

  /* ----------------------------------------------------------
     1. PARALLAX HERO
     Texto sobe mais rápido que a imagem → sensação de profundidade
  ---------------------------------------------------------- */
  const heroImg     = document.querySelector('.hero-imagem');
  const heroContent = document.querySelector('.hero-conteudo');
  const menu        = document.querySelector('.menu');
  const menuToggle  = document.querySelector('.menu-toggle');

  if (menu && menuToggle) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('ativo');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
      menuToggle.querySelector('.material-symbols-outlined').textContent = isOpen ? 'close' : 'menu';
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('ativo');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
        menuToggle.querySelector('.material-symbols-outlined').textContent = 'menu';
      });
    });
  }

  const carousel = document.querySelector('.carrossel-galeria');
  if (carousel) {
    const track = carousel.querySelector('.carrossel-trilho');
    const slides = Array.from(carousel.querySelectorAll('.carrossel-slide'));
    const prevBtn = carousel.querySelector('.carrossel-anterior');
    const nextBtn = carousel.querySelector('.carrossel-proximo');
    const dotsWrapper = carousel.querySelector('.carrossel-indicadores');
    let currentIndex = 0;
    let autoplayId = null;
    const autoplayDelay = 4000;

    function getVisibleSlides() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 4;
    }

    function getMaxIndex() {
      return Math.max(slides.length - getVisibleSlides(), 0);
    }

    function getStepSize() {
      if (!slides.length) return 0;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      return slides[0].getBoundingClientRect().width + gap;
    }

    function buildDots() {
      dotsWrapper.innerHTML = '';
      const totalDots = getMaxIndex() + 1;

      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Mostrar imagem ${i + 1}`);
        dot.addEventListener('click', () => {
          currentIndex = i;
          updateCarousel();
          startAutoplay();
        });
        dotsWrapper.appendChild(dot);
      }
    }

    function updateCarousel() {
      currentIndex = Math.min(currentIndex, getMaxIndex());
      track.style.transform = `translateX(-${currentIndex * getStepSize()}px)`;

      dotsWrapper.querySelectorAll('button').forEach((dot, index) => {
        dot.classList.toggle('ativo', index === currentIndex);
        dot.setAttribute('aria-current', index === currentIndex ? 'true' : 'false');
      });
    }

    function nextSlide() {
      currentIndex = currentIndex === getMaxIndex() ? 0 : currentIndex + 1;
      updateCarousel();
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayId = setInterval(nextSlide, autoplayDelay);
    }

    function stopAutoplay() {
      if (autoplayId) {
        clearInterval(autoplayId);
        autoplayId = null;
      }
    }

    prevBtn.addEventListener('click', () => {
      currentIndex = currentIndex === 0 ? getMaxIndex() : currentIndex - 1;
      updateCarousel();
      startAutoplay();
    });

    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoplay();
    });

    window.addEventListener('resize', () => {
      buildDots();
      updateCarousel();
      startAutoplay();
    });

    buildDots();
    updateCarousel();
    startAutoplay();
  }

  function onParallaxScroll() {
    if (window.innerWidth <= 768) {
      if (heroImg)     heroImg.style.transform     = '';
      if (heroContent) heroContent.style.transform = '';
      return;
    }

    const y = window.scrollY;
    if (heroImg)     heroImg.style.transform     = `translateY(${y * 0.45}px)`;
    if (heroContent) heroContent.style.transform = `translateY(${y * 0.18}px)`;
  }

  window.addEventListener('scroll', onParallaxScroll, { passive: true });
  window.addEventListener('resize', onParallaxScroll);


  /* ----------------------------------------------------------
     2. CONTADOR ANIMADO NAS ESTATÍSTICAS
  ---------------------------------------------------------- */
  function animateCounter(el, target, duration = 1800) {
    const isPercent = el.textContent.includes('%');
    const isPlus    = el.textContent.includes('+');
    const suffix    = isPercent ? '%' : isPlus ? '+' : '';
    const num       = parseFloat(target.replace(/[^0-9.]/g, ''));
    const isK       = target.toLowerCase().includes('k');
    const realTarget = isK ? num * 1000 : num;

    let start = null;
    const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased    = easeOutExpo(progress);
      const current  = Math.floor(eased * realTarget);

      if (isK && current >= 1000) {
        el.textContent = (current / 1000).toFixed(current % 1000 === 0 ? 0 : 1) + 'k' + suffix;
      } else {
        el.textContent = current + suffix;
      }

      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Observa as estatísticas e dispara o contador uma única vez
  const statEls = document.querySelectorAll('.estatistica strong');
  if (statEls.length) {
    const countersRun = new WeakSet();
    const counterObs  = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersRun.has(entry.target)) {
          countersRun.add(entry.target);
          animateCounter(entry.target, entry.target.textContent);
        }
      });
    }, { threshold: 0.6 });

    statEls.forEach(el => counterObs.observe(el));
  }



  /* ----------------------------------------------------------
     4. CTA FLUTUANTE DO WHATSAPP
     Aparece após 300 px de scroll, com pulse animation
  ---------------------------------------------------------- */
  const WA_URL = 'https://wa.me/5544988468608';

  function createWhatsappFAB() {
    const fab = document.createElement('a');
    fab.href        = WA_URL;
    fab.target      = '_blank';
    fab.rel         = 'noopener noreferrer';
    fab.id          = 'wpp-fab';
    fab.setAttribute('aria-label', 'Agendar pelo WhatsApp');
    fab.innerHTML   = `
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="28" height="28">
        <path d="M16 1C7.716 1 1 7.716 1 16c0 2.628.666 5.101 1.832 7.264L1 31l8.02-1.81A14.94 14.94 0 0016 31c8.284 0 15-6.716 15-15S24.284 1 16 1zm0 27.2a12.14 12.14 0 01-6.16-1.674l-.44-.262-4.762 1.075 1.107-4.644-.29-.476A12.152 12.152 0 013.8 16C3.8 9.26 9.26 3.8 16 3.8S28.2 9.26 28.2 16 22.74 28.2 16 28.2zm6.664-9.09c-.364-.182-2.154-1.062-2.49-1.184-.334-.12-.578-.182-.82.182-.244.364-.944 1.184-1.158 1.426-.212.244-.426.274-.79.092-.364-.182-1.538-.566-2.93-1.806-1.082-.966-1.814-2.16-2.026-2.524-.212-.364-.022-.562.16-.744.164-.164.364-.426.546-.638.18-.214.242-.364.362-.608.12-.244.06-.458-.03-.638-.09-.182-.82-1.978-1.124-2.708-.296-.712-.596-.614-.82-.626l-.696-.012c-.244 0-.638.092-.972.456-.334.364-1.274 1.244-1.274 3.034s1.304 3.52 1.486 3.762c.182.244 2.564 3.916 6.212 5.494.87.376 1.548.6 2.076.768.872.278 1.666.24 2.294.146.7-.104 2.154-.88 2.458-1.73.304-.85.304-1.578.212-1.73-.09-.152-.334-.244-.698-.426z"/>
      </svg>`;

    const style = document.createElement('style');
    style.textContent = `
      #wpp-fab {
        position: fixed;
        bottom: 32px;
        right: 32px;
        z-index: 9000;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: #25d366;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 6px 24px rgba(37,211,102,.45);
        opacity: 0;
        transform: scale(0.6);
        transition: opacity .4s cubic-bezier(.34,1.56,.64,1),
                    transform .4s cubic-bezier(.34,1.56,.64,1);
        pointer-events: none;
      }
      #wpp-fab.visible {
        opacity: 1;
        transform: scale(1);
        pointer-events: auto;
      }
      #wpp-fab::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 50%;
        box-shadow: 0 0 0 0 rgba(37,211,102,.55);
        animation: wpp-pulse 2.6s ease-out infinite;
      }
      #wpp-fab:hover { transform: scale(1.1) !important; }
      @keyframes wpp-pulse {
        0%   { box-shadow: 0 0 0 0   rgba(37,211,102,.55); }
        60%  { box-shadow: 0 0 0 18px rgba(37,211,102,0);  }
        100% { box-shadow: 0 0 0 0   rgba(37,211,102,0);   }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(fab);

    // Exibe após 300 px de scroll
    window.addEventListener('scroll', () => {
      fab.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });
  }

  createWhatsappFAB();


  /* ----------------------------------------------------------
     5. EXIT-INTENT POPUP (desktop)
     Dispara quando o mouse sobe até perto do topo da janela
  ---------------------------------------------------------- */
  function createExitIntentPopup() {
    // Só desktop
    if (window.innerWidth < 768) return;

    const overlay = document.createElement('div');
    overlay.id    = 'exit-overlay';

    const style = document.createElement('style');
    style.textContent = `
      #exit-overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: rgba(78,44,53,.55);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        pointer-events: none;
        transition: opacity .35s ease;
      }
      #exit-overlay.show {
        opacity: 1;
        pointer-events: auto;
      }
      #exit-popup {
        background: #fff6f9;
        border-radius: 32px;
        padding: 60px 56px;
        max-width: 520px;
        width: 90%;
        text-align: center;
        box-shadow: 0 32px 80px rgba(92,47,60,.22);
        border: 1px solid #f8d7df;
        position: relative;
        transform: translateY(24px) scale(.96);
        transition: transform .4s cubic-bezier(.34,1.56,.64,1);
      }
      #exit-overlay.show #exit-popup {
        transform: translateY(0) scale(1);
      }
      #exit-popup .exit-badge {
        display: inline-block;
        background: #fdecef;
        color: #8d4f60;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 3px;
        text-transform: uppercase;
        padding: 6px 18px;
        border-radius: 100px;
        margin-bottom: 22px;
      }
      #exit-popup h2 {
        font-family: "Playfair Display", serif;
        font-size: 32px;
        color: #5c2f3c;
        line-height: 1.25;
        margin-bottom: 14px;
      }
      #exit-popup p {
        color: #7a6268;
        font-size: 15px;
        line-height: 1.65;
        margin-bottom: 36px;
      }
      #exit-popup .exit-btn-wa {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        background: linear-gradient(135deg, #8d4f60, #5c2f3c);
        color: #fff;
        font-weight: 600;
        font-size: 15px;
        padding: 16px 34px;
        border-radius: 12px;
        text-decoration: none;
        transition: transform .25s, box-shadow .25s;
        box-shadow: 0 10px 28px rgba(92,47,60,.28);
      }
      #exit-popup .exit-btn-wa:hover {
        transform: translateY(-3px);
        box-shadow: 0 16px 36px rgba(92,47,60,.36);
      }
      #exit-popup .exit-dismiss {
        display: block;
        margin-top: 18px;
        color: #7a6268;
        font-size: 13px;
        cursor: pointer;
        text-decoration: underline;
        text-underline-offset: 3px;
        background: none;
        border: none;
        font-family: inherit;
      }
      #exit-popup .exit-dismiss:hover { color: #8d4f60; }
      #exit-popup .exit-close {
        position: absolute;
        top: 18px; right: 20px;
        background: none; border: none;
        font-size: 22px; cursor: pointer;
        color: #7a6268; line-height: 1;
      }
      #exit-popup .exit-emoji {
        font-size: 44px;
        display: block;
        margin-bottom: 16px;
      }
    `;
    document.head.appendChild(style);

    overlay.innerHTML = `
      <div id="exit-popup" role="dialog" aria-modal="true" aria-labelledby="exit-title">
        <button class="exit-close" aria-label="Fechar">×</button>
        <span class="exit-emoji">💅</span>
        <span class="exit-badge">Oferta especial</span>
        <h2 id="exit-title">Espera! Seu horário ainda está disponível.</h2>
        <p>Agende agora pelo WhatsApp e garanta seu momento de cuidado. Atendimento premium, produtos selecionados e ambiente que você vai adorar.</p>
        <a href="${WA_URL}" target="_blank" rel="noopener noreferrer" class="exit-btn-wa">
          <svg viewBox="0 0 32 32" fill="currentColor" width="20" height="20"><path d="M16 1C7.716 1 1 7.716 1 16c0 2.628.666 5.101 1.832 7.264L1 31l8.02-1.81A14.94 14.94 0 0016 31c8.284 0 15-6.716 15-15S24.284 1 16 1zm0 27.2a12.14 12.14 0 01-6.16-1.674l-.44-.262-4.762 1.075 1.107-4.644-.29-.476A12.152 12.152 0 013.8 16C3.8 9.26 9.26 3.8 16 3.8S28.2 9.26 28.2 16 22.74 28.2 16 28.2zm6.664-9.09c-.364-.182-2.154-1.062-2.49-1.184-.334-.12-.578-.182-.82.182-.244.364-.944 1.184-1.158 1.426-.212.244-.426.274-.79.092-.364-.182-1.538-.566-2.93-1.806-1.082-.966-1.814-2.16-2.026-2.524-.212-.364-.022-.562.16-.744.164-.164.364-.426.546-.638.18-.214.242-.364.362-.608.12-.244.06-.458-.03-.638-.09-.182-.82-1.978-1.124-2.708-.296-.712-.596-.614-.82-.626l-.696-.012c-.244 0-.638.092-.972.456-.334.364-1.274 1.244-1.274 3.034s1.304 3.52 1.486 3.762c.182.244 2.564 3.916 6.212 5.494.87.376 1.548.6 2.076.768.872.278 1.666.24 2.294.146.7-.104 2.154-.88 2.458-1.73.304-.85.304-1.578.212-1.73-.09-.152-.334-.244-.698-.426z"/></svg>
          Agendar agora
        </a>
        <button class="exit-dismiss">Não, obrigada</button>
      </div>`;

    document.body.appendChild(overlay);

    const closePopup = () => overlay.classList.remove('show');
    overlay.querySelector('.exit-close').addEventListener('click', closePopup);
    overlay.querySelector('.exit-dismiss').addEventListener('click', closePopup);
    overlay.addEventListener('click', e => { if (e.target === overlay) closePopup(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closePopup(); });

    // Fecha popup ao clicar no link de agendamento
    overlay.querySelector('.exit-btn-wa').addEventListener('click', closePopup);

    let shown = false;
    document.addEventListener('mouseleave', e => {
      if (shown || e.clientY > 40) return;
      shown = true;
      overlay.classList.add('show');
    });
  }

  createExitIntentPopup();

})();
