
/*** EDITOR ***/

var focused = false;//is the editor focused?
var lineNumber = 1;//number of lines in the editor

/*** Create first line of editor ***/

document.getElementById('editor').appendChild(createNewLine(lineNumber));

/*** Focus the editor if 'i' is pressed, unfocus editor if 'esc' is pressed ***/
function focusEditor(e)
{
  let key = e.which || e.keyCode;//what key was pressed?
  
  // key = 'i', move focus to the editor
  if(key === 73)
  {
    console.log(key);

    let element = document.getElementById('editor')//editor's div element

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

    document.getElementById("editor").blur();//remove focus from editor
    focused = false;//mark the editor as unfocused
    document.getElementById("shell").focus();//focus on shell
  }


}

/*** Checks for Hot Keys while editor is focused ***/
function keyCheck(e)
{
  let key = e.which || e.keyCode;//what key was pressed?

  /*** Backspace Key Behavior ***/
  if(key == 8)
  {
    let lastChar = document.getElementById('1').lastChild.previousSibling;//get character before the caret element
    console.log(lastChar);
  }
  /*** Enter Key Behavior ***/
  if(key == 13)
  {
    //e.preventDefault();


    // let element = createNewLine();
    // let parent = document.getElementById('editor');
    // parent.appendChild(element);
  }


  /*** Tab Key Behavior ***/
  // adapted from http://stackoverflow.com/a/25943182/460084
  //Lifted from https://stackoverflow.com/questions/2237497/how-to-make-the-tab-key-insert-a-tab-character-in-a-contenteditable-div
  if (e.keyCode == 9)
  {

    // insertTab();
    // e.preventDefault();
  }
  // function insertTab()
  // {
  //   if (!window.getSelection) return;
  //   const sel = window.getSelection();
  //   if (!sel.rangeCount) return;
  //   const range = sel.getRangeAt(0);
  //   range.collapse(true);
  //   const span = document.createElement('span');
  //   span.appendChild(document.createTextNode('\t'));
  //   span.style.whiteSpace = 'pre';
  //   range.insertNode(span);
  //   // Move the caret immediately after the inserted span
  //   range.setStartAfter(span);
  //   range.collapse(true);
  //   sel.removeAllRanges();
  //   sel.addRange(range);
  // }

  /*** 'i' Key Behavior ***/
  if(key == 73)
  {
    e.stopPropagation();
  }


}

/*** CHARACTER CATCHER ***/
function keyCatcher(e)
{
  console.log("keyCatcher Function!");
  let character = String.fromCharCode(e.keyCode);
  let newChar;
  var pattern = /./i;
  if(pattern.test(character))
  {
    let line = document.getElementById('1');//get div with line number id
    newChar = document.createTextNode(character);//create a text node with entered character
    line.insertBefore(newChar, line.lastChild);//insert the text node before the div's last child, the caret

  }
}

/*** LINES ***/
/*** Builds a div element with attibutes and returns the element ***/
function createNewLine(number)
{
  console.log("createNewLine Function!")

  let newLine = document.createElement('div');//new line element
  newLine.setAttribute('id', number);
  newLine.setAttribute('class', 'lines');

  /*** Screen Reader Accessibility Attributes ***/
  newLine.setAttribute('role', 'textbox');
  newLine.setAttribute('aria-multiline', 'true');
  newLine.setAttribute('aria-label', ('Line Number ' + number));

  let caret = createCaret();//caret for the new line
  newLine.appendChild(caret);//give the caret to the new line as a child

  lineNumber++;//increment line number

  return newLine;
}

/*** CARET ***/
/*** Create a div to serve as a caret element ***/
function createCaret()
{
  let caret = document.createElement('div');
  caret.setAttribute('id', 'caret');
  caret.setAttribute('class', 'caret');
  return caret;

}
