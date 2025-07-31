
  const btnList = document.getElementById('btn-list');
  const projectHeader = document.querySelector('.project-header');

  btnList.addEventListener('click', () => {
    if (window.innerWidth <= 635) {
      projectHeader.classList.add('sm:padding-inline-12', 'sm:fixed-top-100');
    }
  });