const POLO_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const JERSEY_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const APPAREL_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const CAP_SIZES = ['One size'];
const KIDS_AGES = ['2-3 years', '4-5 years', '6-7 years', '8-9 years', '10-11 years', '12-13 years'];

const INVENTORY = [
  {
    id: 'polo-plain-white',
    name: 'White Polo with Green Trim',
    category: 'polo',
    description: 'White short-sleeve polo with a dark green striped collar and matching sleeve cuffs.',
    details: 'A clean white polo finished with a dark green striped collar and matching sleeve cuffs. Available in adult sizes S–XXL.',
    price: 500,
    priceVerified: true,
    images: ['images/products/polo-white-green-trim.jpg'],
    availableSizes: POLO_SIZES,
    featured: true
  },
  {
    id: 'polo-yellow-black-trim',
    name: 'Yellow Polo with Black Trim',
    category: 'polo',
    description: 'Bright yellow short-sleeve polo with a black striped collar and matching sleeve cuffs.',
    details: 'A bright yellow polo with contrasting black stripes at the collar and sleeve cuffs. Available in adult sizes S–XXL.',
    price: 500,
    priceVerified: true,
    images: ['images/products/polo-yellow-black-trim.jpg'],
    availableSizes: POLO_SIZES,
    featured: true
  },
  {
    id: 'polo-forest-green',
    name: 'Forest Green Polo',
    category: 'polo',
    description: 'Deep green short-sleeve polo with a classic collar and embroidered chest emblem.',
    details: 'A deep green polo with a classic collar, button placket and embroidered chest emblem. Available in adult sizes S–XXL.',
    price: 500,
    priceVerified: true,
    images: ['images/products/polo-forest-green.jpg'],
    availableSizes: POLO_SIZES,
    featured: false
  },
  {
    id: 'polo-navy',
    name: 'Navy Blue Polo',
    category: 'polo',
    description: 'Navy blue short-sleeve polo with a classic collar and button placket.',
    details: 'A versatile navy blue polo with a classic collar and understated button placket. Available in adult sizes S–XXL.',
    price: 500,
    priceVerified: true,
    images: ['images/products/polo-navy.jpg'],
    availableSizes: POLO_SIZES,
    featured: false
  },
  {
    id: 'polo-blue',
    name: 'Blue Polo Shirt',
    category: 'polo',
    description: 'Short-sleeve polo shirt in a soft blue shade with a classic collar.',
    details: 'A soft blue short-sleeve polo shirt with a classic collar and button placket. Available in adult sizes S–XXL.',
    price: 500,
    priceVerified: true,
    images: ['images/products/polo-blue.jpg'],
    availableSizes: POLO_SIZES,
    featured: false
  },
  {
    id: 'polo-beige',
    name: 'Beige Polo Shirt',
    category: 'polo',
    description: 'Neutral beige short-sleeve polo with a classic collar and button placket.',
    details: 'A neutral beige short-sleeve polo with a classic collar and button placket. Available in adult sizes S–XXL.',
    price: 500,
    priceVerified: true,
    images: ['images/products/polo-beige.jpg'],
    availableSizes: POLO_SIZES,
    featured: false
  },
  {
    id: 'polo-white-classic',
    name: 'Classic White Polo Shirt',
    category: 'polo',
    description: 'Classic white short-sleeve polo with a neat collar and button placket.',
    details: 'A classic white short-sleeve polo with a neat collar and button placket. Available in adult sizes S–XXL.',
    price: 500,
    priceVerified: true,
    images: ['images/products/polo-white-classic.jpg'],
    availableSizes: POLO_SIZES,
    featured: false
  },
  {
    id: 'cap-white',
    name: 'White Baseball Cap',
    category: 'caps',
    description: 'White baseball cap with a curved brim and clean, unbranded front.',
    details: 'A clean white baseball cap with a curved brim and adjustable-style back. Ask us to confirm fit and price.',
    price: null,
    priceVerified: false,
    images: ['images/products/cap-white.jpg'],
    availableSizes: CAP_SIZES,
    featured: false
  },
  {
    id: 'cap-black',
    name: 'Black Baseball Cap',
    category: 'caps',
    description: 'Black baseball cap with a curved brim and clean, unbranded front.',
    details: 'A classic black baseball cap with a curved brim and adjustable-style back. Ask us to confirm fit and price.',
    price: null,
    priceVerified: false,
    images: ['images/products/cap-black.jpg'],
    availableSizes: CAP_SIZES,
    featured: false
  },
  {
    id: 'vest-reflective-yellow',
    name: 'High-Visibility Reflective Vest',
    category: 'vest',
    description: 'Fluorescent yellow safety vest with two reflective bands and dark edging.',
    details: 'A fluorescent yellow high-visibility vest featuring two reflective bands and dark edging. Ask us to confirm available sizes and price.',
    price: null,
    priceVerified: false,
    images: ['images/products/vest-reflective-yellow.jpg'],
    availableSizes: APPAREL_SIZES,
    featured: false
  },
  {
    id: 'tshirt-beige',
    name: 'Beige Crew-Neck T-shirt',
    category: 't-shirt',
    description: 'Beige short-sleeve T-shirt with a simple crew neckline.',
    details: 'A beige short-sleeve crew-neck T-shirt with a clean, minimal finish. Ask us to confirm available sizes and price.',
    price: null,
    priceVerified: false,
    images: ['images/products/tshirt-beige.jpg'],
    availableSizes: APPAREL_SIZES,
    featured: false
  },
  {
    id: 'tshirt-white',
    name: 'White Crew-Neck T-shirt',
    category: 't-shirt',
    description: 'White short-sleeve T-shirt with a simple crew neckline.',
    details: 'A white short-sleeve crew-neck T-shirt with a clean, minimal finish. Ask us to confirm available sizes and price.',
    price: null,
    priceVerified: false,
    images: ['images/products/tshirt-white.jpg'],
    availableSizes: APPAREL_SIZES,
    featured: false
  },
  {
    id: 'tshirt-grey',
    name: 'Grey Crew-Neck T-shirt',
    category: 't-shirt',
    description: 'Light grey short-sleeve T-shirt with a classic crew neckline.',
    details: 'A light grey short-sleeve crew-neck T-shirt with a simple, versatile style. Ask us to confirm available sizes and price.',
    price: null,
    priceVerified: false,
    images: ['images/products/tshirt-grey.jpg'],
    availableSizes: APPAREL_SIZES,
    featured: false
  },
  {
    id: 'jersey-real-madrid-home',
    name: 'Real Madrid Home Football Jersey',
    team: 'Real Madrid',
    category: 'football',
    description: 'White Real Madrid home jersey with dark contrasting trim and red shoulder stripes.',
    details: 'A white home jersey with red shoulder stripes, dark trim and team crest. Available in sizes S–XXL.',
    price: 1600,
    priceVerified: true,
    originalPrice: 1900,
    images: ['images/catalog/real-madrid-home-shirt.jpg'],
    availableSizes: JERSEY_SIZES,
    featured: true
  },
  {
    id: 'jersey-chelsea-home',
    name: 'Chelsea Home Football Jersey',
    team: 'Chelsea',
    category: 'football',
    description: 'Royal blue Chelsea-style jersey with yellow accents and club detailing.',
    details: 'A royal blue jersey with yellow accents and club detailing. Available in sizes S–XXL.',
    price: 1600,
    priceVerified: true,
    originalPrice: 1900,
    images: ['images/catalog/chelsea-home-shirt.jpg'],
    availableSizes: JERSEY_SIZES,
    featured: true
  },
  {
    id: 'jersey-manchester-united-home',
    name: 'Manchester United Home Football Jersey',
    team: 'Manchester United',
    category: 'football',
    description: 'Red Manchester United home jersey with white shoulder panels and club detailing.',
    details: 'A red home jersey with white shoulder panels and club detailing. Available in sizes S–XXL.',
    price: 1600,
    priceVerified: true,
    originalPrice: 1900,
    images: ['images/catalog/manchester-united-home.jpg'],
    availableSizes: JERSEY_SIZES,
    featured: false
  }
];

INVENTORY.filter(product => product.category === 'football').forEach(product => {
  const baseName = product.name.replace(/ Football Jersey$/, '');
  product.name = `${baseName} (Player Version)`;
  product.description = `${product.description} 2026/27 season.`;
  product.variantLabel = 'Size';
  product.price = 1600;
  product.priceVerified = true;
  product.availableSizes = JERSEY_SIZES;
  product.version = 'Player';
  product.details = `${product.description} Choose a size before ordering.`;
  INVENTORY.push({
    ...product,
    id: `${product.id}-fan`,
    name: `${baseName} (Fan Version)`,
    description: `${baseName} (Fan Version), 2026/27 season.`,
    details: `${baseName} (Fan Version), 2026/27 season. Choose a size before ordering.`,
    price: 1300,
    originalPrice: undefined,
    version: 'Fan',
    featured: false,
    newArrival: false
  });
});

const SUPPLIED_PRODUCTS = [
  ['arsenal-3rd-shirt', 'Arsenal 3rd Shirt', 'football', 'images/catalog/arsenal-3rd-shirt.jpg', { team: 'Arsenal' }],
  ['arsenal-away-long-sleeves', 'Arsenal Away Long-Sleeve Jersey', 'football', 'images/catalog/arsenal-away-long-sleeves.jpg', { team: 'Arsenal', price: 2000, priceVerified: true }],
  ['arsenal-away', 'Arsenal Away Jersey', 'football', 'images/catalog/arsenal-away.jpg', { team: 'Arsenal' }],
  ['arsenal-home-kids-kit', 'Arsenal Home Kids Kit', 'football', 'images/catalog/arsenal-home-kids-kit.jpg', { team: 'Arsenal', price: 1200, priceVerified: true, variantLabel: 'Age', availableSizes: KIDS_AGES, details: 'Arsenal home kids kit. Choose the child’s age to select a size.' }],
  ['arsenal-home-long-sleeves', 'Arsenal Home Long-Sleeve Jersey', 'football', 'images/catalog/arsenal-home-long-sleeves.jpg', { team: 'Arsenal', price: 2000, priceVerified: true }],
  ['arsenal-home', 'Arsenal Home Jersey', 'football', 'images/catalog/arsenal-home.jpg', { team: 'Arsenal' }],
  ['barcelona-away', 'Barcelona Away Jersey', 'football', 'images/catalog/barcelona-away.jpg', { team: 'Barcelona' }],
  ['chelsea-away', 'Chelsea Away Jersey', 'football', 'images/catalog/chelsea-away-shirt.jpg', { team: 'Chelsea' }],
  ['chelsea-home-world-champions', 'Chelsea Home Jersey with FIFA CWC Badge', 'football', 'images/catalog/chelsea-home-shirt-fifa-cwc-badge.jpg', { team: 'Chelsea' }],
  ['chelsea-third', 'Chelsea Third Kit', 'football', 'images/catalog/chelsea-third-kit.jpg', { team: 'Chelsea' }],
  ['liverpool-away', 'Liverpool Away Jersey', 'football', 'images/catalog/liverpool-away-shirt.jpg', { team: 'Liverpool' }],
  ['liverpool-baby-kit', 'Liverpool Kids Kit', 'football', 'images/catalog/liverpool-baby-kit.jpg', { team: 'Liverpool', price: 1200, priceVerified: true, variantLabel: 'Age', availableSizes: KIDS_AGES, details: 'Liverpool kids kit. Choose the child’s age to select a size.' }],
  ['liverpool-home', 'Liverpool Home Jersey', 'football', 'images/catalog/liverpool-home-shirt.jpg', { team: 'Liverpool' }],
  ['manchester-city-away', 'Manchester City Away Jersey', 'football', 'images/catalog/manchester-city-away.jpg', { team: 'Manchester City' }],
  ['manchester-city-home', 'Manchester City Home Jersey', 'football', 'images/catalog/manchester-city-home.jpg', { team: 'Manchester City' }],
  ['manchester-united-3rd-long-sleeves', 'Manchester United 3rd Long-Sleeve Jersey', 'football', 'images/catalog/manchester-united-3rd-kit-long-sleeves.jpg', { team: 'Manchester United', price: 2000, priceVerified: true }],
  ['manchester-united-3rd', 'Manchester United 3rd Kit', 'football', 'images/catalog/manchester-united-3rd-kit.jpg', { team: 'Manchester United' }],
  ['manchester-united-away-long-sleeves', 'Manchester United Away Long-Sleeve Jersey', 'football', 'images/catalog/manchester-united-away-long-sleeves.jpg', { team: 'Manchester United', price: 2000, priceVerified: true }],
  ['manchester-united-away', 'Manchester United Away Jersey', 'football', 'images/catalog/manchester-united-away-shirt.jpg', { team: 'Manchester United' }],
  ['manchester-united-home-kids-kit', 'Manchester United Home Kids Kit', 'football', 'images/catalog/manchester-united-home-kids-kit.jpg', { team: 'Manchester United', price: 1200, priceVerified: true, variantLabel: 'Age', availableSizes: KIDS_AGES, details: 'Manchester United home kids kit. Choose the child’s age to select a size.' }],
  ['manchester-united-home-long-sleeves', 'Manchester United Home Long-Sleeve Jersey', 'football', 'images/catalog/manchester-united-home-long-sleeves.jpg', { team: 'Manchester United', price: 2000, priceVerified: true }],
  ['polo-plain-beige', 'Plain Beige Polo', 'polo', 'images/catalog/plain-beige-polo.jpg'],
  ['polo-plain-black', 'Plain Black Polo', 'polo', 'images/catalog/plain-black-polo.jpg'],
  ['polo-plain-green', 'Plain Green Polo', 'polo', 'images/catalog/plain-green-polo.jpg'],
  ['polo-plain-grey', 'Plain Grey Polo', 'polo', 'images/catalog/plain-grey-polo.jpg'],
  ['polo-plain-orange', 'Plain Orange Polo', 'polo', 'images/catalog/plain-orange-polo.jpg'],
  ['polo-plain-red', 'Plain Red Polo', 'polo', 'images/catalog/plain-red-polo.jpg'],
  ['polo-plain-white-basic', 'Plain White Polo', 'polo', 'images/catalog/plain-white-polo.jpg'],
  ['polo-plain-yellow', 'Plain Yellow Polo', 'polo', 'images/catalog/plain-yellow-polo.jpg'],
  ['cap-blue', 'Blue Baseball Cap', 'caps', 'images/catalog/blue-cap.jpg'],
  ['cap-pink', 'Pink Baseball Cap', 'caps', 'images/catalog/pink-cap.jpg'],
  ['cap-red', 'Red Baseball Cap', 'caps', 'images/catalog/red-cap.jpg'],
  ['tshirt-black', 'Black Crew-Neck T-shirt', 't-shirt', 'images/catalog/black-tshirt.jpg'],
  ['tshirt-light-grey', 'Light Grey Crew-Neck T-shirt', 't-shirt', 'images/catalog/grey-tshirt-2.jpg']
];

SUPPLIED_PRODUCTS.forEach(([id, name, category, image, details = {}]) => {
  const isPolo = category === 'polo';
  const isKidsKit = details.variantLabel === 'Age';
  const isLongSleeve = /long-sleeve/i.test(name);
  const isShortSleeveJersey = category === 'football' && !isKidsKit && !isLongSleeve;
  const price = isPolo ? 500 : isShortSleeveJersey ? 1600 : details.price ?? null;
  const priceVerified = isPolo || isShortSleeveJersey || details.priceVerified === true;
  const kitMode = /\b(home|away|third|3rd)\b/i.exec(name)?.[1] || (isKidsKit ? 'Home' : '');
  const normalizedMode = kitMode.toLowerCase() === '3rd' ? 'Third' :
    kitMode ? `${kitMode[0].toUpperCase()}${kitMode.slice(1).toLowerCase()}` : '';
  const nameQualifiers = [];
  if (isKidsKit) nameQualifiers.push('Kids Kit');
  if (isLongSleeve) nameQualifiers.push('Long Sleeve');
  if (/badge/i.test(name)) nameQualifiers.push('CWC Badge');
  if (isShortSleeveJersey) nameQualifiers.push('Player Version');
  const nameSuffix = nameQualifiers.map(qualifier => ` (${qualifier})`).join('');
  const titleBase = category === 'football'
    ? `${details.team || ''} ${normalizedMode}${nameSuffix}`.trim()
    : name;
  const productName = titleBase;
  const productSizes = details.availableSizes ||
    (category === 'football' ? JERSEY_SIZES : category === 'caps' ? CAP_SIZES : APPAREL_SIZES);
  const description = category === 'football'
    ? `${titleBase} — 2026/27 season.`
    : titleBase;
  const detailText = details.details ||
    `${productName}. ${priceVerified ? `Listed at KSh ${price.toLocaleString()}.` : 'Contact us to confirm available sizes and price.'}`;
  const seasonalDetails = category === 'football' && !detailText.includes('2026/27')
    ? `${detailText} 2026/27 season.`
    : detailText;
  const productDetails = {
    ...details,
    variantLabel: details.variantLabel || 'Size',
    availableSizes: productSizes
  };
  INVENTORY.push({
    id,
    name: productName,
    category,
    description,
    price,
    priceVerified,
    images: [image],
    availableSizes: productSizes,
    featured: false,
    newArrival: ['arsenal-home', 'manchester-city-home', 'polo-plain-orange', 'cap-red', 'tshirt-black'].includes(id),
    ...productDetails,
    details: seasonalDetails,
    ...(isShortSleeveJersey ? { version: 'Player' } : {})
  });
  if (isShortSleeveJersey) {
    INVENTORY.push({
      ...INVENTORY[INVENTORY.length - 1],
      id: `${id}-fan`,
      name: `${titleBase.replace(/ \(Player Version\)$/, '')} (Fan Version)`,
      description: `${titleBase.replace(/ \(Player Version\)$/, '')} (Fan Version) — 2026/27 season.`,
      details: `${titleBase.replace(/ \(Player Version\)$/, '')} (Fan Version). 2026/27 season. Choose a size before ordering.`,
      price: 1300,
      originalPrice: undefined,
      version: 'Fan',
      featured: false,
      newArrival: false
    });
  }
});

const PRODUCT_CATEGORIES = [
  { id: 'polo', label: 'Polo shirts' },
  { id: 'football', label: 'Football jerseys' },
  { id: 't-shirt', label: 'T-shirts' },
  { id: 'caps', label: 'Caps' },
  { id: 'vest', label: 'Safety vests' }
];

function getProducts() {
  return INVENTORY;
}

function getProductById(id) {
  return INVENTORY.find(product => product.id === id);
}

function getFeaturedProducts() {
  return INVENTORY.filter(product => product.featured === true);
}

function getProductsByCategory(category) {
  if (!category || category === 'all') {
    return INVENTORY;
  }
  return INVENTORY.filter(product => product.category === category);
}

function getCategories() {
  return PRODUCT_CATEGORIES.map(category => category.id);
}

function getCategoryLabel(id) {
  return PRODUCT_CATEGORIES.find(category => category.id === id)?.label || id;
}

function searchProducts(query) {
  if (!query || query.trim() === '') {
    return INVENTORY;
  }
  const lowerQuery = query.toLowerCase().trim();
  return INVENTORY.filter(product => {
    const searchableText = [
      product.name,
      product.team,
      product.category,
      getCategoryLabel(product.category),
      ...(product.tags || [])
    ].filter(Boolean).join(' ').toLowerCase();
    return searchableText.includes(lowerQuery);
  });
}

function getNewArrivals() {
  return INVENTORY.filter(product => product.newArrival);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    INVENTORY,
    PRODUCT_CATEGORIES,
    getProducts,
    getProductById,
    getFeaturedProducts,
    getNewArrivals,
    getProductsByCategory,
    getCategories,
    getCategoryLabel,
    searchProducts
  };
}
