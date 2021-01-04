var charIndex = 0;
var wordIndex = 0;
var correctLetters, correctWords, timeTaken, currWordIndex, currWordArr, allWords, allLetters, allLetters1D, allWordSpans, chars, words, charspans;
var INITIAL_CHARS_LOADED_COUNT = 300;

var testrunning = false;
var testTime = 12;
var testTimeRemaining = testTime;

const AVG_CHARS_PER_WORD_ENGLISH = 4.2;
var LETTER_COUNT_CURRENT_TEST = 0;
var WORD_COUNT_CURRENT_TEST = 0;
var AVG_LETTER_PER_WORD_CURRENT_TEST = 0;
var topOfTextboxOffset;


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

    topOfTextboxOffset = document.getElementById("0").offsetHeight;
    document.getElementById(0).classList.add("currLetter");
    scrollTestContent();
    console.log("Test Initialized");
}

function initializeKeys(){

    
    var ignorechars = ["Shift", "Control", "Meta", "Alt"];

    document.onkeydown = function(evt) {
        
        if(!testrunning){
            startTest();
        }
        evt = evt || window.event;
        var expectedKey = chars[charIndex];
        console.log("Expected " + expectedKey);

        if(ignorechars.includes(evt.key)){
            //do nothing
        }else if(evt.key == "Backspace"){
            backspaceEvent();
            scrollTestContent()
        }else if(evt.key == " "){
            spaceEvent();
            scrollTestContent()
        }else{
            if(expectedKey != " "){
                inp.innerHTML += evt.key;
                if(evt.key == chars[charIndex]){
                    colorCorrect();
                }else{
                    colorIncorrect();
                }
                charIndex++;
                colorCurr();
            }
        }
    };

    console.log("Keys initialized");
}

function startTest(){
    testrunning = true;
    var btnTimer = document.getElementById("btnTimer");
    btnTimer.innerHTML = testTime;

    var interval = setInterval(function(){ 
        btnTimer.innerHTML = testTimeRemaining;
        testTimeRemaining--;
        if(testTimeRemaining == -1){
            endTest();
            clearInterval(interval);
        }
     }, 1000);
}

function resetTest(){
    resetVariables();
    initializeTest();
    initializeData();
    initializeKeys();
}

function resetVariables(){
    wordIndex = 0;
    charIndex = 0;
    testrunning = false;
    testTimeRemaining = testTime;
    document.getElementById("txtInput").innerHTML = "";
    document.getElementById("txtTypeThis").innerHTML = "";
}

function endTest(){
    freezeInputs();
    calculateResults();
}


function freezeInputs(){
    document.onkeydown = "";
}


function calculateResults(){
    console.log("Results Hypothetically Calculated")
}


function backspaceEvent(){
    if(inp.innerHTML.length>1){
        inp.innerHTML = inp.innerHTML.substring(0, inp.innerHTML.length-1);
        removeAllColor();
        charIndex --;
        removeAllColor();
        colorCurr();
    }else{ //Roll back the word.
        if(charIndex>0){
        wordIndex--;
        removeAllColor();
        charIndex--;
        inp.innerHTML = getPrevWord();
        }
    }
}

function getPrevWord(){
    var returnThis = "";
    var lastCharIndexCurrWord = charIndex-1;
    var firstCharIndexCurrWord = indexOfSpaceBefore(lastCharIndexCurrWord);

    for(var i = firstCharIndexCurrWord; i<=lastCharIndexCurrWord; i++){
        if(document.getElementById(i).classList.contains("incorrectLetter")){
            returnThis += "#";
        }else{
            returnThis += chars[i];
        }
    }
    return returnThis;
}

function indexOfSpaceBefore(index){
    while(index > 0){
        if(chars[index] == " "){
            return index;
        }
        index--;
    }
    console.log("No index found. Returning 0");
    return 0;
}

function spaceEvent(){
    //Check if letters missed, then jump ahead and mark all as wrong.
    //up next: handle pressing space early to jump to next word.  Don't just charindex++, use charIndex = array.indexOf(" ", charIndex) and declor / incorrect color
    
    inp.innerHTML = "";
    wordIndex++;
    var oldIndex = charIndex;
    charIndex = chars.indexOf(" ", charIndex)+1;

    if(charIndex-oldIndex > 1){
        colorIncorrectRange(oldIndex, charIndex);
    }

    colorCurr();
}


function colorIncorrectRange(i1, i2){
    for(var i = i1; i < i2; i++){
        document.getElementById(i).classList.remove("currLetter");
        document.getElementById(i).classList.add("incorrectLetter");
    }
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




function scrollTestContent(){
    var testContent = document.getElementById("txtTypeThis");
    
    if(testContent.classList.contains("testcontenthorizontal")){
        location.scrollTo(document.getElementById(charIndex));
        console.log("Scrolling horizontally...");

    }else if(testContent.classList.contains("testcontent")){
        var nextCharSpan = document.getElementById(charIndex);
        txtTypeThis.scrollTop = nextCharSpan.offsetTop-20;
    }
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
