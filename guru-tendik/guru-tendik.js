// =========================
// DATA GURU & TENDIK
// Untuk memakai foto asli, isi "foto" dengan path gambar,
// contoh: foto: "assets/guru/zulianto.jpg"
// Kosongkan ("") untuk memakai ikon default.
// =========================
const kepalaSekolah = [
  { nama: "Zulianto, S.Pd.SD.,M.Pd", jabatan: "Kepala Sekolah", foto: "", garis: true }
];

const guruKelas = [
  { nama: "Etik Widiharsih, S.Pd",  jabatan: "Guru Kelas I",   foto: "" },
  { nama: "Nur Hidayati, S.Pd.SD",  jabatan: "Guru Kelas II",  foto: "" },
  { nama: "Kurnia Bayu Krisna, S.Pd", jabatan: "Guru Kelas III", foto: "" }
];

const guruLainnya = [
  { nama: "Wiji Lestari, S.Pd",         jabatan: "Guru Kelas IV", foto: "" },
  { nama: "Khusnul Khotimah, S.Pd.SD",  jabatan: "Guru Kelas V",  foto: "" },
  { nama: "Frisca Ayu Febrianti, S.Pd, M.Pd",   jabatan: "Guru Kelas VI", foto: "" },
  { nama: "Carito Dwi Arfianto. S.Pd.I",       jabatan: "Guru PAI",      foto: "" },
  { nama: "Surya Lintang Jatidharma. S.Pd",      jabatan: "Guru PJOK",     foto: "" },
  { nama: "Awal Sucipto",               jabatan: "Penjaga / TAS", foto: "" }
];

// Ikon orang default (kuning di atas biru)
const avatarSVG = `
  <svg viewBox="0 0 100 100" aria-hidden="true">
    <defs>
      <linearGradient id="gy" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f0e24a"/>
        <stop offset="1" stop-color="#e3d322"/>
      </linearGradient>
    </defs>
    <circle cx="50" cy="35" r="15.5" fill="url(#gy)"/>
    <path d="M21 80 A29 29 0 0 1 79 80 Z" fill="url(#gy)"/>
  </svg>`;

function buatKartu(orang, urutan) {
  const el = document.createElement("article");
  el.className = "person";
  el.style.setProperty("--delay", (urutan * 0.12) + "s");
  el.style.setProperty("--float", (urutan * -0.7) + "s");

  const foto = orang.foto
    ? `<img src="${orang.foto}" alt="${orang.nama}" loading="lazy">`
    : avatarSVG;

  el.innerHTML = `
    <div class="photo">${foto}</div>
    <div class="pill ${orang.garis ? "has-line" : ""}">
      <span class="name">${orang.nama}</span>
      <span class="role">${orang.jabatan}</span>
    </div>`;
  return el;
}

function isiBaris(idBaris, data) {
  const wadah = document.getElementById(idBaris);
  data.forEach((orang, i) => wadah.appendChild(buatKartu(orang, i)));
}

isiBaris("rowHead", kepalaSekolah);
isiBaris("rowKelas", guruKelas);
isiBaris("rowLainnya", guruLainnya);

// =========================
// ANIMASI MUNCUL SAAT TERLIHAT
// =========================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .15 });

document.querySelectorAll(".person").forEach(el => observer.observe(el));

// =========================
// MENU MOBILE & DROPDOWN (sama dengan index)
// =========================
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const dropdownItems = document.querySelectorAll(".has-dropdown");

menuToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  const buka = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", buka);
});

dropdownItems.forEach(item => {
  const tombol = item.querySelector(".dropdown-btn");
  tombol.addEventListener("click", (e) => {
    e.stopPropagation();
    const buka = !item.classList.contains("open");
    dropdownItems.forEach(i => {
      i.classList.remove("open");
      i.querySelector(".dropdown-btn").setAttribute("aria-expanded", "false");
    });
    item.classList.toggle("open", buka);
    tombol.setAttribute("aria-expanded", buka);
  });
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// =========================
// SEARCH
// Mencari guru & tendik di halaman ini + halaman lain di website
// =========================
const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

const halamanSitus = [
  { judul: "Home",             ket: "Beranda",           href: "../index.html#home" },
  { judul: "Tentang Sekolah",  ket: "Profil",            href: "../index.html#about" },
  { judul: "Data Sekolah",     ket: "Profil",            href: "../index.html#stats" },
  { judul: "Visi & Misi",      ket: "Profil",            href: "../index.html#visi" },
  { judul: "Peserta Didik",    ket: "Directory",         href: "../peserta%20didik/peserta-didik.html" },
  { judul: "Dokumentasi",      ket: "Galery",            href: "../Galery/galery.html" },
  { judul: "Kegiatan Sekolah", ket: "Galery",            href: "../index.html#kegiatan" },
  { judul: "Pengumuman",       ket: "Beranda",           href: "../index.html#announcement" },
  { judul: "Artikel",          ket: "Beranda",           href: "../index.html#artikel" },
  { judul: "Contact Us",       ket: "Hubungi kami",      href: "../index.html#contact" }
];

const semuaOrang = [...kepalaSekolah, ...guruKelas, ...guruLainnya];

function buatItem(judul, ket, href) {
  const li = document.createElement("li");
  li.setAttribute("role", "option");
  const a = document.createElement("a");
  a.href = href;
  const s = document.createElement("span");
  s.textContent = judul;
  const k = document.createElement("small");
  k.textContent = ket;
  a.append(s, k);
  li.appendChild(a);
  return { li, a };
}

function buatGrup(teks) {
  const li = document.createElement("li");
  li.className = "group";
  li.textContent = teks;
  return li;
}

function sorotKartu(nama) {
  const kartu = [...document.querySelectorAll(".person")]
    .find(el => el.querySelector(".name").textContent === nama);
  if (!kartu) return;
  kartu.scrollIntoView({ behavior: "smooth", block: "center" });
  kartu.classList.add("found");
  setTimeout(() => kartu.classList.remove("found"), 2200);
}

function tutupHasil() {
  searchResults.hidden = true;
  searchResults.innerHTML = "";
}

function cari() {
  const kata = searchInput.value.trim().toLowerCase();
  searchResults.innerHTML = "";
  if (!kata) { searchResults.hidden = true; return; }

  const orang = semuaOrang.filter(o => (o.nama + " " + o.jabatan).toLowerCase().includes(kata));
  const halaman = halamanSitus.filter(h => (h.judul + " " + h.ket).toLowerCase().includes(kata));

  if (orang.length) {
    searchResults.appendChild(buatGrup("Guru & Tendik"));
    orang.forEach(o => {
      const { li, a } = buatItem(o.nama, o.jabatan, "#");
      a.addEventListener("click", (e) => {
        e.preventDefault();
        tutupHasil();
        sorotKartu(o.nama);
      });
      searchResults.appendChild(li);
    });
  }

  if (halaman.length) {
    searchResults.appendChild(buatGrup("Halaman"));
    halaman.forEach(h => searchResults.appendChild(buatItem(h.judul, h.ket, h.href).li));
  }

  if (!orang.length && !halaman.length) {
    const li = document.createElement("li");
    li.className = "no-result";
    li.textContent = "Tidak ada hasil ditemukan.";
    searchResults.appendChild(li);
  }
  searchResults.hidden = false;
}

searchInput.addEventListener("input", cari);
searchInput.addEventListener("focus", cari);
searchInput.addEventListener("click", (e) => e.stopPropagation());
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    searchInput.value = "";
    tutupHasil();
    searchBox.classList.remove("open");
    searchInput.blur();
  }
  if (e.key === "Enter") {
    const pertama = searchResults.querySelector("a");
    if (pertama) pertama.click();
  }
});

// di layar kecil, ikon kaca pembesar membuka/menutup kolom input
searchBox.querySelector("i").addEventListener("click", (e) => {
  e.stopPropagation();
  if (window.matchMedia("(max-width: 860px)").matches) {
    const buka = searchBox.classList.toggle("open");
    if (buka) searchInput.focus(); else { searchInput.value = ""; tutupHasil(); }
  } else {
    searchInput.focus();
  }
});
searchResults.addEventListener("click", (e) => e.stopPropagation());

// =========================
// NOTIFIKASI
// =========================
const bellBtn = document.getElementById("bellBtn");
const bellDot = document.getElementById("bellDot");
const notifPanel = document.getElementById("notifPanel");

bellBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const buka = notifPanel.hidden;
  notifPanel.hidden = !buka;
  bellBtn.setAttribute("aria-expanded", buka);
  if (buka) bellDot.classList.add("hide");
});
notifPanel.addEventListener("click", (e) => e.stopPropagation());

// klik di luar menutup dropdown, hasil pencarian, dan panel notifikasi
document.addEventListener("click", () => {
  dropdownItems.forEach(i => {
    i.classList.remove("open");
    i.querySelector(".dropdown-btn").setAttribute("aria-expanded", "false");
  });
  notifPanel.hidden = true;
  bellBtn.setAttribute("aria-expanded", "false");
  tutupHasil();
  if (!searchInput.value.trim()) searchBox.classList.remove("open");
});