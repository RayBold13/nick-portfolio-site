document.addEventListener("DOMContentLoaded", () => {
    gsap.set(".slide", {
      clipPath: "polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)"
    });
  
    gsap.set(".slide-info", { opacity: 0 });
  
    gsap.set([
      ".desktop-nav .nav-item span",
      ".desktop-nav .view-toggle li",
      ".desktop-nav .nav-container li"
    ], {
      opacity: 0,
      y: 20
    });
  
    const enterButton = document.querySelector(".control-btn-primary");
    const reverseBtn = document.getElementById("reverse-btn");
    const soundBtn = document.getElementById("sound-btn");
    const video = document.querySelector(".showreel video");
  
    if (enterButton) {
      enterButton.addEventListener("click", () => {
        gsap.set(".video-controls", { autoAlpha: 0 });
  
        const tl = gsap.timeline({
          onComplete: () => {
            // Dispatch custom event to trigger main UI
            document.dispatchEvent(new Event("preloader:complete"));
          }
        });
  
        // 1. Fade out video
        tl.to(video, {
          scale: 1.05,
          y: -40,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => {
            if (video) {
              video.pause();
              video.src = "";
              video.load();
              video.remove();
            }
          }
        });
  
        // 2. Fade out overlay
        tl.to(".showreel", {
          autoAlpha: 0,
          duration: 0.6,
          ease: "power2.out"
        }, ">-0.4");
  
        // 🔥 Slide + nav animations are now handled by main.js
      });
    }
  
    // Reverse
    if (reverseBtn) {
      reverseBtn.addEventListener("click", () => {
        if (video) {
          video.currentTime = 0;
          video.play();
        }
      });
    }
  
    // Sound toggle
    if (soundBtn) {
      soundBtn.addEventListener("click", () => {
        if (video) {
          video.muted = !video.muted;
          const icon = soundBtn.querySelector("img");
          if (icon) {
            icon.src = video.muted ? "/icons/play-rounded.svg" : "/icons/pause-rounded.svg";
          }
        }
      });
    }
  });
  