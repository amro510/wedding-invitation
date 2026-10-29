// Adapter to make config properties easy to access
const CONFIG = {
  bride: config.brideName,
  groom: config.groomName,
  monogram: config.monogram,
  date: config.weddingDateTime,
  dateDisplay: config.weddingDate,
  dateShort: config.weddingDate,
  venue: config.venueName,
  city: config.city,
  address: config.address,
  dressCode: config.dressCode,
  note: config.note,
  mapsLink: config.googleMapsLink,
  rsvpBy: config.rsvpBy,
  openingKicker: config.openingKicker,
  heroInvitationLine: config.heroInvitationLine,
  closingMessage: config.closingMessage,
};

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];  // Submission handler for Google Apps Script async function sendSubmission(source, submission) { const endpoint = (config.submissionEndpoint \vert{}\vert{} '').trim(); if (!endpoint) throw new Error('missing-endpoint');  let payload; if (source === 'rsvp') { payload = { type: 'rsvp', date: new Date().toLocaleDateString(), name: submission.guestName, attending: submission.attendance.includes('accept') ? 'yes' : 'no', guests: submission.attendance.includes('accept') ? submission.guestCount : 0, meal: submission.meal \vert{}\vert{} '', contact: submission.contact \vert{}\vert{} '' }; } else if (source === 'guestbook') { payload = { type: 'guestbook', date: new Date().toLocaleDateString(), name: submission.guestName, message: submission.message, drawingData: submission.drawingDataUrl \vert{}\vert{} '' }; }    await fetch(endpoint, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) }); }  // Populate content dynamically from config.js function populateConfig() { CONFIG.couple = `${CONFIG.bride} & ${CONFIG.groom}`; $$('[data-config]').forEach((element) => {
    const value = CONFIG[element.dataset.config];
    if (value !== undefined) element.textContent = value;
  });
  document.title = `${CONFIG.couple} — Wedding Invitation`;
  
  const descMeta = document.querySelector('meta[name="description"]');
  if (descMeta) descMeta.content = `A wedding invitation for ${CONFIG.couple}.`;

  if (config.heroImage) {
    const photo = $('#heroPhoto');
    if (photo) {
      photo.style.backgroundImage = `url("${config.heroImage}")`;
      photo.style.backgroundSize = 'cover';
      photo.style.backgroundPosition = 'center';
      const fallback = $('.hero-photo-fallback', photo);
      if (fallback) fallback.hidden = true;
    }
  }

  if (config.cardImage) {
    const cardCoupleImage = $('#card-couple-image');
    if (cardCoupleImage) cardCoupleImage.src = config.cardImage;
  }

  const maps = CONFIG.mapsLink && CONFIG.mapsLink !== '[Maps Link]'
    ? CONFIG.mapsLink
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${CONFIG.venue},${CONFIG.address}`)}`;

  if ($('#mapButton')) $('#mapButton').href = maps;
  if ($('#mapPreviewLink')) $('#mapPreviewLink').href = maps;
  if ($('#directionsLink')) {
    $('#directionsLink').href = maps;
    $('#directionsLink').target = '_blank';
  }

  if (config.mapEmbedUrl) {
    const embed = $('#mapEmbed');
    if (embed) {
      embed.src = config.mapEmbedUrl;
      embed.hidden = false;
    }
  }

  populateEventDetails();
  renderStory();
  populateRsvpChoices();
}

function populateEventDetails() {
  const [ceremony = {}, reception = {}] = config.events || [];
  if ($('#ceremonyTitle')) $('#ceremonyTitle').textContent = ceremony.title || 'Ceremony';
  if ($('#ceremonyTime')) $('#ceremonyTime').textContent = ceremony.time || '';
  if ($('#receptionTitle')) $('#receptionTitle').textContent = reception.title || 'Reception';
  if ($('#receptionTime')) $('#receptionTime').textContent = reception.time || '';
  if ($('#receptionLocation')) $('#receptionLocation').textContent = (reception.location || CONFIG.venue).replace('[Venue Name]', CONFIG.venue);
}

function renderStory() {
  const container = $('#storyMoments');
  if (!container
