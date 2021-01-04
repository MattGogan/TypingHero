const AVG_CHARS_PER_WORD_ENGLISH = 4.2;
var LETTER_COUNT_CURRENT_TEST = 0;
var WORD_COUNT_CURRENT_TEST = 0;
var AVG_LETTER_PER_WORD_CURRENT_TEST = 0;

var testStarted = false;

var shamwowtranscript = "Hi it's Vince from shamwow, you'll be saying wow every time. It's like a shammy, it's like a towel, it's like a sponge. A regular towel doesn't work wet, this works wet or dry. This is for the house The Car The Boat The RV Shamwow holds 12 times it's weight in liquid, look at this, it just does the work. Why do you want to work twice as hard? It doesn't drip, doesn't make a mess, wring it out. You wash it in the washing machine. Made in Germany, you know the Germans always make good stuff. Here's some cola, wine, coffee, cola, pet stains. Not only is your damage going to be on top, there's your mildew. That is gonna smell, see that. Now we're gonna do this in real time, look at this, put it on the spill, turn it over without putting any pressure, 50% of the cola...right there you following me camera guy? The other 50% the color starts to come up no other towels' gonna do that. It acts like a vacuum, and look at this virtually dry on the bottom. See what I’m telling ya Shamwow you'll be saying wow every time. I can't live without it, I just love it! Oh my gosh I don't even buy paper towels anymore. If you're gonna wash your cars or any other vehicle, you'll be out of your mind not to own one of these. All I can say is SHAM! WOW! You're gonna spend twenty dollars every month on paper towels anyway you're throwin away your money. The mini shamwows are for everything, for everyday use. This last ten years, this last a week, I don't know it sells itself. The shamwow sells for 19.95 you get one for the house, one for the car, two for the kitchen and bathroom. But if you call now, within the next twenty minutes cause we can't do this all day, we'll give you a second set absolutely free. So that's 8 shamwows for 19.95. It comes with a ten year warranty, here's how to order.";
var twoLetterWords = "MI OH AN IS OK AT LO AL AM SO LA EM DA PO NU TI BY EL OE WE ED FA AY NO UT ZA DO QI XU TA EN SI AS BA AB WO KI AE IT AD KA HI OS DE UH ME ON GI MU OR EW IN HM AW EF XI OI ID AA YO AH MO SH MY NA LI US OD OP OF PA HO YE GO MM ES UM EH UP AR TE MA HE HA TO OW BI PI EX RE OM JO UN IF AG FE AX PE YA BO ET NE BE OX OY AI ER";
var twoLetterWordsSorted = "AA AB AD AE AG AH AI AL AM AN AR AS AT AW AX AY BA BE BI BO BY DA DE DO ED EF EH EL EM EN ER ES ET EW EX FA FE GI GO HA HE HI HM HO ID IF IN IS IT JO KA KI LA LI LO MA ME MI MM MO MU MY NA NE NO NU OD OE OF OH OI OK OM ON OP OR OS OW OX OY PA PE PI PO QI RE SH SI SO TA TE TI TO UH UM UN UP US UT WE WO XI XU YA YE YO ZA";
var potentialContent = [shamwowtranscript, twoLetterWords, twoLetterWordsSorted];
var correctLetters, correctWords, timeTaken, currWordIndex, currWordArr, allWords, allLetters, allLetters1D, allWordSpans, letterSpans;
var txtTypeThis, txtInput;
var expectedLetter, currLetterSpan, expectingLetterSpan;
var prevI = 0;
var scrollIncrement = 6;
var topOfTextboxOffset;
var timeLastInputReceived;
var timeBetweenKeystrokes = [];



/*
    To Do:

        Bug Fixes:
            Backspaces remove the time since last letter inputted 
            Won't receive letters other than space or save their data if word length exceeds current word length
                Will this fix the lighting up next word first letter bug?

        Calculate words typed and words incorrect
        
        Create options dropdown:
            No capital letters
            No punctuation
            Test Time Limit
            MW2 Hitmaker Sound Effect on Keypress / word completed

        CSS The Results Screen

*/


window.onload = function(){
    console.log("Javascript Loaded");
    initializeTest();
}


// Structure:
// allLetters is an array of arrays which tracks allLetters[word][letters]
// letterSpans is an array which has each letter formatted as <span id = "word.letter"></span>
//      letterSpans id = wordIndex.letterIndex
// allLetters1D is an array which has all letters and spaces in a single row

function initializeTest(){
    txtTypeThis = document.getElementById("txtTypeThis");
    txtInput = document.getElementById("txtInput");

    txtTypeThis.value = potentialContent[0];
    allWords = txtTypeThis.value.split(" ");
    allLetters = [];

    for(var i = 0; i<allWords.length; i++){  //allLetters is an array of arrays.  Subarrays are letters that form words. 
        allLetters.push(allWords[i].split(''));
    }
    console.log("ALL LETTERS:");
    console.log(allLetters);
    
    letterSpans = [];
    allLetters1D = [];
    WORD_COUNT_CURRENT_TEST = allLetters.length;

    console.log("Text loaded with word count: " + WORD_COUNT_CURRENT_TEST);

    for(var i = 0; i<allLetters.length; i++){
        for(var j = 0; j<allLetters[i].length; j++){
            LETTER_COUNT_CURRENT_TEST++;
            letterSpans.push('<span class = "w3-animate-opacity" id = "' + i + "." + j + '">' + allLetters[i][j] + '</span>');
            allLetters1D.push(allLetters[i][j]);
            txtTypeThis.innerHTML+=letterSpans[letterSpans.length-1];
        }
        allLetters1D.push(" ");
        letterSpans.push('<span id = "space"> </span>');
        txtTypeThis.innerHTML+=letterSpans[letterSpans.length-1];
    }

    console.log("allLetters1D: ");
    console.log(allLetters1D);

    console.log("Letters broken up with total count: " + LETTER_COUNT_CURRENT_TEST);
    
    console.log("LETTER SPANS:");
    console.log(letterSpans);

    AVG_LETTER_PER_WORD_CURRENT_TEST = LETTER_COUNT_CURRENT_TEST / WORD_COUNT_CURRENT_TEST;
    console.log("Average letters per word in test: " + AVG_LETTER_PER_WORD_CURRENT_TEST);

    correctLetters = 0;
    correctWords   = 0;
    timeTaken      = 0;

    //Mark first letter as active one.
    document.getElementById("0.0").classList.add("currLetter");
    
    topOfTextboxOffset = document.getElementById("0.0").offsetHeight;
    
    //Initialize currWordIndex and also manipulate it to highlight the first word.
    currWordIndex  = -1;
    highlightNextWord();
    currWordIndex = 0;

    
    console.log("Test Ready");    
}

function highlightNextWord(){
    var lettersInNextWord = allLetters[currWordIndex+1].length;

    for(var i = 0; i<lettersInNextWord; i++){
        var aSpan = document.getElementById(currWordIndex+1 + "." + i);
            aSpan.classList.add("currWord");
        
    }
}

function unhighlightLastWord(){
    var lettersInNextWord = allLetters[currWordIndex].length;

    for(var i = 0; i<lettersInNextWord; i++){
        var aSpan = document.getElementById(currWordIndex + "." + i);
            aSpan.classList.remove("currWord");
        
    }
}

function letterGraphics(){
    var currLettersArr = allLetters[currWordIndex];
    var currLetterIndex = txtInput.value.length;
  
    var localCurrLetterIndex = currLetterIndex;
    var localCurrWordIndex = currWordIndex;


    //Handle rolling to the next word
    if(currLetterIndex > currLettersArr.length){ 
        localCurrLetterIndex = 0;
        localCurrWordIndex = currWordIndex+1;
        highlightNextWord();
    }
        
        expectingLetterSpan = document.getElementById(localCurrWordIndex + "." + localCurrLetterIndex);
        
    
    if(expectingLetterSpan !== null){
        //ScrollTo the currently selected span... not sure how this works.
        txtTypeThis.scrollTop = expectingLetterSpan.offsetTop - 2*topOfTextboxOffset;

        expectingLetterSpan.classList.add("currLetter")
        expectingLetterSpan.classList.remove("correctLetter")
        expectingLetterSpan.classList.remove("incorrectLetter")
    }
    

    ////This code denotes a correct or incorrect letter.
    //console.log("Checking letter: " + txtInput.value.charAt(txtInput.value.length-1));
    //console.log("against correct letter: " + allLetters[currWordIndex][txtInput.value.length-1]);
    var i = txtInput.value.length-1;
    
    if(i<prevI){ //if there was a backspace, set remove all class from the letter following it
        var oldSpan = document.getElementById(currWordIndex + "." + prevI);
        
        if(oldSpan!==null){
        oldSpan.classList.remove("currLetter");
        oldSpan.classList.remove("correctLetter");
        oldSpan.classList.remove("incorrectLetter");
        }

    }
    
    var theSpan = document.getElementById(currWordIndex + "." + i);
    if(allLetters[currWordIndex][i] == txtInput.value.charAt(i)){
        //console.log("Correct letter recorded!");
        theSpan.classList.remove("currLetter");
        theSpan.classList.add("correctLetter");
    }else if(theSpan!==null){
        theSpan.classList.remove("currLetter");
        theSpan.classList.add("incorrectLetter");
    }
    
    prevI = i+1;



}

function timerCountdown(time){
    var timerId = setInterval(countdown, 1000);
    var totalTime = time; 
    function countdown() {
        if (time == 0) {
            document.getElementById("timerContent").innerHTML = time;
            clearTimeout(timerId);
            calculateResults(totalTime);
        } else {
            document.getElementById("timerContent").innerHTML = time;
            time--;
        }
    }
}

function resetTest(){
    //This is a bad implementation.  Should clear out data manually and reset the txtTypeThis
    location.reload();
}

function calculateResults(totalTime){
    txtInput.disabled = true;
    txtTypeThis.disabled = true;
    txtInput.value = "";
    console.log("You had: " + totalTime + " seconds.");
    var correctElements = document.getElementsByClassName("correctLetter");
    var incorrectElements = document.getElementsByClassName("incorrectLetter");

    document.getElementById("divDataWrapper").classList.add("w3-animate-opacity");
    document.getElementById("divResults").classList.add("w3-animate-opacity");
    document.getElementById("KeystrokeDelay").classList.add("w3-animate-opacity");

    document.getElementById("divDataWrapper").hidden = false;

    document.getElementById("spanCorrectLetters").innerHTML = correctElements.length;
    document.getElementById("spanIncorrectLetters").innerHTML = incorrectElements.length;

    var WPM = ((correctElements.length -incorrectElements.length )/ AVG_CHARS_PER_WORD_ENGLISH) * 60/totalTime;
    document.getElementById("spanWPM").innerHTML = Math.round(WPM*10)/10; //Round to .1 decimal

    /////////////////////////
    //TO DO:
    ///////////////////////
    /*
        Charts behind a selection 
        Charts fade in

        Make a keyboard like on https://dmauro.github.io/Keypress/
        
        Charts for
            - Average per 5 seconds leveled out
            - Chart for time to write words
                - That chart but smoothed out.

        HOLY FUCKING SHIT AN AD INSERTER
            FOR WEBPAGES COVERED BY ADBLOCK
            JESUS CHRIST

        
    */

    buildKeystrokesChart();
}

function buildKeystrokesChart(){

    //timeBetweenKeystrokes.splice(0,1);
    console.log("Delay Before Keystrokes: ");
    console.log(timeBetweenKeystrokes);

    var allLetters1DShortened = allLetters1D.splice(0, timeBetweenKeystrokes.length);

    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: allLetters1DShortened,
        datasets: [{
            label: 'Milliseconds Between Keystroke',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: timeBetweenKeystrokes,
            lineTension: 0,
            fill: false
        }]
    },

    // Configuration options go here
    options: {
        responsive: true,
        bezierCurve : false,
        legend:{
            labels:{
                defaultFontSize: 36
            }
        }
    }
});
}

function returnCountArrayTemp(){
    var arr = [];
    for(var i = 0; i<timeBetweenKeystrokes.length; i++){
        arr[i]=i;
    }
    return arr;
}


function checkInput(){
    console.log(txtInput.value);
    letterGraphics();

    var n = new Date()
    timeBetweenKeystrokes.push(-1*(timeLastInputReceived - n));
    timeLastInputReceived = n;
    
    if(testStarted == false){
        testStarted = true;
        timerCountdown(11);
    }
    

    if(txtInput.value.includes(' ') && txtInput.value.length > 1){  //When word submitted
        
        checkSkippedLetters();
        unhighlightLastWord(); 

        
        currWordIndex++;
        console.log("NEW WORD: " + allWords[currWordIndex]);
        currWordArr = allWords[currWordIndex].split();
        txtInput.value = "";
    
    }else if(txtInput.value.includes(' ')){ //Handle space without anything else (i.e. for the double spacers of the world)
        txtInput.value = "";
     }
}

function checkSkippedLetters(){
    if(txtInput.value.length < allLetters[currWordIndex].length){
        for(var i = txtInput.value.length-1; i<allLetters[currWordIndex].length; i++){
            var currSkippedLetterSpan = document.getElementById(currWordIndex + "." + i);
            currSkippedLetterSpan.classList.remove("currLetter");
            currSkippedLetterSpan.classList.add("incorrectLetter");
        }
        var firstLetterOfNextWord = document.getElementById(currWordIndex+1 + "." + 0);
        firstLetterOfNextWord.classList.add("currLetter");
    }
}

function hideTimer(){
    document.getElementById("timerContent").toggleAttribute("hidden");
}


