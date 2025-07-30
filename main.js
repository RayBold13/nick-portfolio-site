// === MAIN INTERACTION LOGIC ===

window.addEventListener('DOMContentLoaded', () => {
  // === Drawer Logic ===
  const drawerContainer = document.querySelector(".project-drawer-container");

  if (drawerContainer) {
    const drawer = drawerContainer.querySelector(".project-drawer");
    const ctaButton = drawer.querySelector(".drawer-cta");

    const drawerSections = [
      drawer.querySelector(".drawer-header"),
      drawer.querySelector(".drawer-main"),
      drawer.querySelector(".drawer-collaborator"),
    ];

    let isOpen = false;

    gsap.set(drawerContainer, { xPercent: 100 });
    gsap.set(drawerSections, { opacity: 1, xPercent: 100 });

    function openDrawer(delay = 0) {
      gsap.to(drawerContainer, {
        xPercent: 0,
        duration: 0.8,
        ease: "power2.out",
        delay,
      });

      gsap.to(drawerSections, {
        opacity: 1,
        xPercent: 0,
        duration: 0.8,
        stagger: { each: 0.15, from: "end" },
        ease: "power2.out",
        delay,
      });

      isOpen = true;
    }

    function closeDrawer() {
      gsap.to(drawerSections, {
        opacity: 1,
        xPercent: 100,
        duration: 0.8,
        stagger: { each: 0.15, from: "end" },
        ease: "power2.in",
      });

      gsap.to(drawerContainer, {
        xPercent: 100,
        duration: 0.8,
        ease: "power2.in",
      });

      isOpen = false;
    }

    ctaButton.addEventListener("click", () => {
      isOpen ? closeDrawer() : openDrawer();
    });

    window.addEventListener("load", () => {
      openDrawer(0.75);
    });
  }

  // === Dropdown Logic ===
  const toggle = document.querySelector('.flex-btn');
  const dropMenu = document.querySelector('.flex-btn-dropdown');

  if (toggle && dropMenu) {
    const listItems = dropMenu.querySelectorAll('li');
    let isDropDownOpen = false;

    const tl = gsap.timeline({ paused: true });

    tl.to(dropMenu, {
      height: 180,
      duration: 0.5,
      ease: "power2.out",
    });

    tl.from(listItems, {
      opacity: 0,
      x: 40,
      duration: 0.4,
      ease: "power2.out",
      stagger: { each: 0.1, from: 'end' }
    }, "<");

    toggle.addEventListener('click', () => {
      isDropDownOpen ? tl.reverse() : tl.play();
      isDropDownOpen = !isDropDownOpen;
    });
  }

  // === List Hover Logic (Image Preview + Text Slide) ===
  const imagePaths = [
    '/assets/images/Collaborator._Def_Jam.webp',
    '/assets/images/Collaborator._Canon.webp',
    '/assets/images/Collaborator._Vogue.webp',
    '/assets/images/Collaborator_JBL.webp',
    '/assets/images/Nick_Anderson_HS.jpg',
    '/assets/images/Collaborator._RCA.webp',
  ];

  const listItems = document.querySelectorAll('.list-item');
  const imgContainer = document.querySelector('.list-img-container');

  listItems.forEach((item, index) => {
    let currentImg = null;

    item.addEventListener('mouseenter', () => {
      const img = document.createElement('img');
      img.src = imagePaths[index];
      img.alt = `Preview ${index}`;
      img.style.opacity = 0;
      img.style.position = 'absolute';
      img.style.top = 0;
      img.style.left = 0;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.pointerEvents = 'none';

      imgContainer.appendChild(img);
      currentImg = img;

      gsap.to(img, {
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
      });

      const leftContainer = item.querySelector('.item-container-left');
      const rightContainer = item.querySelector('.item-container-right');
      const leftWord = leftContainer.querySelector('.list-item-content');
      const rightWord = rightContainer.querySelector('.list-item-content');

      if (!leftWord || !rightWord) return;

      gsap.killTweensOf([leftWord, rightWord]);

      const leftShift = leftContainer.clientWidth - leftWord.clientWidth - parseFloat(getComputedStyle(leftContainer).paddingLeft);
      const rightShift = rightContainer.clientWidth - rightWord.clientWidth - parseFloat(getComputedStyle(rightContainer).paddingRight);

      gsap.to(leftWord, {
        x: leftShift,
        duration: 0.9,
        ease: "power2.out"
      });

      gsap.to(rightWord, {
        x: -rightShift,
        duration: 0.9,
        ease: "power2.out"
      });
    });

    item.addEventListener('mouseleave', () => {
      if (!currentImg) return;

      gsap.to(currentImg, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => {
          currentImg.remove();
          currentImg = null;
        },
      });

      const leftWord = item.querySelector('.item-container-left .list-item-content');
      const rightWord = item.querySelector('.item-container-right .list-item-content');

      if (!leftWord || !rightWord) return;

      gsap.killTweensOf([leftWord, rightWord]);

      gsap.to([leftWord, rightWord], {
        x: 0,
        duration: 0.9,
        ease: "power2.inOut"
      });
    });
  });

  // === Animate item content in from bottom center ===
  const leftContents = document.querySelectorAll('.item-container-left .list-item-content');
  const rightContents = document.querySelectorAll('.item-container-right .list-item-content');

  gsap.set(leftContents, {
    y: 100,
    opacity: 0,
    x: 60,
    transformOrigin: 'center'
  });

  gsap.set(rightContents, {
    y: 100,
    opacity: 0,
    x: -60,
    transformOrigin: 'center'
  });

  gsap.to(leftContents, {
    y: 0,
    x: 0,
    opacity: 1,
    duration: 1,
    ease: 'power2.out',
    stagger: 0.1
  });

  gsap.to(rightContents, {
    y: 0,
    x: 0,
    opacity: 1,
    duration: 1,
    ease: 'power2.out',
    stagger: 0.1
  });
});
