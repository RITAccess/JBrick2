let textArea = document.getElementById('textArea');
let editor1 = document.getElementById('editor1');
let editor2 = document.getElementById('editor2');
let editor3 = document.getElementById('editor3');
let word1;
let word2;
let word3;

//ALL OF THIS IS NEEDED FOR WHAT IM DOING
//BASICALLY, IT MAKES THIS: <pre><span><span>CONTENT FROM TEXT AREA</span></span></pre>
word1 = document.createElement('span');
word1.innerHTML = '&#8203';
this.spanWrapper1 = document.createElement('span');
this.spanWrapper1.appendChild(word1);
this.preWrapper1 = document.createElement('pre');
this.preWrapper1.appendChild(this.spanWrapper1);

word2 = document.createElement('span');
word2.innerHTML = '&#8203';
this.spanWrapper2 = document.createElement('span');
this.spanWrapper2.appendChild(word2);
this.preWrapper2 = document.createElement('pre');
this.preWrapper2.appendChild(this.spanWrapper2);

word3 = document.createElement('span');
word3.innerHTML = '&#8203';
this.spanWrapper3 = document.createElement('span');
this.spanWrapper3.appendChild(word3);
this.preWrapper3 = document.createElement('pre');
this.preWrapper3.appendChild(this.spanWrapper3);


editor1.appendChild(this.preWrapper1);
editor2.appendChild(this.preWrapper2);
editor3.appendChild(this.preWrapper3);


//KEY EVENT
function keyEvent(e)
{
  let key = e.which || w.keyCode;

  //It no worky good with out timeout method
  setTimeout(function(){ handleKey(key); }, 0);
}

function handleKey(key)
{
  let contents;
  let button  = $('input[name=group1]:checked', '#editors').val();

  if(button == 1)
  {
    if(key == 32)//SPACEBAR
    {
      contents = textArea.value;		//get contents of hiddenTextArea
      word1.textContent = contents;			//put contents into currentSpan
      createNewWord(1);
      textArea.value = '';

    }
    //EVERYTHING ELSE
    else {
      contents = textArea.value;		//get contents of hiddenTextArea
      word1.textContent = contents;			//put contents into currentSpan

    }
  }
  else if(button == 2)
  {
    if(key == 32)//SPACEBAR
    {
      contents = textArea.value;		//get contents of hiddenTextArea
      word2.textContent = contents;			//put contents into currentSpan
      createNewWord(2);
      textArea.value = '';

    }
    //EVERYTHING ELSE
    else {
      contents = textArea.value;		//get contents of hiddenTextArea
      word2.textContent = contents;			//put contents into currentSpan

    }
  }
  else {

    if(key == 32)//SPACEBAR
    {
      contents = textArea.value;		//get contents of hiddenTextArea
      word3.textContent = contents;			//put contents into currentSpan
      createNewWord(3);
      textArea.value = '';

    }
    //EVERYTHING ELSE
    else {
      contents = textArea.value;		//get contents of hiddenTextArea
      word3.textContent = contents;			//put contents into currentSpan

    }
  }
}

function createNewWord(n)
{
  let newWord = document.createElement('span');
  newWord.innerHTML = '&#8203';

  if(n == 1)
  {
    word1.parentElement.appendChild(newWord);
    word1 = newWord;
  }
  else if(n == 2)
  {
    word2.parentElement.appendChild(newWord);
    word2 = newWord;
  }
  else {
    word3.parentElement.appendChild(newWord);
    word3 = newWord;
  }
}
