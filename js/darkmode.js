const toggle = document.getElementById('theme-toggle');
const menuLinkSelected = document.querySelector('.selected');

    toggle.addEventListener('change', () => {
      document.body.classList.toggle('dark-mode', toggle.checked);
      document.menuLinkSelected.classList.toggle('dark-mode', toggle.checked);
    });
