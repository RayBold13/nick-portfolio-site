document.addEventListener('DOMContentLoaded', () => {
    // --- Entry Transition ---
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
  
    // --- Navigation Links ---
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
  
    // --- Original main logic start ---
  
    // Example: btnList logic for small screen padding adjustment
    const btnList = document.getElementById('btn-list');
    const projectHeader = document.querySelector('.project-header');
    if (btnList) {
      btnList.addEventListener('click', () => {
        if (window.innerWidth <= 635) {
          projectHeader.classList.add('sm:padding-inline-12', 'sm:fixed-top-100');
        }
      });
    }
  
    // --- View Toggle & List Animation ---
    function originalInitializeMain() {
      const btnSlider = document.getElementById("btn-slider");
      const btnList = document.getElementById("btn-list");
      const sliderView = document.getElementById("sliderView");
      const listView = document.getElementById("listView");
  
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
            listView.classList.remove("is-hidden");
            sliderView.classList.add("is-hidden");
  
            animateListItemsIn();
  
            if (window.innerWidth <= 650) {
              setTimeout(() => {
                setMobileActiveImage();
              }, 500);
            }
          });
        });
      } else {
        console.warn("Toggle or view elements missing");
      }
  
      // Preload hover images and background image logic
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
        const bgImg = document.querySelector('.work-bg-img img');
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
  
      preloadHoverImages();
  
      const bgImg = document.querySelector('.work-bg-img img');
      const listItems = document.querySelectorAll('.list-item');
  
      if (window.innerWidth <= 650 && listItems.length > 0) {
        listItems[0].classList.add('is-active');
      }
  
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
  
      // Infinite Scroll Carousel & Parallax Logic (unchanged)
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
  
      function handleResize() {
        initializeSlides();
      }
  
      function initializeSlider() {
        initializeSlides();
        initializeEventListeners();
        preventClickWhileDragging();
        animate();
      }
  
      initializeSlider();
  
      // Disable certain links on mobile
      document.querySelectorAll('a[data-disable-on-mobile]').forEach(link => {
        link.addEventListener('click', (e) => {
          if (window.innerWidth <= 650) {
            e.preventDefault();
            e.stopImmediatePropagation();
            console.log('Link blocked on mobile');
          }
        });
      });
    }
  
    // --- New Mobile List View Logic & DOM removal ---
  
    // Animate new mobile background images in with clip-path tween
    function preloadImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });
    }
  
    function animateImageIn(imgSrc, mobileBgImg) {
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
          ease: 'power2.out',
        });
  
        if (mobileBgImg.children.length > 2) {
          mobileBgImg.removeChild(mobileBgImg.firstChild);
        }
      }).catch(err => {
        console.error('Image failed to load:', err);
      });
    }
  
    // Initialize mobile list view with active/inactive item opacity logic and BG image animation
    function initializeMobileListView() {
      const mobileListView = document.getElementById('mobileListView');
      const mobileListItems = document.querySelectorAll('.mobile-list-item');
      const mobileBgImg = document.querySelector('.mobile-bg-img');
  
      if (!mobileListView || !mobileListItems.length || !mobileBgImg) return;
  
      gsap.set(mobileListItems, { opacity: 0, y: 40 });
  
      gsap.to(mobileListItems, {
        opacity: 0.5,
        y: 0,
        duration: 0.6,
        stagger: 0.07,
        ease: 'power2.out',
        onComplete: () => {
          const firstItem = mobileListItems[0];
          if (!firstItem) return;
  
          firstItem.classList.add('is-active');
          firstItem.classList.remove('mobile-inactive');
  
          gsap.to(firstItem, {
            opacity: 1,
            duration: 0.3,
            onStart: () => {
              mobileListItems.forEach(item => {
                if (item !== firstItem) {
                  item.classList.add('mobile-inactive');
                  item.classList.remove('is-active');
                }
              });
            }
          });
  
          const firstImgSrc = firstItem.getAttribute('data-img');
          if (firstImgSrc) {
            animateImageIn(firstImgSrc, mobileBgImg);
          }
        }
      });
  
      mobileListItems.forEach(item => {
        item.addEventListener('click', () => {
          const imgSrc = item.getAttribute('data-img');
          if (!imgSrc) return;
  
          mobileListItems.forEach(i => {
            if (i === item) {
              i.classList.add('is-active');
              i.classList.remove('mobile-inactive');
              gsap.to(i, { opacity: 1, duration: 0.3 });
            } else {
              i.classList.remove('is-active');
              i.classList.add('mobile-inactive');
              gsap.to(i, { opacity: 0.5, duration: 0.3 });
            }
          });
  
          animateImageIn(imgSrc, mobileBgImg);
        });
      });
    }
  
    // Show/hide views AND remove sliderView & listView from DOM on mobile (<= 650px)
    function updateViewVisibility() {
      const mobileListView = document.getElementById('mobileListView');
      const sliderView = document.getElementById('sliderView');
      const listView = document.getElementById('listView');
      const isMobile = window.innerWidth <= 650;
  
      if (mobileListView) {
        mobileListView.style.display = isMobile ? 'flex' : 'none';
      }
  
      if (sliderView) {
        if (isMobile) {
          sliderView.remove(); // Remove from DOM entirely on mobile
        } else {
          // Re-add if needed? (Optional: depends on your page structure)
          // If you want to re-add on resize back to desktop, you'd need to cache it or reload page
        }
      }
  
      if (listView) {
        if (isMobile) {
          listView.remove(); // Remove from DOM entirely on mobile
        } else {
          // Same as above for re-adding
        }
      }
    }
  
    // Main initialize function: runs original main logic and mobile list view when appropriate
    function initializeMain() {
      updateViewVisibility();
  
      if (window.innerWidth <= 650) {
        initializeMobileListView();
      } else {
        originalInitializeMain();
      }
    }
  
    // Run entry transition, then initialize
    runEntryTransition().then(() => {
      initializeMain();
      addNavigationListeners();
    });
  
    // Update on window resize: re-run visibility & mobile list logic
    window.addEventListener('resize', () => {
      initializeMain();
    });
  });
  