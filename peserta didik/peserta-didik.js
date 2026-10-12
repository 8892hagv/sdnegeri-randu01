/* =========================
   NAVBAR: menu mobile, dropdown, search, notifikasi
========================== */
(function () {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const dropdownItems = document.querySelectorAll('.has-dropdown');
  const isMobile = () => window.matchMedia('(max-width: 1100px)').matches;

  function tutupDropdown() {
    dropdownItems.forEach(i => {
      i.classList.remove('open');
      i.querySelector('.dropdown-btn').setAttribute('aria-expanded', 'false');
    });
  }

  function tutupMenu() {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '\u2630';
  }

  menuToggle.addEventListener('click', e => {
    e.stopPropagation();
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open);
    menuToggle.textContent = open ? '\u2715' : '\u2630';
  });

  dropdownItems.forEach(item => {
    const tombol = item.querySelector('.dropdown-btn');
    tombol.addEventListener('click', e => {
      e.stopPropagation();
      const buka = !item.classList.contains('open');
      tutupDropdown();
      item.classList.toggle('open', buka);
      tombol.setAttribute('aria-expanded', buka);
    });
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => { if (isMobile()) tutupMenu(); });
  });

  window.addEventListener('resize', () => {
    if (!isMobile()) tutupMenu();
  });

  /* ---------- SEARCH ---------- */
  const searchBox = document.getElementById('searchBox');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  const halamanSitus = [
    { judul: 'Home',             ket: 'Beranda',      href: '../index.html#home' },
    { judul: 'Tentang Sekolah',  ket: 'Profil',       href: '../index.html#about' },
    { judul: 'Data Sekolah',     ket: 'Profil',       href: '../index.html#stats' },
    { judul: 'Visi & Misi',      ket: 'Profil',       href: '../index.html#visi' },
    { judul: 'Guru & Tendik',    ket: 'Directory',    href: '../guru-tendik/guru-tendik.html' },
    { judul: 'Peserta Didik',    ket: 'Directory',    href: 'peserta-didik.html' },
    { judul: 'Dokumentasi',      ket: 'Galery',       href: '../galery/galery.html' },
    { judul: 'Kegiatan Sekolah', ket: 'Galery',       href: '../index.html#kegiatan' },
    { judul: 'Pengumuman',       ket: 'Beranda',      href: '../index.html#announcement' },
    { judul: 'Artikel',          ket: 'Beranda',      href: '../index.html#artikel' },
    { judul: 'Contact Us',       ket: 'Hubungi kami', href: '../index.html#contact' }
  ];

  function tutupHasil() { searchResults.hidden = true; searchResults.innerHTML = ''; }

  function cari() {
    const kata = searchInput.value.trim().toLowerCase();
    searchResults.innerHTML = '';
    if (!kata) { searchResults.hidden = true; return; }

    const hasil = halamanSitus.filter(h => (h.judul + ' ' + h.ket).toLowerCase().includes(kata));
    if (hasil.length) {
      const grup = document.createElement('li');
      grup.className = 'group';
      grup.textContent = 'Halaman';
      searchResults.appendChild(grup);
      hasil.forEach(h => {
        const li = document.createElement('li');
        li.setAttribute('role', 'option');
        const a = document.createElement('a');
        a.href = h.href;
        const s = document.createElement('span');
        s.textContent = h.judul;
        const k = document.createElement('small');
        k.textContent = h.ket;
        a.append(s, k);
        li.appendChild(a);
        searchResults.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.className = 'no-result';
      li.textContent = 'Tidak ada hasil ditemukan.';
      searchResults.appendChild(li);
    }
    searchResults.hidden = false;
  }

  searchInput.addEventListener('input', cari);
  searchInput.addEventListener('focus', cari);
  searchInput.addEventListener('click', e => e.stopPropagation());
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      tutupHasil();
      searchBox.classList.remove('open');
      searchInput.blur();
    }
    if (e.key === 'Enter') {
      const pertama = searchResults.querySelector('a');
      if (pertama) window.location.href = pertama.href;
    }
  });

  // layar kecil: ikon kaca pembesar membuka/menutup kolom input
  searchBox.querySelector('i').addEventListener('click', e => {
    e.stopPropagation();
    if (isMobile()) {
      const buka = searchBox.classList.toggle('open');
      if (buka) searchInput.focus(); else { searchInput.value = ''; tutupHasil(); }
    } else {
      searchInput.focus();
    }
  });
  searchResults.addEventListener('click', e => e.stopPropagation());

  /* ---------- NOTIFIKASI ---------- */
  const bellBtn = document.getElementById('bellBtn');
  const bellDot = document.getElementById('bellDot');
  const notifPanel = document.getElementById('notifPanel');

  bellBtn.addEventListener('click', e => {
    e.stopPropagation();
    const buka = notifPanel.hidden;
    notifPanel.hidden = !buka;
    bellBtn.setAttribute('aria-expanded', buka);
    if (buka) bellDot.classList.add('hide');
  });
  notifPanel.addEventListener('click', e => e.stopPropagation());

  // klik di luar menutup dropdown, hasil pencarian, dan panel notifikasi
  document.addEventListener('click', () => {
    tutupDropdown();
    notifPanel.hidden = true;
    bellBtn.setAttribute('aria-expanded', 'false');
    tutupHasil();
    if (!searchInput.value.trim()) searchBox.classList.remove('open');
  });
})();

/* =========================
   DATA PESERTA DIDIK
   Ubah angka di sini (atau di atribut data-male / data-female pada HTML)
========================== */
const pie = document.getElementById('pie');
const male = Number(pie.dataset.male);
const female = Number(pie.dataset.female);
const total = male + female;
const malePct = (male / total) * 100;
const femalePct = (female / total) * 100;

document.getElementById('pctMale').textContent = malePct.toFixed(1) + '%';
document.getElementById('pctFemale').textContent = femalePct.toFixed(1) + '%';

/* =========================
   ANIMASI: angka naik + pie terisi
========================== */
const totalEl = document.getElementById('totalNumber');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

function animate(duration, onFrame) {
  const start = performance.now();
  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    onFrame(easeOut(t));
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

if (reduceMotion) {
  totalEl.textContent = total;
  pie.style.setProperty('--male-pct', malePct + '%');
} else {
  totalEl.textContent = '0';
  pie.style.setProperty('--male-pct', '0%');

  setTimeout(() => {
    animate(1600, p => {
      totalEl.textContent = Math.round(total * p);
      pie.style.setProperty('--male-pct', (malePct * p) + '%');
    });
  }, 500);
}