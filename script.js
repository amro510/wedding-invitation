// Adapter to make config properties easy to access
const CONFIG = {
  bride: (typeof config !== 'undefined' && config.brideName) || 'Layla',
  groom: (typeof config !== 'undefined' && config.groomName) || 'Youssef',
  monogram: (typeof config !== 'undefined' && config.monogram) || 'L & Y',
  date: (typeof config !== 'undefined' && config.weddingDateTime) || '2026-10-14T17:00:00',
  dateDisplay: (typeof config !== 'undefined' && config.weddingDate) || 'October 14, 2026',
  dateShort: (typeof config !== 'undefined' && config.weddingDate) || 'October 14, 2026',
  venue: (typeof config !== 'undefined' && config.venueName) || 'The Glasshouse Estate',
  city: (typeof config !== 'undefined' && config.city) || 'Alexandria',
  address: (typeof config !== 'undefined' && config.address) || 'Corniche Road, Montazah, Alexandria',
  dressCode: (typeof config !== 'undefined' && config.dressCode) || 'Black Tie Optional',
  note: (typeof config !== 'undefined' && config.note) || 'Valet parking available at the main gates.',
  mapsLink: (typeof config !== 'undefined' && config.googleMapsLink) || 'https://maps.google.com',
  rsvpBy: (typeof config !== 'undefined' && config.rsvpBy) || 'September 15, 2026',
  openingKicker: (typeof config !== 'undefined' && config.openingKicker) || 'THE BEGINNING OF FOREVER',
  heroInvitationLine: (typeof config !== 'undefined' && config.heroInvitationLine) || 'request the pleasure of your company',
  closingMessage: (typeof config !== 'undefined' && config.closingMessage) || 'Your love and presence mean everything to us.',
};

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

// Populate content dynamically
function populateConfig() {
  CONFIG.couple = `${CONFIG.bride} & ${CONFIG.groom}`;
  $$('[data-config]').forEach((element) => {
    const value = CONFIG[element.dataset.config];
    if (value !== undefined) element.textContent = value;
  });
  document.title = `${CONFIG.couple} — Wedding Invitation`;

  if (typeof config !== 'undefined' && config.heroImage) {
    const photo = $('#heroPhoto');
    if (photo) {
      photo.style.backgroundImage = `url("${config.heroImage}")`;
      photo.style.backgroundSize = 'cover';
      photo.style.backgroundPosition = 'center';
      const fallback = $('.hero-photo-fallback', photo);
      if (fallback) fallback.hidden = true;
    }
  }

  if (typeof config !== 'undefined' && config.cardImage) {
    const cardCoupleImage = $('#card-couple-image');
    if (cardCoupleImage) cardCoupleImage.src = config.cardImage;
  }

  const maps = CONFIG.mapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${CONFIG.venue}, ${CONFIG.address}`)}`;
  if ($('#mapButton')) $('#mapButton').href = maps;
  if ($('#mapPreviewLink')) $('#mapPreviewLink').href = maps;
  if ($('#directionsLink')) {
    $('#directionsLink').href = maps;
    $('#directionsLink').target = '_blank';
  }

  populateEventDetails();
  renderStory();
  populateRsvpChoices();
}

function populateEventDetails() {
  const events = (typeof config !== 'undefined' && config.events) || [];
  const [ceremony = {}, reception = {}] = events;
  if ($('#ceremonyTitle')) $('#ceremonyTitle').textContent = ceremony.title || 'Ceremony';
  if ($('#ceremonyTime')) $('#ceremonyTime').textContent = ceremony.time || '5:00 PM';
  if ($('#receptionTitle')) $('#receptionTitle').textContent = reception.title || 'Reception';
  if ($('#receptionTime')) $('#receptionTime').textContent = reception.time || '6:30 PM';
  if ($('#receptionLocation')) $('#receptionLocation').textContent = reception.location || CONFIG.venue;
}

function renderStory() {
  const container = $('#storyMoments');
  if (!container) return;
  const story = (typeof config !== 'undefined' && config.story) || [];
  if (!Array.isArray(story) || !story.length) return;
  
  container.replaceChildren();
  story.forEach((item, index) => {
    const moment = document.createElement('article');
    moment.className = `moment${index % 2 ? ' reverse' : ''}`;
    
    const image = document.createElement('div');
    image.className = 'moment-image';
    if (item.imageUrl) { 
      image.style.backgroundImage = `url("${item.imageUrl}")`; 
      image.style.backgroundSize = 'cover'; 
      image.style.backgroundPosition = 'center'; 
    }
    const number = document.createElement('span'); 
    number.textContent = String(index + 1).padStart(2, '0'); 
    image.append(number);

    const copy = document.createElement('div');
    const date = document.createElement('p'); date.className = 'eyebrow'; date.textContent = item.date || '';
    const title = document.createElement('h3'); title.textContent = item.title || '';
    const description = document.createElement('p'); description.textContent = item.description || '';
    copy.append(date, title, description); 
    moment.append(image, copy); 
    container.append(moment);
  });
}

function populateRsvpChoices() {
  const guestSelect = $('#guestCount');
  if (!guestSelect) return;
  const max = (typeof config !== 'undefined' && config.maxGuests) ? Number(config.maxGuests) : 4;
  guestSelect.replaceChildren(...Array.from({ length: max }, (_, index) => {
    const count = index + 1; 
    return new Option(count === 1 ? 'Just me' : `${count} guests`, String(count));
  }));
}

// FAIL-SAFE ENVELOPE OPENING LOGIC
function setupOpening() {
  const opening = $('#opening');
  const website = $('#website');
  const envelopeScene = $('#envelope-scene');
  const envelopeWrapper = $('#envelope-wrapper');
  const clickInstruction = $('#click-instruction');
  let isOpen = false;

  function triggerOpen(e) {
    if (e) e.stopPropagation();
    if (isOpen) return;
    isOpen = true;

    // 1. Open envelope flap
    if (envelopeScene) envelopeScene.classList.add('open');
    if (clickInstruction) clickInstruction.style.display = 'none';

    // 2. Slide card up
    setTimeout(() => {
      if (envelopeScene) envelopeScene.classList.add('pull-card');
    }, 800);

    // 3. Zoom into card
    setTimeout(() => {
      if (envelopeScene) envelopeScene.classList.add('read-card');
    }, 1800);

    // 4. Show main website smoothly
    setTimeout(() => {
      if (envelopeWrapper) envelopeWrapper.classList.add('fade-out');
      if (opening) opening.classList.add('opened');
      if (website) {
        website.removeAttribute('aria-hidden');
        website.classList.add('is-visible');
      }
    }, 3800);

    // 5. Clean up opening overlay completely
    setTimeout(() => {
      if (opening) opening.style.display = 'none';
      if (envelopeWrapper) envelopeWrapper.style.display = 'none';
    }, 5000);

    // Try playing background audio
    const bgMusic = $('#bgMusic');
    if (bgMusic) {
      bgMusic.play().then(() => {
        const toggle = $('#soundToggle');
        if (toggle) {
          toggle.setAttribute('aria-pressed', 'true');
          const span = toggle.querySelector('span');
          if (span) span.textContent = 'Sound on';
        }
      }).catch(err => console.log('Autoplay prevented:', err));
    }
  }

  // Attach click events to ALL envelope elements
  const triggers = ['#wax-seal', '#envelope-scene', '#envelope-wrapper', '#click-instruction', '.tap-hint', '#opening'];
  triggers.forEach(selector => {
    const el = $(selector);
    if (el) {
      el.addEventListener('click', triggerOpen);
      el.addEventListener('touchstart', triggerOpen, { passive: true });
    }
  });

  // Sound Toggle Control
  const toggle = $('#soundToggle');
  const bgMusic = $('#bgMusic');
  if (bgMusic) bgMusic.volume = 0.5;

  if (toggle && bgMusic) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const active = toggle.getAttribute('aria-pressed') === 'true';
      toggle.setAttribute('aria-pressed', String(!active));
      const span = toggle.querySelector('span');
      if (span) span.textContent = active ? 'Sound off' : 'Sound on';
      if (active) {
        bgMusic.pause();
      } else {
        bgMusic.play().catch(e => console.log('Audio play error:', e));
      }
    });
  }
}

// Navigation Toggle
function setupNavigation() {
  const button = $('#navMenu');
  const links = $('#navLinks');
  if (!button || !links) return;
  button.addEventListener('click', () => { 
    const open = links.classList.toggle('open'); 
    button.setAttribute('aria-expanded', String(open)); 
  });
  $$('a', links).forEach((link) => link.addEventListener('click', () => { 
    links.classList.remove('open'); 
    button.setAttribute('aria-expanded', 'false'); 
  }));
}

// Countdown Clock
function setupCountdown() {
  const ids = ['days', 'hours', 'minutes', 'seconds'];
  const update = () => {
    let remaining = new Date(CONFIG.date).getTime() - Date.now();
    if (Number.isNaN(remaining) || remaining < 0) remaining = 0;
    const values = [
      Math.floor(remaining / 86400000), 
      Math.floor(remaining / 3600000) % 24, 
      Math.floor(remaining / 60000) % 60, 
      Math.floor(remaining / 1000) % 60
    ];
    ids.forEach((id, index) => { 
      const elem = $(`#${id}`);
      if (elem) elem.textContent = String(values[index]).padStart(index ? 2 : 3, '0'); 
    });
  };
  update(); 
  setInterval(update, 1000);
}

// Scroll Reveal
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const windowHeight = window.innerHeight;

  const checkVisibility = () => {
    for (let i = 0; i < reveals.length; i++) {
      const elementTop = reveals[i].getBoundingClientRect().top;
      if (elementTop < windowHeight - 80) {
        reveals[i].classList.add('active');
      }
    }
  };

  window.addEventListener('scroll', checkVisibility);
  checkVisibility();
}

// Run functions safely when page is ready
document.addEventListener('DOMContentLoaded', () => {
  populateConfig(); 
  setupOpening(); 
  setupNavigation(); 
  setupCountdown(); 
  initScrollReveal();
});
