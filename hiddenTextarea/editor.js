
/*** EDITOR ***/

var numberOfLines = 1;		//total number of lines in the editor
var currentSpan;			//the span currently being edited, usually the last span child of the line

newLine();

function $(elid)
{
	return document.getElementById(elid);
}

function focusEditor(e)
{
  let key = e.which || e.keyCode;//what key was pressed?

  // key = 'i', move focus to the editor
  if(key === 73)
  {
    console.log(key);

    let element =$('hiddenTextArea');//editor's div element

    setTimeout(function(){ element.focus(); }, 0);//Put focus in editor's div element. Timing issues
    focused = true;//mark the editor as focused

    /*** Once focused, move the caret to the end of any content inside of the editor ***/
    // var inputSize = element.innerHTML.length;//number of characters in editor
    // console.log("Input Size: " + inputSize);
    // if(inputSize)
    // {
    //   let selection = window.getSelection();//create Selection object
    //   setTimeout(function(){ selection.collapse(element.firstChild, inputSize); },
    //                          0);//move caret to the end of the content. Timing issues
    // }
  }

  // key = 'esc', move focus to the shell
  if(key === 27)
  {
    console.log(key);

    $('hiddenTextArea').blur();//remove focus from editor
    focused = false;//mark the editor as unfocused
    $('shell').focus();//focus on shell
  }


}

//short hand to create and return a new element
function elt(element)
{
	return document.createElement(element);
}

function newLine()
{
	let spanWord = elt('span');
	currentSpan = spanWord;//for appending contents of current word
	let spanWrapper = elt('span');
	let preWrapper = elt('pre');
	let editor = $('editor');

	spanWord.innerHTML = '&#8203';

	spanWrapper.appendChild(spanWord);
	preWrapper.appendChild(spanWrapper);

	preWrapper.setAttribute('id', numberOfLines);
	editor.appendChild(preWrapper);

	numberOfLines++;


}

/*** Create a new span element to hold a new word in the line ***/
function createSpanWord()
{
	let spanWord = elt('span');															//create new span element
	currentSpan.parentElement.appendChild(spanWord);		//append the new span element to the parent node of the currentSpan
	currentSpan = spanWord;															//set currentSpan to the newly appended span element
	clearTextArea();																				//clear the hiddenTextArea to prepare for a new word to be typed in
}

/*** Clear the hiddenTextArea and enter in a space ***/
function clearTextArea()
{
	$('hiddenTextArea').value = ' ';
}

/*** Put the text from the previous span into the hiddenTextArea to allow editing ***/
function setTextArea()
{
	$('hiddenTextArea').value = getSiblingText(currentSpan);
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
	let lastSpan = parent.lastChild;							//get the last span
	currentSpan = lastSpan.previousSibling;		//set currentSpan to the current last span's sibling
	parent.removeChild(lastSpan);									//remove the last span child
}


function nl2br(txt){
	return txt.replace(/\n/g, "<br />");
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
	var contents;

	let key = e.which || e.keyCode;		//what key was pressed?

	console.log(key);

	if(key == 32)		//SPACEBAR
	{
		createSpanWord();		//append a new span child for new word to be typed in
	}
	else if (key == 8 && $('hiddenTextArea').value == '')		//DELETE - if hitting delete key AND the hiddenTextArea is empty
	{
		setTextArea();			//put text from previous span into the hiddenTextArea
		removeSpanWord();		//remove the last span of the line
	}
	else    //take text from the hiddenTextArea and put it into the currentSpan
	{
		contents = $('hiddenTextArea').value;		//get contents of hiddenTextArea
		currentSpan.textContent = contents;			//put contents into currentSpan
	}



}
