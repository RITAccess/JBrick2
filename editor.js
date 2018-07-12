
/*** EDITOR ***/

var focused = false;//is the editor focused?

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
    var inputSize = element.innerHTML.length;//number of characters in editor
    console.log("Input Size: " + inputSize);
    if(inputSize)
    {
      let selection = window.getSelection();//create Selection object
      setTimeout(function(){ selection.collapse(element.firstChild, inputSize); },
                             0);//move caret to the end of the content. Timing issues
    }
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

  /*** Enter Key Behavior ***/
  // if(key == 13)
  // {
  //   let element = createNewLine();
  //   let parent = document.getElementById('editor');
  //   parent.appendChild(element);
  // }


  /*** Tab Key Behavior ***/
  // adapted from http://stackoverflow.com/a/25943182/460084
  //Lifted from https://stackoverflow.com/questions/2237497/how-to-make-the-tab-key-insert-a-tab-character-in-a-contenteditable-div
  if (e.keyCode == 9)
  {
    insertTab();
    e.preventDefault();
  }
  function insertTab()
  {
    if (!window.getSelection) return;
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    range.collapse(true);
    const span = document.createElement('span');
    span.appendChild(document.createTextNode('\t'));
    span.style.whiteSpace = 'pre';
    range.insertNode(span);
    // Move the caret immediately after the inserted span
    range.setStartAfter(span);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  /*** 'i' Key Behavior ***/
  if(key == 73)
  {
    e.stopPropagation();
  }


}

/*** LINES ***/
var lineNumber = 1;

function createNewLine(){
  console.log("createNewLine Function!")
  let newLine = document.createElement('div');
  newLine.setAttribute('id', lineNumber);
  lineNumber++;
  return newLine;
}
