document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.track').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    document.getElementById('track-' + this.dataset.track).classList.add('active');
  });
});

document.querySelectorAll('.unlock-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.getElementById('modal-text').textContent =
      `Le paiement en ligne n'est pas encore branché sur ce portail. Contacte Zézé directement pour un accès anticipé à "${this.dataset.module}".`;
    document.getElementById('modal-overlay').classList.add('visible');
  });
});
document.getElementById('modal-close').addEventListener('click', function () {
  document.getElementById('modal-overlay').classList.remove('visible');
});

document.getElementById('interest-form').addEventListener('submit', function (e) {
  e.preventDefault();
  document.getElementById('confirmation-text').textContent = "Merci, tu seras informé dès l'ouverture des accès payants.";
  this.style.display = 'none';
  document.getElementById('confirmation').classList.add('visible');
});
