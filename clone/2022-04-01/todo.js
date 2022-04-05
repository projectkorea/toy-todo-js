const $toDoForm = document.querySelector('.todo-form');
const $pendingList = document.querySelector('.pending-list');
const $finishedList = document.querySelector('.finished-list');

const PENDING = 'pending';
const FINISHED = 'finished';

let pending_global = [];
let finished_global = [];

const filteredTodo = (listName, li) => {
  let toDos =
    listName === PENDING //
      ? pending_global
      : finished_global;
  const newToDo = toDos.filter((toDo) => toDo.id !== li.id);
  return newToDo;
};

const removeDOM = (listName, li) => {
  if (listName === PENDING) {
    $pendingList.removeChild(li);
  } else {
    $finishedList.removeChild(li);
  }
};

const deleteToDo = (e) => {
  const li = e.target.parentNode;
  const listName = li.parentNode.className.split('-')[0];
  const newToDo = filteredTodo(listName, li);

  removeDOM(listName, li);
  console.log(newToDo);
  saveToDo(listName, newToDo);

  listName === PENDING
    ? (pending_global = newToDo)
    : (finished_global = newToDo);
};

const moveToDo = (e) => {
  const isChecked = e.target.checked;
  const li = e.target.parentNode;
  const text = e.target.nextSibling.textContent;

  const listName = isChecked ? PENDING : FINISHED;
  const newToDo = filteredTodo(listName, li);

  removeDOM(listName, li);
  saveToDo(listName, newToDo);

  if (listName === PENDING) {
    pending_global = newToDo;
    paintToDo(FINISHED, li.id, text);
  } else {
    finished_global = newToDo;
    paintToDo(PENDING, li.id, text);
  }
};

const saveToDo = (listName, newList) => {
  localStorage.setItem(listName, JSON.stringify(newList));
};

const paintToDo = (listName, id, text) => {
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

  const newId = id === null ? Math.random().toString(16).slice(2, 10) : id;
  li.id = newId;
  toDoList.appendChild(li);

  const newToDo = {
    id: newId,
    text,
  };

  toDoTemps.push(newToDo);
  saveToDo(listName, toDoTemps);
};

const ToDoList = (listName, text) => {
  const li = document.createElement('li');
  const delBtn = document.createElement('button');
  const checkBox = document.createElement('input');
  const textNode = document.createTextNode(text);

  checkBox.setAttribute('type', 'checkbox');
  checkBox.classList.add('btn-check');
  checkBox.addEventListener('change', moveToDo);
  listName === FINISHED && checkBox.setAttribute('checked', true);

  delBtn.setAttribute('class', 'btn-del');
  delBtn.innerText = 'DEL';
  delBtn.addEventListener('click', deleteToDo);

  li.appendChild(checkBox);
  li.appendChild(textNode);
  li.appendChild(delBtn);
  $pendingList.appendChild(li);
  return li;
};

const loadToDo = () => {
  const loadedPending = localStorage.getItem('pending');
  const loadedFinished = localStorage.getItem('finished');

  if (loadedPending) {
    const parsedPending = JSON.parse(loadedPending);
    parsedPending.forEach((toDo) => paintToDo(PENDING, toDo.id, toDo.text));
  }

  if (loadedFinished) {
    const parsedFinished = JSON.parse(loadedFinished);
    parsedFinished.forEach((toDo) => paintToDo(FINISHED, toDo.id, toDo.text));
  }
};

const toDoInit = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const value = e.target['todo-input'].value;
    e.target['todo-input'].value = '';
    paintToDo(PENDING, null, value);
  };
  loadToDo();
  $toDoForm.addEventListener('submit', handleSubmit);
};

toDoInit();
