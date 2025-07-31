document.addEventListener('DOMContentLoaded', () => {
  // --- Transition Logic ---

  function runEntryTransition() {
    // On initial page load, if coming from navigation
    return new Promise(resolve => {
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
            resolve();
          },
        });
      } else {
        // Otherwise, place them offscreen at the bottom (100%)
        gsap.set('.container-block', { y: '100%' });
        resolve();
      }
    });
  }

  function addNavigationListeners() {
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
          stagger: 0,
          onComplete: () => {
            window.location.href = href;
          }
        });
      });
    });
  }

  // --- Main.js Logic ---

  function initializeMain() {
    // === View Toggle & List Animation ===
    const btnSlider = document.getElementById("btn-slider");
    const btnList = document.getElementById("btn-list");
    const sliderView = document.getElementById("sliderView");
    const listView = document.getElementById("listView");

    if (btnSlider && btnList && sliderView && listView) {
      const collapseSlides = () => {
        return new Promise(resolve => {
          const slides = document.querySelectorAll("#sliderView .slide");
          const slideInfos = document.querySelectorAll("#sliderView .slide-info");

          const tl = gsap.timeline({
            onComplete: resolve
          });

          tl.to(slides, {
            clipPath: "inset(50% 0% 50% 0%)",
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.inOut",
          }, 0);

          tl.to(slideInfos, {
            opacity: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.out"
          }, 0);
        });
      };

      const resetSlides = () => {
        const slides = document.querySelectorAll("#sliderView .slide");
        const slideInfos = document.querySelectorAll("#sliderView .slide-info");

        gsap.set(slides, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(slideInfos, { opacity: 1 });
      };

      const animateListItemsIn = () => {
        const listItems = document.querySelectorAll("#listView .list-item");
        gsap.fromTo(
          listItems,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.07,
            ease: "power2.out"
          }
        );
      };

      btnSlider.addEventListener("click", () => {
        const listItems = document.querySelectorAll("#listView .list-item");
      
        // Animate list items out first
        const tl = gsap.timeline({
          onComplete: () => {
            // Hide list, show slider
            listView.classList.add("is-hidden");
            sliderView.classList.remove("is-hidden");
      
            // Animate slides back in
            const slideEls = document.querySelectorAll(".slide");
            const slideInfos = document.querySelectorAll(".slide-info");
      
            const revealTl = gsap.timeline();
            revealTl.set(slideEls, { clipPath: "inset(50% 0% 50% 0%)" });
            revealTl.set(slideInfos, { opacity: 0 });
      
            revealTl.to(slideEls, {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.24,
              ease: "power2.out",
              stagger: 0.05
            });
      
            revealTl.to(slideInfos, {
              opacity: 1,
              duration: 0.5,
              stagger: 0.05,
              ease: "power2.out"
            }, ">-2");
      
            // Update active states
            btnSlider.classList.add("is-active");
            btnList.classList.remove("is-active");
          }
        });
      
        tl.to(listItems, {
          opacity: 0,
          y: 40,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.in"
        });
      });
      

      btnList.addEventListener("click", () => {
        collapseSlides().then(() => {
          btnList.classList.add("is-active");
          btnSlider.classList.remove("is-active");
          listView.classList.remove("is-hidden");
          sliderView.classList.add("is-hidden");
      
          animateListItemsIn();
      
          // 👇 Reveal mobile background image after transition if on mobile
          if (window.innerWidth <= 650) {
            setTimeout(() => {
              setMobileActiveImage();
            }, 500); // wait slightly after list animation
          }
        });
      });
      
    } else {
      console.warn("Toggle or view elements missing");
    }

    // === Preloader Completion Listener ===
    document.addEventListener("preloader:complete", () => {
      const slideEls = document.querySelectorAll(".slide");
      const slideInfos = document.querySelectorAll(".slide-info");
      const navEls = document.querySelectorAll([
        ".desktop-nav .nav-item span",
        ".desktop-nav .view-toggle li",
        ".desktop-nav .nav-container li"
      ].join(", "));

      const tl = gsap.timeline();

      tl.to(slideEls, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 1,
        ease: "power2.out",
        stagger: 0.05
      });

      tl.to(slideInfos, {
        opacity: 1,
        duration: 0.8,
        stagger: 0.05,
        ease: "power2.out"
      }, ">-0.6");

      tl.to(navEls, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: "power2.out"
      }, ">-0.8");
    });

    function preloadHoverImages() {
      const listItems = document.querySelectorAll('.list-item');
      listItems.forEach(item => {
        const imageUrl = item.getAttribute('data-img');
        if (imageUrl) {
          const img = new Image();
          img.src = imageUrl;
        }
      });
    }
    
    function setMobileActiveImage() {
      const bgImg = document.querySelector('.bg-img');
      const activeItem = document.querySelector('.list-item.is-active');
    
      if (!bgImg || !activeItem) return;
    
      const imageUrl = activeItem.getAttribute('data-img');
      if (imageUrl) {
        bgImg.src = imageUrl;
        requestAnimationFrame(() => {
          bgImg.classList.add('active');
        });
      }
    }
    
    // Call preload once on load
    preloadHoverImages();
    
    // Setup background image logic
    const bgImg = document.querySelector('.bg-img');
    const listItems = document.querySelectorAll('.list-item');
    
    // ✅ Set default active image on mobile view
    if (window.innerWidth <= 650 && listItems.length > 0) {
      listItems[0].classList.add('is-active');
      
    }
    
    if (bgImg && listItems.length) {
      let preloadCache = {};
    
      // Preload all hover images into memory
      listItems.forEach(item => {
        const imageUrl = item.getAttribute('data-img');
        if (imageUrl) {
          const img = new Image();
          img.src = imageUrl;
          preloadCache[imageUrl] = img;
        }
      });
    
      // Hover image logic for desktop
      listItems.forEach(item => {
        const imageUrl = item.getAttribute('data-img');
    
        item.addEventListener('mouseenter', () => {
          if (!imageUrl || bgImg.src.includes(imageUrl)) return;
    
          bgImg.classList.remove('active');
    
          setTimeout(() => {
            bgImg.src = imageUrl;
            requestAnimationFrame(() => {
              bgImg.classList.add('active');
            });
          }, 300);
        });
    
        item.addEventListener('mouseleave', () => {
          bgImg.classList.remove('active');
        });
      });
    
      // Click-to-activate logic for mobile
      listItems.forEach(item => {
        item.addEventListener('click', () => {
          if (window.innerWidth <= 650) {
            listItems.forEach(i => i.classList.remove('is-active'));
            item.classList.add('is-active');
            setMobileActiveImage();
          }
        });
      });
    } else {
      console.warn("Missing .bg-img or .list-item elements");
    }
    

    





    // === Infinite Scroll Carousel with Parallax ===
    const isMobile = window.innerWidth <= 768;
const config = {
  SCROLL_SPEED: isMobile ? 2.5 : 1.75,
  LERP_FACTOR: isMobile ? 0.12 : 0.05,
  MAX_VELOCITY: isMobile ? 200 : 150,
};

    const state = {
      currentX: 0,
      targetX: 0,
      slideWidth: 0,
      slides: [],
      isDragging: false,
      startX: 0,
      lastX: 0,
      lastMouseX: 0,
      lastScrollTime: Date.now(),
      isMoving: false,
      velocity: 0,
      lastCurrentX: 0,
      dragDistance: 0,
      hasActuallyDragged: false,
    };

    function initializeSlides() {
      const track = document.querySelector(".slide-track");
      if (!track) {
        console.warn("Slide track missing");
        return;
      }
      const originalSlides = Array.from(track.children);
      if (originalSlides.length === 0) {
        console.warn("No slides found in slide track");
        return;
      }
      state.slides = [];
      const copies = 6;

      track.innerHTML = "";

      for (let i = 0; i < copies; i++) {
        originalSlides.forEach(slide => {
          const clone = slide.cloneNode(true);
          track.appendChild(clone);
          state.slides.push(clone);
        });
      }

      const slide = track.querySelector(".slide");
      if (slide) {
        state.slideWidth = slide.offsetWidth + 20;
        const startOffset = -(originalSlides.length * state.slideWidth * 2);
        state.currentX = state.targetX = startOffset;
      } else {
        console.warn("No slide elements found");
      }
    }

    function updateSlidePositions() {
      const track = document.querySelector(".slide-track");
      if (!track) return;
      const sequenceWidth = state.slideWidth * (state.slides.length / 6);

      if (state.currentX > -sequenceWidth * 1) {
        state.currentX -= sequenceWidth;
        state.targetX -= sequenceWidth;
      } else if (state.currentX < -sequenceWidth * 4) {
        state.currentX += sequenceWidth;
        state.targetX += sequenceWidth;
      }

      track.style.transform = `translate3d(${state.currentX}px, 0, 0)`;
    }

    function updateParallax() {
      const viewportCenter = window.innerWidth / 2;

      state.slides.forEach(slide => {
        const img = slide.querySelector("img");
        if (!img) return;

        const rect = slide.getBoundingClientRect();
        if (rect.right < -500 || rect.left > window.innerWidth + 500) return;

        const slideCenter = rect.left + rect.width / 2;
        const distance = slideCenter - viewportCenter;
        const offset = distance * -0.16;

        img.style.transform = `translateX(${offset}px) scale(1.64)`;
      });
    }

    function updateMovingState() {
      state.velocity = Math.abs(state.currentX - state.lastCurrentX);
      state.lastCurrentX = state.currentX;
      const isSlow = state.velocity < 0.1;
      const stillLong = Date.now() - state.lastScrollTime > 200;
      state.isMoving = state.hasActuallyDragged || !isSlow || !stillLong;
    }

    function animate() {
      state.currentX += (state.targetX - state.currentX) * config.LERP_FACTOR;

      updateMovingState();
      updateSlidePositions();
      updateParallax();

      requestAnimationFrame(animate);
    }

    function handleWheel(e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();

      const scrollDelta = e.deltaY * config.SCROLL_SPEED;
      state.targetX -= Math.max(Math.min(scrollDelta, config.MAX_VELOCITY), -config.MAX_VELOCITY);
      state.lastScrollTime = Date.now();
    }

    function handleTouchStart(e) {
      state.isDragging = true;
      state.startX = e.touches[0].clientX;
      state.lastX = state.targetX;
      state.dragDistance = 0;
      state.hasActuallyDragged = false;
      state.lastScrollTime = Date.now();
    }

    function handleTouchMove(e) {
      if (!state.isDragging) return;

      const deltaX = (e.touches[0].clientX - state.startX) * 2.5;
      state.targetX = state.lastX + deltaX;
      state.dragDistance = Math.abs(deltaX);
      if (state.dragDistance > 5) state.hasActuallyDragged = true;
      state.lastScrollTime = Date.now();
    }

    function handleTouchEnd() {
      state.isDragging = false;
      setTimeout(() => (state.hasActuallyDragged = false), 100);
    }

    function handleMouseDown(e) {
      e.preventDefault();
      state.isDragging = true;
      state.startX = e.clientX;
      state.lastMouseX = e.clientX;
      state.lastX = state.targetX;
      state.dragDistance = 0;
      state.hasActuallyDragged = false;
      state.lastScrollTime = Date.now();
    }

    function handleMouseMove(e) {
      if (!state.isDragging) return;
      e.preventDefault();

      const deltaX = (e.clientX - state.lastMouseX) * 2;
      state.targetX += deltaX;
      state.lastMouseX = e.clientX;
      state.dragDistance += Math.abs(deltaX);
      if (state.dragDistance > 5) state.hasActuallyDragged = true;
      state.lastScrollTime = Date.now();
    }

    function handleMouseUp() {
      state.isDragging = false;
      setTimeout(() => (state.hasActuallyDragged = false), 100);
    }

    function handleResize() {
      initializeSlides();
    }

    function initializeEventListeners() {
      const slider = document.querySelector(".slider");
      if (!slider) {
        console.warn("Slider container missing");
        return;
      }

      slider.addEventListener("wheel", handleWheel, { passive: false });
      slider.addEventListener("touchstart", handleTouchStart);
      slider.addEventListener("touchmove", handleTouchMove);
      slider.addEventListener("touchend", handleTouchEnd);
      slider.addEventListener("mousedown", handleMouseDown);
      slider.addEventListener("mouseleave", handleMouseUp);
      slider.addEventListener("dragstart", (e) => e.preventDefault());

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("resize", handleResize);
    }

    function preventClickWhileDragging() {
      const slides = document.querySelectorAll(".slide");
      slides.forEach(slide => {
        slide.addEventListener("click", (e) => {
          if (state.hasActuallyDragged) {
            e.preventDefault();
            e.stopPropagation();
          }
        });
      });
    }

    function initializeSlider() {
      initializeSlides();
      initializeEventListeners();
      preventClickWhileDragging();
      animate();
    }

    initializeSlider();

    document.querySelectorAll('a[data-disable-on-mobile]').forEach(link => {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 650) {
          e.preventDefault();       // Stop the browser from following the link
          e.stopImmediatePropagation(); // Stop other JS listeners (like Barba or custom nav)
          console.log('Link blocked on mobile');
        }
      });
    });
    

    
  }

  // Run entry transition, then initialize main, then add navigation listeners
  runEntryTransition().then(() => {
    initializeMain();
    addNavigationListeners();
  });
});
