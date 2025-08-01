const mobileBgImg = document.querySelector('.mobile-bg-img');
const mobileListItems = document.querySelectorAll('.mobile-list-item');

function animateImageIn(imgSrc) {
  const newImg = document.createElement('img');
  newImg.src = imgSrc;
  newImg.style.clipPath = 'polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)';

  mobileBgImg.appendChild(newImg);

  gsap.to(newImg.style, {
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    duration: 1,
    ease: 'power3.out',
  });
}

// Animate first image on load
window.addEventListener('DOMContentLoaded', () => {
  const firstItem = mobileListItems[0];
  if (firstItem) {
    const imgSrc = firstItem.getAttribute('data-img');
    if (imgSrc) animateImageIn(imgSrc);
  }
});

// Animate new images on click
mobileListItems.forEach(item => {
  item.addEventListener('click', () => {
    const imgSrc = item.getAttribute('data-img');
    if (!imgSrc) return;
    animateImageIn(imgSrc);
  });
});
