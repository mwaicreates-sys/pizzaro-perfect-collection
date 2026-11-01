(function() {
  'use strict';

  const WISHLIST_STORAGE_KEY = 'pizzaro-perfect-wishlist-v1';
  const RECENTLY_VIEWED_KEY = 'pizzaro-perfect-recently-viewed-v1';
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
    document.querySelectorAll('[data-wishlist-count]').forEach(count => {
      count.textContent = String(wishlistIds.length);
      count.hidden = wishlistIds.length === 0;
    });
  }

  function toggleWishlist(productId) {
    if (!getProductById(productId)) return;
    wishlistIds = wishlistIds.includes(productId)
      ? wishlistIds.filter(id => id !== productId)
      : [...wishlistIds, productId];
    saveWishlist();
    updateWishlistButtons();
    document.dispatchEvent(new CustomEvent('pizzaro:wishlist-change'));
  }

  wishlistIds = loadWishlist();
  window.addEventListener('storage', event => {
    if (event.key !== WISHLIST_STORAGE_KEY) return;
    if (event.newValue === null) {
      wishlistIds = [];
      updateWishlistButtons();
      document.dispatchEvent(new CustomEvent('pizzaro:wishlist-change'));
      return;
    }
    try {
      const parsed = JSON.parse(event.newValue);
      if (!Array.isArray(parsed)) throw new TypeError('Updated wishlist data is not a list.');
      wishlistIds = [...new Set(parsed.filter(id =>
        typeof id === 'string' && getProductById(id)
      ))];
      updateWishlistButtons();
      document.dispatchEvent(new CustomEvent('pizzaro:wishlist-change'));
    } catch (error) {
      console.error('Unable to sync the saved wishlist:', error);
    }
  });

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-wishlist-toggle]');
    if (!button) return;
    toggleWishlist(button.dataset.wishlistToggle);
  });

  function generateWhatsAppLink(message) {
    return `https://wa.me/${CONFIG.contact.whatsapp}?text=${encodeURIComponent(message)}`;
  }

  function generateProductWhatsAppMessage(product, variants, customisation) {
    const price = product.priceVerified && Number.isFinite(product.price)
      ? `Listed price: KES ${product.price.toLocaleString()}.`
      : 'Please share the current price.';
    const optionLabel = product.variantLabel || 'Size';
    const lines = [`Hi ${CONFIG.brand.name}, I'm interested in ${product.name}:`];
    if (variants?.size) lines.push(`- ${optionLabel}: ${variants.size}`);
    lines.push(`- ${price}`);
    if (customisation?.name) lines.push(`- Name: ${customisation.name}`);
    if (customisation?.number) lines.push(`- Number: ${customisation.number}`);
    if (customisation?.artwork) lines.push(`- Artwork: ${customisation.artwork} (I will send the file separately)`);
    lines.push(`Please confirm availability and ${optionLabel.toLowerCase()}.`);
    return lines.join('\n');
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
    if (product.newArrival && !getProductOffer(product)) {
      const newLabel = document.createElement('span');
      newLabel.className = 'product-new-label';
      newLabel.textContent = 'New';
      imageFrame.appendChild(newLabel);
    }
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
    wishlistButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.8a5.2 5.2 0 0 0-7.4 0L12 6.2l-1.4-1.4a5.2 5.2 0 0 0-7.4 7.4l1.4 1.4L12 21l7.4-7.4 1.4-1.4a5.2 5.2 0 0 0 0-7.4Z"/></svg>';
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
    info.innerHTML = `
      <h3 class="product-name"><a></a></h3>
      <div class="product-meta"><p class="product-price">${formatPrice(product)}</p></div>
      <div class="product-action"></div>
    `;
    const titleLink = info.querySelector('.product-name a');
    titleLink.href = productUrl;
    titleLink.textContent = product.name;
    const action = info.querySelector('.product-action');
    const feedback = document.createElement('p');
    feedback.className = 'product-feedback';
    feedback.setAttribute('aria-live', 'polite');
    const variantSelect = makeVariantSelect(
      product,
      'size',
      product.variantLabel || 'Size',
      product.availableSizes
    );
    if (variantSelect) action.appendChild(variantSelect);
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
    rememberProduct(product.id);
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
    const zoomButton = document.createElement('button');
    zoomButton.type = 'button';
    zoomButton.className = 'image-zoom-button';
    zoomButton.dataset.imageZoom = '';
    zoomButton.setAttribute('aria-label', `Enlarge image of ${product.name}`);
    zoomButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5M10.8 7.8v6m-3-3h6"/></svg>';
    imageFrame.appendChild(zoomButton);

    const info = document.createElement('div');
    info.className = 'product-detail-info';
    const eyebrow = document.createElement('p');
    eyebrow.className = 'hero-eyebrow';
    eyebrow.textContent = getCategoryLabel(product.category);
    const title = document.createElement('h1');
    title.textContent = product.name;
    const team = document.createElement('p');
    team.className = 'product-detail-team';
    team.textContent = product.team || getCategoryLabel(product.category);
    addOfferSticker(imageFrame, product);
    const price = document.createElement('p');
    price.className = 'product-detail-price';
    price.innerHTML = formatPrice(product);
    const description = document.createElement('p');
    description.className = 'product-detail-description';
    description.textContent = product.details || product.description || 'Contact us for product details.';
    const variants = document.createElement('div');
    variants.className = 'product-detail-variants';
    const sizeSelect = makeVariantSelect(product, 'size', product.variantLabel || 'Size', product.availableSizes);
    if (sizeSelect) variants.appendChild(sizeSelect);
    if (variants.childElementCount === 0) {
      const optionsNote = document.createElement('p');
      optionsNote.className = 'detail-options-note';
      optionsNote.textContent = 'Contact us to confirm available sizes.';
      variants.appendChild(optionsNote);
    }
    const availability = document.createElement('p');
    availability.className = 'product-detail-availability';
    availability.textContent = 'Availability: please confirm with us.';

    const feedback = document.createElement('p');
    feedback.className = 'product-feedback';
    feedback.setAttribute('aria-live', 'polite');
    const actions = document.createElement('div');
    actions.className = 'product-detail-actions';
    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'btn btn-primary add-to-cart';
    addButton.dataset.addToCart = product.id;
    addButton.innerHTML = '<svg class="add-to-cart-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="10" cy="20" r="1.25"/><circle cx="18" cy="20" r="1.25"/></svg><span>Add to cart</span>';
    const quantity = document.createElement('label');
    quantity.className = 'quantity-field';
    quantity.textContent = 'Quantity';
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.min = '1';
    quantityInput.max = '99';
    quantityInput.value = '1';
    quantityInput.dataset.quantity = '';
    quantityInput.setAttribute('aria-label', `Quantity for ${product.name}`);
    quantity.appendChild(quantityInput);
    const wishlistButton = document.createElement('button');
    wishlistButton.type = 'button';
    wishlistButton.className = 'btn btn-outline detail-wishlist';
    wishlistButton.dataset.wishlistToggle = product.id;
    wishlistButton.dataset.productName = product.name;
    wishlistButton.setAttribute('aria-pressed', String(wishlistIds.includes(product.id)));
    wishlistButton.setAttribute('aria-label', `${wishlistIds.includes(product.id) ? 'Remove' : 'Add'} ${product.name} ${wishlistIds.includes(product.id) ? 'from' : 'to'} wishlist`);
    wishlistButton.title = wishlistIds.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist';
    wishlistButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 20-1.4-1.3C5.6 14.2 2.5 11.4 2.5 8a4.8 4.8 0 0 1 8.2-3.4L12 5.9l1.3-1.3A4.8 4.8 0 0 1 21.5 8c0 3.4-3.1 6.2-8.1 10.7L12 20Z"/></svg>';
    const shareButton = document.createElement('button');
    shareButton.type = 'button';
    shareButton.className = 'btn btn-outline product-share';
    shareButton.dataset.shareProduct = '';
    shareButton.textContent = 'Share product';
    const shareStatus = document.createElement('p');
    shareStatus.className = 'product-share-status';
    shareStatus.setAttribute('aria-live', 'polite');
    const enquiry = createWhatsAppButton(product, 'Ask about this product', 'product-detail-enquiry');
    enquiry.dataset.productEnquiry = '';
    enquiry.href = '#';
    enquiry.setAttribute('aria-disabled', 'true');
    enquiry.classList.add('is-disabled');
    enquiry.addEventListener('click', event => {
      if (enquiry.getAttribute('aria-disabled') === 'true') event.preventDefault();
    });
    variants.querySelectorAll('[data-variant]').forEach(select => {
      select.addEventListener('change', () => {
        const selected = {};
        variants.querySelectorAll('[data-variant]').forEach(option => {
          selected[option.dataset.variant] = option.value;
        });
        const hasRequiredSelection = !product.availableSizes?.length || Boolean(selected.size);
        enquiry.href = hasRequiredSelection ? getWhatsAppLinkForProduct(product, selected) : '#';
        enquiry.setAttribute('aria-disabled', String(!hasRequiredSelection));
        enquiry.classList.toggle('is-disabled', !hasRequiredSelection);
      });
    });
    actions.append(quantity, addButton, wishlistButton, shareButton, enquiry);
    info.append(eyebrow, title, team, price, variants, availability, description);
    info.append(feedback, shareStatus, actions);
    container.dataset.productId = product.id;
    container.append(imageFrame, info);
    renderProducts(
      getProductsByCategory(product.category).filter(candidate => candidate.id !== product.id).slice(0, 4),
      '#related-products'
    );
    renderRecentlyViewedSection('#recently-viewed', '.product-detail-section ~ .recently-viewed-section', product.id);
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
      container.appendChild(createProductCard(product, containerSelector === '#product-grid' && index < 4));
    });
    updateWishlistButtons();
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

  function rememberProduct(productId) {
    try {
      const saved = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]');
      const previous = Array.isArray(saved)
        ? saved.filter(id => typeof id === 'string' && getProductById(id) && id !== productId)
        : [];
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify([productId, ...previous].slice(0, 8)));
    } catch (error) {
      console.error('Unable to update recently viewed products:', error);
    }
  }

  function getRecentlyViewed(excludeId = '') {
    try {
      const saved = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]');
      if (!Array.isArray(saved)) throw new TypeError('Recently viewed data is not a list.');
      return saved
        .filter(id => typeof id === 'string' && id !== excludeId)
        .map(getProductById)
        .filter(Boolean)
        .slice(0, 4);
    } catch (error) {
      console.error('Unable to read recently viewed products:', error);
      return [];
    }
  }

  function createCategoryCard(category) {
    const link = document.createElement('a');
    link.className = 'category-card';
    link.href = `inventory.html?category=${encodeURIComponent(category.id)}`;
    const products = getProductsByCategory(category.id);
    const categoryImageIds = {
      polo: 'polo-plain-white',
      football: 'jersey-real-madrid-home',
      't-shirt': 'tshirt-white',
      caps: 'cap-white',
      vest: 'vest-reflective-yellow'
    };
    const imageProduct = getProductById(categoryImageIds[category.id]) || products[0];
    const frame = document.createElement('span');
    frame.className = 'category-card-image';
    const image = document.createElement('img');
    image.src = getProductImage(imageProduct);
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';
    image.width = 145;
    image.height = 145;
    frame.appendChild(image);
    link.appendChild(frame);
    const label = document.createElement('span');
    label.textContent = category.label;
    link.appendChild(label);
    return link;
  }

  function renderCategories() {
    const container = document.getElementById('home-categories');
    if (!container) return;
    const availableCategories = PRODUCT_CATEGORIES.filter(category =>
      getProductsByCategory(category.id).length > 0
    );
    container.replaceChildren(...availableCategories.map(createCategoryCard));
  }

  function initGlobalSearch() {
    document.querySelectorAll('[data-global-search]').forEach(form => {
      const input = form.querySelector('input[type="search"]');
      form.addEventListener('submit', event => {
        event.preventDefault();
        const query = input?.value.trim();
        const target = new URL('inventory.html', window.location.href);
        if (query) target.searchParams.set('q', query);
        window.location.href = target.href;
      });
    });
  }

  function initImageLightbox() {
    document.addEventListener('click', event => {
      const trigger = event.target.closest('[data-image-zoom]');
      if (!trigger) return;
      const image = trigger.closest('.product-detail-image')?.querySelector('img');
      if (!image) return;
      const dialog = document.createElement('dialog');
      dialog.className = 'image-lightbox';
      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'image-lightbox-close';
      close.textContent = 'Close';
      close.addEventListener('click', () => dialog.close());
      const enlarged = document.createElement('img');
      enlarged.src = image.currentSrc || image.src;
      enlarged.alt = image.alt;
      dialog.append(close, enlarged);
      document.body.appendChild(dialog);
      dialog.addEventListener('click', click => {
        if (click.target === dialog) dialog.close();
      });
      dialog.addEventListener('close', () => dialog.remove(), { once: true });
      dialog.showModal();
    });
  }

  function initProductSharing() {
    document.addEventListener('click', async event => {
      const button = event.target.closest('[data-share-product]');
      if (!button) return;
      const product = getProductById(document.getElementById('product-detail')?.dataset.productId);
      const status = document.querySelector('.product-share-status');
      if (!product || !status) return;
      const shareData = {
        title: product.name,
        text: `${product.name} — ${CONFIG.brand.name}`,
        url: window.location.href
      };
      if (navigator.share) {
        try {
          await navigator.share(shareData);
          status.textContent = 'Product shared.';
          return;
        } catch (error) {
          if (error.name === 'AbortError') return;
          console.error('Unable to share this product:', error);
        }
      }
      try {
        await navigator.clipboard.writeText(shareData.url);
        status.textContent = 'Product link copied.';
      } catch (error) {
        console.error('Unable to copy the product link:', error);
        status.textContent = 'Copy this product link from your browser address bar.';
      }
    });
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
    let selectedCategory = getCategories().includes(requestedCategory) ? requestedCategory : 'all';
    const initialQuery = new URLSearchParams(window.location.search).get('q') || '';
    searchInput.value = initialQuery;
    const sizeFilter = document.getElementById('size-filter');
    const clearFilters = document.getElementById('clear-filters');
    const title = document.getElementById('inventory-title');
    const intro = document.getElementById('inventory-intro');
    const loading = document.getElementById('catalogue-loading');
    const status = document.getElementById('catalogue-status');
    let filterTimer;

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
      if (loading) loading.hidden = false;
      productGrid.hidden = true;
      productGrid.setAttribute('aria-busy', 'true');
      window.clearTimeout(filterTimer);
      filterTimer = window.setTimeout(() => {
        let filtered = query.trim()
          ? searchProducts(query)
          : getProductsByCategory(selectedCategory);
        if (sizeFilter?.value) {
          filtered = filtered.filter(product => product.availableSizes?.includes(sizeFilter.value));
        }
        renderProducts(filtered, '#product-grid');
        if (status) status.textContent = `${filtered.length} ${filtered.length === 1 ? 'style' : 'styles'} shown`;
        productGrid.hidden = false;
        productGrid.setAttribute('aria-busy', 'false');
        if (loading) loading.hidden = true;
      }, 80);
    }
    searchInput.addEventListener('input', applyFilters);
    sizeFilter?.addEventListener('change', applyFilters);
    clearFilters?.addEventListener('click', () => {
      searchInput.value = '';
      if (sizeFilter) sizeFilter.value = '';
      selectedCategory = 'all';
      window.history.replaceState(null, '', 'inventory.html');
      applyFilters();
    });
    categoryLinks.forEach(link => {
      if (link.dataset.inventoryCategory === selectedCategory) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    applyFilters();
  }

  function initHomePage() {
    renderCategories();
    renderProducts(getNewArrivals().slice(0, 5), '#new-arrivals');
    renderProducts(getFeaturedProducts().slice(0, 5), '#featured-products');
    renderRecentlyViewedSection('#home-recently-viewed', '#home-recently-viewed-section');
    initHomeCarousel();
  }

  function renderRecentlyViewedSection(containerSelector, sectionSelector, excludeId = '') {
    const products = getRecentlyViewed(excludeId);
    const section = document.querySelector(sectionSelector);
    if (section) section.hidden = products.length === 0;
    renderProducts(products, containerSelector);
  }

  function initWishlistPage() {
    const container = document.getElementById('wishlist-products');
    const empty = document.getElementById('wishlist-empty');
    if (!container || !empty) return;

    function renderWishlist() {
      const products = wishlistIds.map(getProductById).filter(Boolean);
      empty.hidden = products.length > 0;
      container.hidden = products.length === 0;
      renderProducts(products, '#wishlist-products');
    }

    document.addEventListener('pizzaro:wishlist-change', renderWishlist);
    renderWishlist();
  }

  function initHomeCarousel() {
    const carousel = document.querySelector('[data-home-carousel]');
    const track = carousel?.querySelector('[data-carousel-track]');
    const dots = carousel?.querySelector('[data-carousel-dots]');
    const previous = carousel?.querySelector('[data-carousel-prev]');
    const next = carousel?.querySelector('[data-carousel-next]');
    if (!carousel || !track || !dots || !previous || !next) return;

    const promotions = CONFIG.promotions || [];
    const slides = promotions.slice(0, 5).map((promotion, index) => {
      const slide = document.createElement('article');
      slide.className = 'hero-carousel-slide';
      const figure = document.createElement('figure');
      figure.className = 'hero-image';
      const image = document.createElement('img');
      image.src = promotion.image;
      image.alt = promotion.imageAlt || '';
      image.width = 700;
      image.height = 700;
      if (index === 0) image.fetchPriority = 'high';
      image.decoding = 'async';
      addImageLoadingState(image, figure);
      figure.appendChild(image);

      const caption = document.createElement('figcaption');
      caption.className = 'hero-image-caption hero-promo-copy';
      const eyebrow = document.createElement('span');
      eyebrow.className = 'hero-image-category';
      eyebrow.textContent = promotion.eyebrow;
      const heading = document.createElement('span');
      heading.className = 'hero-image-name';
      heading.textContent = promotion.title;
      const description = document.createElement('span');
      description.className = 'hero-image-note';
      description.textContent = promotion.description;
      const action = document.createElement('a');
      action.className = 'btn btn-primary hero-promo-action';
      action.href = promotion.href;
      action.textContent = promotion.action;
      caption.append(eyebrow, heading, description, action);
      figure.appendChild(caption);
      slide.appendChild(figure);
      track.appendChild(slide);

      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'hero-carousel-dot';
      dot.setAttribute('aria-label', `Show promotion: ${promotion.title}`);
      dot.addEventListener('click', () => {
        showSlide(index);
        syncAutoplay();
      });
      dots.appendChild(dot);
      return slide;
    });
    if (slides.length < 2) return;

    let activeIndex = 0;
    let autoplay;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const indicators = [...dots.querySelectorAll('button')];
    let pointerInside = false;
    let keyboardInside = false;

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

    function syncAutoplay() {
      stopAutoplay();
      if (reducedMotion.matches || pointerInside || keyboardInside || document.hidden) return;
      autoplay = window.setInterval(() => showSlide(activeIndex + 1), 7000);
    }

    previous.addEventListener('click', () => {
      showSlide(activeIndex - 1);
      syncAutoplay();
    });
    next.addEventListener('click', () => {
      showSlide(activeIndex + 1);
      syncAutoplay();
    });
    carousel.addEventListener('pointerenter', () => { pointerInside = true; syncAutoplay(); });
    carousel.addEventListener('pointerleave', () => { pointerInside = false; syncAutoplay(); });
    carousel.addEventListener('focusin', () => { keyboardInside = true; syncAutoplay(); });
    carousel.addEventListener('focusout', event => {
      if (!carousel.contains(event.relatedTarget)) {
        keyboardInside = false;
        syncAutoplay();
      }
    });
    reducedMotion.addEventListener('change', syncAutoplay);
    document.addEventListener('visibilitychange', syncAutoplay);

    showSlide(0);
    syncAutoplay();
  }

  function init() {
    initNavigation();
    initSharedContent();
    initBranches();
    initGlobalSearch();
    initImageLightbox();
    initProductSharing();
    updateWishlistButtons();
    const path = window.location.pathname;
    if (path.includes('inventory.html') || path.endsWith('inventory')) initInventoryPage();
    else if (path.includes('product.html') || path.endsWith('product')) initProductPage();
    else if (path.includes('wishlist.html') || path.endsWith('wishlist')) initWishlistPage();
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
    getNewArrivals,
    getProductsByCategory,
    getCategories,
    getCategoryLabel,
    searchProducts,
    getProductOffer,
    rememberProduct,
    getRecentlyViewed
  };
  window.PizzaroWishlist = {
    getIds: () => [...wishlistIds],
    toggle: toggleWishlist
  };
})();
