
/*** EDITOR ***/

let hiddenTextArea        = getElt('hiddenTextArea');        // the hidden textarea element
let editor                = getElt('editor');                // the editor div element
let shell                 = getElt('shell');                 // the shell wrapper
let focus                 = false;                            // tracks if the hiddenTextArea is focused
let currentSpan           = {};		                           //the span currently being edited, usually the last span child of the line
let numberOfLines         = 0;		                           //total number of lines in the editor
let currentLineArrayIndex = 0;                               //line the caret is currently on
let lineArray             = [];                              //Array of created lines
let line;                                                    // the Line Object
let caret;                                                   //the Caret Object
let keyHandler;                                              //the Key Handler Object

window.onload = function () { initialize(); } //Initalize the editor

/***************************************************
*                HELPER FUNCTIONS
*
*
/***************************************************/

//INITIALIZE
//Creates a key handler, caret, and the first line
function initialize()
{
  keyHandler = new KeyHandler();      //Create Key Handler Object
  reader     = new Reader();          //Create a Reader Object
  caret      = new Caret();           //Create Caret Object
  makeNewLine();                      //Create a new line
  caret.createCaret();                //Create a caret object
  caret.appendCaret();                //Append the caret to the editor
}



//MAKE NEW LINE
//Creates a new line - duh!
function makeNewLine()
{
  line = new LineObject();          //Create a Line Object
  line.createNewLine();             //Create new line
  lineArray.push(line);             //Add new line to the lineArray
  caret.setCurrentLineObject(line); //Set the position of the caret in the new line
}


//SET CURRENT LINE
//Set the currentLineArrayIndex (clai) to the line the caret is on
function setCurrentLine()
{
  currentLineArrayIndex = caret.currentLineObject.number;//Set clai to the caret's currentLineObject's line number
}

//KEY EVENT
//Triggered when a key is hit inside of the hiddenTextArea
function keyEvent(e)
{
  setTimeout(function(){ keyHandler.handleKey(e); }, 0);  //Puts the keyHandler Object to work. Need for timing issues
}

//FOCUS EDITOR
//Creates hot keys to navigate focus into and out of the editor
function focusEditor(e)
{
  let key       = e.which || e.keyCode;             //what key was pressed?

  if(key === 73)                                    // key = 'i', move focus to the editor
  {
    //let element = getElt('hiddenTextArea');         //editor's div element
    setTimeout(function(){ hiddenTextArea.focus(); }, 0);  //Put focus in editor's div element. Timing issues
    focused     = true;                             //mark the editor as focused
  }
}

//GET ELEMENT
//Short hand to get an element by ID
function getElt(elid)
{
  return document.getElementById(elid);
}

//MAKE ELEMENT
//Short hand to create and return a new element
function makeElt(element)
{
  return document.createElement(element);
}




/***************************************************************************
*                       KEY HANDLER OBJECT
*Handles key events that happen while the hiddenTextArea element is focused
*
/**************************************************************************/
function KeyHandler()
{

  this.handleKey = function(e)
  {
    let key = e.which || w.keyCode;
    let contents;

    if (e.ctrlKey && key == 76) {
      reader.readSentence();
    }
    else if(key === 27)                                    // key = 'esc', move focus to the shell
    {
      hiddenTextArea.blur();                //remove focus from editor
      focused     = false;                            //mark the editor as unfocused
      getElt('shell').focus();                        //focus on shell
    }
    else if(key == 32)//SPACEBAR
    {
      contents = hiddenTextArea.value;		//get contents of hiddenTextArea
  		currentSpan.textContent = contents;			//put contents into currentSpan
      lineArray[currentLineArrayIndex].setLineWidth();
  		lineArray[currentLineArrayIndex].createNewWord();
      hiddenTextArea.value = '';
      caret.setCaretPosition();
      reader.readWord(contents);
    }
    else if(key == 13)//RETURN
    {
      makeNewLine();
      setCurrentLine();
      hiddenTextArea.value = '';
      caret.setCaretPosition();

    }
    //EVERYTHING ELSE
    else {
      contents = hiddenTextArea.value;		//get contents of hiddenTextArea
  		currentSpan.textContent = contents;			//put contents into currentSpan
      lineArray[currentLineArrayIndex].setLineWidth();
      caret.setCaretPosition();
      reader.readWord(contents);
    }
  }

}

/***************************************************************************
*                               LINE OBJECT
*
*
/***************************************************************************/
function LineObject()
{

  this.number =  numberOfLines;
  this.preWrapper;
  this.spanWrapper;
  this.spanArray = [];
  this.lineWordCount;
  this.characterSize;
  this.lineWidth;
  this.lineHeight;
  this.contentHeight;
  this.heightForCaret;

  this.createNewLine = function()
  {
    let word = makeElt('span');
  	//spanWord.setAttribute('class', 'spanBorder');
  	word.setAttribute('id', 'spanWord');
    word.innerHTML = '&#8203';
    //word.innerHTML = '0123456789';
    //word.innerHTML = '&nbsp';

    this.spanArray.push(word);
    this.lineWordCount = this.spanArray.length;
    currentSpan = word;//for appending contents of current word

    this.spanWrapper = makeElt('span');
    this.spanWrapper.appendChild(word);

  	this.preWrapper = makeElt('pre');
    this.preWrapper.setAttribute('id', this.number);
    this.preWrapper.appendChild(this.spanWrapper);
  	editor.appendChild(this.preWrapper);
    this.setLineWidth();
    this.setLineHeight();

    this.setCharacterSize();

  	numberOfLines++;
  }

  this.createNewWord = function()
  {
    let word = makeElt('span');
  	//spanWord.setAttribute('class', 'spanBorder');
  	word.setAttribute('id', 'spanWord');
    word.innerHTML = '&#8203';
    //word.innerHTML = '0123456789';
    //word.innerHTML = '&nbsp';

    this.spanArray.push(word);
    this.lineWordCount = this.spanArray.length;
    this.spanWrapper.appendChild(word);
    currentSpan = word;//for appending contents of current word
  }

  this.setCharacterSize = function()
  {
    if(numberOfLines == 0)
    {
      this.characterSize = 10;
    }
    else {
      this.characterSize = lineArray[currentLineArrayIndex].characterSize;
    }


  }

  this.setLineWidth = function()
  {
    this.lineWidth = $(this.spanWrapper).width();
  }

  this.setLineHeight = function()
  {
    let actualHeight = $(this.preWrapper).outerHeight(true);
    let preTopMargin = parseInt($(this.preWrapper).css('marginTop'));
    this.lineHeight = actualHeight - preTopMargin;
    this.contentHeight = $(this.preWrapper).outerHeight();
  }


}

/***************************************************************************
*                               CARET OBJECT
*
*
/**************************************************************************/
function Caret()
{
  this.caret;
  this.width;
  this.height = 0;
  this.top;
  this.left;
  this.currentLineObject;

  this.createCaret = function()
  {
    this.caret = makeElt('div')
		this.caret.setAttribute('id', 'caret');
		this.caret.setAttribute('class', 'caret');
    this.height = this.currentLineObject.contentHeight;
    $(this.caret).css('height', this.height);
  }

  this.appendCaret = function()
  {
    editor.appendChild(this.caret);
  }

  this.setCaretPosition = function()
  {
    this.setCaretLeftPosition();
    this.setCaretTopPosition();
  }

  this.setCaretLeftPosition = function()
  {
    this.left = this.currentLineObject.lineWidth;
    $(this.caret).css('left', this.left);
  }

  this.setCaretTopPosition = function()
  {
    let multiplier = numberOfLines - 1;

    if(numberOfLines)
    {
      let lineHeight = this.currentLineObject.lineHeight;
      this.top = lineHeight * multiplier;
      $(this.caret).css('top', this.top);
    }

  }

  this.setCurrentLineObject = function(lineObject)
  {
    this.currentLineObject = lineObject;
  }

}

/***************************************************************************
*                       READER OBJECT
* Updates hidden div elements that have aria-live regions for screenreaders
* to communicate what is being typed
*
/**************************************************************************/
function Reader()
{
  // READ CHAR
  //Sets the div with id = char to the entered keys
  //This triggers the aria-live region to read the update
  this.readChar     = function(key)
  {
    let char        = String.fromCharCode(key);                   //Get the character
    $('#char').text(char);                                        //Append the character to the div element
  }

  // READ WORD
  //Sets the div with id = word to the content argument
  //This triggers the aria-live region to read the update
  this.readWord     = function(contents)
  {
    $('#word').text(contents);                                    //Append the contents to the div element
  }

  /* READ SENTENCE
  /
  /  Sets the div with id = sentence to the words contained in the spanArray of the current line
  /
  /  For the aria-live region to trigger the screenreader, the contents of the sentence must change
  /
  /  This is not an issue when adding new words,
  /
  /  However,
  /  In order to re-read the same sentence without adding content, a sentinal character is appended to the contents
  /  of the sentence div element - this change is enough to trigger the screenreader and not read the sentinal character
  */
  this.readSentence = function()
  {
    let array       = lineArray[currentLineArrayIndex].spanArray; //Get the current line's spanArray
    let sentence    = '';                                         //Reset the sentence to be put into the div element
    let sentinal    = $('#sentence').text();                      // Gret current div conents to check for the sentinal character
    let size        = sentinal.length;                            // Length of the sentinal string

    //Build a string from the current line's spanArray
    $.each(array, function(index, value)
    {
      sentence      = sentence + value.textContent;
    });

    $('#sentence').empty();                                       //Clear the current contents of the div

    //If the sentinal is the last character of the string, remove it
    //Else, append the sentinal character ';' to the end of the string
    if(sentinal[size - 1] === ";")
    {
      sentence.slice(0 , size - 1);
    }
    else {
      sentence      = sentence + ";";
    }

    $('#sentence').text(sentence);                                // Put the string into the div

  }
}

/*** Put the text from the previous span into the hiddenTextArea to allow editing ***/
function setTextArea()
{
	getElt('hiddenTextArea').value = getSiblingText(currentSpan);
}

/*** Gets the previous sibling of the node argument ***/
function getSiblingText(node)
{
		return node.previousSibling.innerHTML;
}

/*** Remove the last span element in a line ***/
function removeSpanWord()
{
	let parent = currentSpan.parentElement;		//get the parent of the last span
	let lastSpan = parent.lastChild;					//get the last span (usually is currentSpan)

	if(lastSpan.previousSibling)		//if current span is not the only child of the pre
	{
		currentSpan = lastSpan.previousSibling;		//set currentSpan to it's sibling
		parent.removeChild(lastSpan);		//remove the last span child
	}
	else 		//cuurentSpan is the only child of the pre
	{
		currentSpan = lastSpan;
	}
}

// /*** Writes text to the fake editor ***/
// function writeText(e)
// {
// 	let contents;
//
// 	let key = e.which || e.keyCode;		//what key was pressed?
//
//
//
// 	/*** KEY BEHAVIOR ***/
// 	if(key == 32)		//SPACEBAR
// 	{
//    contents = hiddenTextArea.value;		//get contents of hiddenTextArea
// 		currentSpan.textContent = contents;			//put contents into currentSpan
//     lineArray[currentLineArrayIndex].setLineWidth();
//     caret.setCaretLeftPosition();
// 		lineArray[currentLineArrayIndex].createNewWord();
// 	}
// 	else if (key == 8 && getElt('hiddenTextArea').value == '')		//DELETE - if hitting delete key AND the hiddenTextArea is empty
// 	{
// 		//if the current span is not the only child of the pre and there is more than one line
// 		if(currentSpan.previousSibling && numberOfLines > 1)
// 		{
// 			setTextArea();			//put text from previous span into the hiddenTextArea
// 			removeSpanWord();		//remove the last span of the line
//
// 		}
// 		//if the current span is not the only child of the pre and there is only one line
// 		else if(currentSpan.previousSibling && numberOfLines == 1)
// 		{
// 			setTextArea();			//put text from previous span into the hiddenTextArea
// 			removeSpanWord();		//remove the last span of the line
//
// 		}
// 		else 		//currentSpan is the only child of the pre
// 		{
// 			currentSpan.innerHTML = '&#8203'; //set currentSpans HTML to blank
//
// 		}
// 	}
// 	else if (key == 13)		//RETURN
// 	{
// 		newLine();
// 		clearTextArea('line');
//
// 	}
// 	else    //take text from the hiddenTextArea and put it into the currentSpan
// 	{
// 		contents = getElt('hiddenTextArea').value;		//get contents of hiddenTextArea
// 		currentSpan.textContent = contents;			//put contents into currentSpan
//     lineArray[currentLineArrayIndex].setLineWidth();
//     caret.setCaretLeftPosition();
//
// 	}
//
// }


function getHiddenTextBoxCaretPosition(element)
{

  let startPos = element.selectionStart;
	console.log('HiddenTextBoxCaretPosition: ' + startPos);
}

function clicked(e)
{
	console.log(window.getSelection().focusNode);
	console.log(window.getSelection().anchorOffset);
}

/*** Uses jQuery to increase or decrease font size ***/
function fontSize(e)
{
	let size = $("#editor").css("font-size");
	size = parseInt(size)/16;

	if(e.target.innerHTML == 'FONT SIZE + ')
	{
		size += 0.2;
	}
	else {
		size -= 0.2;
	}
	size = size + 'em';
	$("#editor").css("font-size", size);



  let cs = caret.characterSize;
  let sw = $(currentSpan).width();
  console.log("OLD CHARACTER SIZE: " + cs);
  console.log("NEW FONT SIZE: " + sw);

  console.log('DIFFERENCE: ' + (sw - cs));

  caret.setCharacterSize(sw);
}
