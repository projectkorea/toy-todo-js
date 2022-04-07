const $pendingList = document.querySelector('.pending-list');
const $finishedList = document.querySelector('.finished-list');

const PENDING = 'pending';
const FINISHED = 'finished';

let pendingData = [];
let finishedData = [];

const saveToDo = (listName, newList) => {
  localStorage.setItem(listName, JSON.stringify(newList));
};

const removeDOM = (listName, li) => {
  listName === PENDING
    ? $pendingList.removeChild(li)
    : $finishedList.removeChild(li);
};

const deleteToDo = (e) => {
  const li = e.target.parentNode;
  const listName = li.parentNode.className.split('-')[0];

  removeDOM(listName, li);
  updateToDo('DEL', listName, li.id, null);
};

const moveToDo = (e) => {
  const isChecked = e.target.checked;
  const li = e.target.parentNode;
  const text = e.target.nextSibling.textContent;
  const listName = isChecked ? PENDING : FINISHED;

  removeDOM(listName, li);
  updateToDo('DEL', listName, li.id, null);

  if (listName === PENDING) {
    paintToDo(FINISHED, li.id, text);
    updateToDo('ADD', FINISHED, li.id, text);
  } else {
    paintToDo(PENDING, li.id, text);
    updateToDo('ADD', PENDING, li.id, text);
  }
};

const ToDoList = (listName, text) => {
  const li = document.createElement('li');
  const delBtn = document.createElement('button');
  const checkBox = document.createElement('input');
  const textNode = document.createTextNode(text);

  checkBox.classList.add('todo-checkbox');
  checkBox.setAttribute('type', 'checkbox');
  checkBox.addEventListener('change', moveToDo);

  delBtn.classList.add('todo-delete');
  delBtn.innerText = 'DEL';
  delBtn.addEventListener('click', deleteToDo);

  listName === FINISHED && checkBox.setAttribute('checked', true);
  listName === FINISHED && li.classList.add('completed');

  li.appendChild(checkBox);
  li.appendChild(textNode);
  li.appendChild(delBtn);
  $pendingList.appendChild(li);
  return li;
};

const updateToDo = (type, listName, id, text) => {
  const prevToDos = listName === PENDING ? pendingData : finishedData;
  let newToDos = '';

  switch (type) {
    case 'ADD':
      const newToDo = { id, text };
      newToDos = [...prevToDos, newToDo];
      break;
    case 'DEL':
      newToDos = prevToDos.filter((toDo) => toDo.id !== id);
      break;
    default:
      break;
  }

  saveToDo(listName, newToDos);
  listName === PENDING //
    ? (pendingData = newToDos)
    : (finishedData = newToDos);
};

const paintToDo = (listName, id, text) => {
  const li = ToDoList(listName, text);
  li.id = id;

  if (listName === PENDING) {
    $pendingList.appendChild(li);
  } else {
    $finishedList.appendChild(li);
  }
};

const loadToDo = () => {
  const pendingData = localStorage.getItem(PENDING);
  const finishedData = localStorage.getItem(FINISHED);

  pendingData &&
    JSON.parse(pendingData).forEach((todo) => {
      paintToDo(PENDING, todo.id, todo.text);
      updateToDo(PENDING, todo.id, todo.text);
    });

  finishedData &&
    JSON.parse(pendingData).forEach((todo) => {
      paintToDo(FINISHED, todo.id, todo.text);
      updateToDo(FINISHED, todo.id, todo.text);
    });
};

const handleSubmit = (e) => {
  e.preventDefault();
  const text = e.target['todo-input'].value;
  const newId = Math.random().toString(16).slice(2, 5);

  e.target['todo-input'].value = '';
  paintToDo(PENDING, newId, text);
  updateToDo('ADD', PENDING, newId, text);
};

const init = () => {
  document.querySelector('.todo-form').addEventListener('submit', handleSubmit);
  loadToDo();
};

init();
