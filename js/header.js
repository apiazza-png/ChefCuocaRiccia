(function() {
  if (window.location.search.indexOf('preview') !== -1) return;
  var isLanding = document.body.classList.contains('landing-page');

  var header = document.createElement('header');
  header.className = 'site-header';

  var nameEl = document.createElement( isLanding ? 'span' : 'a' );
  nameEl.className = 'site-name';
  if (!isLanding) nameEl.href = '../index.html';
  nameEl.textContent = 'AURORA PIAZZA';
  header.appendChild(nameEl);

  var navRight = document.createElement('div');
  navRight.className = 'nav-right';

  if (isLanding) {
    var dropdown = document.createElement('div');
    dropdown.className = 'dropdown';

    var trigger = document.createElement('button');
    trigger.className = 'dropdown-trigger';
    trigger.textContent = 'Projects';
    dropdown.appendChild(trigger);

    var menu = document.createElement('div');
    menu.className = 'dropdown-menu';

    var projects = [
      { name: 'Uova Strapazzate', path: 'RICETTA UOVA STRAPAZZATE/codebase/index.html' },
      { name: 'Generazione di Pattern', path: 'PATTERNEXERCISE/index.html' },
      { name: 'Tipografia Cinetica', path: 'TIPOGRAFIACINETICA/index.html' },
      { name: 'Maschera Sonora', path: 'MASCHERASONORA/index.html' },
      { name: 'Manionette', path: 'MANIONETTE/index.html' }
    ];

    projects.forEach(function(p) {
      var link = document.createElement('a');
      link.href = p.path;
      link.textContent = p.name;
      menu.appendChild(link);
    });

    dropdown.appendChild(menu);
    navRight.appendChild(dropdown);

    trigger.addEventListener('click', function(e) {
      e.stopPropagation();
      var isOpen = menu.classList.toggle('open');
      trigger.classList.toggle('open', isOpen);
    });

    document.addEventListener('click', function() {
      menu.classList.remove('open');
      trigger.classList.remove('open');
    });
  } else {
    var homeLink = document.createElement('a');
    homeLink.className = 'home-link';
    homeLink.href = '../index.html';
    homeLink.textContent = 'Home';
    navRight.appendChild(homeLink);
  }

  var aboutBtn = document.createElement('button');
  aboutBtn.className = 'about-btn';
  aboutBtn.textContent = 'About';
  navRight.appendChild(aboutBtn);

  header.appendChild(navRight);
  document.body.prepend(header);

  // About modal
  var modal = document.createElement('div');
  modal.className = 'about-modal';

  var modalContent = document.createElement('div');
  modalContent.className = 'about-modal-content';

  var closeBtn = document.createElement('button');
  closeBtn.className = 'about-modal-close';
  closeBtn.innerHTML = '&times;';
  modalContent.appendChild(closeBtn);

  var text = document.createElement('div');
  text.className = 'about-modal-text';
  text.innerHTML =
    '<p>Sito sviluppato durante il workshop <strong>"No brain, No Gain"</strong>,<br>' +
    'tenuto da <strong>whateverDev</strong> (Andrea Maffei &amp; Rocco Lorenzo Modugno),<br>' +
    '18-22 Maggio 2026, all&rsquo;interno dei corsi:</p>' +
    '<br>' +
    '<p><strong>Interaction Design 2</strong><br>' +
    'Prof. Alessia Scudieri</p>' +
    '<br>' +
    '<p><strong>Interaction Design 3</strong><br>' +
    'Prof. Andrea Leonardi<br>' +
    'Prof. Marcantonio D&rsquo;Antoni</p>' +
    '<br>' +
    '<p><strong>ABADIR</strong><br>' +
    'Accademia di Design e Comunicazione Visiva<br>' +
    'Sant&rsquo;Agata li Battiati CT<br>' +
    'AA 2025-26</p>';
  modalContent.appendChild(text);

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  aboutBtn.addEventListener('click', function() {
    modal.classList.add('open');
  });

  closeBtn.addEventListener('click', function() {
    modal.classList.remove('open');
  });

  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.classList.remove('open');
    }
  });
})();
