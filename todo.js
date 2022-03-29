const toDoForm = document.querySelector('.todo-form'),
  toDoInput = toDoForm.querySelector('.todo-input'),
  pendingList = document.querySelector('.pending-list'),
  finishedList = document.querySelector('.finished-list');

const PENDING = 'pending',
  FINISHED = 'finished';

let pending = [],
  finished = [];

function moveToDo(e) {
  const isChecked = e.target.checked;
  const li = e.target.parentNode;
  const span = e.target.nextSibling.innerText;

  let toDoTemps = [];
  let listName = '';

  if (isChecked) {
    toDoTemps = pending;
    listName = PENDING;
    pendingList.removeChild(li);
  } else {
    toDoTemps = finished;
    listName = FINISHED;
    finishedList.removeChild(li);
  }

  const cleanToDos = toDoTemps.filter(function (toDo) {
    return toDo.id !== parseInt(li.id);
    //삭제한 리스트의 아이디만 빼고 cleanToDos에 넣는 과정
    // 삭제한 게 3이면 1 !==3 true 1리턴, 2 !==3? true 리턴 3!==3 false 3리턴x
  });

  toDoTemps = cleanToDos;

  saveToDo(listName, toDoTemps);
  if (listName === PENDING) {
    pending = cleanToDos;
    paintToDo(FINISHED, span, null);
  } else {
    finished = cleanToDos;
    paintToDo(PENDING, span, null);
  }
}

function saveToDo(listName, newList) {
  localStorage.setItem(listName, JSON.stringify(newList));
}

function deleteToDo(e) {
  const li = e.target.parentNode;
  const ul = li.parentNode.className.split('-');
  let toDoTemps = [];
  let listName = ul[0];

  if (listName === PENDING) {
    toDoTemps = pending;
    pendingList.removeChild(li);
  } else {
    toDoTemps = finished;
    finishedList.removeChild(li);
  }
  const cleanToDos = toDoTemps.filter(function (toDo) {
    return toDo.id !== parseInt(li.id);
  });

  toDoTemps = cleanToDos;

  saveToDo(listName, toDoTemps);

  if (listName === PENDING) {
    pending = cleanToDos;
  } else {
    finished = cleanToDos;
  }
}

function paintToDo(listName, text, id) {
  const li = document.createElement('li'),
    content = document.createElement('content'),
    delBtn = document.createElement('button'),
    checkBox = document.createElement('input');

  let toDoTemps = [],
    toDoListTemps = [];

  checkBox.setAttribute('type', 'checkbox');
  checkBox.setAttribute('class', 'btn-check');
  delBtn.setAttribute('class', 'btn-del');
  delBtn.innerText = 'DEL';
  delBtn.addEventListener('click', deleteToDo);
  checkBox.addEventListener('change', moveToDo);
  content.innerText = text;

  if (listName === PENDING) {
    toDoTemps = pending;
    toDoListTemps = pendingList;
  } else {
    content.style.textDecoration = 'line-through';
    checkBox.setAttribute('checked', true);
    toDoTemps = finished;
    toDoListTemps = finishedList;
  }

  li.appendChild(checkBox);
  li.appendChild(content);
  li.appendChild(delBtn);

  const newId = id === null ? toDoTemps.length + 1 : id;
  li.id = newId;

  toDoListTemps.appendChild(li);

  const newToDo = {
    text: text,
    id: newId,
  };

  toDoTemps.push(newToDo);
  saveToDo(listName, toDoTemps);
}

function loadToDo() {
  const loadedPending = localStorage.getItem(PENDING);
  const loadedFinished = localStorage.getItem(FINISHED);

  if (loadedPending !== null) {
    const parsedPending = JSON.parse(loadedPending);
    parsedPending.forEach((toDo) => paintToDo(PENDING, toDo.text, toDo.id));
  }
  if (loadedFinished !== null) {
    const parsedFinished = JSON.parse(loadedFinished);
    parsedFinished.forEach((toDo) => paintToDo(FINISHED, toDo.text, toDo.id));
  }
}

function toDoInit() {
  function handleSubmit(e) {
    e.preventDefault();
    const value = e.target['todo-input']['value'];
    paintToDo(PENDING, value, null);
    toDoInput.value = '';
  }
  loadToDo();
  toDoForm.addEventListener('submit', handleSubmit);
}

toDoInit();
