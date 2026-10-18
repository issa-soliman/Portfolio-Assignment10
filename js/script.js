// ===== menu bar and header  =====

var menuBtn = document.querySelector(".mobile-menu-btn");
var navLinks = document.querySelector("#nav-links");

menuBtn.addEventListener("click", function(){
    navLinks.classList.toggle("show");
});

var navItems = document.querySelectorAll("#nav-links a");

navItems.forEach(function(item) {
    item.addEventListener("click", function() {
        navLinks.classList.remove("show");
    });
});

function closeSettings(){
    settingsSidebar.classList.add("translate-x-full");
    settingsToggleBtn.classList.remove("show");
}

var settingsToggleBtn = document.querySelector("#settings-toggle");
var settingsSidebar = document.querySelector("#settings-sidebar");
var closeSettingsBtn = document.querySelector("#close-settings");

settingsToggleBtn.addEventListener("click", function(){
    settingsSidebar.classList.remove("translate-x-full");
    settingsToggleBtn.classList.add("show");
});

closeSettingsBtn.addEventListener("click", closeSettings);

var sections = document.querySelectorAll("section");

var options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1
};

var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");

            navItems.forEach(function(item) {
                item.classList.remove("active");
            });

            var activeLink = document.querySelector('#nav-links a[href="#' + id + '"]');
            if (activeLink) {
                activeLink.classList.add("active");
            }
        }
    });
}, options);

sections.forEach(function(section) {
    observer.observe(section);
});

// ===== Scroll to top =====
var scrollTopBtn = document.getElementById("scroll-to-top");
var hero = document.getElementById("hero-section");

function toggleScrollBtn() {
  var show = window.scrollY > hero.offsetTop + hero.offsetHeight;

  scrollTopBtn.classList.toggle("opacity-0", !show);
  scrollTopBtn.classList.toggle("invisible", !show);
  scrollTopBtn.classList.toggle("opacity-100", show);
  scrollTopBtn.classList.toggle("visible", show);
}

window.addEventListener("scroll", toggleScrollBtn);
toggleScrollBtn();

scrollTopBtn.addEventListener("click", function () {
  window.scrollTo({ top: 0 });
});

// ===== Settings: Font + Theme Color =====
var root = document.documentElement;
var fontButtons = document.querySelectorAll(".font-option");
var colorButtons = document.querySelectorAll("#theme-colors-grid button");
var resetBtn = document.getElementById("reset-settings");

var fontClasses = ["font-alexandria", "font-tajawal", "font-cairo"];
var activeRing = ["ring-2", "ring-primary", "ring-offset-2", "ring-offset-white", "dark:ring-offset-slate-900"];

var DEFAULT_FONT = "tajawal";
var DEFAULT_PRIMARY = "#6366f1";
var DEFAULT_SECONDARY = "#8b5cf6";

// ----- Font -----
function setFont(font) {
  fontClasses.forEach(function (c) { document.body.classList.remove(c); });
  document.body.classList.add("font-" + font);

  fontButtons.forEach(function (btn) {
    var isActive = btn.dataset.font === font;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-checked", isActive);
  });

  localStorage.setItem("font", font);
}

fontButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    setFont(btn.dataset.font);
  });
});

// ----- Color -----
function setColor(primary, secondary) {
  root.style.setProperty("--color-primary", primary);
  root.style.setProperty("--color-secondary", secondary);
  root.style.setProperty("--color-accent", secondary);

  colorButtons.forEach(function (btn) {
    var isActive = btn.dataset.primary === primary;
    activeRing.forEach(function (c) { btn.classList.toggle(c, isActive); });
  });

  localStorage.setItem("themeColor", JSON.stringify({ primary: primary, secondary: secondary }));
}

colorButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    setColor(btn.dataset.primary, btn.dataset.secondary);
  });
});

// ----- Reset -----
resetBtn.addEventListener("click", function () {
  setFont(DEFAULT_FONT);
  setColor(DEFAULT_PRIMARY, DEFAULT_SECONDARY);
  localStorage.removeItem("font");
  localStorage.removeItem("themeColor");
  closeSettings();
});

// ----- On page load: apply what was saved -----
var savedFont = localStorage.getItem("font") || DEFAULT_FONT;
var savedColor = JSON.parse(localStorage.getItem("themeColor")) ||
                 { primary: DEFAULT_PRIMARY, secondary: DEFAULT_SECONDARY };
setFont(savedFont);
setColor(savedColor.primary, savedColor.secondary);


// ===== Testimonials Carousel =====
var track = document.getElementById("testimonials-carousel");
var cards = track.querySelectorAll(".testimonial-card");
var nextBtn = document.getElementById("next-testimonial");
var prevBtn = document.getElementById("prev-testimonial");
var dotsBox = document.querySelector(".carousel-indicator").parentElement;

var current = 0;

function getVisible() {
  return Math.round(track.offsetWidth / cards[0].offsetWidth);
}

function getMaxIndex() {
  return cards.length - getVisible();
}

function buildDots() {
  var html = "";
  for (var i = 0; i <= getMaxIndex(); i++) {
    html += '<button class="carousel-indicator w-3 h-3 rounded-full bg-slate-400 dark:bg-slate-600 transition-all duration-300 hover:scale-125 cursor-pointer" data-index="' + i + '" role="tab" aria-label="التوصية ' + (i + 1) + '" type="button"></button>';
  }
  dotsBox.innerHTML = html;
}

function goTo(index) {
  var max = getMaxIndex();
  if (index > max) index = 0;
  if (index < 0) index = max;
  current = index;

  var step = 100 / getVisible();
  track.style.transform = "translateX(" + (current * step) + "%)";

  var dots = dotsBox.querySelectorAll(".carousel-indicator");
  dots.forEach(function (dot, i) {
    var on = i === current;
    dot.classList.toggle("bg-accent", on);
    dot.classList.toggle("bg-slate-400", !on);
    dot.classList.toggle("dark:bg-slate-600", !on);
    dot.setAttribute("aria-selected", on);
  });
}

// ----- Arrows -----
nextBtn.addEventListener("click", function () { goTo(current + 1); });
prevBtn.addEventListener("click", function () { goTo(current - 1); });

// ----- Dots (one listener for all of them) -----
dotsBox.addEventListener("click", function (e) {
  var dot = e.target.closest(".carousel-indicator");
  if (!dot) return;
  goTo(Number(dot.dataset.index));
});

// ----- Swipe on phones -----
var startX = 0;
track.addEventListener("touchstart", function (e) {
  startX = e.touches[0].clientX;
}, { passive: true });

track.addEventListener("touchend", function (e) {
  var dx = e.changedTouches[0].clientX - startX;
  if (dx > 50) goTo(current + 1);   
  else if (dx < -50) goTo(current - 1);
});

var lastVisible = getVisible();
window.addEventListener("resize", function () {
  var v = getVisible();
  if (v !== lastVisible) {
    lastVisible = v;
    buildDots();
  }
  goTo(Math.min(current, getMaxIndex()));
});

// ----- Start -----
buildDots();
goTo(0);


// ===== Dark / Light mode =====
var themeToggleBtn = document.getElementById("theme-toggle-button");

themeToggleBtn.addEventListener("click", function () {
  root.classList.toggle("dark");
  var isDark = root.classList.contains("dark");
  themeToggleBtn.setAttribute("aria-pressed", isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

var savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  root.classList.remove("dark");
}
themeToggleBtn.setAttribute("aria-pressed", root.classList.contains("dark"));