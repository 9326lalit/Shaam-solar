# Shaam Solar — Turn Sunlight Into Wealth (Nashik Solar EPC)

A high-converting, enterprise-grade, responsive website designed specifically for **Shaam Solar Technologies Pvt. Ltd.**, Nashik's premier rooftop solar EPC, engineering, and commercial installation company.

---

## 🌟 Key Highlights

* **Brand & Local Authority**: Configured for **Shaam Solar**, headquartered at **Plot No. 48, MIDC Ambad, Near Trimbak Road, Nashik**, with an Experience Center near **City Center Mall, Untwadi Road, Nashik**.
* **Fresh Modern Aesthetics**: Vibrant Solar Emerald (`#059669`), Mint highlights (`#10b981`), Sunburst Gold (`#f59e0b`), and Electric Cyan (`#0284c7`) with radiant glassmorphism and crisp typography.
* **Pre-Configured Turnkey Solar Packages**:
  * **3 kW Starter Home Package** (~₹1,05,000 net after ₹78,000 PM Surya Ghar subsidy)
  * **5 kW Premium Family Villa** (~₹1,95,000 net after ₹78,000 subsidy) — *Most Popular in Nashik*
  * **10 kW Executive Villa & EV** (~₹4,45,000 net after ₹78,000 subsidy)
  * **50 kW Commercial Pro** (with 40% accelerated tax depreciation under IT Act Sec 32)
* **PM Surya Ghar Muft Bijli Yojana Central Govt Subsidy Engine**:
  * Automatically calculates direct DBT bank subsidies (₹30,000 for 1 kW, ₹60,000 for 2 kW, and up to ₹78,000 for 3 kW+).
  * Calculates Net Cost to Customer after subsidy deduction.
  * Estimates 5-Year Green Energy Loan EMI and displays net positive monthly cashflow!
* **Redesigned Mobile & Desktop Navigation**:
  * Sleek frosted glass bar with live green status indicator.
  * Direct one-tap WhatsApp and Call buttons.
  * Full-featured mobile drawer navigation tested for mobile viewports (360px - 455px).
  * Non-intrusive mobile sticky bottom action dock (`WhatsApp | Call | Get Quote`).
* **Zero Dependencies**: Pure HTML5, Vanilla CSS3, and Vanilla JavaScript. No React, no Tailwind, no build step needed.

---

## 📁 File Structure

```text
d:/sw1/
│
├── index.html            # Semantic HTML5 document with structured data & local Nashik schemas
│
├── css/
│   └── style.css         # Fresh design system tokens, typography, and responsive styles
│
├── js/
│   ├── config.js         # Centralized configuration (Shaam Solar, Nashik HQ, subsidy rates)
│   ├── navigation.js     # Header scroll behavior, mobile drawer, and data-binding
│   ├── calculator.js     # Solar savings, PM Surya Ghar subsidy, and EMI cashflow modeling
│   ├── form.js           # Form validation, Indian phone checks, and submission handling
│   └── main.js           # FAQ accordion, project filter, counter animations, mobile bar
│
└── README.md             # Architecture, configuration, and manual
```

---

## ⚙️ Configuration (`js/config.js`)

All business identity, contact channels, and subsidy figures are centralized in [`js/config.js`](file:///d:/sw1/js/config.js):

```javascript
const SITE_CONFIG = {
    companyName: "Shaam Solar",
    legalName: "Shaam Solar Technologies Pvt. Ltd.",
    phone: "+91 94222 78910",
    phoneClean: "+919422278910",
    whatsapp: "919422278910",
    email: "contact@shaamsolar.com",
    headquarters: "Shaam Solar Tower, Plot No. 48, MIDC Ambad, Near Trimbak Road, Nashik, Maharashtra 422010",
    experienceCenter: "Showroom 04, Metro Plaza, Near City Center Mall, Untwadi Road, Nashik, MH 422002",
    purchaseUrl: "https://example.com/solar-packages/",
    leadEndpoint: "" // Add your REST API or CRM webhook URL here
};
```

---

## 🚀 How to Run Locally

```bash
# Option 1: Double-click index.html to view directly in any browser
# Option 2: Run via python server
python -m http.server 8085
```
Visit: `http://localhost:8085/`
