(function() {
  'use strict';

  const WISHLIST_STORAGE_KEY = 'pizzaro-perfect-wishlist-v1';
  let wishlistIds = [];
  let wishlistStorageAvailable = true;

  function loadWishlist() {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved === null) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) throw new TypeError('Saved wishlist data is not a list.');
      return [...new Set(parsed.filter(id =>
        typeof id === 'string' && getProductById(id)
      ))];
    } catch (error) {
      wishlistStorageAvailable = false;
      console.error('Unable to read the saved wishlist:', error);
      return [];
    }
  }

  function saveWishlist() {
    if (!wishlistStorageAvailable) return;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch (error) {
      wishlistStorageAvailable = false;
      console.error('Unable to save the wishlist:', error);
    }
  }

  function updateWishlistButtons() {
    document.querySelectorAll('[data-wishlist-toggle]').forEach(button => {
      const saved = wishlistIds.includes(button.dataset.wishlistToggle);
      button.setAttribute('aria-pressed', String(saved));
      button.setAttribute('aria-label', `${saved ? 'Remove' : 'Add'} ${button.dataset.productName} ${saved ? 'from' : 'to'} wishlist`);
      button.title = saved ? 'Remove from wishlist' : 'Add to wishlist';
      button.classList.toggle('is-saved', saved);
    });
  }

  wishlistIds = loadWishlist();
  window.addEventListener('storage', event => {
    if (event.key !== WISHLIST_STORAGE_KEY || event.newValue === null) return;
    try {
      const parsed = JSON.parse(event.newValue);
      if (!Array.isArray(parsed)) throw new TypeError('Updated wishlist data is not a list.');
      wishlistIds = [...new Set(parsed.filter(id =>
        typeof id === 'string' && getProductById(id)
      ))];
      updateWishlistButtons();
    } catch (error) {
      console.error('Unable to sync the saved wishlist:', error);
    }
  });

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-wishlist-toggle]');
    if (!button) return;
    const productId = button.dataset.wishlistToggle;
    wishlistIds = wishlistIds.includes(productId)
      ? wishlistIds.filter(id => id !== productId)
      : [...wishlistIds, productId];
    saveWishlist();
    updateWishlistButtons();
  });

  function generateWhatsAppLink(message) {
    return `https://wa.me/${CONFIG.contact.whatsapp}?text=${encodeURIComponent(message)}`;
  }

  function generateProductWhatsAppMessage(product, variants, customisation) {
    const price = product.priceVerified && Number.isFinite(product.price)
      ? ` The listed price is KES ${product.price.toLocaleString()}.`
      : ' Please share the current price.';
    const selected = variants ? [variants.size && `Size: ${variants.size}`].filter(Boolean) : [];
    const options = selected.length ? ` My selected options: ${selected.join(', ')}.` : '';
    const custom = customisation
      ? [
          customisation.name && `Name: ${customisation.name}`,
          customisation.number && `Number: ${customisation.number}`,
          customisation.artwork && `Artwork file: ${customisation.artwork}`
        ].filter(Boolean)
      : [];
    const customRequest = custom.length ? ` Custom branding: ${custom.join(', ')}.` : '';
    return `Hi ${CONFIG.brand.name}, I'm interested in ${product.name}.${price}${options}${customRequest} Please confirm the size and price.${customisation?.artwork ? ' I will send the logo separately.' : ''}`;
  }

  function getWhatsAppLinkForProduct(product, variants, customisation) {
    return generateWhatsAppLink(generateProductWhatsAppMessage(product, variants, customisation));
  }

  function getWhatsAppLinkForGeneral(message) {
    return generateWhatsAppLink(message || CONFIG.whatsapp.defaultMessage);
  }

  function createWhatsAppButton(product, buttonText, className) {
    const button = document.createElement('a');
    button.href = product ? getWhatsAppLinkForProduct(product) : getWhatsAppLinkForGeneral();
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    button.className = `btn btn-whatsapp ${className || ''}`;
    button.textContent = buttonText || (product ? `Enquire about ${product.name}` : 'Contact via WhatsApp');
    return button;
  }

  function formatPrice(product) {
    if (!product.priceVerified || !Number.isFinite(product.price)) {
      return '<span class="price-unverified">Price on request</span>';
    }
    const currentPrice = `KSh ${product.price.toLocaleString()}`;
    const offer = getProductOffer(product);
    if (!offer) return currentPrice;
    return `<span class="price-current">${currentPrice}</span><del class="price-original">KSh ${offer.originalPrice.toLocaleString()}</del>`;
  }

  function getProductOffer(product) {
    if (!product.priceVerified || !Number.isFinite(product.price) || product.price < 0 ||
        !Number.isFinite(product.originalPrice) || product.originalPrice <= product.price) {
      return null;
    }
    return {
      originalPrice: product.originalPrice,
      discount: Math.max(1, Math.round((1 - product.price / product.originalPrice) * 100))
    };
  }

  function addOfferSticker(container, product) {
    const offer = getProductOffer(product);
    if (!offer) return;
    const sticker = document.createElement('span');
    sticker.className = 'product-discount-sticker';
    sticker.textContent = `${offer.discount}% OFF`;
    sticker.setAttribute('aria-label', `${offer.discount}% discount`);
    container.appendChild(sticker);
  }

  function getProductImage(product) {
    return product.images && product.images.length ? product.images[0] : 'images/placeholder.svg';
  }

  function makeVariantSelect(product, key, label, choices) {
    if (!choices || choices.length === 0) return null;
    const wrapper = document.createElement('label');
    wrapper.className = 'variant-field';
    const caption = document.createElement('span');
    caption.textContent = label;
    const select = document.createElement('select');
    select.dataset.variant = key;
    select.setAttribute('aria-label', `${label} for ${product.name}`);
    const prompt = document.createElement('option');
    prompt.value = '';
    prompt.textContent = `Choose ${label.toLowerCase()}`;
    prompt.selected = true;
    select.appendChild(prompt);
    choices.forEach(choice => {
      const option = document.createElement('option');
      option.value = choice;
      option.textContent = choice;
      select.appendChild(option);
    });
    wrapper.append(caption, select);
    return wrapper;
  }

  function addImageLoadingState(image, frame) {
    const status = document.createElement('span');
    status.className = 'image-loading-status';
    status.setAttribute('aria-hidden', 'true');
    status.innerHTML = '<span class="image-loading-spinner"></span><span class="image-loading-brand">Pizzaro Perfect</span><span>Loading image</span>';
    frame.classList.add('is-image-loading');
    frame.appendChild(status);

    function finishLoading() {
      frame.classList.remove('is-image-loading');
      status.remove();
    }

    image.addEventListener('load', finishLoading, { once: true });
    image.addEventListener('error', () => {
      if (image.dataset.fallbackApplied !== 'true') {
        image.dataset.fallbackApplied = 'true';
        image.src = 'images/placeholder.svg';
        return;
      }
      frame.classList.remove('is-image-loading');
      status.classList.add('image-loading-status--error');
      status.replaceChildren();
      const brand = document.createElement('span');
      brand.className = 'image-loading-brand';
      brand.textContent = 'Pizzaro Perfect';
      const message = document.createElement('span');
      message.textContent = 'Image unavailable';
      status.append(brand, message);
    });

    if (image.complete) {
      if (image.naturalWidth > 0) finishLoading();
      else image.dispatchEvent(new Event('error'));
    }
  }

  function createProductCard(product, prioritizeImage = false) {
    const article = document.createElement('article');
    article.className = 'product-card';
    article.dataset.productId = product.id;
    article.dataset.category = product.category;
    article.setAttribute('role', 'listitem');

    const productUrl = `product.html?id=${encodeURIComponent(product.id)}`;
    const imageFrame = document.createElement('figure');
    imageFrame.className = 'product-image';
    const imageLink = document.createElement('a');
    imageLink.href = productUrl;
    imageLink.setAttribute('aria-label', `View ${product.name}`);
    const image = document.createElement('img');
    image.src = getProductImage(product);
    image.alt = product.name;
    image.loading = prioritizeImage ? 'eager' : 'lazy';
    image.decoding = 'async';
    if (prioritizeImage) image.fetchPriority = 'high';
    image.width = 400;
    image.height = 500;
    addImageLoadingState(image, imageFrame);
    imageLink.appendChild(image);
    imageFrame.appendChild(imageLink);
    addOfferSticker(imageFrame, product);
    const wishlistButton = document.createElement('button');
    wishlistButton.type = 'button';
    wishlistButton.className = 'wishlist-toggle';
    wishlistButton.dataset.wishlistToggle = product.id;
    wishlistButton.dataset.productName = product.name;
    const savedToWishlist = wishlistIds.includes(product.id);
    wishlistButton.setAttribute('aria-pressed', String(savedToWishlist));
    wishlistButton.setAttribute('aria-label', `${savedToWishlist ? 'Remove' : 'Add'} ${product.name} ${savedToWishlist ? 'from' : 'to'} wishlist`);
    wishlistButton.title = savedToWishlist ? 'Remove from wishlist' : 'Add to wishlist';
    wishlistButton.classList.toggle('is-saved', savedToWishlist);
    wishlistButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"/></svg>';
    imageFrame.appendChild(wishlistButton);
    if (product.imageNote) {
      const note = document.createElement('figcaption');
      note.className = 'product-image-note';
      note.textContent = product.imageNote;
      if (product.imageCreditUrl) {
        const credit = document.createElement('a');
        credit.href = product.imageCreditUrl;
        credit.target = '_blank';
        credit.rel = 'noopener noreferrer';
        credit.textContent = 'Photo source';
        note.append(' · ', credit);
      }
      imageFrame.appendChild(note);
    }

    const info = document.createElement('div');
    info.className = 'product-info';
    const category = getCategoryLabel(product.category);
    info.innerHTML = `
      <p class="product-category">${category}</p>
      <h3 class="product-name"><a></a></h3>
      <div class="product-meta"><p class="product-price">${formatPrice(product)}</p></div>
      <div class="product-action"></div>
    `;
    const titleLink = info.querySelector('.product-name a');
    titleLink.href = productUrl;
    titleLink.textContent = product.name;
    const action = info.querySelector('.product-action');
    const sizeSelect = makeVariantSelect(product, 'size', 'Size', product.availableSizes);
    if (sizeSelect) action.appendChild(sizeSelect);
    const feedback = document.createElement('p');
    feedback.className = 'product-feedback';
    feedback.setAttribute('aria-live', 'polite');
    action.appendChild(feedback);
    const actionButtons = document.createElement('div');
    actionButtons.className = 'product-card-actions';
    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'btn btn-primary add-to-cart';
    addButton.dataset.addToCart = product.id;
    addButton.setAttribute('aria-label', `Add ${product.name} to cart`);
    addButton.innerHTML = '<svg class="add-to-cart-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="10" cy="20" r="1.25"/><circle cx="18" cy="20" r="1.25"/></svg><span>Add to cart</span>';
    const detailsLink = document.createElement('a');
    detailsLink.href = productUrl;
    detailsLink.className = 'btn btn-outline';
    detailsLink.textContent = 'Details';
    actionButtons.append(addButton, detailsLink);
    action.appendChild(actionButtons);
    article.append(imageFrame, info);
    return article;
  }

  function initProductPage() {
    const container = document.getElementById('product-detail');
    if (!container) return;
    const productId = new URLSearchParams(window.location.search).get('id');
    const product = getProductById(productId);
    if (!product) {
      container.innerHTML = '<div class="product-not-found"><h1>Product not found</h1><p>That product may have moved or is no longer listed.</p><a class="btn btn-primary" href="inventory.html">Back to the collection</a></div>';
      document.title = 'Product Not Found | Pizzaro Perfect';
      return;
    }

    document.title = `${product.name} | Pizzaro Perfect`;
    const breadcrumb = document.getElementById('breadcrumb-product');
    if (breadcrumb) breadcrumb.textContent = product.name;
    const imageFrame = document.createElement('figure');
    imageFrame.className = 'product-detail-image';
    const image = document.createElement('img');
    image.src = getProductImage(product);
    image.alt = product.name;
    image.width = 700;
    image.height = 875;
    image.fetchPriority = 'high';
    image.decoding = 'async';
    addImageLoadingState(image, imageFrame);
    imageFrame.appendChild(image);
    if (product.category === 'football') {
      const overlay = document.createElement('div');
      overlay.className = 'jersey-photo-customisation';
      overlay.setAttribute('aria-hidden', 'true');
      const nameOverlay = document.createElement('span');
      nameOverlay.className = 'jersey-photo-name';
      nameOverlay.dataset.customPreviewName = '';
      const numberOverlay = document.createElement('span');
      numberOverlay.className = 'jersey-photo-number';
      numberOverlay.dataset.customPreviewNumber = '';
      const artworkOverlay = document.createElement('img');
      artworkOverlay.className = 'jersey-photo-artwork';
      artworkOverlay.dataset.customPreviewArtwork = '';
      artworkOverlay.alt = '';
      artworkOverlay.hidden = true;
      overlay.append(nameOverlay, numberOverlay, artworkOverlay);
      imageFrame.appendChild(overlay);
    }
    if (product.imageNote) {
      const caption = document.createElement('figcaption');
      caption.textContent = product.imageNote;
      if (product.imageCreditUrl) {
        const credit = document.createElement('a');
        credit.href = product.imageCreditUrl;
        credit.target = '_blank';
        credit.rel = 'noopener noreferrer';
        credit.textContent = 'Photo source';
        caption.append(' · ', credit);
      }
      imageFrame.appendChild(caption);
    }

    const info = document.createElement('div');
    info.className = 'product-detail-info';
    const eyebrow = document.createElement('p');
    eyebrow.className = 'hero-eyebrow';
    eyebrow.textContent = getCategoryLabel(product.category);
    const title = document.createElement('h1');
    title.textContent = product.name;
    addOfferSticker(imageFrame, product);
    const price = document.createElement('p');
    price.className = 'product-detail-price';
    price.innerHTML = formatPrice(product);
    const description = document.createElement('p');
    description.className = 'product-detail-description';
    description.textContent = product.details || product.description || 'Ask us about this product.';
    const variants = document.createElement('div');
    variants.className = 'product-detail-variants';
    const sizeSelect = makeVariantSelect(product, 'size', 'Size', product.availableSizes);
    if (sizeSelect) variants.appendChild(sizeSelect);
    if (variants.childElementCount === 0) {
      const optionsNote = document.createElement('p');
      optionsNote.className = 'detail-options-note';
      optionsNote.textContent = 'Ask us for the sizes and price.';
      variants.appendChild(optionsNote);
    }

    let customiser = null;
    if (product.category === 'football') {
      customiser = document.createElement('section');
      customiser.className = 'jersey-customizer';
      customiser.dataset.jerseyCustomizer = '';
      customiser.setAttribute('aria-labelledby', 'jersey-customizer-title');
      customiser.innerHTML = `
        <h2 id="jersey-customizer-title">Custom branding</h2>
        <p>Add a name, number or logo.</p>
        <label for="custom-jersey-name">Name on jersey
          <input id="custom-jersey-name" type="text" maxlength="16" autocomplete="off" data-custom-name>
        </label>
        <label for="custom-jersey-number">Number
          <input id="custom-jersey-number" type="text" inputmode="numeric" maxlength="2" pattern="[0-9]{0,2}" data-custom-number>
        </label>
        <label for="custom-jersey-artwork">Logo file (optional)
          <input id="custom-jersey-artwork" type="file" accept="image/png,image/jpeg,image/webp" data-custom-artwork>
        </label>
        <p class="customizer-note" data-customizer-status aria-live="polite">Send the logo separately on WhatsApp.</p>
        <a class="btn btn-outline custom-jersey-enquiry" href="" target="_blank" rel="noopener noreferrer">Ask about branding</a>
      `;
    }

    const feedback = document.createElement('p');
    feedback.className = 'product-feedback';
    feedback.setAttribute('aria-live', 'polite');
    const actions = document.createElement('div');
    actions.className = 'product-detail-actions';
    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'btn btn-primary add-to-cart';
    addButton.dataset.addToCart = product.id;
    addButton.textContent = 'Add to cart';
    const enquiry = createWhatsAppButton(product, 'Ask about this product', 'product-detail-enquiry');
    variants.querySelectorAll('[data-variant]').forEach(select => {
      select.addEventListener('change', () => {
        const selected = {};
        variants.querySelectorAll('[data-variant]').forEach(option => {
          selected[option.dataset.variant] = option.value;
        });
        enquiry.href = getWhatsAppLinkForProduct(product, selected);
      });
    });
    actions.append(addButton, enquiry);
    info.append(eyebrow, title, price, variants, description);
    if (customiser) info.appendChild(customiser);
    info.append(feedback, actions);
    container.dataset.productId = product.id;
    container.append(imageFrame, info);
  }

  function renderProducts(products, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    container.replaceChildren();
    if (!products || products.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'no-products';
      empty.textContent = 'No products found matching your criteria.';
      container.appendChild(empty);
      return;
    }
    products.forEach((product, index) => {
      container.appendChild(createProductCard(product, index < 3));
    });
  }

  function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navigation = document.getElementById('main-navigation');
    const navMenu = document.querySelector('.nav-menu');
    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('nav-menu-open', !expanded);
    });
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('nav-menu-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('click', event => {
      if (navMenu.classList.contains('nav-menu-open') &&
          !navigation.contains(event.target) &&
          !navToggle.contains(event.target)) {
        navMenu.classList.remove('nav-menu-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function initSharedContent() {
    document.querySelectorAll('[data-business-name]').forEach(el => { el.textContent = CONFIG.brand.name; });
    document.querySelectorAll('[data-business-tagline]').forEach(el => { el.textContent = CONFIG.brand.tagline; });
    document.querySelectorAll('[data-current-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });
    document.querySelectorAll('[data-delivery-summary]').forEach(el => {
      el.textContent = 'Delivery countrywide.';
    });
    document.querySelectorAll('[data-business-phone]').forEach(el => {
      el.textContent = CONFIG.contact.phoneDisplay;
      el.href = `tel:${CONFIG.contact.whatsapp}`;
    });
    document.querySelectorAll('[data-business-email]').forEach(el => {
      el.textContent = CONFIG.contact.email;
      el.href = `mailto:${CONFIG.contact.email}`;
    });
    document.querySelectorAll('[data-contact-whatsapp], #header-whatsapp, #location-whatsapp').forEach(el => {
      el.href = getWhatsAppLinkForGeneral();
    });
    initFloatingWhatsApp();
  }

  function initFloatingWhatsApp() {
    if (document.querySelector('.floating-whatsapp')) return;
    const link = document.createElement('a');
    link.className = 'floating-whatsapp';
    link.href = getWhatsAppLinkForGeneral();
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', 'Chat with us on WhatsApp');
    link.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M20.1 11.8a8.1 8.1 0 0 1-12 7.1L4 20l1.2-4A8.1 8.1 0 1 1 20.1 11.8Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M8.5 8.1c.3-.4.6-.4.9-.4l.6 1.5c.1.2 0 .4-.2.6l-.4.5c.6 1.2 1.4 2 2.6 2.6l.5-.4c.2-.2.4-.3.6-.2l1.5.6c.2.1.2.6.1.9-.2.7-.9 1.1-1.6 1.1-2.5-.2-5.6-3.2-5.8-5.7 0-.5.5-1.1 1.2-1.1Z" fill="currentColor"/>
      </svg>
      <span>WhatsApp</span>
    `;
    document.body.appendChild(link);
  }

  function createBranchCard(location) {
    const card = document.createElement('article');
    card.className = 'branch-card';
    const city = document.createElement('p');
    city.className = 'branch-city';
    city.textContent = location.city;
    const name = document.createElement('h3');
    name.textContent = location.name;
    const address = document.createElement('p');
    address.className = 'branch-address';
    address.textContent = location.address;
    const link = document.createElement('a');
    link.className = 'text-link';
    link.href = CONFIG.getDirectionsUrl(location.address);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Get directions';
    card.append(city, name, address, link);
    return card;
  }

  function initBranches() {
    ['branch-preview-list', 'store-list'].forEach(id => {
      const container = document.getElementById(id);
      if (container) {
        CONFIG.locations.forEach(location => container.appendChild(createBranchCard(location)));
      }
    });
  }

  function initInventoryPage() {
    const searchInput = document.getElementById('product-search');
    const productGrid = document.getElementById('product-grid');
    if (!searchInput || !productGrid) return;

    const requestedCategory = new URLSearchParams(window.location.search).get('category');
    const categoryLinks = document.querySelectorAll('[data-inventory-category]');
    const selectedCategory = getCategories().includes(requestedCategory) ? requestedCategory : 'all';
    const title = document.getElementById('inventory-title');
    const intro = document.getElementById('inventory-intro');

    function updateCategoryHeading(categoryId) {
      const isAll = categoryId === 'all';
      const categoryName = isAll ? 'All products' : getCategoryLabel(categoryId);
      if (title) title.textContent = isAll ? 'Shop all products' : categoryName;
      if (intro) {
        intro.textContent = isAll
          ? 'Browse the full collection, or choose a category to see matching products.'
          : `Browse our ${categoryName.toLowerCase()}. Search or filter to find the right style.`;
      }
      document.title = `${categoryName} | Pizzaro Perfect`;
      document.querySelectorAll('[data-inventory-category]').forEach(link => {
        if (link.dataset.inventoryCategory === categoryId) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    }

    function applyFilters() {
      const query = searchInput.value;
      updateCategoryHeading(selectedCategory);
      const filtered = query.trim()
        ? searchProducts(query)
        : getProductsByCategory(selectedCategory);
      renderProducts(filtered, '#product-grid');
      const status = document.getElementById('catalogue-status');
      if (status) status.textContent = `${filtered.length} ${filtered.length === 1 ? 'style' : 'styles'} shown`;
    }
    searchInput.addEventListener('input', applyFilters);
    categoryLinks.forEach(link => {
      if (link.dataset.inventoryCategory === selectedCategory) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    applyFilters();
  }

  function initHomePage() {
    renderProducts(getFeaturedProducts(), '#featured-products');
    initHomeCarousel();
  }

  function initHomeCarousel() {
    const carousel = document.querySelector('[data-home-carousel]');
    const track = carousel?.querySelector('[data-carousel-track]');
    const dots = carousel?.querySelector('[data-carousel-dots]');
    const previous = carousel?.querySelector('[data-carousel-prev]');
    const next = carousel?.querySelector('[data-carousel-next]');
    if (!carousel || !track || !dots || !previous || !next) return;

    const products = getFeaturedProducts().slice(0, 5);
    const slides = products.map(product => {
      const category = product.category;

      const slide = document.createElement('article');
      slide.className = 'hero-carousel-slide';
      const figure = document.createElement('figure');
      figure.className = 'hero-image';
      const image = document.createElement('img');
      image.src = getProductImage(product);
      image.alt = product.name;
      image.width = 700;
      image.height = 700;
      if (track.childElementCount === 0) image.fetchPriority = 'high';
      image.decoding = 'async';
      addImageLoadingState(image, figure);
      figure.appendChild(image);

      const caption = document.createElement('figcaption');
      caption.className = 'hero-image-caption';
      const categoryLabel = document.createElement('span');
      categoryLabel.className = 'hero-image-category';
      categoryLabel.textContent = getCategoryLabel(category);
      const productName = document.createElement('span');
      productName.className = 'hero-image-name';
      productName.textContent = product.name;
      caption.append(categoryLabel, productName);
      if (product.imageNote) {
        const note = document.createElement('span');
        note.className = 'hero-image-note';
        note.textContent = product.imageNote;
        caption.appendChild(note);
      }
      figure.appendChild(caption);
      slide.appendChild(figure);
      track.appendChild(slide);

      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'hero-carousel-dot';
      dot.setAttribute('aria-label', `Show ${product.name}`);
      dot.addEventListener('click', () => showSlide(products.indexOf(product)));
      dots.appendChild(dot);
      return slide;
    }).filter(Boolean);
    if (slides.length < 2) return;

    let activeIndex = 0;
    let autoplay;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const indicators = [...dots.querySelectorAll('button')];

    function showSlide(index) {
      activeIndex = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${activeIndex * 100}%)`;
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === activeIndex;
        slide.setAttribute('aria-hidden', String(!active));
        slide.inert = !active;
        indicators[slideIndex].setAttribute('aria-current', String(active));
      });
    }

    function stopAutoplay() {
      window.clearInterval(autoplay);
      autoplay = undefined;
    }

    function startAutoplay() {
      stopAutoplay();
      if (reducedMotion.matches) return;
      autoplay = window.setInterval(() => showSlide(activeIndex + 1), 5500);
    }

    previous.addEventListener('click', () => {
      showSlide(activeIndex - 1);
      startAutoplay();
    });
    next.addEventListener('click', () => {
      showSlide(activeIndex + 1);
      startAutoplay();
    });
    carousel.addEventListener('pointerenter', stopAutoplay);
    carousel.addEventListener('pointerleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', event => {
      if (!carousel.contains(event.relatedTarget)) startAutoplay();
    });
    reducedMotion.addEventListener('change', startAutoplay);

    showSlide(0);
    startAutoplay();
  }

  function init() {
    initNavigation();
    initSharedContent();
    initBranches();
    const path = window.location.pathname;
    if (path.includes('inventory.html') || path.endsWith('inventory')) initInventoryPage();
    else if (path.includes('product.html') || path.endsWith('product')) initProductPage();
    else if (path.includes('index.html') || path.endsWith('/')) initHomePage();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.PizzaroApp = {
    generateWhatsAppLink,
    generateProductWhatsAppMessage,
    getWhatsAppLinkForProduct,
    getWhatsAppLinkForGeneral,
    createWhatsAppButton,
    formatPrice,
    getProductImage,
    createProductCard,
    renderProducts,
    getProducts,
    getProductById,
    getFeaturedProducts,
    getProductsByCategory,
    getCategories,
    getCategoryLabel,
    searchProducts,
    getProductOffer
  };
})();
