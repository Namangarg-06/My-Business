// Premium Packaging Solutions (P6S) - Product Database
// Extracted from official catalog & rate card

const PRODUCTS_DATA = [
  // 0. Smart Sachets Overview
  {
    id: "smart-sachets-info",
    category: "smart-sachets",
    name: "Smart Sachets™ (Brand Experience)",
    tagline: "Not just a sachet, it's an experience! Sachet Chota, Impact Bada!",
    badge: "Signature Series",
    description: "Custom printed smart sachets with your brand identity, dynamic QR codes for Google reviews, Instagram follows, video stories, and customer loyalty rewards.",
    minOrderText: "MOQ: 4,000 Sachets",
    features: [
      "01. Basic Custom Sachet - Your logo, clean & premium identity",
      "02. QR Rating Sachet - Direct to Google Review / Website / Menu",
      "03. Experience Sachet - Video message, founder story & offers",
      "04. Reward Sachet - Loyalty points, secret discounts & perks",
      "05. Campaign Sachet - Festive greetings, seasonal launches"
    ],
    sampleShowcases: [
      "Chef Bhupi's Kitchen (Tell Google QR)",
      "Mudoven Cafe & Restaurant (Custom Logo & Contact)",
      "La Indri Restro & Cafe (Follow our vibe Instagram QR)",
      "Thank You for Visiting (Fresh Mouth, Better Mood)"
    ]
  },

  // 1. Mouth Freshener Sachet (Page 7)
  {
    id: "mouth-freshener",
    category: "smart-sachets",
    name: "Mouth Freshener Sachet",
    tagline: "Hygienic • Premium • Custom Printed Post-Meal Mouth Freshener",
    badge: "Top Seller",
    pricingType: "tiered_multi",
    unit: "sachet",
    moq: 4000,
    storageNote: "Store the sachet in dry & clean place. Prevent it from heat.",
    variants: [
      {
        id: "mf-mixture",
        name: "Mouth Freshener Mixture",
        desc: "Colourful crunchy sweet fennel & aromatic mukhwas mix",
        colorTheme: "#854d0e",
        tiers: [
          { range: "4,000 – 6,000", min: 4000, max: 6000, rate: 0.90 },
          { range: "6,000 – 8,000", min: 6000, max: 8000, rate: 0.85 },
          { range: "8,000 – 10,000", min: 8000, max: 10000, rate: 0.80 },
          { range: "10,000+", min: 10000, max: Infinity, rate: 0.75 }
        ]
      },
      {
        id: "mf-madrasi-white",
        name: "Mouth Freshener Madrasi White",
        desc: "Sugar coated aromatic white madrasi saunf",
        colorTheme: "#475569",
        tiers: [
          { range: "4,000 – 6,000", min: 4000, max: 6000, rate: 1.00 },
          { range: "6,000 – 8,000", min: 6000, max: 8000, rate: 0.95 },
          { range: "8,000 – 10,000", min: 8000, max: 10000, rate: 0.90 },
          { range: "10,000+", min: 10000, max: Infinity, rate: 0.85 }
        ]
      },
      {
        id: "mf-madrasi-green",
        name: "Mouth Freshener Madrasi Green",
        desc: "Royal green mint flavored coated madrasi saunf",
        colorTheme: "#15803d",
        tiers: [
          { range: "4,000 – 6,000", min: 4000, max: 6000, rate: 1.00 },
          { range: "6,000 – 8,000", min: 6000, max: 8000, rate: 0.95 },
          { range: "8,000 – 10,000", min: 8000, max: 10000, rate: 0.90 },
          { range: "10,000+", min: 10000, max: Infinity, rate: 0.85 }
        ]
      }
    ]
  },

  // 2. Sugar Sachet (Page 8)
  {
    id: "sugar-sachets",
    category: "sachets",
    name: "Sugar Sachet",
    tagline: "Fine crystal sugar sachets for cafes, hotel rooms & dining tables",
    badge: "Cafe Essential",
    pricingType: "tiered_multi",
    unit: "sachet",
    moq: 4000,
    storageNote: "Store the sachet in dry & clean place. Prevent it from heat.",
    variants: [
      {
        id: "sugar-white",
        name: "White Sugar",
        desc: "Refined sparkling pure white sugar",
        colorTheme: "#0284c7",
        tiers: [
          { range: "4,000 – 6,000", min: 4000, max: 6000, rate: 0.90 },
          { range: "6,000 – 8,000", min: 6000, max: 8000, rate: 0.85 },
          { range: "8,000 – 10,000", min: 8000, max: 10000, rate: 0.80 },
          { range: "10,000+", min: 10000, max: Infinity, rate: 0.75 }
        ]
      },
      {
        id: "sugar-brown",
        name: "Brown Sugar",
        desc: "Natural golden brown demerara sugar crystals",
        colorTheme: "#b45309",
        tiers: [
          { range: "4,000 – 6,000", min: 4000, max: 6000, rate: 1.05 },
          { range: "6,000 – 8,000", min: 6000, max: 8000, rate: 1.00 },
          { range: "8,000+", min: 8000, max: Infinity, rate: 0.95 }
        ]
      }
    ]
  },

  // 3. Salt Sachet (Page 9)
  {
    id: "salt-sachets",
    category: "sachets",
    name: "Salt Sachet",
    tagline: "Hygienic • Premium • Custom Printed Free Flow Iodised Salt",
    badge: "Hygienic Packaging",
    pricingType: "side_by_side_paper",
    unit: "sachet",
    moq: 4000,
    storageNote: "Store the sachet in dry & clean place. Prevent it from heat.",
    paperOptions: [
      {
        id: "poster",
        title: "IN POSTER PAPER",
        tiers: [
          { range: "4,000 – 6,000", min: 4000, max: 6000, rate: 0.55 },
          { range: "6,000 – 8,000", min: 6000, max: 8000, rate: 0.50 },
          { range: "8,000 – 10,000", min: 8000, max: 10000, rate: 0.45 },
          { range: "10,000+", min: 10000, max: Infinity, rate: 0.40 }
        ]
      },
      {
        id: "metallized",
        title: "IN METALLIZED PAPER",
        tiers: [
          { range: "4,000 – 6,000", min: 4000, max: 6000, rate: 0.65 },
          { range: "6,000 – 8,000", min: 6000, max: 8000, rate: 0.60 },
          { range: "8,000 – 10,000", min: 8000, max: 10000, rate: 0.55 },
          { range: "10,000+", min: 10000, max: Infinity, rate: 0.50 }
        ]
      }
    ]
  },

  // 4. Pizza Seasoning & Chilli Flakes Sachet (Page 10)
  {
    id: "pizza-seasoning-chilli",
    category: "sachets",
    name: "Pizza Seasoning & Chilli Flakes Sachet",
    tagline: "In Metallized Paper • Moisture Protected & Crisp Aroma",
    badge: "Pizzeria Favorite",
    pricingType: "side_by_side_variants",
    unit: "sachet",
    moq: 4000,
    storageNote: "Store the sachet in dry & clean place. Prevent it from heat.",
    variants: [
      {
        id: "pizza-seasoning",
        name: "Pizza Seasoning (In Metallized Paper)",
        desc: "Aromatic Italian herb seasoning blend",
        colorTheme: "#047857",
        tiers: [
          { range: "4,000 – 6,000", min: 4000, max: 6000, rate: 0.95 },
          { range: "6,000 – 8,000", min: 6000, max: 8000, rate: 0.90 },
          { range: "8,000 – 10,000", min: 8000, max: 10000, rate: 0.85 },
          { range: "10,000+", min: 10000, max: Infinity, rate: 0.80 }
        ]
      },
      {
        id: "chilli-flakes",
        name: "Chilli Flakes (In Metallized Paper)",
        desc: "Crushed fiery red chilli flakes",
        colorTheme: "#b91c1c",
        tiers: [
          { range: "4,000 – 6,000", min: 4000, max: 6000, rate: 0.95 },
          { range: "6,000 – 8,000", min: 6000, max: 8000, rate: 0.90 },
          { range: "8,000 – 10,000", min: 8000, max: 10000, rate: 0.85 },
          { range: "10,000+", min: 10000, max: Infinity, rate: 0.80 }
        ]
      }
    ]
  },

  // 5. Black Pepper Sachet (Page 11)
  {
    id: "black-pepper-sachets",
    category: "sachets",
    name: "Black Pepper Sachet",
    tagline: "Hygienic • Premium • Custom Printed Pure Kali Mirch Powder",
    badge: "Fine Dining",
    pricingType: "side_by_side_paper",
    unit: "sachet",
    moq: 4000,
    storageNote: "Store the sachet in dry & clean place. Prevent it from heat.",
    paperOptions: [
      {
        id: "poster",
        title: "IN POSTER PAPER",
        tiers: [
          { range: "4,000 – 6,000", min: 4000, max: 6000, rate: 0.85 },
          { range: "6,000 – 8,000", min: 6000, max: 8000, rate: 0.80 },
          { range: "8,000 – 10,000", min: 8000, max: 10000, rate: 0.75 },
          { range: "10,000+", min: 10000, max: Infinity, rate: 0.70 }
        ]
      },
      {
        id: "metallized",
        title: "IN METALLIZED PAPER",
        tiers: [
          { range: "4,000 – 6,000", min: 4000, max: 6000, rate: 0.95 },
          { range: "6,000 – 8,000", min: 6000, max: 8000, rate: 0.90 },
          { range: "8,000+", min: 8000, max: Infinity, rate: 0.85 }
        ]
      }
    ]
  },

  // 6. Butter Paper Sheet (Page 12)
  {
    id: "butter-paper",
    category: "paper-packaging",
    name: "Butter Paper Sheet",
    tagline: "One Colour Custom Printed Butter Paper Sheet for Burgers & Rolls",
    badge: "Bulk Essential",
    pricingType: "weight_sheet",
    unit: "kg",
    pricePerUnit: 290,
    typeText: "NON OGR",
    moq: 30, // 30 KG
    storageNote: "Store the sheet in dry & clean place. Prevent it from heat.",
    desc: "Premium food wrapping paper with your restaurant branding pattern. Oil & grease resistant."
  },

  // 7. Tissue Paper Price List (Page 13)
  {
    id: "tissue-paper",
    category: "paper-packaging",
    name: "Tissue Paper Price List",
    tagline: "Size: 27 x 27 CM | 1 PLY • Made from Natural Fibers • Eco Friendly",
    badge: "Eco Sustainable",
    pricingType: "tissue_tables",
    size: "27 x 27 CM",
    ply: "1 PLY",
    customizationCharge: "₹2 Extra / Pack",
    moqCustomization: "500 Packets",
    tables: {
      hardTissue: {
        title: "HARD TISSUE",
        columns: ["QUANTITY", "750 PACKS", "500 PACKS", "250 PACKS"],
        rows: [
          { qty: "60 PCS", p750: "12.70", p500: "13.20", p250: "13.75" },
          { qty: "70 PCS", p750: "13.50", p500: "14.10", p250: "14.70" },
          { qty: "80 PCS", p750: "14.70", p500: "15.30", p250: "16.00" },
          { qty: "100 PCS", p750: "17.00", p500: "17.70", p250: "18.40" }
        ]
      },
      softTissue: {
        title: "SOFT TISSUE",
        columns: ["QUANTITY", "750 PACKS", "500 PACKS", "250 PACKS"],
        rows: [
          { qty: "60 PCS", p750: "13.80", p500: "14.40", p250: "15.00" },
          { qty: "70 PCS", p750: "14.70", p500: "15.30", p250: "16.00" },
          { qty: "80 PCS", p750: "15.80", p500: "16.50", p250: "17.20" },
          { qty: "100 PCS", p750: "18.10", p500: "18.90", p250: "19.70" }
        ]
      }
    }
  },

  // 8. Chopstick (Page 14)
  {
    id: "chopstick",
    category: "hospitality",
    name: "Chopstick",
    tagline: "Perfect for Every Meal • Individual Printed Paper Sleeve",
    badge: "Asian Dining",
    pricingType: "tiered_simple",
    unit: "pair",
    moq: 2000,
    storageNote: "Store the chopstick in dry & clean place. Prevent it from heat.",
    tiers: [
      { range: "2,000 – 4,000", min: 2000, max: 4000, rate: 2.95 },
      { range: "4,000 – 6,000", min: 4000, max: 6000, rate: 2.90 },
      { range: "6,000 – 8,000", min: 6000, max: 8000, rate: 2.85 },
      { range: "8,000+", min: 8000, max: Infinity, rate: 2.80 }
    ]
  },

  // 9. QR Menu & Customer Engagement (Page 15)
  {
    id: "qr-menu-stands",
    category: "qr-systems",
    name: "QR Menu & Customer Engagement",
    tagline: "For Restaurants, Cafes & Hotels • Digital Menu • Google Reviews • Instagram Follow • WhatsApp Connect",
    badge: "Smart Restaurant Tech",
    pricingType: "qr_hardware_plans",
    stands: [
      { id: "qr-display-stand", name: "QR DISPLAY STAND", price: 149, subtitle: "Tabletop Standing Stand" },
      { id: "acrylic-t-stand", name: "ACRYLIC T-STAND", price: 349, subtitle: "Crystal Clear Acrylic Body" },
      { id: "gold-frame-stand", name: "GOLD FRAME DISPLAY STAND", price: 449, subtitle: "Ultra Luxury Metallic Gold Finish" }
    ],
    plans: [
      {
        id: "standard-plan",
        name: "STANDARD PLAN",
        focus: "GOOGLE + INSTAGRAM",
        price: 2999,
        period: "one time charge",
        freeGift: "8 Acrylic Stands FREE",
        features: [
          "Google Reviews Booster Setup",
          "Instagram Follow Integration",
          "Custom Design (Logo + Theme)",
          "Complete Setup Included"
        ]
      },
      {
        id: "premium-menu-plan",
        name: "PREMIUM MENU PLAN",
        focus: "DIGITAL MENU + WHATSAPP",
        priceMonthly: 649,
        priceYearly: 5999,
        freeGift: "12 Acrylic Stands FREE (With Yearly Plan)",
        features: [
          "Complete Digital Dynamic Menu",
          "WhatsApp Connect & Ordering",
          "Category Wise Menu (Food, Beverages, etc.)",
          "Mobile Friendly Layout",
          "Custom Design (Logo + Theme)",
          "Complete Setup & Dedicated Support"
        ]
      }
    ]
  },

  // 10. Printed Paper Cups (Page 16)
  {
    id: "printed-paper-cups",
    category: "paper-cups",
    name: "Printed Paper Cups",
    tagline: "Customise Your Logo and Design • Premium Quality • Food Grade Material • Attractive Printing • Leak Proof",
    badge: "Custom Printed",
    pricingType: "cups_custom_table",
    unit: "pc",
    moqText: "MINIMUM ORDER 3,000 PCS",
    moq: 3000,
    rates: [
      { size: "200 ML", rate: 3.40 },
      { size: "250 ML", rate: 4.15 },
      { size: "350 ML", rate: 5.40 },
      { size: "480 ML", rate: 6.15 }
    ],
    lids: {
      dome: [
        { size: "80 MM (Dome Lid)", rate: 1.00 },
        { size: "90 MM (Dome Lid)", rate: 1.30 }
      ],
      sipper: [
        { size: "80 MM (Sipper Lid)", rate: 1.30 },
        { size: "90 MM (Sipper Lid)", rate: 1.90 }
      ]
    },
    dyeCharges: [
      { type: "Single Colour", fee: 600, note: "One Time Charge" },
      { type: "Multicolor", fee: 2500, note: "One Time Charge" }
    ]
  },

  // 11. Paper Cups Non Customised (Page 17)
  {
    id: "plain-paper-cups",
    category: "paper-cups",
    name: "Paper Cups (Non Customised)",
    tagline: "Premium Quality • Food Grade Material • Attractive Finish • Leak Proof & Strong",
    badge: "Ready Stock",
    pricingType: "cups_plain_table",
    unit: "pc",
    moqText: "MINIMUM ORDER 20 CARTOONS",
    rates: [
      { size: "200 ML", rate: 2.65 },
      { size: "250 ML", rate: 3.35 },
      { size: "350 ML", rate: 4.00 },
      { size: "480 ML", rate: 4.70 }
    ],
    lids: {
      dome: [
        { size: "80 MM Dome", rate: 1.00 },
        { size: "90 MM Dome", rate: 1.30 }
      ],
      sipper: [
        { size: "80 MM Sipper", rate: 1.30 },
        { size: "90 MM Sipper", rate: 1.90 }
      ]
    }
  }
];

// Business Config - P6S
const COMPANY_CONFIG = {
  name: "Premium Packaging Solutions (P6S)",
  code: "P6S",
  shortName: "P6S Packaging",
  tagline: "SUPPLIER OF SMART SACHETS & HOSPITALITY PACKAGING SOLUTIONS",
  place: "Indore",
  state: "Madhya Pradesh, India",
  owners: ["Naman", "Ansh"],
  phones: ["+91 8462063330", "+91 9111789220"],
  rawPhones: ["918462063330", "919111789220"],
  primaryPhone: "918462063330",
  secondaryPhone: "919111789220",
  email: "contact@p6spackaging.in",
  terms: [
    "1. Goods once sold will not be taken back or exchanged.",
    "2. We are not responsible for any damage after delivery.",
    "3. All customized orders are final and non-refundable.",
    "4. Payment Terms: 50% Advance Payment, 50% Before Delivery.",
    "5. First order delivery is free; charges apply on subsequent orders."
  ]
};
