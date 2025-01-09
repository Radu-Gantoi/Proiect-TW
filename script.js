const NUMBER_OF_CARDS = 8;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function check(discovered_cards, display_discovered) {
    await sleep(1000);

    const len = discovered_cards.length;

    if (len % 2 == 0 && discovered_cards[len - 1] != discovered_cards[len - 2]) {
        discovered_cards.pop();
        discovered_cards.pop();


        display_discovered.pop().querySelector('.card-inner').classList.remove('flipped');
        display_discovered.pop().querySelector('.card-inner').classList.remove('flipped');
    }

    // Poate nu
    await sleep(2000);
}

window.addEventListener('load', function() {
    let cards = ['😁', '❤️', '🐽', '🩼', '🐽', '😁', '🩼', '❤️'];
    cards.sort(() => Math.random() - 0.5);

    const display_cards = Array.from(this.document.querySelectorAll('.card'));

    let discovered_cards = [];
    let display_discovered = [];

    for (let i = 0; i < NUMBER_OF_CARDS; i++) {
        let card = display_cards[i];

        card.addEventListener('click', () => {
            const value = cards[i];

            discovered_cards.push(value);
            display_discovered.push(card);

            card.querySelector('.card-back').textContent = value;
            const cardInner = card.querySelector('.card-inner');
    
            if (!cardInner.classList.contains('flipped')) {
                cardInner.classList.add('flipped');
            }

            check(discovered_cards, display_discovered);
        });
    }
});