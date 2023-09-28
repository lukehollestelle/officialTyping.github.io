const note1 = 'Here is the first note that I am writing. These notes will all be in randomized order.'.split(' ');
const note2 = 'This is the second note, hopefully you think my project is cool!'.split(' ');
const note3 = 'I am going into my third year at UCSD at the time of writing this program.'.split(' ');


const allnotes = [note1, note2, note3;
const wordsCount = words.length;
const gameTime = 30 * 1000;
window.timer = null;
window.gameStart = null;


function addClass(el, name){
    el.className += ' ' + name;
}
function removeClass(el, name){
    el.className = el.className.replace(name, '');
}

function randomNote(){
    const randomIndex = Math.ceil(Math.random() * allnotes.length);
    let myNote = allnotes[randomIndex - 1];
    let formattedNote = '';
    for (let i = 0; i < myNote.length; i++) {
        formattedNote += formatWord(myNote[i]);
    }
    return formattedNote;
}

function randomWord(){
    const randomIndex = Math.ceil(Math.random() * wordsCount);
    return words[randomIndex - 1];
}

function formatWord(word){
    return  `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}

function newGame() {
    document.getElementById('words').innerHTML = '';
    document.getElementById('game').className = '';
    window.timer = null;
    window.gameStart = null;
    for (let i = 0; i < 10; i++) {
        document.getElementById('words').innerHTML += randomNote();
    }
    addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.letter'), 'current');
    document.getElementById('info').innerHTML = (gameTime / 1000) + '';
    window.timer = null;

    let nextLetter = document.querySelector('.letter.current');
    let cursor = document.getElementById('cursor');
    if(nextLetter.getBoundingClientRect().top < 200) {
        const words = document.getElementById('words');
        const margin = parseInt(game.style.marginTop || '0px');
        words.style.marginTop = (margin) + 'px';
    }
    cursor.style.top = nextLetter.getBoundingClientRect().top + 2 + 'px';
    cursor.style.left = nextLetter.getBoundingClientRect().left + 'px';
}

function getWpm() {
    const words = [...document.querySelectorAll('.word')];
    const lastTypedWord = document.querySelector('.word.current');
    const lastTypedWordIndex = words.indexOf(lastTypedWord);
    const typedWords = words.slice(0,lastTypedWordIndex);
    const correctWords = typedWords.filter(word => {
        const letters = [...word.children];
        const correctLetters = letters.filter(letter => letter.className.includes('correct'));
        const incorrectLetters = letters.filter(letter => letter.className.includes('incorrect'));
        return incorrectLetters.length === 0 && correctLetters.length === letters.length 
    }); 
    return (correctWords.length / gameTime) * 60000;
}

function gameOver(){
    clearInterval(window.timer);
    addClass(document.getElementById('game'), 'over');
    const result = getWpm();
    document.getElementById('info').innerHTML = `WPM: ${result}`;
}

document.getElementById('game').addEventListener('keydown', ev =>{
    const key = ev.key;
    const currentWord = document.querySelector('.word.current');
    const currentLetter = document.querySelector('.letter.current');
    const expected = currentLetter?.innerHTML || ' ';
    const isLetter = key.length === 1 && key !== ' ';
    const isSpace = key === ' ';
    const isBackspace = key === 'Backspace';
    const isFirstLetter = currentLetter === currentWord.firstChild;


    if (document.querySelector('#game.over')) {
        return;
    }

    if (!window.timer && isLetter) {
        window.timer = setInterval(() => {
            if (!window.gameStart) {
                window.gameStart = (new Date()).getTime();
            }
            const currentTime = (new Date()).getTime();
            const msPassed = currentTime - window.gameStart;
            const sPassed = Math.round(msPassed / 1000);
            const sLeft = (gameTime / 1000) - sPassed - 1;
            if (sLeft <= 0) {
                gameOver();
                return;
            }
            document.getElementById('info').innerHTML = sLeft + '';
        }, 1000);
    }

    if (isLetter) {
        if (currentLetter){
            addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
            removeClass(currentLetter, 'current');
            if (currentLetter.nextSibling) {
                addClass(currentLetter.nextSibling, 'current');
            }
        } else{
            const incorrectLetter = document.createElement('span');
            incorrectLetter.innerHTML = key;
            incorrectLetter.className = 'letter incorrect extra';
            currentWord.appendChild(incorrectLetter);
        }
    }

    if (isSpace) {
        if (expected !== ' ') {
            const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
            lettersToInvalidate.forEach(letter => {
                addClass(letter, 'incorrect');
            });
        }
        removeClass(currentWord, 'current');
        addClass(currentWord.nextSibling, 'current');
        if (currentLetter) {
            removeClass(currentLetter, 'current');
        }
        addClass(currentWord.nextSibling.firstChild, 'current');
    }

    if (isBackspace){ //FIX BACKSPACE
        
        if (!currentLetter && currentWord.lastChild.className.includes('extra')){
            currentWord.removeChild(currentWord.lastChild); 
        } 
        else if (currentLetter && isFirstLetter) { // here |is my name
            //make previous word current, last letter current
            removeClass(currentWord, 'current');
            addClass(currentWord.previousSibling, 'current');
            removeClass(currentLetter, 'current');
            addClass(currentWord.previousSibling.lastChild, 'current');
            removeClass(currentWord.previousSibling.lastChild, 'incorrect');
            removeClass(currentWord.previousSibling.lastChild, 'correct');
            const extraLetter = document.querySelector('.letter.extra.current');
            if (extraLetter){
                currentWord.previousSibling.removeChild(extraLetter);
            }
        }
        else if (currentLetter && !isFirstLetter){ // he|re is my name
            removeClass(currentLetter, 'current');
            addClass(currentLetter.previousSibling, 'current');
            const extraLetter = document.querySelector('.letter.incorrect.extra.current');
            if (extraLetter){
                currentWord.removeChild(extraLetter);
            }else{
            removeClass(currentLetter.previousSibling, 'incorrect');
            removeClass(currentLetter.previousSibling, 'correct');
            }
        }
        else if (!currentLetter) { // here| is my name
            addClass(currentWord.lastChild, 'current');
            removeClass(currentWord.lastChild, 'incorrect');
            removeClass(currentWord.lastChild, 'correct');
        }
    }

    //move lines
    if(currentWord.getBoundingClientRect().top > 270) {
        const words = document.getElementById('words');
        const margin = parseInt(words.style.marginTop || '0px');
        words.style.marginTop = (margin - 35) + 'px';
    }

    // move cursor
    nextLetter = document.querySelector('.letter.current');
    cursor = document.getElementById('cursor');
    const nextWord = document.querySelector('.word.current');
    if (nextLetter) {
        cursor.style.top = nextLetter.getBoundingClientRect().top + 2 + 'px';
        cursor.style.left = nextLetter.getBoundingClientRect().left + 'px';
    } else{
        cursor.style.top = nextWord.getBoundingClientRect().top + 5 + 'px';
        cursor.style.left = nextWord.getBoundingClientRect().right + 'px';
    }
})

document.getElementById('newGameButton').addEventListener('click', () => {
    gameOver();
    newGame();
  });

newGame();
