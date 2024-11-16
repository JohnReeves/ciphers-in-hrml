let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ";

let abc_code =
{
  "a": "a", "b": "b", "c": "c",
  "d": "d", "e": "e", "f": "f",
  "g": "g", "h": "h", "i": "i",
  "j": "j", "k": "k", "l": "l",
  "m": "m", "n": "n", "o": "o",
  "p": "p", "q": "q", "r": "r",
  "s": "s", "t": "t", "u": "u",
  "v": "v", "w": "w", "x": "x",
  "y": "y", "z": "z", "1": "1",
  "2": "2", "3": "3", "4": "4",
  "5": "5", "6": "6", "7": "7",
  "8": "8", "9": "9", "0": "0"
};

let morse_code =
{
  "a": ".-", "b": "-...", "c": "-.-.",
  "d": "-..", "e": ".", "f": "..-.",
  "g": "--.", "h": "....", "i": "..",
  "j": ".---", "k": "-.-", "l": ".-..",
  "m": "--", "n": "-.", "o": "---",
  "p": ".--.", "q": "--.-", "r": ".-.",
  "s": "...", "t": "-", "u": "..-",
  "v": "...-", "w": ".--", "x": "-..-",
  "y": "-.--", "z": "--..", "1": ".----",
  "2": "..---", "3": "...--", "4": "....-",
  "5": ".....", "6": "-....", "7": "--...",
  "8": "---..", "9": "----.", "0": "-----"
};

let substitute_code =
{
  "a": "z", "b": "y", "c": "x",
  "d": "w", "e": "v", "f": "u",
  "g": "t", "h": "s", "i": "r",
  "j": "q", "k": "p", "l": "o",
  "m": "n", "n": "m", "o": "l",
  "p": "k", "q": "j", "r": "i",
  "s": "h", "t": "g", "u": "f",
  "v": "e", "w": "d", "x": "c",
  "y": "b", "z": "a", "1": "1",
  "2": "2", "3": "3", "4": "4",
  "5": "5", "6": "6", "7": "7",
  "8": "8", "9": "9.", "0": "0"
};

let shift = 0;

let inputText = $("#input");
let vigenereText = $("#vigenereKey");
let outputText = $("#output");

let inputMessage = $("#input").val();
let vigenereKey = $("#vigenereKey").val();
let outputMessage = $("#output").val();

let shiftUp = $("#shiftUp");
let shiftDown = $("#shiftDown");

let vigenereEncode = $("#vigenereEncode");
let removeSpaces = $("#spaces");
let reversePhrase = $("#reverse");

let morseCode = $("#morse");
let soundCode = $("#dih_dah");

let affineCode = $("#affine");
let randomCode = $("#random");

// TODO: design an output space for candidate deciphering
// TODO: verify deciphering with a standard message
// TODO: separate into functional files
// TODO: bootstrap template

// populate the output box once to show what it does
handleMessage();

// event handler to detect new input message
inputText.change(function () {
  inputMessage = $("#input").val();
  handleMessage();
});


// event handler to detect new vigenere key
vigenereText.change(function () {
  vigenereKey = $("#vigenereKey").val();
  handleVigenere();
});

// click functions to call the cipher functions
shiftUp.click(function () {
  shift += 1;
  handleMessage();
});

shiftDown.click(function () {
  shift -= 1;
  handleMessage();
});

vigenereEncode.click(function () {
  //shift -= 1;
  handleVigenere();
});

removeSpaces.click(function () {
  outputMessage = handleSpaces(inputMessage);
  outputText.text(outputMessage);
  inputMessage = outputMessage;
});

reversePhrase.click(function () {
  outputMessage = handleReverse(inputMessage);
  outputText.text(outputMessage);
  inputMessage = outputMessage;
});

morseCode.click(function () {
  handleMorse();
});

var audioUrl = 'http://www.realmofdarkness.net/audio/vg/sf/sf2/perfect.mp3';
//var audioUrl = 'http://www.realmofdarkness.net/wp-content/audio/vg/sonic/shadow/shadow/alright.mp3';

soundCode.click(function () {
  handleMorse();
});

// probably put these in one function
// with the caesar cipher
affineCode.click(function () {
  handleAffine();
});

randomCode.click(function () {
  handleRandom();
});

function handleMessage() {
  outputMessage = encodeCaesar(inputMessage, shift);
  outputText.text(outputMessage);
}

function handleVigenere() {
  outputMessage = encodeVignere(inputMessage, vigenereKey);
  outputText.text(outputMessage);
}

function handleMorse() {
  outputMessage = encode(morse_code, inputMessage);
  outputText.text(outputMessage);
  beep();
}

function handleAffine() {
  a = 5;
  b = 2;

  for (var letter in alphabet) {
    index = (a * letter + b) % alphabet.length;
    abc_code[alphabet.charAt(letter)] =
      alphabet.charAt(index);
  }

  outputMessage = encodeAffine(abc_code, inputMessage);
  outputText.text(outputMessage);
}

function handleRandom() {
  outputMessage = encodeRandom(substitute_code, inputMessage);
  outputText.text(outputMessage);
}

// steps over the input phrase ignoring spaces
// try how understandable these are as filter/map/reduce
// let new_letter = letter.map(letter => letter + shift);
function handleSpaces(phrase) {
  let ret = '';
  let space = " ";

  for (var letter of phrase) {
    if (letter != space) ret += letter;
  }
  return ret;
}

function handleReverse(phrase) {
  let ret = '';

  ret = phrase.split("").reverse().join("");
  return ret;
}

function encodeCaesar(phrase, shift) {
  let ret = '';

  for (var letter of phrase) {
    ret +=
      alphabet.charAt((
        alphabet.indexOf(letter) +
        shift) %
        alphabet.length
      );
  }
  return ret;
}

function encodeVignere(phrase, keyPhrase) {
  let ret = '';
  let keyIndex = 0;

  for (var letter of phrase) {
    ret +=
      alphabet.charAt((
        alphabet.indexOf(letter) +
        alphabet.indexOf(keyPhrase[keyIndex])) %
        alphabet.length
      );

    if (keyIndex == (keyPhrase.length - 1))
      keyIndex = 0;
    else
      keyIndex++;
  }
  return ret;
}

function encode(alpha_code, message) {
  let ret = '';
  let space = " ";

  for (var letter of message.toLowerCase()) {
    if (letter != space)
      ret += alpha_code[letter] + " ";
    else
      ret += "   ";
  }
  return ret;
}

function encodeAffine(affine_code, message) {
  let ret = '';

  for (var letter of message.toLowerCase()) {
    ret += affine_code[letter];
  }
  return ret;
}

function encodeRandom(random_code, message) {
  let ret = '';

  for (var letter of message.toLowerCase()) {
    ret += random_code[letter];
  }
  return ret;
}

function beep() {
  var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
  snd.play();
}

function boop() {
  new Audio(audioUrl).play();

}
//setInterval(beep, 5000);