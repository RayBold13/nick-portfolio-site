const mobileBgImg = document.querySelector('.mobile-bg-img');
const mobileListItems = document.querySelectorAll('.mobile-list-item');

function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}

function animateImageIn(imgSrc) {
  preloadImage(imgSrc).then((newImg) => {
    // Apply inline styles
    Object.assign(newImg.style, {
      clipPath: 'polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)',
      position: 'absolute',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      top: 0,
      left: 0,
      willChange: 'clip-path',
      zIndex: mobileBgImg.children.length + 1, // Stack on top
    });

    mobileBgImg.appendChild(newImg);

    // Animate in
    gsap.to(newImg, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      duration: 1,
      ease: 'power3.out',
    });

    // Keep only top 2 images: current and previous
    if (mobileBgImg.children.length > 2) {
      mobileBgImg.removeChild(mobileBgImg.firstChild); // Remove oldest image
    }
  }).catch((err) => {
    console.error('Image failed to load:', err);
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

// Animate new image on click
mobileListItems.forEach(item => {
  item.addEventListener('click', () => {
    const imgSrc = item.getAttribute('data-img');
    if (!imgSrc) return;
    animateImageIn(imgSrc);
  });
});
