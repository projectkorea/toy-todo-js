const toDoForm = document.querySelector('.todo-form'),
  toDoInput = toDoForm.querySelector('input'),
  pendingList = document.querySelector('.js-pending'),
  finishedList = document.querySelector('.js-finished');

const PENDING = 'pending',
  FINISHED = 'finished';

let pending = [],
  finished = [];

function moveToDo(event) {
  const btn = event.target;
  const li = btn.parentNode;
  const span = btn.nextSibling.innerText;
  let toDoTemps = [];
  let stringToDos = '';
  if (btn.checked) {
    toDoTemps = pending;
    stringToDos = PENDING;
    pendingList.removeChild(li);
  } else {
    toDoTemps = finished;
    stringToDos = FINISHED;
    finishedList.removeChild(li);
  }
  const cleanToDos = toDoTemps.filter(function (toDo) {
    return toDo.id !== parseInt(li.id);
    //삭제한 리스트의 아이디만 빼고 cleanToDos에 넣는 과정
    // 삭제한 게 3이면 1 !==3 true 1리턴, 2 !==3? true 리턴 3!==3 false 3리턴x
  });
  toDoTemps = cleanToDos;
  saveToDo(stringToDos, toDoTemps);
  if (stringToDos === PENDING) {
    pending = cleanToDos;
    paintToDo(FINISHED, span, null);
  } else {
    finished = cleanToDos;
    paintToDo(PENDING, span, null);
  }
}

function saveToDo(list, todo) {
  localStorage.setItem(list, JSON.stringify(todo));
}

function deleteToDo(event) {
  const btn = event.target;
  const li = btn.parentNode;
  const ul = li.parentNode.className.split('-');
  let toDoTemps = [];
  let stringToDos = ul[1];

  if (stringToDos === PENDING) {
    toDoTemps = pending;
    pendingList.removeChild(li);
  } else {
    toDoTemps = finished;
    stringToDos = FINISHED;
    finishedList.removeChild(li);
  }
  const cleanToDos = toDoTemps.filter(function (toDo) {
    return toDo.id !== parseInt(li.id);
  });
  console.log(cleanToDos);
  toDoTemps = cleanToDos;
  saveToDo(stringToDos, toDoTemps);
  if (stringToDos === PENDING) {
    pending = cleanToDos;
  } else {
    finished = cleanToDos;
  }
}

function paintToDo(list, text, id) {
  const li = document.createElement('li'),
    delBtn = document.createElement('button'),
    checkbox = document.createElement('input'),
    span = document.createElement('span');
  let toDoTemps = [],
    toDoListTemps = [];

  checkbox.setAttribute('type', 'checkbox');
  checkbox.setAttribute('class', 'btn-chk');

  if (list === PENDING) {
    toDoTemps = pending;
    toDoListTemps = pendingList;
  } else {
    span.style.textDecoration = 'line-through';
    checkbox.setAttribute('checked', true);
    toDoTemps = finished;
    toDoListTemps = finishedList;
  }
  delBtn.setAttribute('class', 'btn-del');
  delBtn.innerText = '✖';
  delBtn.addEventListener('click', deleteToDo);
  checkbox.addEventListener('change', moveToDo);
  span.innerText = text;
  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(delBtn);

  const newId = id === null ? toDoTemps.length + 1 : id;
  li.id = newId;
  toDoListTemps.appendChild(li);
  const toDoObj = {
    text: text,
    id: newId,
  };
  toDoTemps.push(toDoObj);
  saveToDo(list, toDoTemps);
}

function handleSubmit(event) {
  event.preventDefault();
  const currentValue = toDoInput.value;
  paintToDo(PENDING, currentValue, null);
  toDoInput.value = '';
}

function loadToDo() {
  const loadedPending = localStorage.getItem(PENDING);
  const loadedFinished = localStorage.getItem(FINISHED);

  if (loadedPending !== null) {
    const parsedtoDo = JSON.parse(loadedPending);
    parsedtoDo.forEach(function (toDo) {
      paintToDo(PENDING, toDo.text, toDo.id);
    });
  }
  if (loadedFinished !== null) {
    const parsedFinished = JSON.parse(loadedFinished);
    parsedFinished.forEach(function (toDo) {
      paintToDo(FINISHED, toDo.text, toDo.id);
    });
  }
}

export function toDoInit() {
  loadToDo();
  toDoForm.addEventListener('submit', handleSubmit);
}
