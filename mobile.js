const mobileListItem = document.querySelectorAll('.mobile-list-item');
const mobileBgImg = document.querySelector('.mobile-bg-img');

mobileListItem.forEach((mobileItem) => {
  mobileItem.addEventListener('click', () => {
    const imgSrc = mobileItem.getAttribute('data-img');

    if (!imgSrc) return;

    const newImg = document.createElement('img');
    newImg.src = imgSrc;
    newImg.style.clipPath = "polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)";
    newImg.style.opacity = "1";

    mobileBgImg.appendChild(newImg);

    // Animate the new image in
    gsap.to(newImg, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1,
      ease: "power3.out"
    });

    // Remove previous image after animation (keep newest)
    const allImgs = mobileBgImg.querySelectorAll('img');
    if (allImgs.length > 1) {
      const prevImg = allImgs[allImgs.length - 2];
      gsap.to(prevImg, {
        opacity: 0,
        duration: 1,
        onComplete: () => prevImg.remove()
      });
    }
  });
});
