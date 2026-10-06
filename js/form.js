/**
 * LEAD GENERATION FORM HANDLER
 * Handles field validation, Indian phone format checks, user feedback,
 * submission dispatch to configurable API endpoints, and realistic demo confirmation.
 */

document.addEventListener("DOMContentLoaded", () => {
    initLeadForm();
});

function initLeadForm() {
    const form = document.getElementById("solar-quote-form");
    const submitBtn = document.getElementById("form-submit-btn");
    const modal = document.getElementById("lead-success-modal");
    const modalClose = document.getElementById("modal-close-btn");
    const modalLeadDetails = document.getElementById("modal-lead-details");
    const modalWaBtn = document.getElementById("modal-wa-btn");

    if (!form) return;

    // Real-time input validation clearers
    const inputs = form.querySelectorAll("input, select, textarea");
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            clearFieldError(input);
        });
        input.addEventListener("blur", () => {
            validateField(input);
        });
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Validate all required fields
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            // Focus on first invalid field
            const firstError = form.querySelector(".has-error input, .has-error select, .has-error textarea");
            if (firstError) {
                firstError.focus();
            }
            return;
        }

        // Gather form data
        const formData = {
            fullName: document.getElementById("lead-name")?.value.trim() || "",
            phone: document.getElementById("lead-phone")?.value.trim() || "",
            email: document.getElementById("lead-email")?.value.trim() || "",
            city: document.getElementById("lead-city")?.value.trim() || "",
            propertyType: document.getElementById("lead-property-type")?.value || "Residential",
            monthlyBill: document.getElementById("lead-bill")?.value || "5000",
            solution: document.getElementById("lead-system-interest")?.value || "Rooftop On-Grid",
            message: document.getElementById("lead-message")?.value.trim() || "",
            timestamp: new Date().toISOString()
        };

        // Loading state
        setSubmitLoading(true);

        const endpoint = (typeof SITE_CONFIG !== "undefined" && SITE_CONFIG.leadEndpoint) 
            ? SITE_CONFIG.leadEndpoint 
            : "";

        try {
            if (endpoint && endpoint.trim().length > 0) {
                // Production backend dispatch
                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error("Server responded with error status: " + response.status);
                }
            } else {
                // Static demo mode simulation: simulate 600ms network delay
                await new Promise(resolve => setTimeout(resolve, 600));
            }

            // Show rich success confirmation
            showSuccessModal(formData);
            form.reset();

        } catch (err) {
            console.error("Submission error:", err);
            alert("We encountered an issue submitting your request. Please call or WhatsApp us directly using the buttons on screen.");
        } finally {
            setSubmitLoading(false);
        }
    });

    function validateField(field) {
        if (!field.hasAttribute("required") && !field.value.trim()) {
            return true;
        }

        const value = field.value.trim();
        const fieldGroup = field.closest(".form-group");

        // 1. Required Check
        if (field.hasAttribute("required") && !value) {
            setFieldError(field, "This field is required.");
            return false;
        }

        // 2. Name check
        if (field.id === "lead-name") {
            if (value.length < 3) {
                setFieldError(field, "Please enter your full name (at least 3 letters).");
                return false;
            }
        }

        // 3. Indian Phone Number validation (10 digits starting with 6,7,8,9)
        if (field.id === "lead-phone") {
            // Strip leading +91 or spaces
            const cleanPhone = value.replace(/[\s\-\+]/g, "").replace(/^91/, "");
            const phoneRegex = /^[6-9]\d{9}$/;
            if (!phoneRegex.test(cleanPhone)) {
                setFieldError(field, "Please enter a valid 10-digit Indian mobile number.");
                return false;
            }
        }

        // 4. Email check
        if (field.id === "lead-email" && value.length > 0) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                setFieldError(field, "Please enter a valid email address.");
                return false;
            }
        }

        clearFieldError(field);
        return true;
    }

    function setFieldError(field, message) {
        const group = field.closest(".form-group");
        if (!group) return;
        group.classList.add("has-error");
        let errorMsgEl = group.querySelector(".form-error-msg");
        if (!errorMsgEl) {
            errorMsgEl = document.createElement("span");
            errorMsgEl.className = "form-error-msg";
            group.appendChild(errorMsgEl);
        }
        errorMsgEl.textContent = message;
        field.setAttribute("aria-invalid", "true");
    }

    function clearFieldError(field) {
        const group = field.closest(".form-group");
        if (!group) return;
        group.classList.remove("has-error");
        const errorMsgEl = group.querySelector(".form-error-msg");
        if (errorMsgEl) {
            errorMsgEl.textContent = "";
        }
        field.removeAttribute("aria-invalid");
    }

    function setSubmitLoading(isLoading) {
        if (!submitBtn) return;
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.dataset.originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = `<span class="btn-spinner"></span> Generating Custom Proposal...`;
        } else {
            submitBtn.disabled = false;
            if (submitBtn.dataset.originalText) {
                submitBtn.innerHTML = submitBtn.dataset.originalText;
            }
        }
    }

    function showSuccessModal(data) {
        if (!modal) {
            alert(`Thank you ${data.fullName}! Your solar assessment request has been received. Our solar engineer will reach out at ${data.phone}.`);
            return;
        }

        // Format lead summary in modal
        if (modalLeadDetails) {
            modalLeadDetails.innerHTML = `
                <div class="modal-summary-grid">
                    <div class="summary-item">
                        <span class="summary-label">Name</span>
                        <strong class="summary-value">${escapeHtml(data.fullName)}</strong>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Mobile</span>
                        <strong class="summary-value">${escapeHtml(data.phone)}</strong>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">City</span>
                        <strong class="summary-value">${escapeHtml(data.city)}</strong>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Property Type</span>
                        <strong class="summary-value">${escapeHtml(data.propertyType)}</strong>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">System Interest</span>
                        <strong class="summary-value text-accent">${escapeHtml(data.solution)}</strong>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Status</span>
                        <span class="badge-status">Assigned to Engineer</span>
                    </div>
                </div>
            `;
        }

        // Setup instant WhatsApp verification link
        if (modalWaBtn && typeof SITE_CONFIG !== "undefined") {
            const waText = encodeURIComponent(`Hi ${SITE_CONFIG.companyName}, I just submitted a quote request for my ${data.propertyType} property in ${data.city}. System interest: ${data.solution}. Name: ${data.fullName}.`);
            modalWaBtn.href = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${waText}`;
        }

        modal.classList.add("is-visible");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove("is-visible");
            document.body.style.overflow = "";
        }
    }

    if (modalClose) {
        modalClose.addEventListener("click", closeModal);
    }

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal && modal.classList.contains("is-visible")) {
            closeModal();
        }
    });

    function escapeHtml(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}
