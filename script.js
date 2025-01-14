const NUMBER_OF_CARDS = 8;
let already_clicked = 0;

// Va rog nu furati
const api_key = '$2a$10$Fn36t5w6bnwEPnl9RlwHFeQBvrcpBvxyH6kn5mjzEMFukmSAacCdy';
const bin_id = '6786b789acd3cb34a8cbaf7d';
const url = `https://api.jsonbin.io/v3/b/${bin_id}`;

function getData(usr, pwd) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('X-Master-Key', api_key);

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const data = JSON.parse(xhr.responseText).record;
                
                for (let key in data) {
                    if (key == usr && data[key]['pass'] == pwd) {
                        let game_wrapper = document.querySelector('.game-wrapper');
                        game_wrapper.style.visibility = 'visible';

                        let ps = Array.from(document.querySelectorAll('#extra'));
                        let inp_usr = document.querySelector('#usr');
                        let inp_pwd = document.querySelector('#pwd');
                        let btn_login = document.querySelector('#login');

                        let parent = document.body;

                        parent.removeChild(ps[0]);
                        parent.removeChild(ps[1]);
                        parent.removeChild(inp_usr);
                        parent.removeChild(inp_pwd);
                        parent.removeChild(btn_login);

                        break;
                    }
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        } else {
            console.error('Failed to retrieve data:', xhr.status, xhr.statusText);
        }
    };

    xhr.onerror = function () {
        console.error('Network error occurred.');
    };

    xhr.send();
}

function getUsers() {
    let usr = document.getElementById('usr').value;
    let pwd = document.getElementById('pwd').value;

    getData(usr, pwd);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function check(discovered_cards, display_discovered) {
    await sleep(500);

    const len = discovered_cards.length;

    if (discovered_cards[len - 1] != discovered_cards[len - 2]) {
        discovered_cards.pop();
        discovered_cards.pop();


        display_discovered.pop().querySelector('.card-inner').classList.remove('flipped');
        display_discovered.pop().querySelector('.card-inner').classList.remove('flipped');
    }

    already_clicked = 0;
    await sleep(500);

    if (discovered_cards.length == NUMBER_OF_CARDS) {
        alert("Game won!");
    }
}

window.addEventListener('load', function() {
    // Login session

    let game_wrapper = this.document.querySelector('.game-wrapper');
    game_wrapper.style.visibility = 'hidden';

    // Wait for login...

    // Game session

    let cards = ['😁', '❤️', '🐽', '🩼', '🐽', '😁', '🩼', '❤️'];
    cards.sort(() => Math.random() - 0.5);

    const display_cards = Array.from(this.document.querySelectorAll('.card'));

    let discovered_cards = [];
    let display_discovered = [];

    for (let i = 0; i < NUMBER_OF_CARDS; i++) {
        let card = display_cards[i];

        card.addEventListener('click', () => {
            const value = cards[i];

            card.querySelector('.card-back').textContent = value;
            const cardInner = card.querySelector('.card-inner');
    
            if (!cardInner.classList.contains('flipped')) {
                already_clicked++;

                if (already_clicked <= 2) {
                    cardInner.classList.add('flipped');

                    discovered_cards.push(value);
                    display_discovered.push(card);

                    if (already_clicked == 2) {
                        check(discovered_cards, display_discovered);
                    }
                }
            }
        });
    }
});