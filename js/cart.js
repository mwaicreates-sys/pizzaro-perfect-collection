(function() {
  'use strict';

  const STORAGE_KEY = 'pizzaro-perfect-cart-v1';
  const app = window.PizzaroApp;
  if (!app) throw new Error('PizzaroApp must load before the cart.');

  let items = [];
  let storageAvailable = true;

  const linesContainer = document.getElementById('cart-lines');
  const status = document.getElementById('cart-status');
  const count = document.getElementById('cart-count');
  const subtotal = document.getElementById('cart-subtotal');
  const priceNotice = document.getElementById('cart-price-notice');
  const orderLink = document.getElementById('cart-order');

  function setStatus(message, isError) {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('is-error', Boolean(isError));
    status.classList.toggle('is-success', Boolean(message) && !isError);
  }

  function loadCart() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === null) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) throw new TypeError('Saved cart data is not a list.');
      const valid = parsed.filter(item => {
        const product = item && typeof item.productId === 'string' && app.getProductById(item.productId);
        if (!product || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) return false;
        const allowedSizes = product.availableSizes || [];
        return (!item.size || !allowedSizes.length || allowedSizes.includes(item.size)) &&
          ['customName', 'customNumber', 'artworkName'].every(key =>
            item[key] === undefined || typeof item[key] === 'string'
          );
      }).map(item => ({
        productId: item.productId,
        size: item.size || '',
        customName: item.customName || '',
        customNumber: item.customNumber || '',
        artworkName: item.artworkName || '',
        quantity: item.quantity
      }));
      if (valid.length !== parsed.length) {
        console.warn('Removed outdated or invalid items from the saved cart.');
        setStatus('Some saved cart items were outdated and have been removed.', true);
      }
      return valid;
    } catch (error) {
      storageAvailable = false;
      setStatus('Your saved cart could not be read. This session can continue, but changes may not persist.', true);
      console.error('Unable to read the saved cart:', error);
      return [];
    }
  }

  function saveCart() {
    if (!storageAvailable) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      storageAvailable = false;
      setStatus('Cart changes could not be saved on this device. Keep this tab open while you enquire.', true);
      console.error('Unable to save the cart:', error);
    }
  }

  function productFor(item) {
    return app.getProductById(item.productId);
  }

  function hasItemsMissingSizes() {
    return items.some(item => {
      const product = productFor(item);
      return product && product.availableSizes?.length && !item.size;
    });
  }

  function variantLabel(item, product) {
    return [
      item.size && `${product.variantLabel || 'Size'} ${item.size}`,
      item.customName && `Name ${item.customName}`,
      item.customNumber && `Number ${item.customNumber}`,
      item.artworkName && `Artwork file ${item.artworkName}`
    ]
      .filter(Boolean).join(' · ');
  }

  function formatKes(value) {
    return `KSh ${value.toLocaleString()}`;
  }

  function buildOrderMessage() {
    const messageLines = [`Hi ${CONFIG.brand.name}, I would like to order:`];
    let knownSubtotal = 0;
    items.forEach(item => {
      const product = productFor(item);
      const unitPrice = product.priceVerified && Number.isFinite(product.price)
        ? formatKes(product.price)
        : 'price to confirm';
      const linePrice = product.priceVerified && Number.isFinite(product.price)
        ? ` · line subtotal ${formatKes(product.price * item.quantity)}`
        : ' · price and line total to confirm';
      messageLines.push(`- ${product.name} × ${item.quantity} — ${unitPrice}${linePrice}`);
      if (item.size) messageLines.push(`  - ${product.variantLabel || 'Size'}: ${item.size}`);
      if (item.customName) messageLines.push(`  - Name: ${item.customName}`);
      if (item.customNumber) messageLines.push(`  - Number: ${item.customNumber}`);
      if (item.artworkName) messageLines.push(`  - Artwork: ${item.artworkName} (send file separately)`);
      if (product.priceVerified && Number.isFinite(product.price)) {
        knownSubtotal += product.price * item.quantity;
      }
    });
    messageLines.push(`Confirmed items subtotal: ${formatKes(knownSubtotal)} (items awaiting price confirmation are not included).`);
    messageLines.push('Please confirm item availability, any unlisted sizes, delivery fees and arrangements. Delivery is available countrywide.');
    return messageLines.join('\n');
  }

  function render() {
    if (linesContainer) linesContainer.replaceChildren();
    let knownSubtotal = 0;
    let totalQuantity = 0;
    let hasUnpricedItems = false;

    items.forEach((item, index) => {
      const product = productFor(item);
      if (!product) return;
      const confirmedPrice = product.priceVerified && Number.isFinite(product.price);
      if (!confirmedPrice) hasUnpricedItems = true;
      if (linesContainer) {
        const line = document.createElement('article');
        line.className = 'cart-line';
        line.setAttribute('role', 'listitem');
        const image = document.createElement('img');
        image.className = 'cart-line-image';
        image.src = app.getProductImage(product);
        image.alt = '';
        image.width = 80;
        image.height = 96;
        image.loading = index < 3 ? 'eager' : 'lazy';
        image.decoding = 'async';
        if (index === 0) image.fetchPriority = 'high';
        const details = document.createElement('div');
        details.className = 'cart-line-details';
        const name = document.createElement('h3');
        const nameLink = document.createElement('a');
        nameLink.href = `product.html?id=${encodeURIComponent(product.id)}`;
        nameLink.textContent = product.name;
        name.appendChild(nameLink);
        const variant = document.createElement('p');
        const availableSizes = product.availableSizes || [];
        variant.textContent = item.size
          ? variantLabel(item, product)
          : availableSizes.length
            ? `Choose ${product.variantLabel === 'Age' ? 'an age' : 'a size'} to complete this item.`
            : variantLabel(item, product) || 'Options to confirm';
        if (!item.size && availableSizes.length) {
          const sizeField = document.createElement('label');
          sizeField.className = 'cart-size-field';
          const sizeLabel = document.createElement('span');
          sizeLabel.textContent = product.variantLabel || 'Size';
          const sizeSelect = document.createElement('select');
          sizeSelect.dataset.cartSize = String(index);
          sizeSelect.setAttribute('aria-label', `${product.variantLabel || 'Size'} for ${product.name}`);
          const prompt = document.createElement('option');
          prompt.value = '';
          prompt.textContent = `Choose ${product.variantLabel === 'Age' ? 'age' : 'size'}`;
          sizeSelect.appendChild(prompt);
          availableSizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            sizeSelect.appendChild(option);
          });
          sizeField.append(sizeLabel, sizeSelect);
          details.append(name, variant, sizeField);
        } else {
          details.append(name, variant);
        }
        const price = document.createElement('p');
        price.textContent = confirmedPrice
          ? `${formatKes(product.price)} each · ${formatKes(product.price * item.quantity)} total`
          : 'Price on request';
        price.className = 'cart-line-price';
        details.appendChild(price);

        const controls = document.createElement('div');
        controls.className = 'cart-line-controls';
        const decrease = document.createElement('button');
        decrease.type = 'button';
        decrease.dataset.cartChange = String(index);
        decrease.dataset.amount = '-1';
        decrease.setAttribute('aria-label', `Remove one ${product.name}`);
        decrease.textContent = '−';
        const quantity = document.createElement('span');
        quantity.textContent = String(item.quantity);
        const increase = document.createElement('button');
        increase.type = 'button';
        increase.dataset.cartChange = String(index);
        increase.dataset.amount = '1';
        increase.setAttribute('aria-label', `Add one ${product.name}`);
        increase.textContent = '+';
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.dataset.cartRemove = String(index);
        remove.className = 'cart-remove';
        remove.textContent = 'Remove';
        controls.append(decrease, quantity, increase, remove);
        line.append(image, details, controls);
        linesContainer.appendChild(line);
      }
      totalQuantity += item.quantity;
      if (confirmedPrice) knownSubtotal += product.price * item.quantity;
    });

    if (linesContainer && items.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'cart-empty';
      empty.textContent = 'Your cart is empty. Browse the products to add an item.';
      linesContainer.appendChild(empty);
    }
    if (count) count.textContent = String(totalQuantity);
    if (subtotal) subtotal.textContent = formatKes(knownSubtotal);
    if (priceNotice) {
      priceNotice.hidden = !hasUnpricedItems;
      priceNotice.textContent = hasUnpricedItems
        ? 'Some items need price confirmation and are not included in the confirmed subtotal. This is not the final order total.'
        : 'Delivery fees, if any, are confirmed by the store and are not included.';
    }
    if (orderLink) {
      const disabled = items.length === 0 || hasItemsMissingSizes();
      orderLink.href = disabled ? '#' : app.generateWhatsAppLink(buildOrderMessage());
      orderLink.setAttribute('aria-disabled', String(disabled));
      orderLink.classList.toggle('is-disabled', disabled);
    }
  }

  function addItem(button) {
    const product = app.getProductById(button.dataset.addToCart);
    const card = button.closest('[data-product-id]');
    const feedback = card && card.querySelector('.product-feedback');
    const showFeedback = (message, isError) => {
      if (!feedback) return;
      feedback.replaceChildren(document.createTextNode(message));
      feedback.classList.toggle('is-error', Boolean(isError));
      feedback.classList.toggle('is-success', !isError);
    };
    if (!product) {
      showFeedback('That item could not be found. Refresh the catalogue and try again.', true);
      return;
    }
    const selected = {};
    card.querySelectorAll('[data-variant]').forEach(select => {
      selected[select.dataset.variant] = select.value;
    });
    const sizeSelector = card.querySelector('[data-variant="size"]');
    if ((product.availableSizes || []).length && (!sizeSelector || !selected.size)) {
      showFeedback(product.variantLabel === 'Age' ? 'Choose an age first.' : 'Choose a size first.', true);
      sizeSelector?.focus();
      return;
    }

    const customName = card.querySelector('[data-custom-name]')?.value.trim() || '';
    const customNumber = card.querySelector('[data-custom-number]')?.value.trim() || '';
    const artworkName = card.querySelector('[data-custom-artwork]')?.files?.[0]?.name || '';
    const requestedQuantity = Number(card.querySelector('[data-quantity]')?.value || 1);
    if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1 || requestedQuantity > 99) {
      showFeedback('Choose a quantity from 1 to 99.', true);
      card.querySelector('[data-quantity]')?.focus();
      return;
    }
    const existing = items.find(item => item.productId === product.id &&
      item.size === (selected.size || '') &&
      item.customName === customName &&
      item.customNumber === customNumber &&
      item.artworkName === artworkName);
    if (existing && existing.quantity + requestedQuantity > 99) {
      showFeedback('The maximum quantity per item is 99.', true);
      return;
    }
    if (existing) existing.quantity += requestedQuantity;
    else items.push({
      productId: product.id,
      size: selected.size || '',
      customName,
      customNumber,
      artworkName,
      quantity: requestedQuantity
    });
    if (feedback) {
      feedback.classList.remove('is-error');
      feedback.classList.add('is-success');
      feedback.replaceChildren();
      feedback.append(`${product.name} added. `);
      const viewCart = document.createElement('a');
      viewCart.href = 'cart.html';
      viewCart.textContent = 'View cart';
      feedback.appendChild(viewCart);
    }
    setStatus(`${product.name} added to your cart.`, false);
    saveCart();
    render();
  }

  document.addEventListener('click', event => {
    const addButton = event.target.closest('[data-add-to-cart]');
    if (addButton) {
      addItem(addButton);
      return;
    }
    const removeButton = event.target.closest('[data-cart-remove]');
    if (removeButton) {
      items.splice(Number(removeButton.dataset.cartRemove), 1);
      saveCart();
      render();
      return;
    }
    const changeButton = event.target.closest('[data-cart-change]');
    if (changeButton) {
      const index = Number(changeButton.dataset.cartChange);
      const item = items[index];
      if (!item) return;
      if (Number(changeButton.dataset.amount) > 0 && item.quantity >= 99) {
        setStatus('The maximum quantity per item is 99.', true);
        return;
      }
      item.quantity += Number(changeButton.dataset.amount);
      if (item.quantity <= 0) items.splice(index, 1);
      saveCart();
      render();
      return;
    }
    if (event.target.closest('[data-cart-clear]')) {
      items = [];
      saveCart();
      setStatus('Your cart has been cleared.', false);
      render();
    }
  });

  document.addEventListener('change', event => {
    const sizeSelect = event.target.closest('[data-cart-size]');
    if (!sizeSelect) return;
    const index = Number(sizeSelect.dataset.cartSize);
    const item = items[index];
    const product = item && productFor(item);
    if (!product || !product.availableSizes?.includes(sizeSelect.value)) return;
    item.size = sizeSelect.value;
    saveCart();
    setStatus(`${product.variantLabel || 'Size'} saved for ${product.name}.`, false);
    render();
  });

  orderLink?.addEventListener('click', event => {
    if (items.length === 0) {
      event.preventDefault();
      setStatus('Add a product to your cart before preparing an order enquiry.', true);
    } else if (hasItemsMissingSizes()) {
      event.preventDefault();
      setStatus('Choose a size or age for every item before ordering.', true);
      document.querySelector('[data-cart-size]')?.focus();
    }
  });

  window.addEventListener('storage', event => {
    if (event.key !== STORAGE_KEY) return;
    items = loadCart();
    render();
  });

  items = loadCart();
  render();
  window.PizzaroCart = {
    getItems: () => items.map(item => ({ ...item })),
    buildOrderMessage,
    render
  };
})();
