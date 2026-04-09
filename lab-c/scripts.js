let map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  attribution: '© CartoDB'
}).addTo(map);

document.getElementById('getLocation').onclick = () => {
  navigator.geolocation.getCurrentPosition(p => {
    map.setView([p.coords.latitude, p.coords.longitude], 15);
    L.marker([p.coords.latitude, p.coords.longitude]).addTo(map);
  });
};

document.getElementById('notifPerm').onclick = () => Notification.requestPermission();

document.getElementById('downloadMap').onclick = async () => {
  const table = document.getElementById('shuffledTable');
  const drop = document.getElementById('dropZone');
  const raster = document.getElementById('rasterMap');

  table.innerHTML = drop.innerHTML = raster.innerHTML = '';

  const mapArea = document.getElementById('map');
  const tempCanvas = document.createElement('canvas');
  const ctx = tempCanvas.getContext('2d');

  tempCanvas.width = mapArea.clientWidth;
  tempCanvas.height = mapArea.clientHeight;

  const tiles = Array.from(document.querySelectorAll('.leaflet-tile'));
  let loadedTiles = 0;

  tiles.forEach(tile => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = tile.src;

    const rect = tile.getBoundingClientRect();
    const mapRect = mapArea.getBoundingClientRect();

    img.onload = () => {
      ctx.drawImage(img, rect.left - mapRect.left, rect.top - mapRect.top, rect.width, rect.height);
      loadedTiles++;

      if (loadedTiles === tiles.length) {
        const finalImg = tempCanvas.toDataURL();
        raster.innerHTML = `<img src="${finalImg}" style="width:100%; height:100%;">`;
        createPuzzles(tempCanvas);
      }
    };
  });
};

function createPuzzles(sourceCanvas) {
  const table = document.getElementById('shuffledTable');
  const s = 4;
  const w = sourceCanvas.width / s;
  const h = sourceCanvas.height / s;

  for (let i = 0; i < s * s; i++) {
    const pc = document.createElement('canvas');
    pc.width = w; pc.height = h;
    const row = Math.floor(i / s);
    const col = i % s;

    pc.getContext('2d').drawImage(sourceCanvas, col * w, row * h, w, h, 0, 0, w, h);

    const piece = document.createElement('div');
    piece.className = 'puzzle-piece';
    piece.style.backgroundImage = `url(${pc.toDataURL()})`;
    piece.style.width = `${w}px`;
    piece.style.height = `${h}px`;


    piece.dataset.correctRow = row;
    piece.dataset.correctCol = col;
    piece.dataset.id = i;

    
    piece.style.left = Math.random() * (table.clientWidth - w) + 'px';
    piece.style.top = Math.random() * (table.clientHeight - h) + 'px';
    piece.draggable = true;

    setupDrag(piece, w, h);
    table.appendChild(piece);
  }
}

function setupDrag(el, w, h) {
  el.ondragstart = (e) => {
    el.classList.add('dragging');
    e.dataTransfer.setData('text/plain', el.dataset.id);
  };
  el.ondragend = () => el.classList.remove('dragging');

  [document.getElementById('shuffledTable'), document.getElementById('dropZone')].forEach(zone => {
    zone.ondragover = e => e.preventDefault();
    zone.ondrop = e => {
      e.preventDefault();
      const drag = document.querySelector('.dragging');
      if (!drag) return;

      zone.appendChild(drag);
      const r = zone.getBoundingClientRect();
      let posX = e.clientX - r.left - (w / 2);
      let posY = e.clientY - r.top - (h / 2);


      if (zone.id === 'dropZone') {
        const targetX = drag.dataset.correctCol * w;
        const targetY = drag.dataset.correctRow * h;


        if (Math.abs(posX - targetX) < 20 && Math.abs(posY - targetY) < 20) {
          drag.style.left = targetX + 'px';
          drag.style.top = targetY + 'px';
          drag.classList.add('locked'); // пазл на місці
        } else {
          drag.style.left = posX + 'px';
          drag.style.top = posY + 'px';
          drag.classList.remove('locked');
        }
      } else {
        drag.style.left = posX + 'px';
        drag.style.top = posY + 'px';
        drag.classList.remove('locked');
      }

      checkWin();
    };
  });
}

function checkWin() {
  const lockedPieces = document.querySelectorAll('#dropZone .puzzle-piece.locked');
  if (lockedPieces.length === 16) {
    alert("Brawo! Brawo! Puzzle są ułożone prawidłowo!");
    if (Notification.permission === "granted") {
      new Notification("Maksym Bereziuk:  Puzzle są ułożone prawidłowo!");
    }
  }
}
