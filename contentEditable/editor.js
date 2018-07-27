
/*** EDITOR ***/

let numberOfLines = 1;		//total number of lines in the editor

let editor = makeElt('div');

editor.setAttribute('id', 'textArea');
editor.setAttribute('contenteditable', 'true');
editor.setAttribute('readonly', '');

getElt('editor').appendChild(editor);


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

	contents = getElt('hiddenTextArea').value;		//get contents of hiddenTextArea
  let test = '<pre><span>Test</span></pre>';
  editor.innerHTML = test;


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
