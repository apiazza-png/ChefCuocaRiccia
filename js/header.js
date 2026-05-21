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
      { name: 'Uova Strapazzate', path: '../RICETTA UOVA STRAPAZZATE/codebase/index.html' },
      { name: 'Generazione di Pattern', path: '../PATTERNEXERCISE/index.html' },
      { name: 'Tipografia Cinetica', path: '../TIPOGRAFIACINETICA/index.html' },
      { name: 'Maschera Sonora', path: '../MASCHERASONORA/index.html' },
      { name: 'Manionette', path: '../MANIONETTE/index.html' }
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

  header.appendChild(navRight);
  document.body.prepend(header);
})();
