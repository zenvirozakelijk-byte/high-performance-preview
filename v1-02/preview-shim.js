window.HP_SHARE = {"design":"v1-02","name":"v1.02","products":[{"id":1001,"handle":"spine-tee-black-on-black","title":"Spine Tee / Black on Black","image":"tee-spine-black-on-black.jpg"},{"id":1002,"handle":"spine-tee-black-gold","title":"Spine Tee / Black & Gold","image":"tee-spine-black-gold.jpg"},{"id":1003,"handle":"core-tee-black","title":"Core Tee / Black","image":"tee-core-black.jpg"},{"id":1004,"handle":"core-tee-heather-grey","title":"Core Tee / Heather Grey","image":"tee-core-heather-grey.jpg"},{"id":1005,"handle":"core-tee-sand","title":"Core Tee / Sand","image":"tee-core-sand.jpg"}],"variants":[{"id":10000,"product_id":1001,"title":"Zwart op zwart / XS","price":6500,"available":true,"inventory_quantity":8},{"id":10001,"product_id":1001,"title":"Zwart op zwart / S","price":6500,"available":true,"inventory_quantity":8},{"id":10002,"product_id":1001,"title":"Zwart op zwart / M","price":6500,"available":true,"inventory_quantity":8},{"id":10003,"product_id":1001,"title":"Zwart op zwart / L","price":6500,"available":true,"inventory_quantity":8},{"id":10004,"product_id":1001,"title":"Zwart op zwart / XL","price":6500,"available":true,"inventory_quantity":8},{"id":10005,"product_id":1001,"title":"Zwart op zwart / 2XL","price":7000,"available":true,"inventory_quantity":8},{"id":10006,"product_id":1001,"title":"Zwart op zwart / 3XL","price":6500,"available":false,"inventory_quantity":0},{"id":10100,"product_id":1002,"title":"Zwart met goud / XS","price":6500,"available":true,"inventory_quantity":8},{"id":10101,"product_id":1002,"title":"Zwart met goud / S","price":6500,"available":true,"inventory_quantity":8},{"id":10102,"product_id":1002,"title":"Zwart met goud / M","price":6500,"available":true,"inventory_quantity":8},{"id":10103,"product_id":1002,"title":"Zwart met goud / L","price":6500,"available":true,"inventory_quantity":8},{"id":10104,"product_id":1002,"title":"Zwart met goud / XL","price":6500,"available":true,"inventory_quantity":8},{"id":10105,"product_id":1002,"title":"Zwart met goud / 2XL","price":7000,"available":true,"inventory_quantity":8},{"id":10106,"product_id":1002,"title":"Zwart met goud / 3XL","price":6500,"available":false,"inventory_quantity":0},{"id":10200,"product_id":1003,"title":"Zwart / XS","price":6500,"available":true,"inventory_quantity":8},{"id":10201,"product_id":1003,"title":"Zwart / S","price":6500,"available":true,"inventory_quantity":8},{"id":10202,"product_id":1003,"title":"Zwart / M","price":6500,"available":true,"inventory_quantity":8},{"id":10203,"product_id":1003,"title":"Zwart / L","price":6500,"available":true,"inventory_quantity":8},{"id":10204,"product_id":1003,"title":"Zwart / XL","price":6500,"available":true,"inventory_quantity":8},{"id":10205,"product_id":1003,"title":"Zwart / 2XL","price":7000,"available":true,"inventory_quantity":8},{"id":10206,"product_id":1003,"title":"Zwart / 3XL","price":6500,"available":false,"inventory_quantity":0},{"id":10300,"product_id":1004,"title":"Grijs melange / XS","price":6500,"available":true,"inventory_quantity":8},{"id":10301,"product_id":1004,"title":"Grijs melange / S","price":6500,"available":true,"inventory_quantity":8},{"id":10302,"product_id":1004,"title":"Grijs melange / M","price":6500,"available":true,"inventory_quantity":8},{"id":10303,"product_id":1004,"title":"Grijs melange / L","price":6500,"available":true,"inventory_quantity":8},{"id":10304,"product_id":1004,"title":"Grijs melange / XL","price":6500,"available":true,"inventory_quantity":8},{"id":10305,"product_id":1004,"title":"Grijs melange / 2XL","price":7000,"available":true,"inventory_quantity":8},{"id":10306,"product_id":1004,"title":"Grijs melange / 3XL","price":6500,"available":false,"inventory_quantity":0},{"id":10400,"product_id":1005,"title":"Zand / XS","price":6500,"available":true,"inventory_quantity":8},{"id":10401,"product_id":1005,"title":"Zand / S","price":6500,"available":true,"inventory_quantity":8},{"id":10402,"product_id":1005,"title":"Zand / M","price":6500,"available":true,"inventory_quantity":8},{"id":10403,"product_id":1005,"title":"Zand / L","price":6500,"available":true,"inventory_quantity":8},{"id":10404,"product_id":1005,"title":"Zand / XL","price":6500,"available":true,"inventory_quantity":8},{"id":10405,"product_id":1005,"title":"Zand / 2XL","price":7000,"available":true,"inventory_quantity":8},{"id":10406,"product_id":1005,"title":"Zand / 3XL","price":6500,"available":false,"inventory_quantity":0}],"words":{"tooMany":"Deze hoeveelheid is niet beschikbaar. Kies een andere maat of een lager aantal.","results":"{{ count }} resultaten voor “{{ terms }}”","searchEmpty":"GEEN RESULTATEN.","searchTryAgain":"Probeer een andere zoekterm of bekijk de collectie.","viewAll":"Bekijk de collectie","cartInDrawer":"JE WINKELWAGEN STAAT IN HET ZIJPANEEL.","cartInDrawerWhy":"Dit is een voorbeeld zonder server, dus deze pagina blijft leeg. Het zijpaneel toont wel wat je hebt gekozen.","cartOpen":"Open het zijpaneel"}};

/*
  Makes an exported copy of the website behave like the real one, without a server.

  The pages in a share folder are plain HTML files. Anything the preview server
  used to answer — the cart, sorting, searching, the forms — is answered here in
  the browser instead. The cart lives in this tab only and is forgotten when the
  tab closes. Nothing is ordered and nothing is sent anywhere.

  The data this file needs is written directly above it, as window.HP_SHARE.
*/
(() => {
  const share = window.HP_SHARE;
  if (!share) return;

  /* Where the top of this design sits, seen from the page you are on. */
  const root = document.documentElement.dataset.shareRoot || './';
  const at = (rest) => root + rest;

  const words = share.words;
  const variantById = (id) => share.variants.find((variant) => variant.id === Number(id));
  const productOf = (variant) => share.products.find((product) => product.id === variant.product_id);

  /* ---------- the cart, kept in this tab only ---------- */

  const storeKey = 'hp-share-cart:' + share.design;
  let lines = [];
  try { lines = JSON.parse(sessionStorage.getItem(storeKey)) || []; } catch { lines = []; }
  const remember = () => { try { sessionStorage.setItem(storeKey, JSON.stringify(lines)); } catch { /* private window */ } };

  function cart() {
    const items = lines.map(({ id, quantity }) => {
      const variant = variantById(id);
      const product = productOf(variant);
      return {
        id: variant.id,
        key: variant.id + ':preview',
        quantity,
        product_id: product.id,
        product_title: product.title,
        variant_title: variant.title,
        product: { title: product.title, has_only_default_variant: false },
        variant: { title: variant.title },
        url: at('products/' + product.handle + '/?variant=' + variant.id),
        image: at('assets/' + product.image),
        final_line_price: variant.price * quantity,
        price: variant.price,
        properties: {},
        url_to_remove: '#'
      };
    });
    return {
      items,
      item_count: items.reduce((total, item) => total + item.quantity, 0),
      total_price: items.reduce((total, item) => total + item.final_line_price, 0),
      currency: 'EUR',
      taxes_included: true,
      cart_level_discount_applications: []
    };
  }

  const answer = (body, status = 200) => new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });

  const realFetch = window.fetch.bind(window);
  window.fetch = async (input, options = {}) => {
    const address = String(typeof input === 'string' ? input : (input && input.url) || '');
    const route = address.replace(/^[a-z]+:\/\/[^/]+/i, '').split('?')[0];

    if (route.endsWith('/cart.js')) return answer(cart());

    if (route.endsWith('/cart/add.js')) {
      const body = options.body;
      const read = (key) => (body instanceof FormData ? body.get(key) : JSON.parse(String(body || '{}'))[key]);
      const id = Number(read('id'));
      const quantity = Number(read('quantity') || 1);
      const variant = variantById(id);
      const existing = lines.find((line) => line.id === id);
      const already = existing ? existing.quantity : 0;
      if (!variant || !variant.available || !Number.isInteger(quantity) || quantity < 1 || already + quantity > variant.inventory_quantity) {
        return answer({ description: words.tooMany }, 422);
      }
      if (existing) existing.quantity += quantity; else lines.push({ id, quantity });
      remember();
      return answer(cart().items.find((item) => item.id === id));
    }

    if (route.endsWith('/cart/change.js')) {
      const body = JSON.parse(String(options.body || '{}'));
      const id = Number(String(body.id).split(':')[0]);
      const quantity = Number(body.quantity);
      const variant = variantById(id);
      if (!variant || !Number.isInteger(quantity) || quantity < 0 || quantity > variant.inventory_quantity) {
        return answer({ description: words.tooMany }, 422);
      }
      lines = lines.map((line) => (line.id === id ? { ...line, quantity } : line)).filter((line) => line.quantity > 0);
      remember();
      return answer(cart());
    }

    return realFetch(input, options);
  };

  /* ---------- the forms and menus that used to need the server ---------- */

  const sortTarget = (value) => at('collections/all/' + (value === 'manual' ? '' : 'sort-' + value + '/'));

  document.addEventListener('change', (event) => {
    const select = event.target.closest('.sort-form select[name="sort_by"]');
    if (select) location.href = sortTarget(select.value);
  });

  document.addEventListener('submit', (event) => {
    if (event.defaultPrevented) return;
    const form = event.target;
    const action = form.getAttribute('action') || '';
    const submitter = event.submitter;

    if (submitter && submitter.name === 'checkout') {
      event.preventDefault();
      location.href = at('preview/checkout/');
      return;
    }
    if (form.classList.contains('sort-form')) {
      event.preventDefault();
      location.href = sortTarget(form.querySelector('select[name="sort_by"]').value);
      return;
    }
    if (form.getAttribute('role') === 'search' || form.classList.contains('page-search')) {
      event.preventDefault();
      const terms = String(new FormData(form).get('q') || '').trim();
      location.href = at('search/') + (terms ? '?q=' + encodeURIComponent(terms) : '');
      return;
    }
    if (/\/preview\/(newsletter|contact)$/.test(action)) {
      event.preventDefault();
      location.href = at('preview/form-result/');
      return;
    }
    if (/\/preview\/password$/.test(action)) {
      event.preventDefault();
      location.href = at('');
      return;
    }
    /* The cart page's own update button, and add-to-cart without JavaScript. */
    if (/\/cart(\/add)?$/.test(action)) event.preventDefault();
  });

  /* ---------- the search page ---------- */

  const searchPage = document.querySelector('.search-page');
  if (searchPage) {
    const grid = searchPage.querySelector('.catalogue-grid');
    const countLine = grid && grid.previousElementSibling;
    const terms = String(new URLSearchParams(location.search).get('q') || '').trim();
    const field = searchPage.querySelector('input[name="q"]');
    if (field) field.value = terms;

    if (grid && !terms) {
      grid.remove();
      if (countLine) countLine.remove();
    } else if (grid) {
      const needle = terms.toLowerCase();
      const kept = [...grid.children].filter((card) => {
        const match = card.textContent.toLowerCase().includes(needle);
        if (!match) card.remove();
        return match;
      });
      if (countLine) countLine.textContent = words.results.replace('{{ count }}', String(kept.length)).replace('{{ terms }}', terms);
      if (!kept.length) {
        grid.innerHTML = '<div class="empty-state"><h2>' + words.searchEmpty + '</h2><p>' + words.searchTryAgain + '</p><a class="text-link" href="' + at('collections/all/') + '">' + words.viewAll + '</a></div>';
      }
    }
  }

  /* ---------- the cart page ---------- */

  const cartPage = document.querySelector('.cart-page');
  if (cartPage && cart().item_count > 0) {
    const empty = cartPage.querySelector('.empty-state');
    if (empty) {
      empty.innerHTML = '<h2>' + words.cartInDrawer + '</h2><p>' + words.cartInDrawerWhy + '</p><button type="button" class="button button--dark" data-open-dialog="CartDialog">' + words.cartOpen + '</button>';
    }
  }

  /* ---------- the notice at the bottom ---------- */

  if (window.top === window.self) {
    const bar = document.createElement('aside');
    bar.className = 'hp-share-bar';
    bar.setAttribute('style', [
      'position:fixed', 'bottom:12px', 'left:12px', 'z-index:2147483000',
      'background:#161A18', 'color:#F1F2EA', 'border:1px solid #4a504a',
      'padding:8px 12px', 'max-width:280px', 'border-radius:2px',
      'font:11px/1.45 system-ui,-apple-system,Segoe UI,Arial,sans-serif',
      'letter-spacing:.02em'
    ].join(';'));
    const title = document.createElement('strong');
    title.setAttribute('style', 'color:#D5F26B;font-weight:700;letter-spacing:.08em');
    title.textContent = 'VOORBEELD · ' + share.name;
    const note = document.createElement('span');
    note.textContent = 'Conceptbeelden en testprijzen. Je kunt hier niets bestellen.';
    const back = document.createElement('a');
    back.href = at('../');
    back.setAttribute('style', 'color:#F1F2EA');
    back.textContent = 'Alle versies';
    const hide = document.createElement('button');
    hide.type = 'button';
    hide.setAttribute('style', 'all:unset;cursor:pointer;color:#B3B9AE;margin-left:8px');
    hide.textContent = 'Verberg';
    hide.addEventListener('click', () => bar.remove());
    bar.append(title, document.createElement('br'), note, document.createElement('br'), back, hide);
    document.body.append(bar);
  }
})();
