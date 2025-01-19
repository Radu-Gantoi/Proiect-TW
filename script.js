const NUMBER_OF_CARDS = 8;
let already_clicked = 0;
let total_flips = 0;

// Continut JSON
let data;
let user;
let password;

// Va rog nu furati
const api_key = '$2a$10$Fn36t5w6bnwEPnl9RlwHFeQBvrcpBvxyH6kn5mjzEMFukmSAacCdy';
const bin_id = '6786b789acd3cb34a8cbaf7d';
const url = `https://api.jsonbin.io/v3/b/${bin_id}`;

function updateCounter() {
    document.getElementById('current_flips').innerHTML = `Total flips so far: ${total_flips}`;
}

function startGame() {
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

    document.getElementById('highscore').innerHTML = `Highscore for ${user}: ${data[user]['score']}`;
    updateCounter();
}

function getData(usr, pwd) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('X-Master-Key', api_key);

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                data = JSON.parse(xhr.responseText).record;

                let can_add_curr_usr = true;
                
                for (let key in data) {
                    if (key == usr) {
                        can_add_curr_usr = false;

                        if (data[key]['pass'] == pwd) {
                            user = usr;
                            startGame();
                            break;
                        }
                        else {
                            alert(`Parola pentru userul ${usr} este gresita!`);
                        }
                    }
                }

                if (can_add_curr_usr) {
                    data[usr] = { 'pass': pwd, 'score': Infinity.toString() };
                    user = usr;
                    startGame();
                }

            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        }
        else {
            console.error('Failed to retrieve data:', xhr.status, xhr.statusText);
        }
    };

    xhr.onerror = function () {
        console.error('Network error occurred.');
    };

    xhr.send();
}

function updateData(new_data) {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-Master-Key', api_key);

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log('Data updated successfully:', xhr.responseText);
        }
        else {
            console.error('Failed to update data:', xhr.status, xhr.statusText);
        }
    };

    xhr.onerror = function () {
        console.error('Network error occurred.');
    };

    xhr.send(JSON.stringify(new_data));
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

        if (!isFinite(parseInt(data[user]['score'])) || parseInt(data[user]['score']) > total_flips) {
            data[user]['score'] = total_flips.toString();
            updateData(data);
        }
    }
}

window.addEventListener('load', function() {
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

                    total_flips++;
                    updateCounter();

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