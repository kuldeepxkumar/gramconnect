/**
 * GRAMCONNECT - JAVASCRIPT WITH DARK/LIGHT THEME SUPPORT
 */

document.addEventListener("DOMContentLoaded", () => {
    initThemeToggle(); // <- Dark/Light Mode Activator
    initLanguageSwitcher();
    initMobileNavigation();
    initDynamicYear();
    initHoverBubble();
    initScrollSpyAndNavbar();
    initStatCounters();
    initQuickComplaintTracker();
});

/* ------------------------------------------------------------------------------
   1. DARK & LIGHT THEME TOGGLE (WITH LOCALSTORAGE REMEMBRANCE)
------------------------------------------------------------------------------ */
function initThemeToggle() {
    const themeBtn = document.getElementById("themeToggleBtn");
    const themeIcon = document.getElementById("themeIcon");

    const savedTheme = localStorage.getItem("gramconnect_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Set initial theme
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
        document.body.classList.add("dark-mode");
        if (themeIcon) themeIcon.textContent = "☀️";
    } else {
        document.body.classList.remove("dark-mode");
        if (themeIcon) themeIcon.textContent = "🌙";
    }

    if (themeBtn && themeIcon) {
        themeBtn.addEventListener("click", () => {
            const isDark = document.body.classList.toggle("dark-mode");
            themeIcon.textContent = isDark ? "☀️" : "🌙";
            localStorage.setItem("gramconnect_theme", isDark ? "dark" : "light");
        });
    }
}

/* ------------------------------------------------------------------------------
   2. BILINGUAL LANGUAGE SWITCHER (HINDI / ENGLISH)
------------------------------------------------------------------------------ */
function initLanguageSwitcher() {
    const langBtn = document.getElementById("languageBtn");
    const langText = document.getElementById("langText");
    let currentLang = localStorage.getItem("gramconnect_lang") || "en";

    if (currentLang === "hi") {
        applyLanguage("hi");
    }

    if (langBtn) {
        langBtn.addEventListener("click", () => {
            currentLang = currentLang === "en" ? "hi" : "en";
            applyLanguage(currentLang);
            localStorage.setItem("gramconnect_lang", currentLang);
        });
    }

    function applyLanguage(lang) {
        if (langText) langText.textContent = lang === "en" ? "हिंदी" : "English";

        document.querySelectorAll("[data-en][data-hi]").forEach((el) => {
            const translation = el.getAttribute(`data-${lang}`);
            if (translation) el.textContent = translation;
        });

        document.querySelectorAll("[data-en-placeholder][data-hi-placeholder]").forEach((input) => {
            const placeholderText = input.getAttribute(`data-${lang}-placeholder`);
            if (placeholderText) input.placeholder = placeholderText;
        });
    }
}

/* ------------------------------------------------------------------------------
   3. MOBILE NAVIGATION DRAWER
------------------------------------------------------------------------------ */
function initMobileNavigation() {
    const menuBtn = document.getElementById("menuBtn");
    const navLinks = document.getElementById("navLinks");
    if (!menuBtn || !navLinks) return;

    menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = navLinks.classList.toggle("nav-active");
        menuBtn.setAttribute("aria-expanded", isOpen);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("nav-active");
            menuBtn.setAttribute("aria-expanded", "false");
        });
    });

    document.addEventListener("click", (e) => {
        if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
            navLinks.classList.remove("nav-active");
            menuBtn.setAttribute("aria-expanded", "false");
        }
    });
}

/* ------------------------------------------------------------------------------
   4. DYNAMIC YEAR
------------------------------------------------------------------------------ */
function initDynamicYear() {
    const yearSpan = document.getElementById("year");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

/* ------------------------------------------------------------------------------
   5. HOVER INFORMATION BUBBLE
------------------------------------------------------------------------------ */
function initHoverBubble() {
    const bubble = document.getElementById("imageInfoBubble");
    const bubbleText = document.getElementById("bubbleText");
    if (!bubble || !bubbleText) return;

    document.querySelectorAll("[data-hover-info]").forEach((el) => {
        el.addEventListener("mouseenter", () => {
            const info = el.getAttribute("data-hover-info");
            if (info) {
                bubbleText.textContent = info;
                bubble.classList.add("visible");
            }
        });

        el.addEventListener("mousemove", (e) => {
            const offset = 14;
            const maxX = window.innerWidth - bubble.offsetWidth - 20;
            bubble.style.left = `${Math.min(e.clientX + offset, maxX)}px`;
            bubble.style.top = `${e.clientY + offset}px`;
        });

        el.addEventListener("mouseleave", () => {
            bubble.classList.remove("visible");
        });
    });
}

/* ------------------------------------------------------------------------------
   6. SCROLL SPY & NAVBAR SHADOW
------------------------------------------------------------------------------ */
function initScrollSpyAndNavbar() {
    const navbar = document.getElementById("navbar");
    const sections = document.querySelectorAll("section[id]");
    const navItems = document.querySelectorAll(".nav-links .nav-link");

    window.addEventListener("scroll", () => {
        const scrollY = window.pageYOffset;

        if (navbar) {
            navbar.style.boxShadow = scrollY > 30 ? "0 4px 20px rgba(0, 0, 0, 0.12)" : "none";
        }

        let currentSectionId = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navItems.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    }, { passive: true });
}

/* ------------------------------------------------------------------------------
   7. STAT COUNTERS
------------------------------------------------------------------------------ */
function initStatCounters() {
    const statElements = document.querySelectorAll(".stat-number[data-target]");
    if (statElements.length === 0) return;

    let hasAnimated = false;
    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateNumbers();
                observerInstance.disconnect();
            }
        });
    }, { threshold: 0.4 });

    const trustSection = document.querySelector(".trust-strip");
    if (trustSection) observer.observe(trustSection);

    function animateNumbers() {
        statElements.forEach((el) => {
            const target = parseInt(el.getAttribute("data-target"), 10);
            const duration = 1600;
            const frameRate = 1000 / 60;
            const totalFrames = Math.round(duration / frameRate);
            let frame = 0;

            const counter = setInterval(() => {
                frame++;
                const progress = frame / totalFrames;
                const easeValue = progress * (2 - progress);
                const currentNumber = Math.round(target * easeValue);

                if (target === 100) {
                    el.textContent = `${currentNumber}%`;
                } else if (target >= 1000) {
                    el.textContent = `${currentNumber.toLocaleString()}+`;
                } else {
                    el.textContent = currentNumber;
                }

                if (frame === totalFrames) clearInterval(counter);
            }, frameRate);
        });
    }
}

/* ------------------------------------------------------------------------------
   8. COMPLAINT TRACKER POPUP
------------------------------------------------------------------------------ */
function initQuickComplaintTracker() {
    const trackForm = document.getElementById("heroTrackForm");
    const trackInput = document.getElementById("quickTrackInput");
    if (!trackForm || !trackInput) return;

    trackForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const ticketId = trackInput.value.trim();
        if (!ticketId) return;

        const isHindi = document.getElementById("langText")?.textContent === "English";
        const title = isHindi ? `📋 शिकायत स्थिति: ${ticketId}` : `📋 Complaint Status: ${ticketId}`;
        const message = isHindi 
            ? `स्थिति: समीक्षाधीन (ग्राम सचिव द्वारा जांच जारी)\nअधिकारी: श्री राजेश कुमार\nअनुमानित समाधान: 3 कार्य दिवस`
            : `Status: Under Review (Action initiated by Gram Sachiv)\nAssigned Officer: Mr. Rajesh Kumar\nEstimated Resolution: 3 working days`;

        alert(`${title}\n\n${message}`);
    });
}