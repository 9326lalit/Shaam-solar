/**
 * SITE CONFIGURATION — SHAAM SOLAR ENERGY SYSTEMS
 * Centralized business details, Nashik headquarters, contact channels,
 * government subsidy guidelines, and solar calculation parameters.
 */
const SITE_CONFIG = {
    // Brand & Identity
    companyName: "Shaam Solar",
    legalName: "Shaam Solar Technologies Pvt. Ltd.",
    tagline: "Turn Sunlight Into Wealth • Nashik's Premier Solar EPC & Engineering Partner",
    foundedYear: 2015,

    // Contact Information (Easily updated in this single location)
    phone: "+91 94222 78910",
    phoneClean: "+919422278910",
    altPhone: "+91 253 238 4500",
    whatsapp: "919422278910",
    whatsappDefaultMessage: "Namaskar Shaam Solar team, I am interested in rooftop solar installation for my property in Nashik / Maharashtra. Please share estimated cost, PM Surya Ghar subsidy, and savings.",
    email: "contact@shaamsolar.com",
    supportEmail: "service@shaamsolar.com",

    // Physical Headquarters & Regional Branches
    headquarters: "Shaam Solar Tower, Plot No. 48, MIDC Ambad, Near Trimbak Road, Nashik, Maharashtra 422010",
    experienceCenter: "Showroom 04, Metro Plaza, Near City Center Mall, Untwadi Road, Nashik, MH 422002",
    operatingCities: ["Nashik", "Pune", "Mumbai Metro", "Chhatrapati Sambhajinagar", "Jalgaon", "Dhule", "Ahmednagar", "Malegaon"],
    workingHours: "Monday – Saturday: 9:00 AM – 7:30 PM",

    // External URLs / Integrations
    purchaseUrl: "https://example.com/solar-packages/", // WooCommerce / WordPress catalog link
    quoteUrl: "#quote-section",
    leadEndpoint: "", // Leave blank for demo mode; add your API endpoint when live

    // Verified Benchmark Data (Placeholders & baseline figures)
    metrics: {
        installations: "2,150+",
        totalCapacityMW: "28.5 MW",
        happyCustomers: "2,050+",
        citiesPresent: "12+",
        experienceYears: "10+",
        msedclApprovals: "100%"
    },

    // PM Surya Ghar Muft Bijli Yojana Central Government Subsidy Scheme
    subsidyRates: {
        oneKw: 30000,
        twoKw: 60000,
        threeKwAndAbove: 78000
    },

    // Solar Engineering Assumptions for the Savings Calculator
    SOLAR_ASSUMPTIONS: {
        costPerKwMin: 52000,           // Base turnkey EPC cost per kW (INR)
        costPerKwMax: 65000,           // Tier-1 high-efficiency TOPCon bifacial (INR)
        annualGenerationPerKw: 1500,   // High-yield Nashik / North Maharashtra solar belt (kWh/kWp/year)
        systemLifeYears: 25,           // Standard performance warranty life
        averageTariffResidential: 8.40,// MSEDCL blended slab rate per kWh for residential (INR)
        averageTariffCommercial: 10.80,// MSEDCL commercial tariff rate (INR)
        averageTariffIndustrial: 8.95, // MSEDCL HT/LT industrial tariff rate (INR)
        co2PerKwhKg: 0.82,             // kg CO2 offset per unit
        treesEquivalentPerKwYear: 24,  // Environmental tree absorption equivalent
        tariffAnnualInflation: 0.05,   // 5% historic average annual utility grid escalation
        degradationAnnual: 0.0055      // 0.55% annual module output degradation
    }
};

// Freeze configuration to prevent accidental modification at runtime
Object.freeze(SITE_CONFIG);
Object.freeze(SITE_CONFIG.metrics);
Object.freeze(SITE_CONFIG.subsidyRates);
Object.freeze(SITE_CONFIG.SOLAR_ASSUMPTIONS);
