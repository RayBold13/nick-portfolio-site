document.addEventListener('DOMContentLoaded', () => {
    // --- Transition Logic ---
    function runEntryTransition() {
      return new Promise(resolve => {
        if (sessionStorage.getItem('navigationTriggered') === 'true') {
          gsap.set('.container-block', { y: '0%' });
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
          gsap.set('.container-block', { y: '100%' });
          resolve();
        }
      });
    }
  
    function addNavigationListeners() {
      document.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', e => {
          const href = link.getAttribute('href');
          if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
  
          e.preventDefault();
          sessionStorage.setItem('navigationTriggered', 'true');
  
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
  
    function initializeMain() {
      const btnSlider = document.getElementById("btn-slider");
      const btnList = document.getElementById("btn-list");
      const sliderView = document.getElementById("sliderView");
      const listView = document.getElementById("listView");
  
      const isMobile = window.innerWidth <= 768;
  
      if (btnSlider && btnList && sliderView && listView) {
        const collapseSlides = () => {
          return new Promise(resolve => {
            const slides = document.querySelectorAll("#sliderView .slide");
            const slideInfos = document.querySelectorAll("#sliderView .slide-info");
  
            const tl = gsap.timeline({ onComplete: resolve });
            tl.to(slides, {
              clipPath: "inset(50% 0% 50% 0%)",
              duration: 0.5,
              stagger: 0.05,
              ease: "power2.inOut"
            }, 0);
            tl.to(slideInfos, {
              opacity: 0,
              duration: 0.3,
              stagger: 0.05,
              ease: "power2.out"
            }, 0);
          });
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
          const tl = gsap.timeline({
            onComplete: () => {
              listView.classList.add("is-hidden");
              sliderView.classList.remove("is-hidden");
  
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
          
              const isMobile = window.innerWidth <= 768;
          
              if (isMobile) {
                const mobileListView = document.getElementById('mobileListView');
                if (!mobileListView) return;
          
                const mobileListItems = mobileListView.querySelectorAll('.mobile-list-item');
                if (mobileListItems.length === 0) return;
          
                const mobileBgImg = document.querySelector('.mobile-bg-img');
                if (!mobileBgImg) return;
          
                const firstItem = mobileListItems[0];
                const firstImgSrc = firstItem?.getAttribute('data-img');
                if (!firstImgSrc) return;
          
                // Show mobile list view container
                mobileListView.classList.remove('d-none');
          
                // Immediately hide list items to prevent flash
                gsap.set(mobileListItems, { opacity: 0, y: 40 });
          
                // Preload and animate image in
                preloadImage(firstImgSrc).then((newImg) => {
                  Object.assign(newImg.style, {
                    clipPath: 'polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    top: 0,
                    left: 0,
                    willChange: 'clip-path',
                    zIndex: mobileBgImg.children.length + 1,
                  });
          
                  mobileBgImg.appendChild(newImg);
          
                  gsap.to(newImg, {
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                    duration: 1,
                    ease: 'power3.out',
                    onComplete: () => {
                      // Animate list items AFTER image reveal completes
                      gsap.to(mobileListItems, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        stagger: 0.07,
                        ease: "power2.out"
                      });
                    }
                  });
          
                  // Keep only top 2 images to prevent buildup
                  if (mobileBgImg.children.length > 2) {
                    mobileBgImg.removeChild(mobileBgImg.firstChild);
                  }
                }).catch(err => {
                  console.error('Error preloading image:', err);
                });
              } else {
                listView.classList.remove("is-hidden");
                sliderView.classList.add("is-hidden");
                animateListItemsIn();
              }
            });
          });
          
          
          
      }
  
     // === Mobile List Reveal ===
const mobileBgImg = document.querySelector('.mobile-bg-img');
const mobileListView = document.getElementById('mobileListView');
const mobileListItems = document.querySelectorAll('#mobileListView .mobile-list-item');

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
    Object.assign(newImg.style, {
      clipPath: 'polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)',
      position: 'absolute',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      top: 0,
      left: 0,
      willChange: 'clip-path',
      zIndex: mobileBgImg.children.length + 1,
    });

    mobileBgImg.appendChild(newImg);

    gsap.to(newImg, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      duration: 1,
      ease: 'power3.out',
    });

    if (mobileBgImg.children.length > 2) {
      mobileBgImg.removeChild(mobileBgImg.firstChild);
    }
  }).catch((err) => {
    console.error('Image failed to load:', err);
  });
}

// Animate first image on load
if (mobileListView) {


  // Click to switch image + active state
  mobileListItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.getAttribute('data-img');
      if (!imgSrc) return;

      mobileListItems.forEach(i => {
        i.classList.remove('is-active', 'mobile-inactive');
      });

      item.classList.add('is-active');

      mobileListItems.forEach(i => {
        if (!i.classList.contains('is-active')) {
          i.classList.add('mobile-inactive');
        }
      });

      animateImageIn(imgSrc);
    });
  });
}

  
      // Preloader animation
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
  
      // Preload desktop hover images
      const listItems = document.querySelectorAll('.list-item');
      const bgImg = document.querySelector('.work-bg-img img');
  
      if (bgImg && listItems.length) {
        let preloadCache = {};
        listItems.forEach(item => {
          const imageUrl = item.getAttribute('data-img');
          if (imageUrl) {
            const img = new Image();
            img.src = imageUrl;
            preloadCache[imageUrl] = img;
          }
        });
  
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
      }
  
      // Infinite Scroll Carousel
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
        if (!track) return;
  
        const originalSlides = Array.from(track.children);
        if (originalSlides.length === 0) return;
  
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
        if (!slider) return;
  
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
    }
  
    runEntryTransition().then(() => {
      initializeMain();
      addNavigationListeners();
    });
  });
  