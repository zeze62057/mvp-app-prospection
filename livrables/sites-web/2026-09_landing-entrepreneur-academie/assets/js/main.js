document.getElementById('waitlist-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const nom = document.getElementById('wl-nom').value.trim();
  const form = document.getElementById('waitlist-form');
  const confirmation = document.getElementById('confirmation');
  document.getElementById('confirmation-text').textContent =
    `Merci ${nom}, tu es sur la liste. On te préviendra dès l'ouverture d'Entrepreneur Académie.`;
  form.style.display = 'none';
  confirmation.classList.add('visible');
});
