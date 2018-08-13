let textArea = document.getElementById('textArea');
let editor = document.getElementById('editor');
let word;
let reader = document.getElementById('reader');
let currentSpan = {};
let spanArray = [];
let spanWrapper;
let preWrapper;
let height;
let left;
let lineWidth;
let caret;


/***************************************************************************
*                               INITIALIZE
*
*
/***************************************************************************/
word = document.createElement('span');
word.innerHTML = '&#8203';
spanArray.push(word);
currentSpan = word;


spanWrapper = document.createElement('span');
spanWrapper.appendChild(word);
preWrapper = document.createElement('pre');
preWrapper.appendChild(spanWrapper);
editor.appendChild(preWrapper);

createCaret();
setCaretPosition();

/***************************************************************************
*                               KEY HANDLER
*
*
/***************************************************************************/
//KEY EVENT
function keyEvent(e)
{
  //It no worky good with out timeout method
  setTimeout(function(){ handleKey(e); }, 0);
}

function handleKey(e)
{
  let key = e.which || w.keyCode;
  let contents;

  if (e.ctrlKey && key == 76)
  {

    readSentence();
  }
  else if(key === 27)                                    // key = 'esc', move focus to the shell
  {
    hiddenTextArea.blur();                //remove focus from editor
    focused     = false;                            //mark the editor as unfocused
    getElt('shell').focus();                        //focus on shell
  }
  else if(key == 32)//SPACEBAR
  {
    contents = textArea.value;		//get contents of hiddenTextArea
    currentSpan.textContent = contents;			//put contents into currentSpan


    readWord(contents);


    createNewWord();

    setCaretPosition();

    textArea.value = '';

  }
  //EVERYTHING ELSE
  else {
    contents = textArea.value;		//get contents of hiddenTextArea
    currentSpan.textContent = contents;			//put contents into currentSpan

    setCaretPosition();

    //readChar(key);
    readWord(contents);

  }

}

/***************************************************************************
*                               READER
*
*
/***************************************************************************/
function readChar(key)
{
  let char = String.fromCharCode(key);
  $('#char').text(char);
}
function readWord(contents)
{
  $('#word').text(contents);
}
function readSentence()
{
  let sentence = '';
  let check = $('#sentence').text();
  let size = check.length;


  $.each(spanArray, function(index, value)
  {
    sentence = sentence + value.textContent;
  });

  $('#sentence').empty();

  if(check[size - 1] === ";")
  {
    sentence.slice(0 , size - 1);
  }
  else {
    sentence = sentence + ";";
  }

  $('#sentence').text(sentence);

}

/***************************************************************************
*                               NEW WORD
*
*
/***************************************************************************/
function createNewWord()
{
  word = document.createElement('span');
  //spanWord.setAttribute('class', 'spanBorder');

  word.innerHTML = '&#8203';
  //word.innerHTML = '0123456789';
  //word.innerHTML = '&nbsp';
  spanArray.push(word);
  currentSpan = word;//for appending contents of current word

  spanWrapper.appendChild(word);

}

//FOCUS EDITOR
//Creates hot keys to navigate focus into and out of the editor
function focusEditor(e)
{
  let key       = e.which || e.keyCode;             //what key was pressed?

  if(key === 73)                                    // key = 'i', move focus to the editor
  {
    setTimeout(function(){ textArea.focus(); }, 0);  //Put focus in editor's div element. Timing issues
    focused     = true;                             //mark the editor as focused
  }
}

/***************************************************************************
*                               CARET
*
*
/***************************************************************************/
function createCaret()
{
  caret = document.createElement('div');
  caret.setAttribute('id', 'caret');
  caret.setAttribute('class', 'caret');
  height = setLineHeight();
  $(caret).css('height', height);
  appendCaret();
}

function setLineHeight()
{
  let actualHeight = $(preWrapper).outerHeight(true);
  let preTopMargin = parseInt($(preWrapper).css('marginTop'));
  return actualHeight - preTopMargin;
}

function appendCaret()
{
  $('#editor').append(caret);
}

function setCaretPosition()
{
  lineWidth = setLineWidth();
  left = lineWidth;
  $(caret).css('left', left);
}

function setLineWidth()
{
  return $(spanWrapper).width();
}
