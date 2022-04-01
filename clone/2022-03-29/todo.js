const toDoForm = document.querySelector('.todo-form');
const toDoInput = document.querySelector('.todo-input');
const pendingList = document.querySelector('.pending-list');
const finishedList = document.querySelector('.finished-list');

let pending = [];
let finished = [];

const deleteToDo = (e) => {
  const li = e.target.parentNode;
  const ul = li.parentNode.className.split('-');
  const listName = ul[0];

  let toDoTemps = [];

  if (listName === 'pending') {
    toDoTemps = pending;
    pendingList.removeChild(li);
  } else {
    toDoTemps = finished;
    finishedList.removeChild(li);
  }
  const cleanToDos = toDoTemps.filter((toDo) => toDo.id !== parseInt(li.id));

  toDoTemps = cleanToDos;

  saveToDo(listName, toDoTemps);

  listName === 'pending' //
    ? (pending = cleanToDos)
    : (finished = cleanToDos);
};

const moveToDo = (e) => {
  const isChecked = e.target.checked;
  const li = e.target.parentNode;
  const text = e.target.nextSibling.innerText;

  let toDoTemps = [];
  let listName = '';

  if (isChecked) {
    toDoTemps = pending;
    listName = 'pending';
    pendingList.removeChild(li);
  } else {
    toDoTemps = finished;
    listName = 'finished';
    finishedList.removeChild(li);
  }

  const cleanToDos = toDoTemps.filter((toDo) => toDo.id !== parseInt(li.id));

  toDoTemps = cleanToDos;

  saveToDo(listName, toDoTemps);

  if (listName === 'pending') {
    pending = cleanToDos;
    paintToDo('finished', text, null);
  } else {
    finished = cleanToDos;
    paintToDo('pending', text, null);
  }
};

const saveToDo = (listName, newList) => {
  localStorage.setItem(listName, JSON.stringify(newList));
};

const paintToDo = (listName, text, id) => {
  const li = document.createElement('li');
  const delBtn = document.createElement('button');
  const checkBox = document.createElement('input');

  let toDoTemps = [];
  let toDoListTemps = [];

  checkBox.setAttribute('type', 'checkbox');
  checkBox.setAttribute('class', 'btn-check');
  delBtn.setAttribute('class', 'btn-del');
  delBtn.innerText = 'DEL';
  delBtn.addEventListener('click', deleteToDo);
  checkBox.addEventListener('change', moveToDo);
  li.textContent = text;

  if (listName === 'pending') {
    toDoTemps = pending;
    toDoListTemps = pendingList;
  } else {
    toDoTemps = finished;
    toDoListTemps = finishedList;
    checkBox.setAttribute('checked', true);
  }

  li.appendChild(checkBox);
  li.appendChild(delBtn);

  const newId = id === null ? toDoTemps.length + 1 : id;
  li.id = newId;

  toDoListTemps.appendChild(li);

  const newToDo = {
    text,
    id: newId,
  };

  toDoTemps.push(newToDo);
  saveToDo(listName, toDoTemps);
};

const loadToDo = () => {
  const loadedPending = localStorage.getItem('pending');
  const loadedFinished = localStorage.getItem('finished');

  if (loadedPending) {
    const parsedPending = JSON.parse(loadedPending);
    parsedPending.forEach((toDo) => paintToDo('pending', toDo.text, toDo.id));
  }

  if (loadedFinished) {
    const parsedFinished = JSON.parse(loadedFinished);
    parsedFinished.forEach((toDo) => paintToDo('finished', toDo.text, toDo.id));
  }
};

const toDoInit = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const value = e.target['todo-input'].value;
    paintToDo('pending', value, null);
    toDoInput.value = '';
  };
  loadToDo();
  toDoForm.addEventListener('submit', handleSubmit);
};

toDoInit();
