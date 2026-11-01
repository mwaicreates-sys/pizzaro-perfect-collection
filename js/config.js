const CONFIG = {
  brand: {
    name: 'Pizzaro Perfect Collection',
    tagline: 'Polo Shirts & Football Jerseys'
  },
  contact: {
    whatsapp: '254720489284',
    phoneDisplay: '+254 720 489284',
    email: 'info@pizzaroperfect.com'
  },
  locations: [
    {
      id: 'nairobi',
      city: 'Nairobi',
      name: 'Royal Palms Mall',
      address: 'Royal Palms Mall, along Ronald Ngala Street, Nairobi. Wing A, first floor, Shops AM 11 and AM 13. Next to Naivas supermarket and opposite RNG Plaza.'
    },
    {
      id: 'meru',
      city: 'Meru',
      name: 'Paul Kigunda Plaza',
      address: 'Paul Kigunda Plaza (Jamii Yetu Sacco), Tom Mboya Street. Ground floor, Shop 002. Opposite Kingdom Bank.'
    },
    {
      id: 'nakuru',
      city: 'Nakuru',
      name: 'Lydia Arcade Mall',
      address: 'Lydia Arcade Mall, second floor, Shop 224. Along Kenyatta Avenue, next to Tai Sacco and opposite Equity Bank.'
    }
  ],
  delivery: {
    countrywide: true
  },
  promotions: [
    {
      eyebrow: 'Selected jersey offer',
      title: 'Now KSh 1,600 · Was KSh 1,900',
      description: 'Save 16% on three selected home jerseys. Confirm availability with our team.',
      image: 'images/jersey campaign.jpg',
      imageAlt: 'Arsenal and Chelsea football shirts from the jersey campaign',
      href: 'inventory.html?category=football',
      action: 'Shop the offer'
    },
    {
      eyebrow: 'Adult polos',
      title: 'Everyday polos from KSh 500',
      description: 'Explore the adult polo selection in a range of colours.',
      image: 'images/polo campaign.jpg',
      imageAlt: 'Colourful polo shirts from the polo campaign',
      href: 'inventory.html?category=polo',
      action: 'Shop polo shirts'
    },
    {
      eyebrow: 'Everyday T-shirts',
      title: 'Find your everyday colour',
      description: 'Browse simple tees for everyday wear.',
      image: 'images/tshirt campaign.jpg',
      imageAlt: 'A selection of T-shirts in different colours',
      href: 'inventory.html?category=t-shirt',
      action: 'Shop T-shirts'
    },
    {
      eyebrow: 'T-shirt collection',
      title: 'Easy everyday essentials',
      description: 'Explore the T-shirt collection.',
      image: 'images/tshirt alternaive campaign.jpg',
      imageAlt: 'Close-up of colourful T-shirts',
      href: 'inventory.html?category=t-shirt',
      action: 'Shop T-shirts'
    }
  ],
  social: {
    instagram: null,
    facebook: null,
    twitter: null
  },
  whatsapp: {
    defaultMessage: 'Hi Pizzaro Perfect, I\'d like to know more about your products.'
  }
};

CONFIG.getDirectionsUrl = function(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
