const $toDoForm = document.querySelector('.todo-form');
const $toDoList = document.querySelector('.todo-list');

const progress = () => {
  const total = $toDoList.childNodes.length || 1;
  const checked = $toDoList.getElementsByClassName('checked').length;
  const rate = Math.floor((checked / total) * 100);

  document.querySelector('.progress-per').textContent = `${rate}%`;
  document.querySelector('.progress-bar').value = rate;
};

const updateToDo = (e, parent) => {
  if (e.key === 'Enter') {
    const text = document.createElement('span');
    text.textContent = e.target.value;
    text.addEventListener('dblclick', editToDo);
    parent.insertBefore(text, parent.lastChild);
    e.target.remove();
  }
};

const editToDo = (e) => {
  const parent = e.target.parentNode;
  const value = e.target.textContent;
  e.target.remove();

  const input = document.createElement('input');
  input.value = value;
  input.addEventListener('keydown', (e) => updateToDo(e, parent));
  parent.insertBefore(input, parent.lastChild);
};

const checkToDo = (e) => {
  e.target.parentNode.classList.toggle('checked');
  progress();
};

const deleteToDo = (e) => {
  e.target.parentNode.remove();
  progress();
};

const ToDo = (value) => {
  const li = document.createElement('li');
  const delBtn = document.createElement('button');
  const checkBox = document.createElement('input');
  const text = document.createElement('span');

  delBtn.classList.add('todo-delete');
  checkBox.classList.add('todo-checkbox');
  li.classList.add('todo-item');

  delBtn.textContent = 'DEL';
  delBtn.addEventListener('click', deleteToDo);
  checkBox.setAttribute('type', 'checkbox');
  checkBox.addEventListener('click', checkToDo);

  text.classList.add('todo-text');
  text.textContent = value;
  text.addEventListener('dblclick', editToDo);

  li.appendChild(checkBox);
  li.appendChild(text);
  li.appendChild(delBtn);

  return li;
};

const paintToDo = (value) => {
  const newToDo = ToDo(value);
  $toDoList.appendChild(newToDo);
  progress();
};

const handleSubmit = (e) => {
  e.preventDefault();
  const value = e.target['todo-input'].value;
  if (validate(value)) {
    e.target['todo-input'].value = '';
    paintToDo(value);
  }
};

const validate = (value) => {
  return value !== '';
};

const init = () => {
  $toDoForm.addEventListener('submit', handleSubmit);
};

init();
