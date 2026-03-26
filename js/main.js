/* =============================================
   Bishop Ogez High School — Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Preloader ---------- */
  const preloader = document.querySelector('.preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader?.classList.add('hide'), 400);
  });

  /* ---------- Navbar scroll effect ---------- */
  const navbar = document.querySelector('.navbar');
  const backToTop = document.querySelector('.back-to-top');

  function handleScroll() {
    const scrolled = window.scrollY > 60;
    navbar?.classList.toggle('scrolled', scrolled);
    backToTop?.classList.toggle('show', window.scrollY > 400);
  }
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });

        // Close mobile menu if open
        const navCollapse = document.querySelector('.navbar-collapse');
        if (navCollapse?.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
          bsCollapse?.hide();
        }
      }
    });
  });

  /* ---------- Back to top ---------- */
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Counter Animation ---------- */
  const counters = document.querySelectorAll('[data-count]');
  let counted = false;

  function animateCounters() {
    if (counted) return;
    counters.forEach(counter => {
      const rect = counter.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        counted = true;
        const target = +counter.getAttribute('data-count');
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 2000;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = Math.floor(target * eased) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
      }
    });
  }

  window.addEventListener('scroll', animateCounters);
  animateCounters();

  /* ---------- Active nav link highlight ---------- */
  const sections = document.querySelectorAll('section[id]');

  function highlightNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.navbar a[href="#${id}"]`);
      if (scrollY >= top && scrollY < top + height) {
        document.querySelectorAll('.navbar .nav-link').forEach(l => l.classList.remove('active'));
        link?.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', highlightNav);

  /* ---------- AOS Init ---------- */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
    });
  }

  /* ---------- Testimonials Carousel (simple) ---------- */
  const track = document.querySelector('.testimonials-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');
  let currentIndex = 0;

  function updateCarousel() {
    if (!track || cards.length === 0) return;
    const cardWidth = cards[0].offsetWidth + 20; // gap
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  }

  prevBtn?.addEventListener('click', () => {
    currentIndex = Math.max(0, currentIndex - 1);
    updateCarousel();
  });

  nextBtn?.addEventListener('click', () => {
    // Show max 1 card on mobile, 2 on tablet, 3 on desktop
    const visible = window.innerWidth < 768 ? 1 : window.innerWidth < 992 ? 2 : 3;
    currentIndex = Math.min(cards.length - visible, currentIndex + 1);
    updateCarousel();
  });

  window.addEventListener('resize', updateCarousel);

  /* Auto-advance testimonials every 5 seconds */
  if (cards.length > 0) {
    setInterval(() => {
      const visible = window.innerWidth < 768 ? 1 : window.innerWidth < 992 ? 2 : 3;
      currentIndex = (currentIndex + 1) % (cards.length - visible + 1);
      updateCarousel();
    }, 5000);
  }
});
