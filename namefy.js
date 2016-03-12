(function(w){

  'use strict'

  var VOWELS = ['a','e','i','o','u'];
  var container, form, input;
  var _public = {};

  _public.init = function(){
    bindElements();
  };

  function bindElements(){
    form = document.getElementsByTagName('form')[0];
    input = document.getElementsByTagName('input')[0];
    container = document.querySelectorAll('[data-js=names]')[0];
    form.addEventListener('submit', function(evt){
      evt.preventDefault();
      printNames(input);
    });
  }

  function printNames(input){
    var names;
    if(input.value)
      names = buildNames(input.value);
    appendNames(names);
  }

  function buildNames(words){
    words = input.value.replace(';','').replace(',','').split(' ');
    var splittedWords = splitWords(words);
    var allSyllables = joinAllSyllables(splittedWords);
    var twoSyllablesNames = mixSyllables(allSyllables, words, 2);
    var threeSyllablesNames = mixSyllables(allSyllables, words, 3);
    return twoSyllablesNames.concat(threeSyllablesNames);
  }

  function splitWords(words){
    var splittedWords = [];
    for (var i = 0; i < words.length; i++){
      var splittedWord = splitWord(words[i]);
      splittedWords.push(splittedWord);
    }
    return splittedWords;
  }

  function splitWord(word){
    word = buildCurrentWordObject(word);
    for (var i = 0; i < word.fullWord.length; i++){
      if(isVowel(word.fullWord[i]))
        storeSyllable(word, i + 1)
    }
    return word.syllables;
  }

  function buildCurrentWordObject(word){
    return {
      fullWord: word,
      lastVowelIndex: 0,
      currentVowelIndex: 0,
      syllables: []
    };
  }

  function isVowel(letter){
    for (var i = 0; i < VOWELS.length; i++)
      if(VOWELS[i] === letter)
        return true;
  }

  function storeSyllable(word, currentVowelIndex){
    var syllableEndLetterIndex = currentVowelIndex;
    if(word.fullWord.length === currentVowelIndex + 1)
      syllableEndLetterIndex++;
    word.syllables.push(word.fullWord.substring(word.lastVowelIndex, syllableEndLetterIndex));
    word.lastVowelIndex = currentVowelIndex;
  }

  function joinAllSyllables(words){
    var allSyllables = [];
    for (var i = 0; i < words.length; i++){
      var word = words[i];
      for (var j = 0; j < word.length; j++)
        allSyllables.push(word[j]);
    };
    return allSyllables;
  }

  function mixSyllables(syllables, words, numOfSyllables){
    var names = [];
    for (var i = 0; i < syllables.length; i++) {
      for (var j = 0; j < syllables.length; j++){
        var name = syllables[i] + syllables[j];
        if(numOfSyllables === 2)
          storeName(names, name, words);
        else
          buildThreeSyllablesNames(names, name, syllables, words);
      }
    };
    return names;
  }

  function storeName(names, name, words){
    if(!isSameWordAlreadyEntered(name, words))
      names.push(removeDoubleConsonantFromWordStart(name));    
  }

  function buildThreeSyllablesNames(names, name, syllables, words){
    for (var k = 0; k < syllables.length; k++) {
      var threeSyllablesName = name + syllables[k];
      storeName(names, threeSyllablesName, words);
    };
  }

  function isSameWordAlreadyEntered(name, words){
    for (var i = 0; i < words.length; i++)
      if(words[i] === name)
        return true;
  }

  function removeDoubleConsonantFromWordStart(name){
    if(!isVowel(name[1]))
      return name.substring(1);
    return name;
  }

  function appendNames(names){
    container.innerHTML = '';
    for (var i = 0; i < names.length; i++){
      var name = document.createElement('li');
      name.innerHTML = names[i];
      container.appendChild(name);
    }
  }

  w.namefy = _public;

})(window);
