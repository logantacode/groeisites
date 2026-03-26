/* ZET PUNT VOOR DUIZENDTALLEN EN KOMMA VOOR DECIMALEN */

<script>
(function () {

  const SELECTORS = [
    '.product-item-price a',
    '.product-item-price',
    '.scratched',
    '.current-price',
    '.old-price'
  ];

  const nf = new Intl.NumberFormat('nl-BE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  function isAlreadyNlBe(text) {
    // FIX: Accepteert nu formaten met én zonder duizendtal-scheider (bijv. "1.234,56" en "1234,56").
    // Voorkomt de oneindige loop die de browser liet crashen.
    return /(?:^|[^\d])(?:\d{1,3}(?:[.\s\u00A0\u202F]\d{3})*|\d+),\d{2}(?!\d)/.test(text);
  }

  function toNumber(raw) {
    if (!raw) return null;

    let s = raw.replace(/\u00A0/g, ' ').replace(/\s+/g, '');

    const lastDot = s.lastIndexOf('.');
    const lastComma = s.lastIndexOf(',');
    const decPos = Math.max(lastDot, lastComma);

    const hasDot = lastDot > -1;
    const hasComma = lastComma > -1;

    if (!hasDot && !hasComma) {
      const v = Number(s.replace(/[^\d-]/g, ''));
      return Number.isFinite(v) ? v : null;
    }

    const digitsAfter = decPos > -1 ? (s.length - decPos - 1) : 0;

    if ((hasDot ^ hasComma) && digitsAfter === 3) {
      s = s.replace(/[.,]/g, '');
      const v = Number(s);
      return Number.isFinite(v) ? v : null;
    }

    if (decPos > -1) {
      const intPart = s.slice(0, decPos).replace(/[.,]/g, '');
      const decPart = s.slice(decPos + 1).replace(/[.,]/g, '');

      if (decPart.length !== 2) {
        const v = Number((intPart + decPart).replace(/[^\d-]/g, ''));
        return Number.isFinite(v) ? v : null;
      }

      const v = Number(intPart + '.' + decPart);
      return Number.isFinite(v) ? v : null;
    }

    return null;
  }

  function formatMoneyInText(text) {
    if (!text) return null;
    if (isAlreadyNlBe(text)) return null;

    const re = /(€\s*)?(\d[\d\s.,]*\d)(\s*(€|EUR))?/i;
    const m = text.match(re);
    if (!m) return null;

    const v = toNumber(m[2]);
    if (v === null) return null;

    const formattedNumber = nf.format(v).replace(/[\s\u00A0\u202F]/g, '.');

    return text.replace(re, formattedNumber + ' €');
  }

  function apply(el) {
    if (el.tagName === 'INPUT') {
      const out = formatMoneyInText(el.value || '');
      if (out && out !== el.value) el.value = out;
      return;
    }

    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    let node;

    while ((node = w.nextNode())) {
      if (!/\d/.test(node.nodeValue)) continue;

      const out = formatMoneyInText(node.nodeValue);
      if (out && out !== node.nodeValue) node.nodeValue = out;
    }
  }

  function run(scope) {
    (scope || document).querySelectorAll(SELECTORS.join(',')).forEach(apply);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => run(document));
  } else {
    run(document);
  }

  let scheduled = false;
  const obs = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      run(document);
    });
  });

  obs.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['value']
  });

})();
</script>
