document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js');

const focusableSelectors = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const getFocusable = (container) =>
  Array.from(container.querySelectorAll(focusableSelectors)).filter((element) => element.offsetParent !== null);

document.querySelectorAll('[data-drawer-open]').forEach((button) => {
  const drawer = document.querySelector(button.getAttribute('data-drawer-open'));
  if (!drawer) return;

  const panel = drawer.querySelector('[role="dialog"]') || drawer;
  let previouslyFocused = null;

  const closeDrawer = () => {
    drawer.setAttribute('aria-hidden', 'true');
    button.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('drawer-open');

    if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
      previouslyFocused.focus();
    }
  };

  const openDrawer = () => {
    previouslyFocused = document.activeElement;
    drawer.setAttribute('aria-hidden', 'false');
    button.setAttribute('aria-expanded', 'true');
    document.body.classList.add('drawer-open');

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

    if (event.key !== 'Tab') return;

    const focusable = getFocusable(panel);
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
  });
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
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      });

      if (!response.ok) throw new Error('Cart add failed');

      const cartResponse = await fetch('/cart.js', { headers: { Accept: 'application/json' } });
      const cart = await cartResponse.json();
      document.querySelectorAll('[data-cart-count]').forEach((count) => {
        count.textContent = cart.item_count;
      });

      if (status) {
        status.textContent = 'Added to cart. Checkout when you are ready.';
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
