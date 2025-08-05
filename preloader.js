document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("showreel-video");
  const reverseBtn = document.getElementById("reverse-btn");
  const soundBtn = document.getElementById("sound-btn");

  if (!video || !reverseBtn || !soundBtn) {
    console.warn("Missing video or control buttons.");
    return;
  }

  // Reverse button: jump to start and play
  reverseBtn.addEventListener("click", () => {
    video.currentTime = 0;
    video.play();
  });

  // Sound toggle button: mute/unmute
  soundBtn.addEventListener("click", () => {
    video.muted = !video.muted;

    const icon = soundBtn.querySelector("img");
    if (icon) {
      icon.src = video.muted
        ? "/icons/play-rounded.svg"
        : "/icons/pause-rounded.svg";
    }
  });
});
