document.addEventListener('DOMContentLoaded', () => {
    // Entry transition
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
  
    // Navigation links
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
  
    // Preload utility
    function preloadImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });
    }
  
    // Animate image in function
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
  
        // Keep only top 2 images
        if (mobileBgImg.children.length > 2) {
          mobileBgImg.removeChild(mobileBgImg.firstChild);
        }
      }).catch(err => {
        console.error('Image failed to load:', err);
      });
    }
  
    // Initialize mobile-only list view with proper active/inactive logic and GSAP opacity tween
    function initializeMobileListView() {
        const mobileListView = document.getElementById('mobileListView');
        const mobileListItems = document.querySelectorAll('.mobile-list-item');
        const mobileBgImg = document.querySelector('.mobile-bg-img');
      
        if (!mobileListView || !mobileListItems.length || !mobileBgImg) return;
      
        // Start all items hidden (opacity 0), y offset 40
        gsap.set(mobileListItems, { opacity: 0, y: 40 });
      
        // Animate all items in
        gsap.to(mobileListItems, {
          opacity: 0.5,   // Animate to inactive opacity by default
          y: 0,
          duration: 0.6,
          stagger: 0.07,
          ease: 'power2.out',
          onComplete: () => {
            // After animation completes, set first item fully visible (active)
            const firstItem = mobileListItems[0];
            if (!firstItem) return;
      
            firstItem.classList.add('is-active');
            firstItem.classList.remove('mobile-inactive');
      
            gsap.to(firstItem, {
              opacity: 1,
              duration: 0.3,
              onStart: () => {
                // Remove inactive from first item, add inactive to all others
                mobileListItems.forEach(item => {
                  if (item !== firstItem) {
                    item.classList.add('mobile-inactive');
                    item.classList.remove('is-active');
                  }
                });
              }
            });
      
            // Animate first image in BG
            const firstImgSrc = firstItem.getAttribute('data-img');
            if (firstImgSrc) {
              animateImageIn(firstImgSrc, mobileBgImg);
            }
          }
        });
      
        // Click to switch image and toggle active/inactive with gsap opacity
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
      
      
  
    // Show/hide views based on window width <= 630px
    function updateViewVisibility() {
      const mobileListView = document.getElementById('mobileListView');
      const sliderView = document.getElementById('sliderView');
      const listView = document.getElementById('listView');
      const isMobile = window.innerWidth <= 630;
  
      if (mobileListView) {
        mobileListView.style.display = isMobile ? 'flex' : 'none';
      }
      if (sliderView) {
        sliderView.style.display = isMobile ? 'none' : 'block';
      }
      if (listView) {
        listView.style.display = isMobile ? 'none' : 'block';
      }
    }
  
    // Main initialization
    function initializeMain() {
      updateViewVisibility();
      if (window.innerWidth <= 630) {
        initializeMobileListView();
      }
    }
  
    runEntryTransition().then(() => {
      initializeMain();
      addNavigationListeners();
    });
  
    // Update views on resize
    window.addEventListener('resize', () => {
      updateViewVisibility();
      if (window.innerWidth <= 630) {
        initializeMobileListView();
      }
    });
  });
  