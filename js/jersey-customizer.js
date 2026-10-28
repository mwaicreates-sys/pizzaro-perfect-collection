(function() {
  'use strict';

  function init() {
    const form = document.querySelector('[data-jersey-customizer]');
    if (!form) return;

    const nameField = form.querySelector('[data-custom-name]');
    const numberField = form.querySelector('[data-custom-number]');
    const artworkField = form.querySelector('[data-custom-artwork]');
    const status = form.querySelector('[data-customizer-status]');
    const namePreview = document.querySelector('[data-custom-preview-name]');
    const numberPreview = document.querySelector('[data-custom-preview-number]');
    const artworkPreview = document.querySelector('[data-custom-preview-artwork]');
    const customLink = form.querySelector('.custom-jersey-enquiry');
    const productLink = document.querySelector('.product-detail-enquiry');
    const product = window.PizzaroApp.getProductById(
      document.querySelector('#product-detail').dataset.productId
    );
    let artworkUrl = '';
    let artworkToken = 0;

    function selectedOptions() {
      const size = document.querySelector('#product-detail [data-variant="size"]')?.value || '';
      return { size };
    }

    function selectedCustomisation() {
      return {
        name: nameField.value.trim(),
        number: numberField.value.trim(),
        artwork: artworkField.files?.[0]?.name || ''
      };
    }

    function updateLinks() {
      const link = window.PizzaroApp.getWhatsAppLinkForProduct(
        product,
        selectedOptions(),
        selectedCustomisation()
      );
      customLink.href = link;
      if (productLink) productLink.href = link;
    }

    function updateTextPreview() {
      namePreview.textContent = nameField.value.trim().toUpperCase();
      numberPreview.textContent = numberField.value.trim();
      updateLinks();
    }

    function clearArtworkPreview() {
      ++artworkToken;
      if (artworkUrl) URL.revokeObjectURL(artworkUrl);
      artworkUrl = '';
      artworkPreview.removeAttribute('src');
      artworkPreview.hidden = true;
    }

    function loadArtwork(file) {
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
        clearArtworkPreview();
        artworkField.value = '';
        status.textContent = 'Choose a PNG, JPG or WebP image.';
        updateLinks();
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        clearArtworkPreview();
        artworkField.value = '';
        status.textContent = 'The artwork file must be smaller than 5 MB.';
        updateLinks();
        return;
      }

      clearArtworkPreview();
      const token = artworkToken;
      artworkUrl = URL.createObjectURL(file);
      artworkPreview.onload = () => {
        if (token !== artworkToken) return;
        artworkPreview.hidden = false;
        status.textContent = 'Artwork previewed on this device. Send the file separately on WhatsApp.';
      };
      artworkPreview.onerror = () => {
        if (token !== artworkToken) return;
        clearArtworkPreview();
        artworkField.value = '';
        status.textContent = 'The artwork could not be opened. Choose another image.';
        updateLinks();
      };
      artworkPreview.src = artworkUrl;
      updateLinks();
    }

    form.addEventListener('input', updateTextPreview);
    document.querySelectorAll('#product-detail [data-variant]').forEach(select => {
      select.addEventListener('change', updateLinks);
    });
    artworkField.addEventListener('change', () => {
      const file = artworkField.files?.[0];
      if (file) loadArtwork(file);
      else {
        clearArtworkPreview();
        updateLinks();
      }
    });
    window.addEventListener('beforeunload', clearArtworkPreview);

    updateTextPreview();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
