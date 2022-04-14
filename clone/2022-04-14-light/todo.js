const $toDoForm = document.querySelector('.todo-form');
const $toDoList = document.querySelector('.todo-list');

const checkToDo = (e) => {
  e.target.parentNode.classList.toggle('checked');
  progress();
};

const deleteToDo = (e) => {
  e.target.parentNode.remove();
  progress();
};

const updateToDo = (e) => {
  if (e.key === 'Enter') {
    const text = document.createElement('div');
    text.textContent = e.target.value;
    text.addEventListener('dblclick', editToDo);

    e.target.parentNode.insertBefore(text, e.target.parentNode.lastChild);
    e.target.remove();
  }
};

const editToDo = (e) => {
  const value = e.target.textContent;
  const input = document.createElement('input');
  input.value = value;

  input.addEventListener('keydown', updateToDo);
  e.target.parentNode.insertBefore(input, e.target.parentNode.lastChild);

  e.target.remove();
};

const ToDoItem = (value) => {
  const li = document.createElement('li');
  const delBtn = document.createElement('button');
  const checkbox = document.createElement('input');
  const text = document.createElement('div');

  delBtn.classList.add('todo-delete');
  delBtn.addEventListener('click', deleteToDo);
  delBtn.textContent = 'DEL';

  checkbox.setAttribute('type', 'checkbox');
  checkbox.classList.add('todo-checkbox');
  checkbox.addEventListener('click', checkToDo);

  text.addEventListener('dblclick', editToDo);
  text.textContent = value;

  li.classList.add('todo-item');
  li.appendChild(checkbox);
  li.appendChild(text);
  li.appendChild(delBtn);

  return li;
};

const paintToDo = (value) => {
  const newToDo = ToDoItem(value);
  $toDoList.appendChild(newToDo);
};

const progress = () => {
  const total = $toDoList.childElementCount || 1;
  const checked = $toDoList.getElementsByClassName('checked').length;

  const rate = Math.floor((checked / total) * 100);
  document.querySelector('.progress-bar').value = rate;
  document.querySelector('.progress-per').textContent = `${rate}%`;
};

const handleSubmit = (e) => {
  e.preventDefault();
  const value = e.target['todo-input'].value;
  e.target['todo-input'].value = '';
  paintToDo(value);
  progress();
};

const init = () => {
  $toDoForm.addEventListener('submit', handleSubmit);
};

init();
