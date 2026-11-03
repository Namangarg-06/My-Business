// Premium Packaging Solutions (P2S) - Product Database
// Extracted from official catalog & rate card

const PRODUCTS_DATA = [
  {
    id: "smart-sachets-info",
    category: "smart-sachets",
    name: "Smart Sachets™ (Brand Experience)",
    tagline: "Not just a sachet, it's an experience! Sachet Chota, Impact Bada!",
    badge: "Most Popular",
    description: "Custom printed smart sachets with your brand identity, dynamic QR codes for Google reviews, Instagram follows, video stories, and customer loyalty rewards.",
    minOrderText: "MOQ: 4,000 Sachets",
    features: [
      "01. Basic Custom Sachet - Your logo, clean & premium identity",
      "02. QR Rating Sachet - Direct to Google Review / Menu / Socials",
      "03. Experience Sachet - Video message, founder story & offers",
      "04. Reward Sachet - Loyalty points, secret discounts & perks",
      "05. Campaign Sachet - Festive greetings, seasonal launches"
    ],
    types: [
      { id: "basic", name: "01 Basic Custom Sachet", desc: "Your logo & clean branding" },
      { id: "qr_review", name: "02 QR Rating Sachet", desc: "Direct to Google Reviews & Menu" },
      { id: "experience", name: "03 Experience Sachet", desc: "Scan for video & founder story" },
      { id: "reward", name: "04 Reward Sachet", desc: "Unlock gifts & loyalty points" },
      { id: "campaign", name: "05 Campaign Sachet", desc: "Festival & event promotional campaigns" }
    ],
    sampleShowcases: [
      "Chef Bhupi's Kitchen (Tell Google QR)",
      "Mudoven Cafe & Restaurant (Custom Logo & Contact)",
      "La Indri Restro & Cafe (Follow our vibe Instagram QR)",
      "Thank You for Visiting (Fresh Mouth, Better Mood)"
    ]
  },

  // 1. Mouth Freshener Sachet
  {
    id: "mouth-freshener",
    category: "smart-sachets",
    name: "Mouth Freshener Sachet (Saunf / Mukhwas)",
    tagline: "Hygienic & aromatic restaurant mouth freshener sachets with custom branding",
    badge: "Hospitality Essential",
    pricingType: "tiered",
    unit: "sachet",
    moq: 4000,
    dyeCharge: 600,
    variants: [
      {
        id: "mf-mixture",
        name: "Mouth Freshener Mixture",
        desc: "Colourful crunchy sweet fennel & mouth freshener mix",
        tiers: [
          { min: 4000, max: 6000, rate: 0.90 },
          { min: 6000, max: 8000, rate: 0.85 },
          { min: 8000, max: 10000, rate: 0.80 },
          { min: 10000, max: Infinity, rate: 0.75 }
        ]
      },
      {
        id: "mf-madrasi-white",
        name: "Mouth Freshener Madrasi White",
        desc: "Premium white coated aromatic sweet madrasi saunf",
        tiers: [
          { min: 4000, max: 6000, rate: 1.00 },
          { min: 6000, max: 8000, rate: 0.95 },
          { min: 8000, max: 10000, rate: 0.90 },
          { min: 10000, max: Infinity, rate: 0.85 }
        ]
      },
      {
        id: "mf-madrasi-green",
        name: "Mouth Freshener Madrasi Green",
        desc: "Royal green coated mint flavored madrasi saunf",
        tiers: [
          { min: 4000, max: 6000, rate: 1.00 },
          { min: 6000, max: 8000, rate: 0.95 },
          { min: 8000, max: 10000, rate: 0.90 },
          { min: 10000, max: Infinity, rate: 0.85 }
        ]
      }
    ],
    packagingOptions: ["Custom Printed Foil", "Metallized Barrier Paper"],
    storageNote: "Store the sachet in dry & clean place. Prevent it from heat."
  },

  // 2. Sugar Sachet
  {
    id: "sugar-sachets",
    category: "sachets",
    name: "Custom Sugar Sachets",
    tagline: "Fine crystal sugar sachets for cafes, hotel rooms & breakfast tables",
    badge: "Cafe & Hotel Favorite",
    pricingType: "tiered",
    unit: "sachet",
    moq: 4000,
    dyeCharge: 600,
    variants: [
      {
        id: "sugar-white",
        name: "White Sugar Sachet (5g)",
        desc: "Premium refined sparkling white sugar",
        tiers: [
          { min: 4000, max: 6000, rate: 0.90 },
          { min: 6000, max: 8000, rate: 0.85 },
          { min: 8000, max: 10000, rate: 0.80 },
          { min: 10000, max: Infinity, rate: 0.75 }
        ]
      },
      {
        id: "sugar-brown",
        name: "Brown Sugar Sachet (5g)",
        desc: "Natural golden brown demerara sugar",
        tiers: [
          { min: 4000, max: 6000, rate: 1.05 },
          { min: 6000, max: 8000, rate: 1.00 },
          { min: 8000, max: Infinity, rate: 0.95 }
        ]
      }
    ],
    packagingOptions: ["Food Grade Poster Paper", "Poly Coated Moisture Guard"],
    storageNote: "Store the sachet in dry & clean place. Prevent it from heat."
  },

  // 3. Salt Sachet
  {
    id: "salt-sachets",
    category: "sachets",
    name: "Iodised Salt Sachet",
    tagline: "Hygienic • Premium • Custom Printed Free Flow Salt",
    badge: "High Demand",
    pricingType: "tiered_paper",
    unit: "sachet",
    moq: 4000,
    dyeCharge: 600,
    paperOptions: [
      {
        id: "poster",
        name: "In Poster Paper",
        tiers: [
          { min: 4000, max: 6000, rate: 0.55 },
          { min: 6000, max: 8000, rate: 0.50 },
          { min: 8000, max: 10000, rate: 0.45 },
          { min: 10000, max: Infinity, rate: 0.40 }
        ]
      },
      {
        id: "metallized",
        name: "In Metallized Paper",
        tiers: [
          { min: 4000, max: 6000, rate: 0.65 },
          { min: 6000, max: 8000, rate: 0.60 },
          { min: 8000, max: 10000, rate: 0.55 },
          { min: 10000, max: Infinity, rate: 0.50 }
        ]
      }
    ],
    storageNote: "Store the sachet in dry & clean place. Prevent it from heat."
  },

  // 4. Pizza Seasoning & Chilli Flakes Sachet
  {
    id: "pizza-seasoning-chilli",
    category: "sachets",
    name: "Pizza Seasoning & Chilli Flakes Sachet",
    tagline: "In Premium Metallized Paper | Fresh & Crisp Aromas",
    badge: "Pizzeria & Cafe Essential",
    pricingType: "tiered",
    unit: "sachet",
    moq: 4000,
    dyeCharge: 600,
    variants: [
      {
        id: "pizza-seasoning",
        name: "Oregano Pizza Seasoning (In Metallized Paper)",
        desc: "Aromatic Italian herb blend (oregano, basil, garlic, thyme)",
        tiers: [
          { min: 4000, max: 6000, rate: 0.95 },
          { min: 6000, max: 8000, rate: 0.90 },
          { min: 8000, max: 10000, rate: 0.85 },
          { min: 10000, max: Infinity, rate: 0.80 }
        ]
      },
      {
        id: "chilli-flakes",
        name: "Crushed Red Chilli Flakes (In Metallized Paper)",
        desc: "Spicy premium hot red pepper flakes",
        tiers: [
          { min: 4000, max: 6000, rate: 0.95 },
          { min: 6000, max: 8000, rate: 0.90 },
          { min: 8000, max: 10000, rate: 0.85 },
          { min: 10000, max: Infinity, rate: 0.80 }
        ]
      }
    ],
    storageNote: "Store the sachet in dry & clean place. Prevent it from heat."
  },

  // 5. Black Pepper Sachet
  {
    id: "black-pepper-sachets",
    category: "sachets",
    name: "Black Pepper Sachet",
    tagline: "Hygienic • Premium • Custom Printed Pure Black Pepper",
    badge: "Pure Spice",
    pricingType: "tiered_paper",
    unit: "sachet",
    moq: 4000,
    dyeCharge: 600,
    paperOptions: [
      {
        id: "poster",
        name: "In Poster Paper",
        tiers: [
          { min: 4000, max: 6000, rate: 0.85 },
          { min: 6000, max: 8000, rate: 0.80 },
          { min: 8000, max: 10000, rate: 0.75 },
          { min: 10000, max: Infinity, rate: 0.70 }
        ]
      },
      {
        id: "metallized",
        name: "In Metallized Paper",
        tiers: [
          { min: 4000, max: 6000, rate: 0.95 },
          { min: 6000, max: 8000, rate: 0.90 },
          { min: 8000, max: Infinity, rate: 0.85 }
        ]
      }
    ],
    storageNote: "Store the sachet in dry & clean place. Prevent it from heat."
  },

  // 6. Butter Paper Sheet
  {
    id: "butter-paper",
    category: "paper-packaging",
    name: "One Colour Custom Butter Paper Sheet",
    tagline: "Greaseproof Food Wrapping Sheet for Burgers, Rolls & Sandwiches",
    badge: "Bulk Value",
    pricingType: "weight",
    unit: "kg",
    pricePerUnit: 290,
    typeText: "Non OGR",
    moq: 30, // 30 KG minimum
    dyeCharge: 600,
    desc: "Premium food wrapping paper with your restaurant logo pattern in single custom color.",
    storageNote: "Store the sheet in dry & clean place. Prevent it from heat."
  },

  // 7. Tissue Paper Price List (27 x 27 CM | 1 PLY)
  {
    id: "tissue-paper",
    category: "paper-packaging",
    name: "Custom Printed Tissue Paper (27 x 27 CM | 1 PLY)",
    tagline: "Natural Fibers • Soft & Lightweight • Hygienic & Safe • Eco Friendly",
    badge: "Eco-Friendly",
    pricingType: "tissue_matrix",
    unit: "pack",
    customizationChargePerPack: 2.00,
    moqCustomizationPacks: 500,
    tables: {
      hardTissue: {
        title: "Hard Tissue",
        tiers: {
          "750_packs": { "60_pcs": 12.70, "70_pcs": 13.50, "80_pcs": 14.70, "100_pcs": 17.00 },
          "500_packs": { "60_pcs": 13.20, "70_pcs": 14.10, "80_pcs": 15.30, "100_pcs": 17.70 },
          "250_packs": { "60_pcs": 13.75, "70_pcs": 14.70, "80_pcs": 16.00, "100_pcs": 18.40 }
        }
      },
      softTissue: {
        title: "Soft Tissue",
        tiers: {
          "750_packs": { "60_pcs": 13.80, "70_pcs": 14.70, "80_pcs": 15.80, "100_pcs": 18.10 },
          "500_packs": { "60_pcs": 14.40, "70_pcs": 15.30, "80_pcs": 16.50, "100_pcs": 18.90 },
          "250_packs": { "60_pcs": 15.00, "70_pcs": 16.00, "80_pcs": 17.20, "100_pcs": 19.70 }
        }
      }
    }
  },

  // 8. Chopstick
  {
    id: "chopstick",
    category: "hospitality",
    name: "Custom Sized Bamboo Chopsticks with Paper Sleeve",
    tagline: "Perfect for Every Asian Meal | Hygienic Individual Paper Sleeve",
    badge: "Pan-Asian Special",
    pricingType: "tiered",
    unit: "pair",
    moq: 2000,
    dyeCharge: 600,
    variants: [
      {
        id: "chopstick-standard",
        name: "Chopstick Pair with Custom Printed Paper Sleeve",
        desc: "Splinter-free natural bamboo chopsticks packed in branded paper casing",
        tiers: [
          { min: 2000, max: 4000, rate: 2.95 },
          { min: 4000, max: 6000, rate: 2.90 },
          { min: 6000, max: 8000, rate: 2.85 },
          { min: 8000, max: Infinity, rate: 2.80 }
        ]
      }
    ],
    storageNote: "Store the chopstick in dry & clean place. Prevent it from heat."
  },

  // 9. QR Menu & Customer Engagement Stands & Plans
  {
    id: "qr-stands-plans",
    category: "qr-systems",
    name: "QR Menu & Customer Engagement Solutions",
    tagline: "Digital Menu • Google Reviews • Instagram Growth • WhatsApp Ordering",
    badge: "Tech For Restaurants",
    pricingType: "fixed_stands",
    stands: [
      { id: "qr_display_stand", name: "QR Display Stand", price: 149, desc: "Compact tabletop display stand" },
      { id: "acrylic_t_stand", name: "Acrylic T-Stand", price: 349, desc: "Crystal clear premium dual-sided acrylic stand" },
      { id: "gold_frame_stand", name: "Gold Frame Luxury Display Stand", price: 449, desc: "Ultra-luxury metallic gold finish stand for fine dining" }
    ],
    plans: [
      {
        id: "standard_plan",
        name: "Standard Plan (Google + Instagram Setup)",
        price: 2999,
        billingCycle: "One-Time Setup Charge",
        freebies: "8 Acrylic Stands FREE",
        features: [
          "Google Reviews Booster Setup",
          "Instagram Direct Follow Integration",
          "Custom Restaurant Logo & Theme Design",
          "Complete Physical & Digital Setup",
          "High Quality Waterproof Acrylic Stands Included"
        ]
      },
      {
        id: "premium_menu_plan",
        name: "Premium Menu Plan (Digital Menu + WhatsApp)",
        monthlyPrice: 649,
        yearlyPrice: 5999,
        freebies: "12 Acrylic Stands FREE (with Yearly Plan)",
        features: [
          "Complete Dynamic Digital Food Menu",
          "Direct WhatsApp Connect & Instant Ordering",
          "Category-Wise Menu Management (Food, Drinks, Desserts)",
          "100% Mobile & Tablet Friendly",
          "Custom Restaurant Branding & Color Theme",
          "Pan-India Delivery & Dedicated Support Team"
        ]
      }
    ]
  },

  // 10. Printed Paper Cups (Customised)
  {
    id: "printed-paper-cups",
    category: "paper-cups",
    name: "Printed Paper Cups (Customised Logo & Design)",
    tagline: "Food Grade Material • Attractive HD Printing • Leak Proof & Strong",
    badge: "Branded Cups",
    pricingType: "cups_custom",
    unit: "pc",
    moq: 3000,
    dyeOptions: {
      singleColour: { name: "Single Colour Dye Charge", fee: 600, oneTime: true },
      multicolor: { name: "Multicolor Dye Charge", fee: 2500, oneTime: true }
    },
    sizes: [
      { size: "200 ML", rate: 3.40, desc: "Ideal for Espresso, Tea, Kadak Chai" },
      { size: "250 ML", rate: 4.15, desc: "Standard Cappuccino & Hot Beverages" },
      { size: "350 ML", rate: 5.40, desc: "Medium Coffee, Cold Brew, Juices" },
      { size: "480 ML", rate: 6.15, desc: "Large Thick Shakes, Iced Frappes, Smoothies" }
    ],
    lids: [
      { id: "lid-dome-80", name: "80 MM Dome Lid", rate: 1.00 },
      { id: "lid-dome-90", name: "90 MM Dome Lid", rate: 1.30 },
      { id: "lid-sipper-80", name: "80 MM Sipper Lid", rate: 1.30 },
      { id: "lid-sipper-90", name: "90 MM Sipper Lid", rate: 1.90 }
    ]
  },

  // 11. Plain Paper Cups (Non-Customised)
  {
    id: "plain-paper-cups",
    category: "paper-cups",
    name: "Paper Cups (Non-Customised Plain White)",
    tagline: "Premium Quality • Food Grade • Attractive Finish • Leak Proof",
    badge: "Instant Ready Stock",
    pricingType: "cups_plain",
    unit: "pc",
    moqText: "Minimum Order 20 Cartons",
    sizes: [
      { size: "200 ML", rate: 2.65 },
      { size: "250 ML", rate: 3.35 },
      { size: "350 ML", rate: 4.00 },
      { size: "480 ML", rate: 4.70 }
    ],
    lids: [
      { id: "lid-dome-80", name: "80 MM Dome Lid", rate: 1.00 },
      { id: "lid-dome-90", name: "90 MM Dome Lid", rate: 1.30 },
      { id: "lid-sipper-80", name: "80 MM Sipper Lid", rate: 1.30 },
      { id: "lid-sipper-90", name: "90 MM Sipper Lid", rate: 1.90 }
    ]
  }
];

// Business Contact & Company Profile
const COMPANY_CONFIG = {
  name: "Premium Packaging Solutions (P2S)",
  shortName: "P2S Packaging",
  tagline: "SUPPLIER OF SMART SACHETS & HOSPITALITY PACKAGING SOLUTIONS",
  place: "Indore",
  state: "Madhya Pradesh, India",
  owners: ["Ansh", "Naman"],
  phones: ["+91 8462063330", "+91 9111789220"],
  rawPhones: ["918462063330", "919111789220"],
  primaryPhone: "918462063330",
  secondaryPhone: "919111789220",
  email: "orders@p2spackaging.in",
  terms: [
    "1. Goods once sold will not be taken back or exchanged.",
    "2. We are not responsible for any damage after delivery.",
    "3. All customized orders are final and non-refundable.",
    "4. Payment Terms: 50% Advance Payment, 50% Before Delivery.",
    "5. First order delivery is free; charges apply on subsequent orders."
  ]
};
