export interface Medicine {
  id: number;
  name: string;
  brand: string;
  saltComposition: string;
  category: string;
  description: string;
  dosage: string;
  sideEffects: string;
  storageInstructions: string;
  batchNumber: string;
  expiryDate: string;
  mrp: number;
  discountPrice: number;
  stock: number;
  manufacturer: string;
  prescriptionRequired: boolean;
  isFeatured: boolean;
  imageUrl?: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  medicineCount: number;
}

export interface HealthTip {
  id: number;
  title: string;
  category: string;
  summary: string;
  content: string;
  readTime: string;
  date: string;
  imageUrl: string;
}

export interface CartItem {
  medicineId: number;
  medicineName: string;
  price: number;
  quantity: number;
  prescriptionRequired: boolean;
  imageUrl?: string;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
}

export interface OrderItem {
  medicineId: number;
  medicineName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface Prescription {
  id: number;
  customerName: string;
  notes: string;
  fileUrl: string;
  status: string;
  createdAt: string;
}

// Initial Mock Categories
export const mockCategories: Category[] = [
  { id: 1, name: "Medicines", icon: "💊", medicineCount: 4 },
  { id: 2, name: "Personal Care", icon: "🧴", medicineCount: 3 },
  { id: 3, name: "Healthcare Devices", icon: "🔌", medicineCount: 2 },
  { id: 4, name: "Baby Care", icon: "🍼", medicineCount: 2 },
  { id: 5, name: "Ayurvedic", icon: "🍃", medicineCount: 2 }
];

// Initial Mock Products (Medicines & Cosmetics)
export const mockMedicines: Medicine[] = [
  {
    id: 1,
    name: "Paracetamol 650mg",
    brand: "Calpol 650",
    saltComposition: "Paracetamol (650mg)",
    category: "Medicines",
    description: "Helps relieve pain and reduce fever. Widely used for headaches, muscle aches, arthritis, backaches, toothaches, colds, and fevers.",
    dosage: "1 tablet every 4-6 hours as needed. Do not exceed 4 tablets in 24 hours.",
    sideEffects: "Allergic skin reaction, nausea, liver damage (only in case of overdose).",
    storageInstructions: "Store below 30°C in a dry place.",
    batchNumber: "CP2026X4",
    expiryDate: "2028-12-01",
    mrp: 35.00,
    discountPrice: 29.50,
    stock: 120,
    manufacturer: "GSK Pharmaceuticals Ltd",
    prescriptionRequired: false,
    isFeatured: true,
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Amoxicillin 500mg",
    brand: "Novamox 500",
    saltComposition: "Amoxicillin (500mg)",
    category: "Medicines",
    description: "A penicillin-type antibiotic used to treat a wide variety of bacterial infections. It works by stopping the growth of bacteria.",
    dosage: "1 capsule 3 times a day or as directed by a physician. Complete the full course.",
    sideEffects: "Nausea, diarrhea, skin rash, oral thrush with prolonged use.",
    storageInstructions: "Store below 25°C away from direct sunlight.",
    batchNumber: "NM9087Y",
    expiryDate: "2027-10-01",
    mrp: 110.00,
    discountPrice: 95.00,
    stock: 85,
    manufacturer: "Cipla Ltd",
    prescriptionRequired: true,
    isFeatured: true,
    imageUrl: "https://images.unsplash.com/photo-1550572017-edd951b55104?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Niacinamide 10% Face Serum",
    brand: "The Derma Co",
    saltComposition: "Niacinamide (10%), Zinc PCA (1%)",
    category: "Personal Care",
    description: "Premium cosmetic serum that helps minimize acne marks, reduces large pores, and evens out skin tone. Promotes clear and healthy skin barrier.",
    dosage: "Apply 2-3 drops on clean face twice daily.",
    sideEffects: "Mild tingling sensation on first application.",
    storageInstructions: "Store in a cool, dry place. Keep away from direct sunlight.",
    batchNumber: "DC-NS22",
    expiryDate: "2028-04-01",
    mrp: 399.00,
    discountPrice: 349.00,
    stock: 50,
    manufacturer: "Honasa Consumer Ltd",
    prescriptionRequired: false,
    isFeatured: true,
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Hydrating Moisturizer Cream",
    brand: "Cetaphil",
    saltComposition: "Glycerin, Panthenol, Niacinamide",
    category: "Personal Care",
    description: "Dermatologist-recommended premium face and body lotion. Intense 48-hour hydration for dry to normal, sensitive skin.",
    dosage: "Apply liberally over clean skin daily or as needed.",
    sideEffects: "Extremely safe, no known common side effects.",
    storageInstructions: "Store below 30°C.",
    batchNumber: "CP-HM99",
    expiryDate: "2028-02-01",
    mrp: 480.00,
    discountPrice: 420.00,
    stock: 75,
    manufacturer: "Galderma India Pvt Ltd",
    prescriptionRequired: false,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Digital Blood Pressure Monitor",
    brand: "Omron HEM-7120",
    saltComposition: "Oscillometric Sensor",
    category: "Healthcare Devices",
    description: "Fully automatic digital blood pressure monitor with Intellisense technology for comfortable and accurate readings.",
    dosage: "Wrap cuff around upper arm. Press Start button. Follow user guide instructions.",
    sideEffects: "None.",
    storageInstructions: "Store cuff and monitor in the soft carry bag inside a dry place.",
    batchNumber: "OM-HEM11",
    expiryDate: "2031-01-01",
    mrp: 2499.00,
    discountPrice: 1999.00,
    stock: 30,
    manufacturer: "Omron Healthcare India",
    prescriptionRequired: false,
    isFeatured: true,
    imageUrl: "/bp-monitor.png"
  },
  {
    id: 6,
    name: "Ashwagandha Capsules 250mg",
    brand: "Himalaya Wellness",
    saltComposition: "Ashwagandha Extract (250mg)",
    category: "Ayurvedic",
    description: "Supports stress relief, improves energy levels, and boosts general immunity. Pure herbal extract for daily vitality.",
    dosage: "1 capsule twice daily after meals, or as recommended by an Ayurvedic doctor.",
    sideEffects: "None when taken in recommended doses.",
    storageInstructions: "Store in dry place at room temperature.",
    batchNumber: "HW-AW08",
    expiryDate: "2028-09-01",
    mrp: 180.00,
    discountPrice: 165.00,
    stock: 90,
    manufacturer: "Himalaya Drug Company",
    prescriptionRequired: false,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 7,
    name: "Baby Gentle Mild Shampoo",
    brand: "Johnson's Baby",
    saltComposition: "Decyl Glucoside, Glycerin, Water",
    category: "Baby Care",
    description: "No More Tears gentle formula, mild as pure water to baby's eyes. Soap-free and hypoallergenic cosmetic shampoo for soft baby hair.",
    dosage: "Wet baby's hair, apply small amount, lather gently and rinse thoroughly.",
    sideEffects: "None. Hypoallergenic.",
    storageInstructions: "Store in a cool place.",
    batchNumber: "JB-BS45",
    expiryDate: "2028-06-01",
    mrp: 210.00,
    discountPrice: 190.00,
    stock: 60,
    manufacturer: "Johnson & Johnson Pvt Ltd",
    prescriptionRequired: false,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 9,
    name: "Herbal Chyawanprash 1kg",
    brand: "Dabur",
    saltComposition: "Amla, Giloy, Ashwagandha, Honey",
    category: "Ayurvedic",
    description: "Traditional Ayurvedic health supplement enriched with Amla and 40+ herbs. Boosts immunity, protects against seasonal infections.",
    dosage: "1-2 teaspoons daily with warm milk or water.",
    sideEffects: "None.",
    storageInstructions: "Keep container tightly closed after use.",
    batchNumber: "DB-CP01",
    expiryDate: "2028-08-01",
    mrp: 450.00,
    discountPrice: 399.00,
    stock: 100,
    manufacturer: "Dabur India Ltd",
    prescriptionRequired: false,
    isFeatured: true,
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXpXC3wPxD6u1xK7eZU8e7njSQErHjDBJdbazZurwBAA&s=10"
  },
  {
    id: 10,
    name: "Vitamin C Anti-Aging Serum",
    brand: "Garnier Skin Naturals",
    saltComposition: "Vitamin C, Salicylic Acid, Niacinamide",
    category: "Personal Care",
    description: "Brightening skin serum that reduces dark spots and acne marks in just 3 days. A lightweight cosmetic formula.",
    dosage: "Apply 3-4 drops evenly on face and neck morning and night.",
    sideEffects: "Mild redness in very sensitive skin.",
    storageInstructions: "Keep bottle in box. Store in dark cool place.",
    batchNumber: "GR-VC44",
    expiryDate: "2028-01-01",
    mrp: 499.00,
    discountPrice: 425.00,
    stock: 80,
    manufacturer: "L'Oreal India Pvt Ltd",
    prescriptionRequired: false,
    isFeatured: true,
    imageUrl: "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 11,
    name: "Matte Sunscreen SPF 50+",
    brand: "Neutrogena",
    saltComposition: "Zinc Oxide (8%), Octocrylene (6%)",
    category: "Personal Care",
    description: "Ultra-sheer dry-touch sunblock that protects skin from sunburn and harmful UVA/UVB rays with a clean, matte finish.",
    dosage: "Apply generously to face and neck 15 minutes before sun exposure.",
    sideEffects: "Avoid direct contact with eyes.",
    storageInstructions: "Store in a cool place, protect from freezing.",
    batchNumber: "NT-SS50",
    expiryDate: "2028-11-01",
    mrp: 650.00,
    discountPrice: 580.00,
    stock: 65,
    manufacturer: "Johnson & Johnson Pvt Ltd",
    prescriptionRequired: false,
    isFeatured: true,
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4OVIjpzudikbwOCPVjTQb7EsCiyESsyU2An90OVWcdQ&s=10"
  },
  {
    id: 12,
    name: "Salicylic Acid Foaming Cleanser",
    brand: "CeraVe",
    saltComposition: "Salicylic Acid (1%), Ceramides, Niacinamide",
    category: "Personal Care",
    description: "Gentle exfoliating cleanser designed to remove dirt, oil, and makeup while softening and smoothing rough, bumpy skin.",
    dosage: "Wet skin with lukewarm water. Massage cleanser into skin in a gentle, circular motion. Rinse.",
    sideEffects: "Mild peeling or dryness may occur initially.",
    storageInstructions: "Store at room temperature.",
    batchNumber: "CV-SA30",
    expiryDate: "2028-07-01",
    mrp: 750.00,
    discountPrice: 699.00,
    stock: 45,
    manufacturer: "L'Oreal India Pvt Ltd",
    prescriptionRequired: false,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 13,
    name: "Pure Aloe Vera Soothing Gel",
    brand: "Wow Skin Science",
    saltComposition: "Aloe Vera Leaf Juice (99%), Xanthan Gum",
    category: "Personal Care",
    description: "Multipurpose beauty care gel for healthy skin, hair, and scalp. Soothes sunburn, hydrates dry skin, and reduces redness.",
    dosage: "Apply evenly to skin or massage into scalp as desired.",
    sideEffects: "None. Suitable for all skin types.",
    storageInstructions: "Store in cool, dry place. Keep away from direct heat.",
    batchNumber: "WS-AV99",
    expiryDate: "2028-09-01",
    mrp: 299.00,
    discountPrice: 249.00,
    stock: 110,
    manufacturer: "Wow Skin Science",
    prescriptionRequired: false,
    isFeatured: false,
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRkavYGQlzW3EMvublvhYSvugzjiTEV-_GO09I5eKJxw&s=10"
  },
  {
    id: 14,
    name: "Rosemary Hair Vitalizing Oil",
    brand: "Soulflower",
    saltComposition: "Rosemary Oil (5%), Jojoba Oil, Coconut Oil",
    category: "Personal Care",
    description: "Premium natural hair nourishment oil that stimulates hair follicles, prevents hair thinning, and controls dandruff.",
    dosage: "Massage a few drops onto scalp gently. Leave for at least 30 minutes before washing.",
    sideEffects: "None. Avoid getting into eyes.",
    storageInstructions: "Store in a cool, dry place.",
    batchNumber: "SF-RM88",
    expiryDate: "2029-03-01",
    mrp: 450.00,
    discountPrice: 395.00,
    stock: 85,
    manufacturer: "Soulflower Co",
    prescriptionRequired: false,
    isFeatured: true,
    imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 15,
    name: "Hyaluronic Acid Plumping Serum",
    brand: "L'Oreal Paris",
    saltComposition: "Hyaluronic Acid (1.5%)",
    category: "Personal Care",
    description: "Lightweight, non-sticky water-based serum that intensely hydrates skin, leaving it plump, smooth, and youthful.",
    dosage: "Apply 3-4 drops to a clean face and neck. Pat gently.",
    sideEffects: "None.",
    storageInstructions: "Store in cool, dry place.",
    batchNumber: "LP-HA15",
    expiryDate: "2028-10-01",
    mrp: 599.00,
    discountPrice: 529.00,
    stock: 60,
    manufacturer: "L'Oreal India Pvt Ltd",
    prescriptionRequired: false,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 16,
    name: "Digital Oral Thermometer",
    brand: "Dr. Trust",
    saltComposition: "High Precision Sensor",
    category: "Healthcare Devices",
    description: "Premium digital oral thermometer that provides fast, highly accurate body temperature readings in 10 seconds. Memory recall feature stores last reading.",
    dosage: "Place under tongue or under arm. Wait for beep. Read digital temperature.",
    sideEffects: "None.",
    storageInstructions: "Keep in protective case. Store in cool, dry place.",
    batchNumber: "DT-TH22",
    expiryDate: "2031-12-01",
    mrp: 350.00,
    discountPrice: 280.00,
    stock: 150,
    manufacturer: "Nureca Ltd",
    prescriptionRequired: false,
    isFeatured: true,
    imageUrl: "/thermometer.png"
  },
  {
    id: 17,
    name: "Blood Glucose Monitor (Glucometer)",
    brand: "Accu-Chek Active",
    saltComposition: "Glucose Dehydrogenase Enzyme",
    category: "Healthcare Devices",
    description: "Self-testing digital blood sugar monitor. Gives accurate results in just 5 seconds. Easy to use with large display screen.",
    dosage: "Insert test strip. Apply small blood drop to strip. Wait 5 seconds for reading.",
    sideEffects: "None. lancet prick may cause very minor temporary discomfort.",
    storageInstructions: "Store strips tightly capped in their original container.",
    batchNumber: "AC-GL45",
    expiryDate: "2030-05-01",
    mrp: 1599.00,
    discountPrice: 1299.00,
    stock: 40,
    manufacturer: "Roche Diabetes Care",
    prescriptionRequired: false,
    isFeatured: false,
    imageUrl: "/glucometer.png"
  },
  {
    id: 18,
    name: "Infrared Forehead Thermometer",
    brand: "Omron",
    saltComposition: "Infrared Sensor",
    category: "Healthcare Devices",
    description: "Non-contact infrared thermometer for forehead body temperature measurement. Perfect for kids and fast screenings. Bright backlit LCD screen.",
    dosage: "Hold 1-3 cm from forehead, press trigger. Wait for beep. Read temperature.",
    sideEffects: "None. Safe and non-contact.",
    storageInstructions: "Store in protective pouch in dry place at room temperature.",
    batchNumber: "OM-IR88",
    expiryDate: "2031-06-01",
    mrp: 2999.00,
    discountPrice: 2499.00,
    stock: 25,
    manufacturer: "Omron Healthcare India",
    prescriptionRequired: false,
    isFeatured: true,
    imageUrl: "/ir-thermometer.png"
  },
  {
    id: 19,
    name: "Vitamin D3 60,000 IU Capsules",
    brand: "Uprise-D3 60K",
    saltComposition: "Cholecalciferol (60000 IU)",
    category: "Medicines",
    description: "Helps the body absorb calcium and phosphorus. Crucial for building and maintaining strong bones, muscle function, and teeth.",
    dosage: "1 capsule weekly, or as directed by a healthcare professional.",
    sideEffects: "None if taken in recommended doses. Hypercalcemia in case of overdose.",
    storageInstructions: "Store in a cool, dry place. Protect from light.",
    batchNumber: "UD-60K2",
    expiryDate: "2029-05-01",
    mrp: 52.00,
    discountPrice: 45.00,
    stock: 150,
    manufacturer: "Alkem Laboratories Ltd",
    prescriptionRequired: false,
    isFeatured: true,
    imageUrl: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 20,
    name: "Cetirizine Hydrochloride 10mg",
    brand: "Okacet",
    saltComposition: "Cetirizine (10mg)",
    category: "Medicines",
    description: "An antihistamine used to relieve allergy symptoms such as watery eyes, runny nose, itching eyes/nose, sneezing, hives, and itching.",
    dosage: "1 tablet daily before bedtime, or as advised by a doctor.",
    sideEffects: "Drowsiness, dry mouth, tiredness, headache.",
    storageInstructions: "Store below 25°C in a cool and dry place.",
    batchNumber: "OK-10MG",
    expiryDate: "2028-09-01",
    mrp: 18.50,
    discountPrice: 15.00,
    stock: 200,
    manufacturer: "Cipla Ltd",
    prescriptionRequired: false,
    isFeatured: false,
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 21,
    name: "Tulsi Panchang Drops 30ml",
    brand: "Dabur",
    saltComposition: "Concentrated extract of 5 types of Tulsi leaves",
    category: "Ayurvedic",
    description: "Natural immunity booster drops containing extracts of 5 distinct types of Tulsi leaves. Helps relieve cough, cold, and supports respiratory health.",
    dosage: "5-10 drops in a glass of water, tea, or milk, twice daily.",
    sideEffects: "None under normal consumption.",
    storageInstructions: "Store in a cool, dry place. Keep out of reach of children.",
    batchNumber: "DB-TL44",
    expiryDate: "2029-01-01",
    mrp: 195.00,
    discountPrice: 160.00,
    stock: 120,
    manufacturer: "Dabur India Ltd",
    prescriptionRequired: false,
    isFeatured: true,
    imageUrl: "https://shop.beatoapp.com/cdn/shop/files/1024_time1693485817_69a6896f-1f9e-4ca9-a841-5fa5487c5da5.jpg?v=1724253051&width=1000"
  }
];

// Initial Mock Health Tips
export const mockHealthTips: HealthTip[] = [
  {
    id: 1,
    title: "5 Essential Supplements for Daily Wellness",
    category: "Nutrition",
    summary: "Discover the key vitamins and minerals your body needs to maintain high energy levels, immunity, and overall vitality.",
    content: "Maintaining optimal health can be a challenge with today's fast-paced lifestyle. While a balanced diet is the foundation of good health, dietary supplements can bridge nutrition gaps. The 5 essential daily supplements include: 1. Vitamin D (for strong bones and immune support), 2. Omega-3 Fish Oil (for heart and brain function), 3. Multivitamins (for baseline nutrient support), 4. Probiotics (for digestive wellness), and 5. Magnesium (for muscle relaxation and deep sleep). Consult a healthcare provider to find the right dosage for you.",
    readTime: "4 min read",
    date: "2026-06-25",
    imageUrl: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Understanding Schedule H Prescription Medicines",
    category: "Safety",
    summary: "Why some medicines require a valid doctor's prescription and how to buy them safely online.",
    content: "In India, Schedule H and Schedule H1 drugs are restricted medicines under the Drugs and Cosmetics Act. These include critical therapeutics like antibiotics, strong painkillers, and psychiatric medicines. They are marked with an 'Rx' or a red line. Buying them without a valid prescription poses serious health risks, including antibiotic resistance and dependency. At Krishna Pharmacy, we ensure full safety by having our registered pharmacists verify every uploaded prescription before dispatching Schedule H medicines.",
    readTime: "5 min read",
    date: "2026-06-22",
    imageUrl: "https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=400&auto=format&fit=crop"
  }
];

// In-Memory Database instances
export const inMemoryCart: Cart = {
  items: [],
  totalAmount: 0
};

export const inMemoryOrders: Order[] = [
  {
    id: 1001,
    customerName: "Rahul Sharma",
    customerPhone: "9876543210",
    deliveryAddress: "Flat 402, Royal Residency, Sector 62, Noida, UP - 201301",
    items: [
      { medicineId: 1, medicineName: "Paracetamol 650mg", price: 29.50, quantity: 2 },
      { medicineId: 3, medicineName: "Niacinamide 10% Face Serum", price: 349.00, quantity: 1 }
    ],
    totalAmount: 408.00,
    status: "Delivered",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  },
  {
    id: 1002,
    customerName: "Ananya Iyer",
    customerPhone: "9123456789",
    deliveryAddress: "Villa 12, Ferns Meadows, Hennur Road, Bangalore, KA - 560077",
    items: [
      { medicineId: 2, medicineName: "Amoxicillin 500mg", price: 95.00, quantity: 1 }
    ],
    totalAmount: 95.00,
    status: "Processing",
    createdAt: new Date().toISOString() // Today
  }
];

export const inMemoryPrescriptions: Prescription[] = [
  {
    id: 501,
    customerName: "Ananya Iyer",
    notes: "Please pack 1 strip of Novamox 500mg",
    fileUrl: "https://example.com/prescription-1002.pdf",
    status: "Pending Review",
    createdAt: new Date().toISOString()
  }
];

export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  address: string;
  gender?: string;
  profileCompletion?: number;
}

export const inMemoryUsers: User[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    passwordHash: "5be76307a5180026e64ee4ec069176313fa4227eb188a91a92e2ad47a505b382", // SHA256 of "rahul123"
    phone: "9876543210",
    address: "Flat 402, Royal Residency, Sector 62, Noida, UP - 201301",
    gender: "Male",
    profileCompletion: 100
  },
  {
    id: 2,
    name: "Bipin chandra pandey",
    email: "bipin.kanha.pandey@gmail.com",
    passwordHash: "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3", // SHA256 of "bipin123"
    phone: "9565025178",
    address: "Lucknow, Uttar Pradesh, India",
    gender: "Male",
    profileCompletion: 83
  }
];
