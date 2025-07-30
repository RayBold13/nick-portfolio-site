const projectItems = document.querySelectorAll('.footer-project-item');
const imgContainer = document.querySelector('.footer-project-img-container');
const footerProjectContainer = document.querySelector('.footer-project-container');

projectItems.forEach((item) => {
  item.addEventListener('mouseenter', () => {
    const imgSrc = item.getAttribute('data-img');
    const newImg = document.createElement('img');
    newImg.src = imgSrc;
    newImg.style.clipPath = "polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)";
    imgContainer.appendChild(newImg);

    gsap.to(newImg, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1,
      ease: "power3.out",
    });
  });
});

footerProjectContainer.addEventListener('mouseout', (event) => {
  if (event.relatedTarget && footerProjectContainer.contains(event.relatedTarget)) {
    return; // Mouse moved to a child inside the container, ignore
  }

  const imgs = imgContainer.querySelectorAll('img');
  gsap.to(imgs, {
    clipPath: "polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)",
    duration: 1,
    ease: "power3.in",
    onComplete: () => {
      imgs.forEach(img => img.remove());
    }
  });
});
