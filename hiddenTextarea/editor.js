
/*** EDITOR ***/

let numberOfLines = 1;		//total number of lines in the editor
let currentSpan;					//the span currently being edited, usually the last span child of the line
let textArea = getElt('hiddenTextArea');
let caret = new Caret(textArea);



newLine();

caret.createCaret();
caret.appendCaret(getElt('editor'));
console.log('Caret parent ' + caret.caret.parentElement.id);




function focusEditor(e)
{
  let key = e.which || e.keyCode;//what key was pressed?

  // key = 'i', move focus to the editor
  if(key === 73)
  {
    //console.log(key);

    let element =getElt('hiddenTextArea');//editor's div element

    setTimeout(function(){ element.focus(); }, 0);//Put focus in editor's div element. Timing issues
    focused = true;//mark the editor as focused

  }

  // key = 'esc', move focus to the shell
  if(key === 27)
  {
    //console.log(key);

    getElt('hiddenTextArea').blur();//remove focus from editor
    focused = false;//mark the editor as unfocused
    getElt('shell').focus();//focus on shell
  }


}

//short hand to get and element by ID
function getElt(elid)
{
	return document.getElementById(elid);
}

//short hand to create and return a new element
function makeElt(element)
{
	return document.createElement(element);
}

function newLine()
{
	let spanWord = makeElt('span');
	//spanWord.setAttribute('class', 'spanBorder');
	spanWord.setAttribute('id', 'spanWord');
	currentSpan = spanWord;//for appending contents of current word
	let spanWrapper = makeElt('span');
	let preWrapper = makeElt('pre');
	let editor = getElt('editor');

	spanWord.innerHTML = '&#8203';
	//spanWord.innerHTML = '0123456789';

	//spanWrapper.appendChild(spanWord);
	//preWrapper.appendChild(spanWrapper);

  preWrapper.appendChild(spanWord);

	preWrapper.setAttribute('id', numberOfLines);
	editor.appendChild(preWrapper);

	numberOfLines++;

	caret.setLineRange(document.getElementById('1'));
  console.log('span width: ' + $(currentSpan).width());

}

/*** Create a new span element to hold a new word in the line ***/
function createSpanWord()
{
	let spanWord = makeElt('span');
	//spanWord.setAttribute('class', 'spanBorder');															//create new span element
	currentSpan.parentElement.appendChild(spanWord);				//append the new span element to the parent node of the currentSpan
	currentSpan = spanWord;																	//set currentSpan to the newly appended span element
	clearTextArea('word');																	//clear the hiddenTextArea to prepare for a new word to be typed in
}

/*** Clear the hiddenTextArea content
/*** 'word' argument adds a space to the hiddenTextArea
/*** 'line' argument adds nothing to the hiddenTextArea ***/
function clearTextArea(option)
{
	if(option == 'word')
	{
		getElt('hiddenTextArea').value = '';
	}
	if(option == 'line')
	{
		getElt('hiddenTextArea').value = '';
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

//needed for onkeypress event - otherwise writing is delayed one character
//calles writeText immediately
function pause(e)
{
	setTimeout(function(){ writeText(e); }, 0);
}

/*** Writes text to the fake editor ***/
function writeText(e)
{
	let contents;

	let key = e.which || e.keyCode;		//what key was pressed?



	/*** KEY BEHAVIOR ***/
	if(key == 32)		//SPACEBAR
	{

		currentSpan.insertAdjacentHTML('afterend', '&nbsp;');
		createSpanWord();		//append a new span child for new word to be typed in
		caret.setCaretPosition(currentSpan);
	}
	else if (key == 8 && getElt('hiddenTextArea').value == '')		//DELETE - if hitting delete key AND the hiddenTextArea is empty
	{
		//if the current span is not the only child of the pre and there is more than one line
		if(currentSpan.previousSibling && numberOfLines > 1)
		{
			setTextArea();			//put text from previous span into the hiddenTextArea
			removeSpanWord();		//remove the last span of the line
			caret.setCaretPosition(currentSpan);
		}
		//if the current span is not the only child of the pre and there is only one line
		else if(currentSpan.previousSibling && numberOfLines == 1)
		{
			setTextArea();			//put text from previous span into the hiddenTextArea
			removeSpanWord();		//remove the last span of the line
			caret.setCaretPosition(currentSpan);
		}
		else 		//currentSpan is the only child of the pre
		{
			currentSpan.innerHTML = '&#8203'; //set currentSpans HTML to blank
			caret.setCaretPosition(currentSpan);
		}
	}
	else if (key == 13)		//RETURN
	{
		newLine();
		clearTextArea('line');
		caret.setCaretPosition(currentSpan);
	}
	else    //take text from the hiddenTextArea and put it into the currentSpan
	{
		contents = getElt('hiddenTextArea').value;		//get contents of hiddenTextArea
		currentSpan.textContent = contents;			//put contents into currentSpan
		caret.setCaretPosition(currentSpan);
	}

}

/*** CARET OBJECT ***/
function Caret(textArea)
{
	this.caret;
	this.selection;
	this.lineRange = document.createRange();
  this.startNode;
  this.endNode;
  this.endNodeLength;
	this.lineWidth;
	this.textArea = textArea;
	this.anchorSpan;


	//CREATE CARET
	this.createCaret = function()
	{
		this.caret = makeElt('div')
		this.caret.setAttribute('id', 'caret');
		this.caret.setAttribute('class', 'caret');

	}

	//APPEND CARET
	this.appendCaret = function(element)
	{
		//element.appendChild(this.caret);
		//$(element).after(this.caret);
		//this.range.insertNode(this.caret);
    element.appendChild(this.caret);
	}

	//SET SELECTION
	this.setLineRange = function(element)
	{

    this.lineRange.selectNode(element);

    this.startNode = element.firstChild.firstChild;

    this.lineRange.setStart(this.startNode, 0);

    this.endNode = element.lastChild.firstChild;

    this.endNodeLength = this.endNode.length;

    this.lineRange.setEnd(this.endNode, this.endNodeLength);

    console.log(this.lineRange);

    let s = window.getSelection();
    s.addRange(this.lineRange);



	}

	//SET CARET POSITION
	this.setCaretPosition = function(element)
	{
		let width = $(element).width();
    this.lineWidth = this.lineWidth + width;
		$('#caret').css('left', width);

	}

  //SET LINE WIDTH
  this.setLineWidth = function()
  {
    
  }

}

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
}
