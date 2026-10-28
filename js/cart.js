(function() {
  'use strict';

  const STORAGE_KEY = 'pizzaro-perfect-cart-v1';
  const app = window.PizzaroApp;
  if (!app) throw new Error('PizzaroApp must load before the cart.');

  let items = [];
  let storageAvailable = true;

  const dialog = document.createElement('dialog');
  dialog.className = 'cart-dialog';
  dialog.id = 'cart-dialog';
  dialog.setAttribute('aria-labelledby', 'cart-title');
  dialog.innerHTML = `
    <div class="cart-panel">
      <header class="cart-heading">
        <div><p class="hero-eyebrow">Your items</p><h2 id="cart-title">Cart</h2></div>
        <button type="button" class="dialog-close" data-cart-close aria-label="Close cart">Close</button>
      </header>
      <p class="cart-status" id="cart-status" role="status"></p>
      <div class="cart-lines" id="cart-lines"></div>
      <div class="cart-summary">
        <p><span>Priced items subtotal</span><strong id="cart-subtotal"></strong></p>
        <p class="cart-disclaimer">Items without a confirmed price are not included. Confirm sizes and delivery with us.</p>
      </div>
      <a class="btn btn-primary cart-order" id="cart-order" href="" target="_blank" rel="noopener noreferrer">Send order on WhatsApp</a>
    </div>
  `;
  document.body.appendChild(dialog);

  const linesContainer = dialog.querySelector('#cart-lines');
  const status = dialog.querySelector('#cart-status');
  const count = document.getElementById('cart-count');
  const toggle = document.getElementById('cart-toggle');
  const orderLink = dialog.querySelector('#cart-order');

  function setStatus(message, isError) {
    status.textContent = message;
    status.classList.toggle('is-error', Boolean(isError));
  }

  function loadCart() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === null) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) throw new TypeError('Saved cart data is not a list.');
      return parsed.filter(item => item && typeof item.productId === 'string' &&
        Number.isInteger(item.quantity) && item.quantity > 0 &&
        app.getProductById(item.productId));
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

  function variantLabel(item) {
    return [
      item.size && `Size ${item.size}`,
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
      const variant = variantLabel(item);
      const unitPrice = product.priceVerified && Number.isFinite(product.price)
        ? formatKes(product.price)
        : 'price to confirm';
      messageLines.push(`- ${product.name}${variant ? ` (${variant})` : ''} × ${item.quantity} — ${unitPrice}`);
      if (item.artworkName) messageLines.push(`  Send artwork file separately: ${item.artworkName}`);
      if (product.priceVerified && Number.isFinite(product.price)) {
        knownSubtotal += product.price * item.quantity;
      }
    });
    messageLines.push(`Priced items subtotal: ${formatKes(knownSubtotal)} (unpriced items excluded).`);
    messageLines.push('Please confirm available sizes and delivery details.');
    return messageLines.join('\n');
  }

  function render() {
    linesContainer.replaceChildren();
    let knownSubtotal = 0;
    let totalQuantity = 0;

    items.forEach((item, index) => {
      const product = productFor(item);
      if (!product) return;
      const line = document.createElement('article');
      line.className = 'cart-line';
      const details = document.createElement('div');
      details.className = 'cart-line-details';
      const name = document.createElement('h3');
      name.textContent = product.name;
      const variant = document.createElement('p');
      variant.textContent = variantLabel(item) || 'Options to confirm';
      const price = document.createElement('p');
      const confirmedPrice = product.priceVerified && Number.isFinite(product.price);
      price.textContent = confirmedPrice
        ? `${formatKes(product.price)} each · ${formatKes(product.price * item.quantity)} total`
        : 'Price on request';
      price.className = 'cart-line-price';
      details.append(name, variant, price);

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
      line.append(details, controls);
      linesContainer.appendChild(line);
      totalQuantity += item.quantity;
      if (confirmedPrice) knownSubtotal += product.price * item.quantity;
    });

    if (items.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'cart-empty';
      empty.textContent = 'Your cart is empty. Browse the products to add an item.';
      linesContainer.appendChild(empty);
    }
    if (count) count.textContent = String(totalQuantity);
    dialog.querySelector('#cart-subtotal').textContent = formatKes(knownSubtotal);
    const order = dialog.querySelector('#cart-order');
    order.href = app.generateWhatsAppLink(buildOrderMessage());
    order.setAttribute('aria-disabled', String(items.length === 0));
    order.classList.toggle('is-disabled', items.length === 0);
  }

  function addItem(button) {
    const product = app.getProductById(button.dataset.addToCart);
    const card = button.closest('[data-product-id]');
    const feedback = card && card.querySelector('.product-feedback');
    if (!product) {
      if (feedback) feedback.textContent = 'That item could not be found. Refresh the catalogue and try again.';
      return;
    }
    const selected = {};
    card.querySelectorAll('[data-variant]').forEach(select => {
      selected[select.dataset.variant] = select.value;
    });
    const hasSize = product.availableSizes && product.availableSizes.length;
    if (hasSize && !selected.size) {
      if (feedback) feedback.textContent = 'Choose a size first.';
      const missing = [...card.querySelectorAll('[data-variant]')].find(select => !select.value);
      missing?.focus();
      return;
    }

    const customName = card.querySelector('[data-custom-name]')?.value.trim() || '';
    const customNumber = card.querySelector('[data-custom-number]')?.value.trim() || '';
    const artworkName = card.querySelector('[data-custom-artwork]')?.files?.[0]?.name || '';
    const existing = items.find(item => item.productId === product.id &&
      item.size === (selected.size || '') &&
      item.customName === customName &&
      item.customNumber === customNumber &&
      item.artworkName === artworkName);
    if (existing) existing.quantity += 1;
    else items.push({
      productId: product.id,
      size: selected.size || '',
      customName,
      customNumber,
      artworkName,
      quantity: 1
    });
    if (feedback) feedback.textContent = `${product.name} added to your cart.`;
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
    const closeButton = event.target.closest('[data-cart-close]');
    if (closeButton) {
      dialog.close();
      return;
    }
    if (event.target === toggle || event.target.closest('#cart-toggle')) {
      dialog.showModal();
      render();
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
      const item = items[Number(changeButton.dataset.cartChange)];
      item.quantity += Number(changeButton.dataset.amount);
      if (item.quantity <= 0) items.splice(Number(changeButton.dataset.cartChange), 1);
      saveCart();
      render();
    }
  });

  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  orderLink.addEventListener('click', event => {
    if (items.length === 0) {
      event.preventDefault();
      setStatus('Add a product to your cart before preparing an order enquiry.', true);
    }
  });

  items = loadCart();
  render();
  window.PizzaroCart = {
    getItems: () => items.map(item => ({ ...item })),
    buildOrderMessage,
    render
  };
})();
