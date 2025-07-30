document.addEventListener('DOMContentLoaded', () => {
    const imagePaths = [
        'assets/images/Collaborator._Def_Jam .webp',
        '/assets/images/Collaborator._Canon.webp',
        'assets/images/Collaborator._Vogue.webp',
      'assets/images/Collaborator_JBL.webp',
      '/assets/images/Nick_Anderson_HS.jpg',
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
  
        imgContainer.appendChild(img);
        currentImg = img;
  
        gsap.to(img, {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
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
      });
    });
  });



  
  