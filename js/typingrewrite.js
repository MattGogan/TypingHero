var charIndex = 0;
var wordIndex = 0;
var correctLetters, correctWords, timeTaken, currWordIndex, currWordArr, allWords, allLetters, allLetters1D, allWordSpans, letterSpans, chars, words, charspans;
var INITIAL_CHARS_LOADED_COUNT = 300;


const AVG_CHARS_PER_WORD_ENGLISH = 4.2;
var LETTER_COUNT_CURRENT_TEST = 0;
var WORD_COUNT_CURRENT_TEST = 0;
var AVG_LETTER_PER_WORD_CURRENT_TEST = 0;


window.onload = function(){
    console.log("typingrewrite.js loaded");
    initializeTest();
    initializeData();
    initializeKeys();
}

function initializeTest(){
    content = document.getElementById("txtTypeThis");
    inp = document.getElementById("txtInput");

    var teststring = getTestContent();
    chars = teststring.split("");
    words = teststring.split(" ");

    charspans = teststring.split("");
    for(i = 0; i<charspans.length; i++){
        charspans[i] = "<span id = '"+i+"'>" + charspans[i] + "</span>";
    }

    for(i = 0; i<INITIAL_CHARS_LOADED_COUNT; i++){
        content.innerHTML += charspans[i];
    }

    
    document.getElementById(0).classList.add("currLetter");
    console.log("Test Initialized");
}

function initializeKeys(){

    
    var ignorechars = ["Shift", "Control", "Meta", "Alt"];

    document.onkeydown = function(evt) {
        evt = evt || window.event;
        console.log("Expected " + chars[charIndex]);

        if(ignorechars.includes(evt.key)){
            //do nothing
        }else if(evt.key == "Backspace"){
            backspaceEvent();
        }else if(evt.key == " "){
            spaceEvent();
        }else{
            inp.innerHTML += evt.key;
            if(evt.key == chars[charIndex]){
                colorCorrect();
            }else{
                colorIncorrect();
            }
            charIndex++;
            colorCurr();
        }
    };

    console.log("Keys initialized");
}

function backspaceEvent(){


    //TODO //when backspacing, find the incorrect letters from their word and insert # for them.  

    if(inp.innerHTML.length>0){
        inp.innerHTML = inp.innerHTML.substring(0, inp.innerHTML.length-1);
        removeAllColor();
        charIndex --;
        removeAllColor();
        colorCurr();
    }else{
        wordIndex--;
        removeAllColor();
        charIndex--;
        inp.innerHTML = words[wordIndex];
    }
}


function spaceEvent(){
    //Check if letters missed, then jump ahead and mark all as wrong.
    //up next: handle pressing space early to jump to next word.  Don't just charindex++, use charIndex = array.indexOf(" ", charIndex) and declor / incorrect color
    
    inp.innerHTML = "";
    wordIndex++;
    charIndex++;
    colorCurr();
}




function colorCurr(){
    document.getElementById(charIndex).classList.add("currLetter");
}

function colorCorrect(){
    document.getElementById(charIndex).classList.remove("currLetter");
    document.getElementById(charIndex).classList.add("correctLetter");
}

function colorIncorrect(){
    document.getElementById(charIndex).classList.remove("currLetter");
    document.getElementById(charIndex).classList.add("incorrectLetter");
}

function removeAllColor(){
    document.getElementById(charIndex).classList.remove("currLetter");
    document.getElementById(charIndex).classList.remove("correctLetter");
    document.getElementById(charIndex).classList.remove("incorrectLetter");
}















function initializeData(rawstring){
    LETTER_COUNT_CURRENT_TEST = chars.length;
    WORD_COUNT_CURRENT_TEST = words.length;
    AVG_LETTER_PER_WORD_CURRENT_TEST = LETTER_COUNT_CURRENT_TEST / WORD_COUNT_CURRENT_TEST;

    //console.log("Total letters: " + LETTER_COUNT_CURRENT_TEST);
    //console.log("Total words: " + WORD_COUNT_CURRENT_TEST);
    //console.log("Average Word Length: " + AVG_LETTER_PER_WORD_CURRENT_TEST);

    console.log("Data initialized");
}


function getTestContent(){
    return "Hi it's Vince from shamwow, you'll be saying wow every time. It's like a shammy, it's like a towel, it's like a sponge. A regular towel doesn't work wet, this works wet or dry. This is for the house The Car The Boat The RV Shamwow holds 12 times it's weight in liquid, look at this, it just does the work. Why do you want to work twice as hard? It doesn't drip, doesn't make a mess, wring it out. You wash it in the washing machine. Made in Germany, you know the Germans always make good stuff. Here's some cola, wine, coffee, cola, pet stains. Not only is your damage going to be on top, there's your mildew. That is gonna smell, see that. Now we're gonna do this in real time, look at this, put it on the spill, turn it over without putting any pressure, 50% of the cola...right there you following me camera guy? The other 50% the color starts to come up no other towels' gonna do that. It acts like a vacuum, and look at this virtually dry on the bottom. See what I’m telling ya Shamwow you'll be saying wow every time. I can't live without it, I just love it! Oh my gosh I don't even buy paper towels anymore. If you're gonna wash your cars or any other vehicle, you'll be out of your mind not to own one of these. All I can say is SHAM! WOW! You're gonna spend twenty dollars every month on paper towels anyway you're throwin away your money. The mini shamwows are for everything, for everyday use. This last ten years, this last a week, I don't know it sells itself. The shamwow sells for 19.95 you get one for the house, one for the car, two for the kitchen and bathroom. But if you call now, within the next twenty minutes cause we can't do this all day, we'll give you a second set absolutely free. So that's 8 shamwows for 19.95. It comes with a ten year warranty, here's how to order.";
}
