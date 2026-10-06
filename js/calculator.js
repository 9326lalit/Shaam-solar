/**
 * INTERACTIVE SOLAR SAVINGS & SUBSIDY CALCULATOR — SHAAM SOLAR
 * Computes capacity, monthly generation, MSEDCL electricity bill savings,
 * PM Surya Ghar DBT subsidy deduction, net turnkey cost, and monthly EMI.
 */

document.addEventListener("DOMContentLoaded", () => {
    initSolarCalculator();
});

function initSolarCalculator() {
    // Form Inputs
    const billSlider = document.getElementById("calc-bill-slider");
    const billInput = document.getElementById("calc-bill-input");
    const propertyTypes = document.querySelectorAll("input[name='calc-property-type']");
    const stateSelect = document.getElementById("calc-state-select");
    const roofAreaInput = document.getElementById("calc-roof-area");

    // Output Result Elements
    const systemSizeEl = document.getElementById("calc-system-size");
    const monthlyGenEl = document.getElementById("calc-monthly-gen");
    const monthlySavingsEl = document.getElementById("calc-monthly-savings");
    const annualSavingsEl = document.getElementById("calc-annual-savings");
    const lifetimeSavingsEl = document.getElementById("calc-lifetime-savings");
    const grossCostEl = document.getElementById("calc-gross-cost");
    const subsidyAmountEl = document.getElementById("calc-subsidy-amount");
    const netCostEl = document.getElementById("calc-net-cost");
    const paybackPeriodEl = document.getElementById("calc-payback-period");
    const monthlyEmiEl = document.getElementById("calc-monthly-emi");
    const netMonthlyBenefitEl = document.getElementById("calc-net-monthly-benefit");
    const co2OffsetEl = document.getElementById("calc-co2-offset");
    const roofRequiredEl = document.getElementById("calc-roof-required");
    const panelCountEl = document.getElementById("calc-panel-count");
    const applyToQuoteBtn = document.getElementById("calc-apply-quote-btn");

    if (!billSlider || !billInput) return;

    // Synchronize Slider and Direct Input
    billSlider.addEventListener("input", (e) => {
        billInput.value = e.target.value;
        updateCalculations();
    });

    billInput.addEventListener("input", (e) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val)) val = 1000;
        if (val > 500000) val = 500000;
        billSlider.value = Math.min(val, parseInt(billSlider.max, 10));
        updateCalculations();
    });

    propertyTypes.forEach(radio => {
        radio.addEventListener("change", updateCalculations);
    });

    if (stateSelect) {
        stateSelect.addEventListener("change", updateCalculations);
    }

    if (roofAreaInput) {
        roofAreaInput.addEventListener("input", updateCalculations);
    }

    function getSelectedPropertyType() {
        const checked = document.querySelector("input[name='calc-property-type']:checked");
        return checked ? checked.value : "residential";
    }

    function getStateFactor() {
        if (!stateSelect) return 1.05; // Default Nashik/Maharashtra
        const val = stateSelect.value;
        const factors = {
            "nashik": 1.06,
            "pune": 1.04,
            "mumbai": 1.00,
            "rest_mh": 1.04,
            "gujarat": 1.07,
            "other": 1.01
        };
        return factors[val] || 1.04;
    }

    function calculateMetrics() {
        const bill = Math.max(1000, parseInt(billInput.value, 10) || 5500);
        const propType = getSelectedPropertyType();
        const assumptions = (typeof SITE_CONFIG !== "undefined" && SITE_CONFIG.SOLAR_ASSUMPTIONS) 
            ? SITE_CONFIG.SOLAR_ASSUMPTIONS 
            : {
                costPerKwMin: 52000,
                costPerKwMax: 65000,
                annualGenerationPerKw: 1500,
                systemLifeYears: 25,
                averageTariffResidential: 8.40,
                averageTariffCommercial: 10.80,
                averageTariffIndustrial: 8.95,
                co2PerKwhKg: 0.82,
                tariffAnnualInflation: 0.05,
                degradationAnnual: 0.0055
            };

        // Tariff lookup (MSEDCL tariff benchmarks)
        let tariff = assumptions.averageTariffResidential;
        if (propType === "commercial") tariff = assumptions.averageTariffCommercial;
        if (propType === "industrial") tariff = assumptions.averageTariffIndustrial;

        // Estimated monthly kWh consumed from grid
        const monthlyKwhConsumed = bill / tariff;
        const annualKwhConsumed = monthlyKwhConsumed * 12;

        // Effective generation factoring Nashik sunny climate
        const stateFactor = getStateFactor();
        const effectiveAnnualGenPerKw = assumptions.annualGenerationPerKw * stateFactor;

        // Sizing: Target offset ~88% of consumption
        let rawKw = (annualKwhConsumed * 0.88) / effectiveAnnualGenPerKw;
        let recommendedKw = Math.max(1, Math.round(rawKw * 2) / 2);
        if (recommendedKw > 15) {
            recommendedKw = Math.round(recommendedKw);
        }

        // Module count with 550W high-efficiency bifacial panels
        const panelCount = Math.ceil((recommendedKw * 1000) / 550);

        // Roof area required: ~75-80 sq ft per kW
        const roofAreaNeededSqFt = Math.round(recommendedKw * 80);

        // Generation
        const annualGenerationKwh = Math.round(recommendedKw * effectiveAnnualGenPerKw);
        const monthlyGenerationKwh = Math.round(annualGenerationKwh / 12);

        // Savings
        const annualSavingsINR = Math.round(annualGenerationKwh * tariff * 0.95);
        const monthlySavingsINR = Math.round(annualSavingsINR / 12);

        // 25-Year Cumulative Savings factoring 5% utility tariff escalation and 0.55% degradation
        let lifetimeSavings = 0;
        let currentYearGen = annualGenerationKwh;
        let currentTariff = tariff;

        for (let yr = 1; yr <= assumptions.systemLifeYears; yr++) {
            lifetimeSavings += (currentYearGen * currentTariff * 0.95);
            currentYearGen *= (1 - assumptions.degradationAnnual);
            currentTariff *= (1 + assumptions.tariffAnnualInflation);
        }
        lifetimeSavings = Math.round(lifetimeSavings);

        // Base Gross Turnkey EPC Cost
        const avgCostPerKw = (assumptions.costPerKwMin + assumptions.costPerKwMax) / 2;
        const grossCost = Math.round(recommendedKw * avgCostPerKw);

        // Central Govt Subsidy (PM Surya Ghar Muft Bijli Yojana) — applicable to residential
        let subsidy = 0;
        if (propType === "residential") {
            if (recommendedKw >= 3) {
                subsidy = 78000;
            } else if (recommendedKw >= 2) {
                subsidy = 60000;
            } else if (recommendedKw >= 1) {
                subsidy = 30000;
            }
        }

        // Net Effective Cost to Customer
        const netCost = Math.max(25000, grossCost - subsidy);

        // Simple Payback in Years
        const paybackYears = Math.min(8.0, Math.max(2.8, (netCost / annualSavingsINR))).toFixed(1);

        // 5-Year Green Energy Loan EMI estimation (~9% annual interest on 80% financed net cost)
        const loanAmount = netCost * 0.80;
        const monthlyRate = 0.09 / 12;
        const tenureMonths = 60;
        const emi = Math.round((loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1));

        // Net monthly cash benefit (Electricity Savings - Loan EMI)
        const netMonthlyGain = monthlySavingsINR - emi;

        // Environmental CO2 offset
        const annualCo2Tons = ((annualGenerationKwh * assumptions.co2PerKwhKg) / 1000).toFixed(1);

        return {
            bill,
            propType,
            recommendedKw,
            panelCount,
            monthlyGenerationKwh,
            monthlySavingsINR,
            annualSavingsINR,
            lifetimeSavings,
            grossCost,
            subsidy,
            netCost,
            paybackYears,
            emi,
            netMonthlyGain,
            annualCo2Tons,
            roofAreaNeededSqFt
        };
    }

    function formatINR(number) {
        if (number >= 10000000) {
            return "₹" + (number / 10000000).toFixed(2) + " Cr";
        } else if (number >= 100000) {
            return "₹" + (number / 100000).toFixed(2) + " Lakh";
        }
        return "₹" + Number(number).toLocaleString("en-IN");
    }

    function updateCalculations() {
        const data = calculateMetrics();

        // Update DOM elements
        if (systemSizeEl) systemSizeEl.textContent = `${data.recommendedKw} kW`;
        if (monthlyGenEl) monthlyGenEl.textContent = `${Number(data.monthlyGenerationKwh).toLocaleString("en-IN")} kWh`;
        if (monthlySavingsEl) monthlySavingsEl.textContent = formatINR(data.monthlySavingsINR);
        if (annualSavingsEl) annualSavingsEl.textContent = formatINR(data.annualSavingsINR);
        if (lifetimeSavingsEl) lifetimeSavingsEl.textContent = formatINR(data.lifetimeSavings);
        if (grossCostEl) grossCostEl.textContent = formatINR(data.grossCost);
        if (subsidyAmountEl) {
            subsidyAmountEl.textContent = data.subsidy > 0 ? `- ${formatINR(data.subsidy)}` : "₹0 (Business/Commercial)";
        }
        if (netCostEl) netCostEl.textContent = formatINR(data.netCost);
        if (paybackPeriodEl) paybackPeriodEl.textContent = `${data.paybackYears} Years`;
        if (monthlyEmiEl) monthlyEmiEl.textContent = `₹${data.emi.toLocaleString("en-IN")}/mo`;
        if (netMonthlyBenefitEl) {
            if (data.netMonthlyGain >= 0) {
                netMonthlyBenefitEl.innerHTML = `<span style="color:#10b981; font-weight:800;">+ ₹${data.netMonthlyGain.toLocaleString("en-IN")}/mo (Cashflow Positive)</span>`;
            } else {
                netMonthlyBenefitEl.textContent = `Net: ₹${Math.abs(data.netMonthlyGain).toLocaleString("en-IN")}/mo`;
            }
        }
        if (co2OffsetEl) co2OffsetEl.textContent = `${data.annualCo2Tons} Tons/Year`;
        if (roofRequiredEl) roofRequiredEl.textContent = `~${data.roofAreaNeededSqFt} sq.ft`;
        if (panelCountEl) panelCountEl.textContent = `${data.panelCount} Modules (550W)`;

        // Update CTA label
        if (applyToQuoteBtn) {
            applyToQuoteBtn.innerHTML = `<span>Get Detailed Proposal for ${data.recommendedKw} kW System</span> <svg class="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>`;
        }
    }

    // Prefill form handler
    if (applyToQuoteBtn) {
        applyToQuoteBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const data = calculateMetrics();

            const formBillInput = document.getElementById("lead-bill");
            const formPropertyType = document.getElementById("lead-property-type");
            const formSystemSize = document.getElementById("lead-system-interest");
            const formNotes = document.getElementById("lead-message");

            if (formBillInput) formBillInput.value = data.bill;
            if (formPropertyType) {
                if (data.propType === "commercial") formPropertyType.value = "Commercial";
                else if (data.propType === "industrial") formPropertyType.value = "Industrial";
                else formPropertyType.value = "Residential";
            }
            if (formSystemSize) formSystemSize.value = `Rooftop On-Grid (${data.recommendedKw} kW)`;
            if (formNotes && !formNotes.value) {
                formNotes.value = `Calculated requirement: ${data.recommendedKw} kW system with approx net investment of ₹${data.netCost.toLocaleString("en-IN")}. Roof area: ~${data.roofAreaNeededSqFt} sq.ft.`;
            }

            const quoteSection = document.getElementById("quote-section");
            if (quoteSection) {
                quoteSection.scrollIntoView({ behavior: "smooth" });
                const formCard = quoteSection.querySelector(".lead-form-card");
                if (formCard) {
                    formCard.classList.add("form-highlight");
                    setTimeout(() => formCard.classList.remove("form-highlight"), 2000);
                }
            }
        });
    }

    // Initial run
    updateCalculations();
}
