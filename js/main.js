document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mainNav.classList.remove('open'));
});

// Service tabs
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-panel');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.querySelector(`.tab-panel[data-panel="${tab.dataset.tab}"]`).classList.add('active');
  });
});

// Before & After filter tabs
const baTabs = document.querySelectorAll('#baTabs .tab');
const baCards = document.querySelectorAll('.ba-card');
baTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    baTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const cat = tab.dataset.batab;
    baCards.forEach(card => {
      card.classList.toggle('ba-hidden', cat !== 'all' && card.dataset.bacat !== cat);
    });
  });
});

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// Price list lightbox
const priceLightbox = document.getElementById('priceLightbox');
document.getElementById('openPriceList').addEventListener('click', () => priceLightbox.classList.add('open'));
document.getElementById('closePriceList').addEventListener('click', () => priceLightbox.classList.remove('open'));
priceLightbox.addEventListener('click', (e) => {
  if (e.target === priceLightbox) priceLightbox.classList.remove('open');
});

// Contact form -> WhatsApp
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(contactForm);
  const name = data.get('name') || '';
  const phone = data.get('phone') || '';
  const service = data.get('service') || '';
  const message = data.get('message') || '';
  const text = `Hi Hi Girl Advanced Cosmetology Center, I'd like to book a consultation.%0A%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AInterested in: ${encodeURIComponent(service)}%0AMessage: ${encodeURIComponent(message)}`;
  window.open(`https://wa.me/919493079179?text=${text}`, '_blank');
});
