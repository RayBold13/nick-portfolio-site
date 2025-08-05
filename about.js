const overlay = document.querySelector('.about-overlay');
const img = overlay.querySelector('img');
const textElements = overlay.querySelectorAll('.text-reveal');
const aboutButton = document.getElementById('About');
const closeButton = document.getElementById('close');

// Set initial styles once
gsap.set(overlay, {
  clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'
});

gsap.set(img, {
  clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
});

gsap.set(textElements, {
  opacity: 0,
  y: 20
});

// Create timeline (paused initially)
const aboutTL = gsap.timeline({ paused: true });

aboutTL
  .to(overlay, {
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    duration: 1.5,
    ease: 'power2.out'
  })

  .to(img, {
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    duration: 0.8,
    ease: 'power2.out'
  }, "-=1.24")

  .to(textElements, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out',
    stagger: 0.05
  }, "-=0.6");

// Trigger play and reverse
aboutButton.addEventListener('click', () => {
  aboutTL.play();
});

closeButton.addEventListener('click', () => {
  aboutTL.reverse();
});
