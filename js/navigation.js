/**
 * NAVIGATION & UI INTERACTION CONTROLLER
 * Handles header elevation on scroll, active section spy, accessible mobile menu,
 * and dynamic binding of phone/WhatsApp contact points from SITE_CONFIG.
 */

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    bindConfigToElements();
});

function initNavigation() {
    const header = document.querySelector(".site-header");
    const mobileToggle = document.querySelector(".mobile-menu-toggle");
    const mobileMenu = document.querySelector(".mobile-nav-drawer");
    const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");
    const closeBtn = document.getElementById("mobile-drawer-close-btn");
    const overlay = document.querySelector(".mobile-nav-backdrop");

    // 1. Header scroll elevation effect
    const handleScroll = () => {
        if (window.scrollY > 20) {
            header?.classList.add("header-scrolled");
        } else {
            header?.classList.remove("header-scrolled");
        }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // 2. Mobile drawer open / close toggle
    function openMobileNav() {
        if (!mobileMenu) return;
        mobileMenu.classList.add("is-open");
        if (overlay) overlay.classList.add("is-visible");
        if (mobileToggle) {
            mobileToggle.setAttribute("aria-expanded", "true");
            mobileToggle.classList.add("is-active");
        }
        document.body.style.overflow = "hidden";
    }

    function closeMobileNav() {
        if (!mobileMenu) return;
        mobileMenu.classList.remove("is-open");
        if (overlay) overlay.classList.remove("is-visible");
        if (mobileToggle) {
            mobileToggle.setAttribute("aria-expanded", "false");
            mobileToggle.classList.remove("is-active");
        }
        document.body.style.overflow = "";
    }

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            if (mobileMenu.classList.contains("is-open")) {
                closeMobileNav();
            } else {
                openMobileNav();
            }
        });

        if (closeBtn) {
            closeBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                closeMobileNav();
            });
        }

        if (overlay) {
            overlay.addEventListener("click", closeMobileNav);
        }

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) {
                closeMobileNav();
            }
        });
    }

    // Auto close mobile drawer if resized to desktop width
    window.addEventListener("resize", () => {
        if (window.innerWidth > 1080 && mobileMenu?.classList.contains("is-open")) {
            closeMobileNav();
        }
    }, { passive: true });

    // 3. Smooth scrolling and drawer closing for all internal anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (!targetId || targetId === "#") return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                closeMobileNav();
                targetEl.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                }
            }
        });
    });

    // 4. Reliable Scrollspy active link indicator
    const trackedHrefs = new Set(
        Array.from(navLinks)
            .map(link => link.getAttribute("href"))
            .filter(href => href && href.startsWith("#") && href.length > 1)
    );

    const trackedSections = Array.from(document.querySelectorAll("section[id]"))
        .filter(sec => trackedHrefs.has(`#${sec.id}`));

    function updateActiveNav() {
        if (!trackedSections.length) return;
        const scrollPosition = window.scrollY + 130;
        let currentSectionId = trackedSections[0].id;

        for (let i = trackedSections.length - 1; i >= 0; i--) {
            const section = trackedSections[i];
            if (section.offsetTop <= scrollPosition) {
                currentSectionId = section.id;
                break;
            }
        }

        navLinks.forEach(link => {
            const href = link.getAttribute("href");
            if (href === `#${currentSectionId}`) {
                link.classList.add("is-current");
            } else if (href && href.startsWith("#")) {
                link.classList.remove("is-current");
            }
        });
    }

    window.addEventListener("scroll", updateActiveNav, { passive: true });
    updateActiveNav();
}

/**
 * Dynamically binds configuration values from config.js into marked HTML elements
 * Ensures single source of truth across phone, whatsapp, email, and company names.
 */
function bindConfigToElements() {
    if (typeof SITE_CONFIG === "undefined") return;

    // Company Name Bindings
    document.querySelectorAll("[data-bind='companyName']").forEach(el => {
        el.textContent = SITE_CONFIG.companyName;
    });

    // Legal Name Bindings
    document.querySelectorAll("[data-bind='legalName']").forEach(el => {
        el.textContent = SITE_CONFIG.legalName;
    });

    // Phone bindings
    const phoneHref = `tel:${SITE_CONFIG.phoneClean}`;
    document.querySelectorAll("[data-bind='phoneLink']").forEach(el => {
        el.setAttribute("href", phoneHref);
        if (el.dataset.showText === "true") {
            el.textContent = SITE_CONFIG.phone;
        }
    });

    // WhatsApp bindings
    const encodedMsg = encodeURIComponent(SITE_CONFIG.whatsappDefaultMessage);
    const waUrl = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodedMsg}`;
    document.querySelectorAll("[data-bind='whatsappLink']").forEach(el => {
        el.setAttribute("href", waUrl);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
    });

    // Email bindings
    document.querySelectorAll("[data-bind='emailLink']").forEach(el => {
        el.setAttribute("href", `mailto:${SITE_CONFIG.email}`);
        if (el.dataset.showText === "true") {
            el.textContent = SITE_CONFIG.email;
        }
    });

    // Purchase URL bindings (WordPress / WooCommerce flow)
    document.querySelectorAll("[data-bind='purchaseUrl']").forEach(el => {
        el.setAttribute("href", SITE_CONFIG.purchaseUrl);
        el.addEventListener("click", (e) => {
            // Can track analytics event here before redirect
            if (SITE_CONFIG.purchaseUrl.startsWith("http")) {
                el.setAttribute("target", "_blank");
                el.setAttribute("rel", "noopener noreferrer");
            }
        });
    });

    // Address
    document.querySelectorAll("[data-bind='address']").forEach(el => {
        el.textContent = SITE_CONFIG.headquarters;
    });

    // Metrics bindings
    if (SITE_CONFIG.metrics) {
        document.querySelectorAll("[data-metric='installations']").forEach(el => el.textContent = SITE_CONFIG.metrics.installations);
        document.querySelectorAll("[data-metric='capacity']").forEach(el => el.textContent = SITE_CONFIG.metrics.totalCapacityMW);
        document.querySelectorAll("[data-metric='experience']").forEach(el => el.textContent = SITE_CONFIG.metrics.experienceYears);
        document.querySelectorAll("[data-metric='customers']").forEach(el => el.textContent = SITE_CONFIG.metrics.happyCustomers);
    }
}
