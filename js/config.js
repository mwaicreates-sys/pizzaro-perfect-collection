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
