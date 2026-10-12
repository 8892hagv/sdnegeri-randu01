/* =========================================================
   SD NEGERI RANDU 01 - Beranda
========================================================= */

/* ---------- Indeks pencarian ---------- */
const SEARCH_INDEX = [
  { label: "Beranda", desc: "Halaman utama", href: "#home", icon: "fa-house", keys: "home beranda utama" },
  { label: "Tentang Sekolah", desc: "Sejarah dan profil singkat", href: "#about", icon: "fa-school", keys: "tentang profil sejarah sekolah akreditasi lahan 1828" },
  { label: "Data Sekolah", desc: "Jumlah peserta didik dan guru", href: "#stats", icon: "fa-chart-simple", keys: "data statistik jumlah" },
  { label: "Visi & Misi", desc: "Visi dan misi sekolah", href: "#visi", icon: "fa-bullseye", keys: "visi misi tujuan" },
  { label: "Guru & Tendik", desc: "Struktur guru dan tenaga kependidikan", href: "guru-tendik/guru-tendik.html", icon: "fa-chalkboard-user", keys: "guru tendik pengajar staf struktur" },
  { label: "Peserta Didik", desc: "Data siswa laki-laki dan perempuan", href: "peserta%20didik/peserta-didik.html", icon: "fa-user-graduate", keys: "peserta didik siswa murid laki perempuan" },
  { label: "Galery Dokumentasi", desc: "Foto kegiatan sekolah", href: "Galery/galery.html", icon: "fa-images", keys: "galery galeri foto dokumentasi" },
  { label: "Kegiatan Sekolah", desc: "Galery, pengumuman, artikel", href: "#kegiatan", icon: "fa-calendar-days", keys: "kegiatan acara agenda" },
  { label: "Pengumuman", desc: "Pengumuman terbaru", href: "#announcement", icon: "fa-bullhorn", keys: "pengumuman announcement info" },
  { label: "Artikel JAMRAN", desc: "Kontingen SDN Randu 01 mengikuti JAMRAN", href: "#artikel", icon: "fa-newspaper", keys: "artikel berita jamran kontingen" },
  { label: "Contact Us", desc: "Email dan media sosial", href: "#contact", icon: "fa-envelope", keys: "contact kontak email instagram tiktok youtube sosial media" }
];

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* =========================================================
   NAVBAR: menu mobile, dropdown klik, scrollspy
========================================================= */
const menuToggle = $("#menuToggle");
const navLinks = $("#navLinks");
const dropdownItems = $$(".has-dropdown");

menuToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});

function closeDropdowns() {
  dropdownItems.forEach((item) => {
    item.classList.remove("open");
    $(".dropdown-btn", item).setAttribute("aria-expanded", "false");
  });
}

dropdownItems.forEach((item) => {
  const btn = $(".dropdown-btn", item);
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const willOpen = !item.classList.contains("open");
    closeDropdowns();
    closePanels();
    if (willOpen) {
      item.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
    }
  });
});

// Klik tautan di menu -> tutup menu
$$(".nav a").forEach((link) =>
  link.addEventListener("click", () => {
    closeDropdowns();
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  })
);

// Scrollspy: tandai menu sesuai bagian yang sedang dilihat
const spyMap = [
  { ids: ["home"], key: "home" },
  { ids: ["stats", "about", "visi"], key: "profil" },
  { ids: ["kegiatan"], key: "galery" },
  { ids: ["contact"], key: "contact" }
];

function updateSpy() {
  const y = window.scrollY + window.innerHeight * 0.35;
  let current = "home";
  spyMap.forEach(({ ids, key }) => {
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= y) current = key;
    });
  });
  $$("[data-spy]").forEach((el) => el.classList.toggle("active", el.dataset.spy === current));
}

/* =========================================================
   PENCARIAN
========================================================= */
const searchBox = $("#searchBox");
const searchInput = $("#searchInput");
const searchResults = $("#searchResults");
let focusIdx = -1;

function renderResults(query) {
  const q = query.trim().toLowerCase();
  if (!q) { searchResults.hidden = true; searchResults.innerHTML = ""; return; }

  const hits = SEARCH_INDEX.filter((it) =>
    (it.label + " " + it.desc + " " + it.keys).toLowerCase().includes(q)
  );

  searchResults.innerHTML = hits.length
    ? hits.map((it) =>
        `<li role="option"><a href="${it.href}"><i class="fa-solid ${it.icon}"></i><span>${it.label}<small>${it.desc}</small></span></a></li>`
      ).join("")
    : `<li class="search-empty">Tidak ada hasil untuk "${q.replace(/[<>&"]/g, "")}". Coba kata lain, misalnya "guru" atau "galery".</li>`;

  searchResults.hidden = false;
  focusIdx = -1;
}

function moveFocus(dir) {
  const items = $$("a", searchResults);
  if (!items.length) return;
  focusIdx = (focusIdx + dir + items.length) % items.length;
  items.forEach((a, i) => a.classList.toggle("focus", i === focusIdx));
  items[focusIdx].scrollIntoView({ block: "nearest" });
}

searchInput.addEventListener("input", () => renderResults(searchInput.value));
searchInput.addEventListener("focus", () => { closeDropdowns(); closePanels(); renderResults(searchInput.value); });

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") { e.preventDefault(); moveFocus(1); }
  else if (e.key === "ArrowUp") { e.preventDefault(); moveFocus(-1); }
  else if (e.key === "Enter") {
    const items = $$("a", searchResults);
    const target = items[focusIdx] || items[0];
    if (target) target.click();
  }
});

searchResults.addEventListener("click", (e) => {
  if (e.target.closest("a")) {
    searchInput.value = "";
    searchResults.hidden = true;
    searchInput.blur();
  }
});

/* =========================================================
   NOTIFIKASI
========================================================= */
const bellBtn = $("#bellBtn");
const bellDot = $("#bellDot");
const notifPanel = $("#notifPanel");
const SEEN_KEY = "randu01-notif-seen";

try { if (localStorage.getItem(SEEN_KEY) === "1") bellDot.classList.add("hidden"); } catch (_) {}

bellBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const willOpen = notifPanel.hidden;
  closeDropdowns();
  searchResults.hidden = true;
  notifPanel.hidden = !willOpen;
  bellBtn.setAttribute("aria-expanded", willOpen);
  if (willOpen) {
    bellDot.classList.add("hidden");
    try { localStorage.setItem(SEEN_KEY, "1"); } catch (_) {}
  }
});

notifPanel.addEventListener("click", (e) => { if (e.target.closest("a")) closePanels(); });

function closePanels() {
  notifPanel.hidden = true;
  bellBtn.setAttribute("aria-expanded", "false");
}

// Tutup semua panel saat klik di luar atau tekan Escape
document.addEventListener("click", (e) => {
  closeDropdowns();
  closePanels();
  if (!searchBox.contains(e.target)) searchResults.hidden = true;
  if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  closeDropdowns(); closePanels(); closeLightbox();
  searchResults.hidden = true;
});

/* =========================================================
   HERO: foto bisa ditukar / diperbesar
========================================================= */
const photoMainImg = $("#photoMainImg");
$$(".photo-thumb").forEach((thumb) => {
  thumb.addEventListener("click", () => {
    const img = $("img", thumb);
    const prev = { src: photoMainImg.getAttribute("src"), alt: photoMainImg.alt };
    photoMainImg.classList.add("fading");
    setTimeout(() => {
      photoMainImg.src = thumb.dataset.src;
      photoMainImg.alt = thumb.dataset.alt;
      img.src = prev.src; img.alt = prev.alt;
      thumb.dataset.src = prev.src; thumb.dataset.alt = prev.alt;
      photoMainImg.classList.remove("fading");
    }, 250);
  });
});

/* =========================================================
   ANGKA STATISTIK NAIK + REVEAL SAAT SCROLL
========================================================= */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function animateNumber(el) {
  const target = Number(el.dataset.target);
  const plain = el.dataset.plain === "true"; // tahun: tanpa pemisah ribuan
  const fmt = (n) => (plain ? String(n) : n.toLocaleString("id-ID"));

  if (reduceMotion) { el.textContent = fmt(target); return; }

  const duration = 1000;
  const start = performance.now();
  (function frame(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(frame);
  })(start);
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add("show");
    $$("[data-target]", el).forEach(animateNumber);
    revealObserver.unobserve(el);
  });
}, { threshold: 0.15 });

$$(".reveal").forEach((el) => revealObserver.observe(el));

/* =========================================================
   SLIDER GALERY
========================================================= */
const galleryTrack = $("#galleryTrack");
const galleryImgs = $$("img", galleryTrack);
const galleryDots = $("#galleryDots");
const galleryBox = $("#gallery");
let galleryIdx = 0;
let galleryTimer = null;

galleryImgs.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.setAttribute("aria-label", `Foto ${i + 1}`);
  dot.addEventListener("click", () => { goGallery(i); restartGallery(); });
  galleryDots.appendChild(dot);
});

function goGallery(i) {
  galleryIdx = (i + galleryImgs.length) % galleryImgs.length;
  galleryTrack.style.transform = `translateX(-${galleryIdx * 100}%)`;
  $$("button", galleryDots).forEach((d, n) => d.classList.toggle("active", n === galleryIdx));
}

function restartGallery() {
  clearInterval(galleryTimer);
  galleryTimer = setInterval(() => goGallery(galleryIdx + 1), 4000);
}

$("#galleryPrev").addEventListener("click", () => { goGallery(galleryIdx - 1); restartGallery(); });
$("#galleryNext").addEventListener("click", () => { goGallery(galleryIdx + 1); restartGallery(); });

// Jeda saat kursor di atas galery
galleryBox.addEventListener("mouseenter", () => clearInterval(galleryTimer));
galleryBox.addEventListener("mouseleave", restartGallery);

// Geser (swipe) di layar sentuh
let touchX = null;
galleryBox.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
galleryBox.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 40) { goGallery(galleryIdx + (dx < 0 ? 1 : -1)); restartGallery(); }
  touchX = null;
});

goGallery(0);
restartGallery();

/* =========================================================
   LIGHTBOX
========================================================= */
const lightbox = $("#lightbox");
const lightboxImg = $("#lightboxImg");

galleryImgs.forEach((img) =>
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  })
);

$("#photoMain").addEventListener("click", () => {
  lightboxImg.src = photoMainImg.src;
  lightboxImg.alt = photoMainImg.alt;
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
});

function closeLightbox() {
  if (lightbox.hidden) return;
  lightbox.hidden = true;
  document.body.style.overflow = "";
}
$("#lightboxClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });

/* =========================================================
   FAKTA SEKOLAH (label interaktif)
========================================================= */
const factView = $("#factView");
$$(".fact").forEach((btn) =>
  btn.addEventListener("click", () => {
    $$(".fact").forEach((b) => b.classList.toggle("on", b === btn));
    factView.textContent = btn.dataset.fact;
    factView.classList.add("has-fact");
  })
);

/* =========================================================
   TOMBOL KE ATAS + SCROLL
========================================================= */
const toTop = $("#toTop");
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

function onScroll() {
  toTop.classList.toggle("show", window.scrollY > 600);
  updateSpy();
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
