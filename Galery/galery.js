/* =========================
   NAVBAR: menu mobile + dropdown di layar sentuh
========================== */
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');
const isMobile = () => window.matchMedia('(max-width: 1100px)').matches;

menuToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
  menuToggle.textContent = open ? '✕' : '☰';
});

dropdownItems.forEach(item => {
  item.querySelector('.nav-label').addEventListener('click', e => {
    e.stopPropagation();
    const willOpen = !item.classList.contains('open');
    dropdownItems.forEach(i => i.classList.remove('open'));
    if (willOpen) item.classList.add('open');
  });
});

// Tutup dropdown saat klik di luar menu
document.addEventListener('click', e => {
  if (!e.target.closest('.nav-item')) {
    dropdownItems.forEach(i => i.classList.remove('open'));
  }
});

// Tutup menu mobile setelah memilih link
navLinks.querySelectorAll('.dropdown a, a.nav-item').forEach(link => {
  link.addEventListener('click', () => {
    if (!isMobile()) return;
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '☰';
  });
});

window.addEventListener('resize', () => {
  if (!isMobile()) {
    navLinks.classList.remove('open');
    menuToggle.textContent = '☰';
  }
});

/* =========================
   LIGHTBOX FOTO
========================== */
const items = Array.from(document.querySelectorAll('.gallery-item'));
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
let current = 0;

function showPhoto(index) {
  current = (index + items.length) % items.length;
  const img = items[current].querySelector('img');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
}

function openLightbox(index) {
  showPhoto(index);
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

items.forEach((item, i) => {
  item.tabIndex = 0;
  item.addEventListener('click', () => openLightbox(i));
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(i);
    }
  });
});

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxPrev').addEventListener('click', () => showPhoto(current - 1));
document.getElementById('lightboxNext').addEventListener('click', () => showPhoto(current + 1));

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPhoto(current - 1);
  if (e.key === 'ArrowRight') showPhoto(current + 1);
});

/* =========================
   SEARCH + NOTIFIKASI
========================== */
const searchBox = document.getElementById('searchBox');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const bellBtn = document.getElementById('bellBtn');
const bellDot = document.getElementById('bellDot');
const notifPanel = document.getElementById('notifPanel');
const notifBox = document.getElementById('notifBox');

// Daftar halaman yang bisa dicari
const pages = [
  { title: 'Home',            group: 'Halaman',  icon: 'fa-house',                href: '../index.html#home',         keys: 'beranda utama selamat datang' },
  { title: 'Tentang Sekolah', group: 'Profil',   icon: 'fa-school',               href: '../index.html#about',        keys: 'profil sejarah akreditasi 1828 randu' },
  { title: 'Data Sekolah',    group: 'Profil',   icon: 'fa-chart-simple',         href: '../index.html#stats',        keys: 'statistik jumlah' },
  { title: 'Visi & Misi',     group: 'Profil',   icon: 'fa-bullseye',             href: '../index.html#visi',         keys: 'visi misi tujuan' },
  { title: 'Guru & Tendik',   group: 'Directory', icon: 'fa-chalkboard-user',     href: '../guru-tendik/guru-tendik.html', keys: 'guru tenaga kependidikan kepala sekolah' },
  { title: 'Peserta Didik',   group: 'Directory', icon: 'fa-user-graduate',       href: '../peserta didik/peserta-didik.html', keys: 'siswa murid jumlah laki perempuan' },
  { title: 'Dokumentasi',     group: 'Galery',   icon: 'fa-images',               href: 'galery.html',                keys: 'foto galeri kegiatan' },
  { title: 'Kegiatan Sekolah', group: 'Galery',  icon: 'fa-camera',               href: '../index.html#kegiatan',     keys: 'galeri pengumuman artikel' },
  { title: 'Pengumuman',      group: 'Kegiatan', icon: 'fa-bullhorn',             href: '../index.html#announcement', keys: 'info terbaru' },
  { title: 'Artikel: JAMRAN', group: 'Kegiatan', icon: 'fa-newspaper',            href: '../index.html#artikel',      keys: 'kontingen berita jamran pecalungan' },
  { title: 'Contact Us',      group: 'Kontak',   icon: 'fa-envelope',             href: '../index.html#contact',      keys: 'email instagram tiktok youtube hubungi' }
];

// Foto di halaman ini ikut bisa dicari (klik = buka foto)
const photoEntries = items.map((item, i) => ({
  title: item.querySelector('img').alt,
  group: 'Foto galery',
  icon: 'fa-image',
  photo: i,
  keys: 'foto dokumentasi galeri'
}));

const searchIndex = pages.concat(photoEntries);
let activeResult = -1;

function closeSearch() {
  searchResults.hidden = true;
  searchResults.innerHTML = '';
  activeResult = -1;
}

function closeNotif() {
  notifPanel.hidden = true;
  bellBtn.setAttribute('aria-expanded', 'false');
}

function setActiveResult(n) {
  const links = Array.from(searchResults.querySelectorAll('a'));
  links.forEach(l => l.classList.remove('focus'));
  if (!links.length) return;
  activeResult = (n + links.length) % links.length;
  links[activeResult].classList.add('focus');
  links[activeResult].scrollIntoView({ block: 'nearest' });
}

function renderResults(query) {
  const q = query.trim().toLowerCase();
  if (!q) { closeSearch(); return; }

  const found = searchIndex
    .filter(e => (e.title + ' ' + e.group + ' ' + (e.keys || '')).toLowerCase().includes(q))
    .slice(0, 8);

  searchResults.innerHTML = '';
  activeResult = -1;

  if (!found.length) {
    const li = document.createElement('li');
    li.className = 'search-empty';
    li.textContent = 'Tidak ada hasil untuk "' + query.trim() + '"';
    searchResults.appendChild(li);
  } else {
    found.forEach(entry => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = entry.href || '#';

      const icon = document.createElement('i');
      icon.className = 'fa-solid ' + entry.icon;

      const text = document.createElement('span');
      text.textContent = entry.title;
      const small = document.createElement('small');
      small.textContent = entry.group;
      text.appendChild(small);

      a.append(icon, text);

      if (entry.photo !== undefined) {
        a.addEventListener('click', e => {
          e.preventDefault();
          closeSearch();
          searchInput.value = '';
          openLightbox(entry.photo);
        });
      }

      li.appendChild(a);
      searchResults.appendChild(li);
    });
  }
  searchResults.hidden = false;
}

// Di layar kecil, ikon search diketuk -> langsung fokus ke input
searchBox.addEventListener('click', () => searchInput.focus());

searchInput.addEventListener('input', () => {
  closeNotif();
  renderResults(searchInput.value);
});

searchInput.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown') { e.preventDefault(); setActiveResult(activeResult + 1); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveResult(activeResult - 1); }
  else if (e.key === 'Enter') {
    const links = searchResults.querySelectorAll('a');
    const target = links[activeResult >= 0 ? activeResult : 0];
    if (target) { e.preventDefault(); target.click(); }
  } else if (e.key === 'Escape') {
    closeSearch();
    searchInput.blur();
  }
});

// Notifikasi
bellBtn.addEventListener('click', e => {
  e.stopPropagation();
  const willOpen = notifPanel.hidden;
  closeSearch();
  notifPanel.hidden = !willOpen;
  bellBtn.setAttribute('aria-expanded', willOpen);
  if (willOpen) bellDot.classList.add('hidden');
});

// Tutup search / notifikasi saat klik di luar
document.addEventListener('click', e => {
  if (!e.target.closest('#searchBox')) closeSearch();
  if (!e.target.closest('#notifBox')) closeNotif();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeNotif();
});