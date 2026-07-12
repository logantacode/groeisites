<script>
(function () {
    const cardSelector = '.portfolio-post-article';
    const linkSelector = '.post-title a[href], .image-overlay a[href], a[href]';

    function getCard(target) {
        if (!(target instanceof Element)) {
            return null;
        }

        return target.closest(cardSelector);
    }

    function getCardLink(card) {
        return card.querySelector(linkSelector);
    }

    function prepareCards() {
        const cards = document.querySelectorAll(cardSelector);

        cards.forEach(function (card) {
            const link = getCardLink(card);

            if (!link) {
                return;
            }

            if (card.dataset.coClickablePortfolio === 'true') {
                return;
            }

            card.dataset.coClickablePortfolio = 'true';
            card.classList.add('co-clickable-portfolio-card');
            card.setAttribute('role', 'link');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', link.getAttribute('title') || link.textContent.trim());
        });
    }

    function openCardLink(link, event) {
        if (event.ctrlKey || event.metaKey || event.button === 1) {
            window.open(link.href, '_blank');
            return;
        }

        window.location.href = link.href;
    }

    document.addEventListener('click', function (event) {
        const target = event.target;
        const card = getCard(target);

        if (!card) {
            return;
        }

        if (target.closest('a, button, input, textarea, select, label')) {
            return;
        }

        const link = getCardLink(card);

        if (!link) {
            return;
        }

        openCardLink(link, event);
    });

    document.addEventListener('auxclick', function (event) {
        if (event.button !== 1) {
            return;
        }

        const card = getCard(event.target);

        if (!card) {
            return;
        }

        const link = getCardLink(card);

        if (!link) {
            return;
        }

        openCardLink(link, event);
    });

    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Enter') {
            return;
        }

        const card = getCard(event.target);

        if (!card) {
            return;
        }

        const link = getCardLink(card);

        if (!link) {
            return;
        }

        window.location.href = link.href;
    });

    prepareCards();

    const observer = new MutationObserver(prepareCards);

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
</script>
