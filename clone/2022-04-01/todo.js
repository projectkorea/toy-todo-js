const $toDoForm = document.querySelector('.todo-form');
const $pendingList = document.querySelector('.pending-list');
const $finishedList = document.querySelector('.finished-list');

const PENDING = 'pending';
const FINISHED = 'finished';

let pending_global = [];
let finished_global = [];

const deleteToDo = (e) => {
  const li = e.target.parentNode;
  const ul = li.parentNode.className.split('-');
  const listName = ul[0];

  let toDoTemps = [];

  if (listName === PENDING) {
    toDoTemps = pending_global;
    $pendingList.removeChild(li);
  } else {
    toDoTemps = finished_global;
    $finishedList.removeChild(li);
  }
  const cleanToDos = toDoTemps.filter((toDo) => toDo.id !== parseInt(li.id));
  toDoTemps = cleanToDos;
  saveToDo(listName, toDoTemps);

  if (listName === PENDING) {
    pending_global = cleanToDos;
  } else {
    finished_global = cleanToDos;
  }
};

const moveToDo = (e) => {
  const isChecked = e.target.checked;
  const li = e.target.parentNode;
  const text = e.target.nextSibling.innerText;

  let toDoTemps = [];
  let listName = '';

  if (isChecked) {
    toDoTemps = pending_global;
    listName = PENDING;
    $pendingList.removeChild(li);
  } else {
    toDoTemps = finished_global;
    listName = FINISHED;
    $finishedList.removeChild(li);
  }

  const cleanToDos = toDoTemps.filter((toDo) => toDo.id !== parseInt(li.id));

  toDoTemps = cleanToDos;

  saveToDo(listName, toDoTemps);

  if (listName === PENDING) {
    pending_global = cleanToDos;
    paintToDo(FINISHED, text, null);
  } else {
    finished_global = cleanToDos;
    paintToDo(PENDING, text, null);
  }
};

const saveToDo = (listName, newList) => {
  localStorage.setItem(listName, JSON.stringify(newList));
};

const paintToDo = (listName, text, id) => {
  const li = ToDoList(listName, text);
  let toDoTemps = [];
  let toDoList = [];

  if (listName === PENDING) {
    toDoTemps = pending_global;
    toDoList = $pendingList;
  } else {
    toDoTemps = finished_global;
    toDoList = $finishedList;
  }

  const newId = id === null ? toDoTemps.length + 1 : id;
  li.id = newId;
  toDoList.appendChild(li);

  const newToDo = {
    text,
    id: newId,
  };

  toDoTemps.push(newToDo);
  saveToDo(listName, toDoTemps);
};

const ToDoList = (listName, text) => {
  const li = document.createElement('li');
  const delBtn = document.createElement('button');
  const checkBox = document.createElement('input');

  checkBox.setAttribute('type', 'checkbox');
  checkBox.setAttribute('class', 'btn-check');
  checkBox.addEventListener('change', moveToDo);
  listName === FINISHED && checkBox.setAttribute('checked', true);

  delBtn.setAttribute('class', 'btn-del');
  delBtn.innerText = 'DEL';
  delBtn.addEventListener('click', deleteToDo);

  console.log(text);
  li.innerText = text;
  li.appendChild(checkBox);
  li.appendChild(delBtn);
  $pendingList.appendChild(li);
  return li;
};

const loadToDo = () => {
  const loadedPending = localStorage.getItem('pending');
  const loadedFinished = localStorage.getItem('finished');

  if (loadedPending) {
    const parsedPending = JSON.parse(loadedPending);
    parsedPending.forEach((toDo) => paintToDo(PENDING, toDo.id, toDo.item));
  }

  if (loadedFinished) {
    const parsedFinished = JSON.parse(loadedFinished);
    parsedFinished.forEach((toDo) => paintToDo(FINISHED, toDo.id, toDo.item));
  }
};

const toDoInit = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const value = e.target['todo-input'].value;
    e.target['todo-input'].value = '';
    paintToDo(PENDING, value, null);
  };
  loadToDo();
  $toDoForm.addEventListener('submit', handleSubmit);
};

toDoInit();
