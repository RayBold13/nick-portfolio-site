document.addEventListener('DOMContentLoaded', () => {
  // On initial page load, check if coming from navigation
  if (sessionStorage.getItem('navigationTriggered') === 'true') {
    // Set container blocks at 0% (covering screen)
    gsap.set('.container-block', { y: '0%' });

    // Animate them offscreen to top (-100%)
    gsap.to('.container-block', {
      y: '-100%',
      duration: 1,
      ease: 'power2.inOut',
      stagger: 0.16,
      delay: 0.2,
      onComplete: () => {
        sessionStorage.removeItem('navigationTriggered');
      },
    });
  } else {
    // Otherwise, place them offscreen at the bottom (100%)
    gsap.set('.container-block', { y: '100%' });
  }

  // Add click listeners to all anchor links
  document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');

      // Ignore invalid link types
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      e.preventDefault();

      // Flag for transition on next page
      sessionStorage.setItem('navigationTriggered', 'true');

      // Animate blocks from bottom (100%) to cover screen (0%)
      gsap.set('.container-block', { y: '100%' });
      gsap.to('.container-block', {
        y: '0%',
        duration: 1,
        ease: 'power2.out',
        stagger: 0.0,
        onComplete: () => {
          window.location.href = href;
        }
      });
    });
  });
});
