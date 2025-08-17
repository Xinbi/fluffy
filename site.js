// site.js

// Inject header & footer
Promise.all([
  fetch('header.html').then(r => r.text()),
  fetch('footer.html').then(r => r.text())
]).then(([header, footer]) => {
  document.getElementById('site-header').innerHTML = header;
  document.getElementById('site-footer').innerHTML = footer;

  const links = document.querySelector('.nav-links');
  const menuBtn = document.querySelector('.menu-btn');
  if (menuBtn && links) {
    menuBtn.addEventListener('click', () => {
      const showing = getComputedStyle(links).display !== 'none';
      links.style.display = showing ? 'none' : 'flex';
    });
  }

  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}).catch(err => {
  console.error('Failed to load header/footer:', err);
});
