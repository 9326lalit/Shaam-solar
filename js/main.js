/**
 * MAIN INTERACTIVITY & EXPERIENCE CONTROLLER
 * Handles FAQ accordion, project category filtering, scroll-triggered number counting,
 * reveal animations, dynamic copyright year, and mobile bottom bar management.
 */

document.addEventListener("DOMContentLoaded", () => {
    initFaqAccordion();
    initProjectFilter();
    initScrollAnimations();
    initCounterAnimations();
    initMobileBottomBar();
    initFooterYear();
});

/**
 * 1. FAQ ACCORDION
 * Accessible, keyboard-friendly accordion with smooth maxHeight animation.
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
        const questionBtn = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        if (!questionBtn || !answer) return;

        questionBtn.addEventListener("click", () => {
            const isCurrentlyOpen = item.classList.contains("is-open");

            // Close other open accordions in the same container for clean reading
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains("is-open")) {
                    otherItem.classList.remove("is-open");
                    const otherBtn = otherItem.querySelector(".faq-question");
                    const otherAnswer = otherItem.querySelector(".faq-answer");
                    if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
                    if (otherAnswer) otherAnswer.style.maxHeight = null;
                }
            });

            // Toggle current
            if (isCurrentlyOpen) {
                item.classList.remove("is-open");
                questionBtn.setAttribute("aria-expanded", "false");
                answer.style.maxHeight = null;
            } else {
                item.classList.add("is-open");
                questionBtn.setAttribute("aria-expanded", "true");
                answer.style.maxHeight = answer.scrollHeight + 32 + "px";
            }
        });
    });

    // Expand the first item by default for immediate preview
    if (faqItems.length > 0) {
        const firstItem = faqItems[0];
        const firstBtn = firstItem.querySelector(".faq-question");
        const firstAnswer = firstItem.querySelector(".faq-answer");
        if (firstItem && firstBtn && firstAnswer) {
            firstItem.classList.add("is-open");
            firstBtn.setAttribute("aria-expanded", "true");
            firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 32 + "px";
        }
    }
}

/**
 * 2. PROJECT SHOWCASE GALLERY FILTER
 */
function initProjectFilter() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const filterValue = btn.dataset.filter;

            // Active button state
            filterButtons.forEach(b => b.classList.remove("is-active"));
            btn.classList.add("is-active");

            // Filter cards with smooth fade
            projectCards.forEach(card => {
                const category = card.dataset.category;
                if (filterValue === "all" || category === filterValue) {
                    card.style.display = "flex";
                    requestAnimationFrame(() => {
                        card.style.opacity = "1";
                        card.style.transform = "scale(1)";
                    });
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "scale(0.96)";
                    setTimeout(() => {
                        if (card.style.opacity === "0") {
                            card.style.display = "none";
                        }
                    }, 250);
                }
            });
        });
    });
}

/**
 * 3. SCROLL-TRIGGERED REVEAL ANIMATIONS
 */
function initScrollAnimations() {
    // Respect user's motion preferences
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.querySelectorAll(".reveal-on-scroll").forEach(el => {
            el.classList.add("is-visible");
        });
        return;
    }

    const revealElements = document.querySelectorAll(".reveal-on-scroll");
    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    });

    revealElements.forEach(el => observer.observe(el));
}

/**
 * 4. NUMERICAL COUNTER ANIMATIONS
 */
function initCounterAnimations() {
    const counters = document.querySelectorAll(".stat-counter");
    if (!counters.length) return;

    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endVal = parseFloat(target.dataset.target);
                const suffix = target.dataset.suffix || "";
                const prefix = target.dataset.prefix || "";
                const decimals = parseInt(target.dataset.decimals || "0", 10);
                const duration = 1600;
                const startTime = performance.now();

                function updateCount(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out quart
                    const easeProgress = 1 - Math.pow(1 - progress, 4);
                    const currentVal = (endVal * easeProgress).toFixed(decimals);

                    target.textContent = `${prefix}${currentVal}${suffix}`;

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        target.textContent = `${prefix}${endVal.toFixed(decimals)}${suffix}`;
                    }
                }

                requestAnimationFrame(updateCount);
                obs.unobserve(target);
            }
        });
    }, { threshold: 0.3 });

    counters.forEach(c => counterObserver.observe(c));
}

/**
 * 5. MOBILE BOTTOM STICKY CTA MANAGEMENT
 * Hides gracefully when user is already viewing the quote form or hero CTA to avoid visual competition.
 */
function initMobileBottomBar() {
    const bottomBar = document.querySelector(".mobile-sticky-bar");
    const quoteSection = document.getElementById("quote-section");

    if (!bottomBar || !quoteSection) return;

    const quoteObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                bottomBar.classList.add("is-hidden");
            } else {
                bottomBar.classList.remove("is-hidden");
            }
        });
    }, { threshold: 0.2 });

    quoteObserver.observe(quoteSection);
}

/**
 * 6. DYNAMIC COPYRIGHT YEAR
 */
function initFooterYear() {
    const yearEl = document.getElementById("current-year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}
