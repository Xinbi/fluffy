// site.js

// Inject shared <head> elements
fetch('head.html')
  .then(r => r.text())
  .then(headContent => {
    document.head.insertAdjacentHTML('beforeend', headContent);
    if (!document.title) {
      document.title = "The Church of Her Holy Fluff";
    }
  });

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

(function(){
function setEnabled(on){
  const cert = document.getElementById('btnCert');
  const donate = document.getElementById('btnDonate');
  [cert, donate].forEach(a=>{
	if(!a) return;
	if(on){
	  a.removeAttribute('aria-disabled');
	  a.classList.remove('is-disabled');
	  a.style.pointerEvents = '';
	  a.style.opacity = '';
	} else {
	  a.setAttribute('aria-disabled', 'true');
	  a.classList.add('is-disabled');
	  a.style.pointerEvents = 'none';
	  a.style.opacity = '0.6';
	}
  });
}
setEnabled(false);
const box = document.getElementById('chkDone');
box && box.addEventListener('change', ()=> setEnabled(box.checked));
})();