(function() {
  'use strict';

  var projects = [
    {
      name: 'Uova Strapazzate', icon: '🍳',
      tagline: 'La colazione perfetta ti aspetta',
      path: 'RICETTA UOVA STRAPAZZATE/codebase/index.html',
      previewImage: 'RICETTAUOVASTRAPAZZATEANTEPRIMA.png'
    },
    {
      name: 'Generazione di Pattern', icon: '〰️',
      tagline: 'Dove le linee prendono vita',
      path: 'PATTERNEXERCISE/index.html',
      previewImage: 'PATTERNEXERCISEANTEPRIMA.png'
    },
    {
      name: 'Tipografia Cinetica', icon: '✍️',
      tagline: 'Parole che danzano nello spazio',
      path: 'TIPOGRAFIACINETICA/index.html',
      previewImage: 'TIPOGRAFIACINETICAANTEPRIMA.png'
    },
    {
      name: 'Maschera Sonora', icon: '🎵',
      tagline: 'Il suono prende forma',
      path: 'MASCHERASONORA/index.html',
      previewImage: 'MASCHERASONORAANTEPRIMA.png'
    },
    {
      name: 'Manionette', icon: '🖐️',
      tagline: 'Il gesto crea geometria',
      path: 'MANIONETTE/index.html',
      previewImage: 'MANIONETTEANTEPRIMA.png'
    }
  ];

  var canvas = document.getElementById('orbital-canvas');
  var ctx = canvas.getContext('2d');
  var halo = document.getElementById('cursorHalo');
  var transition = document.getElementById('pageTransition');

  var angle = 0;
  var isHovering = false;
  var hoveredIndex = -1;
  var mouseX = 0;
  var mouseY = 0;
  var cursorX = 0;
  var cursorY = 0;
  var centerX = 0;
  var centerY = 0;
  var radiusX = 0;
  var radiusY = 0;
  var cardData = [];
  var startTime = null;

  function resize() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    centerX = w / 2;
    centerY = h / 2;
    radiusX = Math.min(w, h) * 0.44;
    radiusY = radiusX * 0.6;
  }

  function getCardAngle(index, totalSlots) {
    var spacing = (Math.PI * 2) / totalSlots;
    return -Math.PI / 2 + index * spacing;
  }

  function buildCards() {
    var totalSlots = projects.length;
    document.querySelectorAll('.project-card').forEach(function(el) { el.remove(); });
    cardData = [];

    for (var i = 0; i < totalSlots; i++) {
      var p = projects[i];

      var card = document.createElement('div');
      card.className = 'project-card';

      var textBox = document.createElement('div');
      textBox.className = 'card-text-box';

      var titleEl = document.createElement('div');
      titleEl.className = 'card-title';
      titleEl.textContent = p.name;
      textBox.appendChild(titleEl);

      var taglineEl = document.createElement('div');
      taglineEl.className = 'card-tagline';
      taglineEl.textContent = p.tagline;
      textBox.appendChild(taglineEl);

      card.appendChild(textBox);

      var preview = document.createElement('div');
      preview.className = 'card-preview';
      card.appendChild(preview);

      var bobDelay = Math.random() * Math.PI * 2;

      card.addEventListener('mouseenter', function(idx) {
        return function() {
          isHovering = true;
          hoveredIndex = idx;
          var previewEl = projects[idx]._card.querySelector('.card-preview');
          if (!previewEl) return;
          var p = projects[idx];
          if (p.previewImage && !previewEl.querySelector('img')) {
            var img = document.createElement('img');
            img.src = p.previewImage;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            previewEl.appendChild(img);
          } else if (p.preview && !previewEl.querySelector('iframe')) {
            var pData = p.preview;
            var iframe = document.createElement('iframe');
            iframe.src = p.path + '?preview';
            iframe.loading = 'lazy';
            iframe.style.transform = 'scale(' + pData.scale + ')';
            iframe.style.transformOrigin = pData.originX + ' ' + pData.originY;
            iframe.style.width = (100 / pData.scale) + '%';
            iframe.style.height = (100 / pData.scale) + '%';
            iframe.style.position = 'absolute';
            iframe.style.left = '0';
            iframe.style.top = '0';
            previewEl.appendChild(iframe);
          }
        };
      }(i));

      card.addEventListener('mouseleave', function() {
        isHovering = false;
        hoveredIndex = -1;
      });

      card.addEventListener('click', function(path) {
        return function() {
          transition.classList.add('active');
          setTimeout(function() {
            window.location.href = path;
          }, 400);
        };
      }(p.path));

      p._card = card;
      cardData.push({ el: card, bobDelay: bobDelay });

      document.querySelector('.landing-main').appendChild(card);
    }
  }

  function updatePositions(time) {
    var totalSlots = cardData.length;
    var cardW = 300;
    var cardH = 220;

    for (var i = 0; i < totalSlots; i++) {
      var data = cardData[i];

      var rawAngle = getCardAngle(i, totalSlots);
      var cardAngle = rawAngle + angle;
      var x = centerX + Math.cos(cardAngle) * radiusX;
      var y = centerY + Math.sin(cardAngle) * radiusY;

      var el = data.el;

      var bob = Math.sin(time * 1.5 + data.bobDelay) * 5;

      var depth = Math.sin(cardAngle);
      var depthScale = 1 + depth * 0.12;
      var rotateY = -cardAngle * (180 / Math.PI) * 0.15;

      if (isHovering && hoveredIndex === i) {
        var towardX = (centerX - x) * 0.15;
        var towardY = (centerY - y) * 0.15;
        el.style.left = (x - cardW / 2 + towardX) + 'px';
        el.style.top = (y - cardH / 2 + towardY + bob) + 'px';
        el.style.transform = 'scale(' + (1.2 * depthScale) + ') rotateY(' + rotateY + 'deg)';
        el.style.borderColor = '#AD1F23';
        el.style.boxShadow = '0 0 30px rgba(173,31,35,0.3)';
        el.style.zIndex = 10;
      } else if (isHovering) {
        el.style.left = (x - cardW / 2) + 'px';
        el.style.top = (y - cardH / 2 + bob) + 'px';
        el.style.transform = 'scale(' + (0.92 * depthScale) + ') rotateY(' + rotateY + 'deg)';
        el.style.borderColor = 'rgba(255,255,255,0.08)';
        el.style.boxShadow = 'none';
        el.style.zIndex = 1;
      } else {
        var nudgeX = (mouseX / window.innerWidth - 0.5) * 4;
        var nudgeY = (mouseY / window.innerHeight - 0.5) * 4;
        el.style.left = (x - cardW / 2 + nudgeX) + 'px';
        el.style.top = (y - cardH / 2 + bob + nudgeY) + 'px';
        el.style.transform = 'scale(' + depthScale + ') rotateY(' + rotateY + 'deg)';
        el.style.borderColor = 'rgba(255,255,255,0.08)';
        el.style.boxShadow = 'none';
        el.style.zIndex = Math.round((depth + 1) * 5);
      }
    }
  }

  function drawTrack(progress) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(254,253,248,0.08)';
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 12]);
    ctx.lineDashOffset = -progress * 100;
    ctx.stroke();

    if (isHovering && hoveredIndex >= 0) {
      var totalSlots = cardData.length;
      var cardAngle = getCardAngle(hoveredIndex, totalSlots) + angle;
      var arcStart = cardAngle - 0.4;
      var arcEnd = cardAngle + 0.4;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, arcStart, arcEnd);
      ctx.strokeStyle = 'rgba(173,31,35,0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.stroke();
    }
  }

  function animate(timestamp) {
    if (startTime === null) startTime = timestamp;
    var dt = Math.min((timestamp - startTime) / 1000, 0.1);
    startTime = timestamp;

    if (!isHovering) {
      angle += dt * 0.18;
    }

    var progress = angle / (Math.PI * 2);
    var time = timestamp / 1000;

    drawTrack(progress);
    updatePositions(time);

    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    halo.style.left = cursorX + 'px';
    halo.style.top = cursorY + 'px';

    requestAnimationFrame(animate);
  }

  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mouseover', function(e) {
    var card = e.target.closest('.project-card');
    if (card) {
      halo.classList.add('expanded');
    }
  });

  document.addEventListener('mouseout', function(e) {
    var card = e.target.closest('.project-card');
    if (card) {
      halo.classList.remove('expanded');
    }
  });

  window.addEventListener('resize', resize);
  resize();

  buildCards();
  for (var i = 0; i < cardData.length; i++) {
    var data = cardData[i];
    var cardAngle = getCardAngle(i, cardData.length) + angle;
    var x = centerX + Math.cos(cardAngle) * radiusX;
    var y = centerY + Math.sin(cardAngle) * radiusY;
    data.el.style.left = (x - 150) + 'px';
    data.el.style.top = (y - 110) + 'px';
  }

  requestAnimationFrame(animate);
})();
