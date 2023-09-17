const note1 = 'You are the perfect person to go to the beach with. You are always down to go in the water and have fun which is a quality that I love so much about you. I had so much fun swimming with you and eating yummy food afterwards this summer, and I am so excited to do it all over again next summer.'.split(' ');
const note2 = 'You have a small freckle to the right of your right eye that I think is really cute. I also like your bangs a lot I think they frame your face really well even though you swear I say otherwise.'.split(' ');
const note3 = 'Thank you for taking so many pictures of us when we are hanging out because I look at our shared album a lot at school. Especially with so many couples walking around campus I like being able to look back at all the fun times we have together.'.split(' ');
const note4 = 'I think it\'s really cute how much you like dogs. It shows that you\'re a very compassionate person and I love seeing you get super excited each time we see one whenever we\'re hanging out together. I hope we can take care of a funny dog togehter when we\'re older.'.split(' ');
const note5 = 'My favorite date from this summer was probably our picnic date. The sushi I brought was terrible but it was still super peaceful being with you and eating yummy food.'.split(' ');
const note6 = 'It\'s really cute that you started playing pokemon for me even though you didn\'t finish the game. It meant a lot to me that you went out of your way to explore some of my interests.'.split(' ');
const note7 = 'Thank you for being so loyal and kind to me for 4 years. I see a lot of people always worrying about finding a partner or worrying about their partner not liking them anymore etc., but you make me feel very safe and secure.'.split(' ');
const note8 = 'Calling you is super nice because I love hearing your voice and especially when I\'m having a rough day at school talking to you grounds me. You\'re always the first person I call whenever I feel like I did either really well or really poorly on a test.'.split(' ');
const note9 = 'Our tennis and basketball day this summer was super random but super fun. You were really good at freethrow shooting, I had so much fun that day.'.split(' ');
const note10 = 'I\'m typing all of these on September 15th and you just sent me a video of you getting ready to go to a party and you look so beautiful. I love seeing your awesome outfits and makeup you have such a great sense of style'.split(' ');
const note11 = 'It\'s comforting spending time with you. I notice I get a lot more tired when I\'m with you and I think that I just feel very calm and safe around you because you are so caring and loving that it takes away a lot of my stress.'.split(' ');
const note12 = 'Your unique songs that you perform for me almost every call are always very cute and funny. You somehow manage to create a new chorus and rhythm everytime and it\'s something I always look forward to on facetime.'.split(' ');
const note13 = 'I\'m super proud to be your partner. You are so hardworking and dedicated to your schoolwork and SAO and it\'s something I really admire about you. You have an insane work ethic and I believe that will carry you very far in life.'.split(' ');
const note14 = 'Long distance is really hard but you\'ve been so patient with me and I know that we can push through two more years. I can\'t wait until after college when I won\'t have to worry about watching you leave anymore.'.split(' ');
const note15 = 'I really like walking to Whole Foods with you later in the day. It feels like we\'re an old couple to me for some reason, and it\'s always fun to pick out a little treat at the end too. I love you.'.split(' ');


const allnotes = [note1, note2, note3, note4, note5, note6, note7, note8, note9, note10, note11, note12, note13, note14, note15];
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
