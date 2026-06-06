document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js');

const focusableSelectors = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionEnabled = document.body.classList.contains('motion-enabled') && !reducedMotion.matches;

const normalizeDatasetKey = (key) =>
  key
    .replace(/^ycEvent/, '')
    .replace(/[A-Z]/g, (character) => `_${character.toLowerCase()}`)
    .replace(/^_/, '');

const eventPayloadFromElement = (element) => {
  const payload = {
    path: window.location.pathname
  };

  Object.entries(element.dataset).forEach(([key, value]) => {
    if (!key.startsWith('ycEvent') || key === 'ycEvent' || value === '') return;
    payload[normalizeDatasetKey(key)] = value;
  });

  return payload;
};

const emitYcEvent = (eventName, payload = {}) => {
  if (!eventName) return;

  const eventPayload = {
    ...payload,
    path: payload.path || window.location.pathname
  };

  try {
    window.Shopify?.analytics?.publish?.(eventName, eventPayload);
  } catch (error) {
    // Keep storefront interactions working if a pixel sandbox rejects a custom event.
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...eventPayload
  });

  window.dispatchEvent(new CustomEvent(`yc:${eventName}`, { detail: eventPayload }));
};

window.ycTrackEvent = emitYcEvent;

const getFocusable = (container) =>
  Array.from(container.querySelectorAll(focusableSelectors)).filter((element) => element.offsetParent !== null);

document.querySelectorAll('a[href="/pages/careers"], a[href="https://www.yemenicorner.ca/pages/careers"]').forEach((link) => {
  link.setAttribute('href', '/careers');
});

document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  const trackedElement = event.target.closest('[data-yc-event]');
  if (!trackedElement) return;

  emitYcEvent(trackedElement.dataset.ycEvent, eventPayloadFromElement(trackedElement));
});

document.addEventListener(
  'submit',
  (event) => {
    const form = event.target;
    if (!form.closest('[data-yc-newsletter-form]')) return;
    if (typeof form.checkValidity === 'function' && !form.checkValidity()) return;

    emitYcEvent('newsletter_signup', {
      source: 'newsletter_form'
    });
  },
  true
);

document.querySelectorAll('[data-yc-view-item]').forEach((item) => {
  emitYcEvent('view_item', eventPayloadFromElement(item));
});

if (/\/pages\/menu\/?$/.test(window.location.pathname)) {
  emitYcEvent('menu_view', {
    source: 'page_load'
  });
}

const trapTab = (event, container) => {
  if (event.key !== 'Tab') return;

  const focusable = getFocusable(container);
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

document.querySelectorAll('[data-drawer-open]').forEach((button) => {
  const drawer = document.querySelector(button.getAttribute('data-drawer-open'));
  if (!drawer) return;

  const panel = drawer.querySelector('[role="dialog"]') || drawer;
  const backdrop = drawer.querySelector('[data-drawer-close]');
  let previouslyFocused = null;

  const setDrawerVisualState = (isOpen) => {
    drawer.classList.toggle('is-open', isOpen);
    if (backdrop) {
      backdrop.style.opacity = isOpen ? '1' : '';
    }
    if (panel) {
      panel.style.transform = isOpen ? 'translateX(0)' : '';
    }
  };

  const closeDrawer = () => {
    drawer.setAttribute('aria-hidden', 'true');
    button.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('drawer-open');
    setDrawerVisualState(false);

    if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
      previouslyFocused.focus();
    }
  };

  const openDrawer = () => {
    previouslyFocused = document.activeElement;
    drawer.setAttribute('aria-hidden', 'false');
    button.setAttribute('aria-expanded', 'true');
    document.body.classList.add('drawer-open');
    setDrawerVisualState(true);

    const focusable = getFocusable(panel);
    (focusable[0] || panel).focus();
  };

  button.addEventListener('click', openDrawer);

  drawer.querySelectorAll('[data-drawer-close]').forEach((closeButton) => {
    closeButton.addEventListener('click', closeDrawer);
  });

  drawer.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  drawer.addEventListener('keydown', (event) => {
    if (drawer.getAttribute('aria-hidden') === 'true') return;

    if (event.key === 'Escape') {
      closeDrawer();
      return;
    }

    trapTab(event, panel);
  });
});

const revealItems = Array.from(document.querySelectorAll('[data-reveal]'));
if (revealItems.length) {
  if (!motionEnabled || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }
}

const parallaxItems = Array.from(document.querySelectorAll('[data-parallax]'));
if (motionEnabled && parallaxItems.length) {
  let ticking = false;

  const updateParallax = () => {
    parallaxItems.forEach((item) => {
      const speed = Number(item.dataset.parallaxSpeed || 0.04);
      const rect = item.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const itemCenter = rect.top + rect.height / 2;
      const offset = (viewportCenter - itemCenter) * speed;
      item.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`);
    });
    ticking = false;
  };

  const requestParallax = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateParallax);
  };

  updateParallax();
  window.addEventListener('scroll', requestParallax, { passive: true });
  window.addEventListener('resize', requestParallax);
}

document.querySelectorAll('[data-brew-guide]').forEach((guide) => {
  const steps = Array.from(guide.querySelectorAll('[data-brew-step]'));
  const progress = guide.querySelector('[data-brew-progress]');
  if (!steps.length) return;

  const setActiveStep = (activeIndex) => {
    steps.forEach((step, index) => {
      const isActive = index === activeIndex;
      step.classList.toggle('is-active', isActive);
      step.setAttribute('aria-pressed', String(isActive));
    });

    if (progress) {
      progress.style.width = `${((activeIndex + 1) / steps.length) * 100}%`;
    }
  };

  steps.forEach((step, index) => {
    step.addEventListener('click', () => setActiveStep(index));
    step.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      setActiveStep(index);
    });
    step.addEventListener('focus', () => setActiveStep(index));
  });

  setActiveStep(0);
});

document.querySelectorAll('[data-menu-filter]').forEach((filters) => {
  const buttons = Array.from(filters.querySelectorAll('[data-menu-filter-button]'));
  const section = filters.closest('.section');
  const cards = section ? Array.from(section.querySelectorAll('[data-menu-card]')) : [];
  if (!buttons.length || !cards.length) return;

  const applyFilter = (category) => {
    buttons.forEach((button) => {
      const isActive = button.dataset.menuFilterButton === category;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    cards.forEach((card) => {
      const isVisible = category === 'all' || card.dataset.menuCategory === category;
      card.classList.toggle('is-hidden', !isVisible);
    });
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => applyFilter(button.dataset.menuFilterButton));
  });
});

document.querySelectorAll('[data-testimonial-slider]').forEach((slider) => {
  const track = slider.querySelector('[data-slider-track]');
  const previous = slider.querySelector('[data-slider-prev]');
  const next = slider.querySelector('[data-slider-next]');
  if (!track || !previous || !next) return;

  const scrollByCard = (direction) => {
    const firstCard = track.querySelector('.testimonial-card');
    const distance = firstCard ? firstCard.getBoundingClientRect().width + 16 : track.clientWidth;
    track.scrollBy({ left: distance * direction, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  };

  previous.addEventListener('click', () => scrollByCard(-1));
  next.addEventListener('click', () => scrollByCard(1));
});

document.querySelectorAll('[data-quantity]').forEach((quantity) => {
  const input = quantity.querySelector('input');
  if (!input) return;

  quantity.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
      const step = button.dataset.quantityButton === 'plus' ? 1 : -1;
      const min = Number(input.getAttribute('min') || 1);
      const value = Math.max(min, Number(input.value || min) + step);
      input.value = String(value);
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });
});

const cartDrawer = document.querySelector('[data-cart-drawer]');
const cartDrawerPanel = cartDrawer ? cartDrawer.querySelector('[role="dialog"]') : null;
const cartDrawerBackdrop = cartDrawer ? cartDrawer.querySelector('.cart-drawer__backdrop') : null;
const cartDrawerItems = cartDrawer ? cartDrawer.querySelector('[data-cart-drawer-items]') : null;
const cartDrawerSubtotal = cartDrawer ? cartDrawer.querySelector('[data-cart-drawer-subtotal]') : null;
let cartReturnFocus = null;

const escapeHtml = (value) =>
  String(value || '').replace(/[&<>"']/g, (character) => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return entities[character];
  });

const displayProductTitle = (title) => {
  const value = String(title || '');
  return /Harraz|Signature\s+Roast/i.test(value) ? 'Yemeni Corner Signature Blend' : value;
};

const formatMoney = (cents, currency) => {
  const activeCurrency = currency || window.Shopify?.currency?.active || 'CAD';
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: activeCurrency
  }).format(Number(cents || 0) / 100);
};

const openCartDrawer = (returnFocus) => {
  if (!cartDrawer || !cartDrawerPanel) return;
  cartReturnFocus = returnFocus || document.activeElement;
  cartDrawer.setAttribute('aria-hidden', 'false');
  cartDrawer.classList.add('is-open');
  document.body.classList.add('drawer-open');
  if (cartDrawerBackdrop) {
    cartDrawerBackdrop.style.opacity = '1';
  }
  cartDrawerPanel.style.transform = 'translateX(0)';
  const focusable = getFocusable(cartDrawerPanel);
  (focusable[0] || cartDrawerPanel).focus();
};

const closeCartDrawer = () => {
  if (!cartDrawer) return;
  cartDrawer.setAttribute('aria-hidden', 'true');
  cartDrawer.classList.remove('is-open');
  document.body.classList.remove('drawer-open');
  if (cartDrawerBackdrop) {
    cartDrawerBackdrop.style.opacity = '';
  }
  if (cartDrawerPanel) {
    cartDrawerPanel.style.transform = '';
  }

  if (cartReturnFocus && typeof cartReturnFocus.focus === 'function') {
    cartReturnFocus.focus();
  }
};

const renderCartDrawer = (cart) => {
  if (!cartDrawer || !cartDrawerItems || !cartDrawerSubtotal) return;

  if (!cart.items || !cart.items.length) {
    cartDrawerItems.innerHTML = '<div class="cart-drawer__empty"><p>Your cart is ready for its first coffee bag.</p></div>';
  } else {
    const fallbackImage = cartDrawer.dataset.cartFallbackImage;
    cartDrawerItems.innerHTML = cart.items
      .slice(0, 4)
      .map((item) => {
        const image = item.image || fallbackImage;
        const title = displayProductTitle(item.product_title);
        const variant = item.variant_title && item.variant_title !== 'Default Title' ? `<p>${escapeHtml(item.variant_title)}</p>` : '';
        return `
          <article class="cart-drawer__item">
            <div class="cart-drawer__image">
              <img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" loading="lazy">
            </div>
            <div>
              <h3>${escapeHtml(title)}</h3>
              ${variant}
              <p>${item.quantity} x ${formatMoney(item.final_price, cart.currency)}</p>
            </div>
          </article>
        `;
      })
      .join('');
  }

  cartDrawerSubtotal.textContent = formatMoney(cart.total_price, cart.currency);
};

if (cartDrawer && cartDrawerPanel) {
  cartDrawer.querySelectorAll('[data-cart-drawer-close]').forEach((button) => {
    button.addEventListener('click', closeCartDrawer);
  });

  cartDrawer.addEventListener('keydown', (event) => {
    if (cartDrawer.getAttribute('aria-hidden') === 'true') return;

    if (event.key === 'Escape') {
      closeCartDrawer();
      return;
    }

    trapTab(event, cartDrawerPanel);
  });
}

document.querySelectorAll('form.product-form').forEach((form) => {
  form.addEventListener('submit', async (event) => {
    if (!window.fetch || form.dataset.ajax === 'false') return;

    event.preventDefault();
    const button = form.querySelector('[type="submit"]');
    const originalText = button ? button.textContent : '';
    const status = form.querySelector('[data-product-status]');

    if (button) {
      button.disabled = true;
      button.textContent = 'Adding...';
    }

    if (status) {
      status.textContent = '';
    }

    try {
      const formData = new FormData(form);
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      });

      if (!response.ok) throw new Error('Cart add failed');
      const addedItem = await response.json();

      emitYcEvent('add_to_cart', {
        source: 'ajax_product_form',
        item_id: addedItem.product_id,
        item_name: displayProductTitle(addedItem.product_title),
        variant_id: addedItem.variant_id || formData.get('id'),
        quantity: addedItem.quantity || formData.get('quantity') || 1,
        price: Number(addedItem.final_price || 0) / 100,
        currency: window.Shopify?.currency?.active || 'CAD'
      });

      const cartResponse = await fetch('/cart.js', { headers: { Accept: 'application/json' } });
      const cart = await cartResponse.json();
      document.querySelectorAll('[data-cart-count]').forEach((count) => {
        count.textContent = cart.item_count;
      });

      renderCartDrawer(cart);
      openCartDrawer(button);

      if (status) {
        status.textContent = 'Added to cart. Your coffee bag is waiting in the mini cart.';
      }
    } catch (error) {
      form.submit();
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = originalText;
      }
    }
  });
});
