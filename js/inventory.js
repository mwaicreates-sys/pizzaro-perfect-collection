const POLO_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const JERSEY_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const INVENTORY = [
  {
    id: 'polo-plain-white',
    name: 'White Polo with Green Trim',
    category: 'polo',
    description: 'White short-sleeve polo with a dark green striped collar and matching sleeve cuffs.',
    details: 'A clean white polo finished with a dark green striped collar and matching sleeve cuffs. Available in adult sizes S–XXL.',
    price: 500,
    priceVerified: true,
    images: ['images/products/polo-white-green-trim.png'],
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
    images: ['images/products/polo-yellow-black-trim.png'],
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
    images: ['images/products/polo-forest-green.png'],
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
    images: ['images/products/polo-navy.png'],
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
    images: ['images/products/polo-blue.png'],
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
    images: ['images/products/polo-beige.png'],
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
    images: ['images/products/polo-white-classic.png'],
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
    images: ['images/products/cap-white.png'],
    availableSizes: [],
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
    images: ['images/products/cap-black.png'],
    availableSizes: [],
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
    images: ['images/products/vest-reflective-yellow.png'],
    availableSizes: [],
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
    images: ['images/products/tshirt-beige.png'],
    availableSizes: [],
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
    images: ['images/products/tshirt-white.png'],
    availableSizes: [],
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
    images: ['images/products/tshirt-grey.png'],
    availableSizes: [],
    featured: false
  },
  {
    id: 'jersey-real-madrid-home',
    name: 'Real Madrid Home Football Jersey',
    category: 'football',
    description: 'White Real Madrid home jersey with dark contrasting trim and red shoulder stripes.',
    details: 'A white home jersey with red shoulder stripes, dark trim and team crest. Available in sizes S–XXL.',
    price: 1600,
    priceVerified: true,
    images: ['images/products/jersey-real-madrid-home.png'],
    availableSizes: JERSEY_SIZES,
    featured: true
  },
  {
    id: 'jersey-chelsea-home',
    name: 'Chelsea Blue Football Jersey',
    category: 'football',
    description: 'Royal blue Chelsea-style jersey with yellow accents and club detailing.',
    details: 'A royal blue jersey with yellow accents and club detailing. Available in sizes S–XXL.',
    price: 1600,
    priceVerified: true,
    images: ['images/products/jersey-chelsea-blue.png'],
    availableSizes: JERSEY_SIZES,
    featured: true
  },
  {
    id: 'jersey-manchester-united-home',
    name: 'Manchester United Home Football Jersey',
    category: 'football',
    description: 'Red Manchester United home jersey with white shoulder panels and club detailing.',
    details: 'A red home jersey with white shoulder panels and club detailing. Available in sizes S–XXL.',
    price: 1600,
    priceVerified: true,
    images: ['images/products/jersey-manchester-united-home.png'],
    availableSizes: JERSEY_SIZES,
    featured: false
  }
];

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
    const searchableText = [product.name, getCategoryLabel(product.category)].join(' ').toLowerCase();
    return searchableText.includes(lowerQuery);
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    INVENTORY,
    PRODUCT_CATEGORIES,
    getProducts,
    getProductById,
    getFeaturedProducts,
    getProductsByCategory,
    getCategories,
    getCategoryLabel,
    searchProducts
  };
}
