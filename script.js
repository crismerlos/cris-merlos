(() => {
  'use strict';

  /* ----------------------------------------------------------
     1. PARALLAX HERO
     Texto sobe mais rápido que a imagem → sensação de profundidade
  ---------------------------------------------------------- */
  const heroImg     = document.querySelector('.hero-imagem');
  const heroContent = document.querySelector('.hero-conteudo');
  const heroTitle   = document.querySelector('.hero-titulo');
  const heroDesc    = document.querySelector('.hero-descricao');
  const menu        = document.querySelector('.menu');
  const menuToggle  = document.querySelector('.menu-toggle');

  if (heroTitle || heroDesc) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      if (heroTitle) heroTitle.classList.add('titulo-visivel');
      if (heroDesc) heroDesc.classList.add('descricao-visivel');
    } else {
      window.setTimeout(() => {
        if (heroTitle) heroTitle.classList.add('titulo-visivel');
      }, 180);

      window.setTimeout(() => {
        if (heroDesc) heroDesc.classList.add('descricao-visivel');
      }, 360);
    }
  }

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
    let cachedStepSize = 0;

    function getVisibleSlides() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 4;
    }

    function getMaxIndex() {
      return Math.max(slides.length - getVisibleSlides(), 0);
    }

    function computeStepSize() {
      if (!slides.length) return 0;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      cachedStepSize = slides[0].getBoundingClientRect().width + gap;
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
      track.style.transform = `translateX(-${currentIndex * cachedStepSize}px)`;

      dotsWrapper.querySelectorAll('button').forEach((dot, index) => {
        dot.classList.toggle('ativo', index === currentIndex);
        dot.setAttribute('aria-current', index === currentIndex ? 'true' : 'false');
      });
    }

    function nextSlide() {
      currentIndex = currentIndex === getMaxIndex() ? 0 : currentIndex + 1;
      updateCarousel();
    }

    function prevSlide() {
      currentIndex = currentIndex === 0 ? getMaxIndex() : currentIndex - 1;
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

    /* Swipe touch */
    let touchStartX = 0;
    let touchStartY = 0;
    carousel.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    carousel.addEventListener('touchend', e => {
      const diffX = touchStartX - e.changedTouches[0].clientX;
      const diffY = touchStartY - e.changedTouches[0].clientY;
      /* Só processa se o movimento horizontal for dominante */
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        diffX > 0 ? nextSlide() : prevSlide();
        startAutoplay();
      }
    }, { passive: true });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoplay();
    });

    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoplay();
    });

    /* Debounce no resize para não recalcular a cada pixel */
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        computeStepSize();
        buildDots();
        updateCarousel();
        startAutoplay();
      }, 150);
    });

    /* Pausa autoplay quando o usuário não está vendo o carrossel */
    const visibilityObs = new IntersectionObserver(entries => {
      entries[0].isIntersecting ? startAutoplay() : stopAutoplay();
    }, { threshold: 0.2 });
    visibilityObs.observe(carousel);

    computeStepSize();
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
     2. CTA FLUTUANTE DO WHATSAPP
     Aparece após 300 px de scroll, com pulse animation
  ---------------------------------------------------------- */
  const WA_URL = 'https://wa.me/5544988468608?text=Olá%2C%20gostaria%20de%20agendar%20um%20horário%20para%20fazer%20as%20unhas.%20Poderia%20me%20informar%20os%20horários%20disponíveis%3F';

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

})();
