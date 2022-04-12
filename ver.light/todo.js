const $toDoList = document.querySelector('.todo-list');

const deleteToDo = (e) => {
  const li = e.target.parentNode;
  $toDoList.removeChild(li);
  calcRate();
};

const checkToDo = (e) => {
  const completed = Object.values(e.target.parentNode.classList).includes(
    'checked'
  );
  completed
    ? e.target.parentNode.classList.remove('checked')
    : e.target.parentNode.classList.add('checked');

  calcRate();
};

const ToDoItem = (id, text) => {
  const li = document.createElement('li');
  const delBtn = document.createElement('button');
  const checkBox = document.createElement('input');
  const textNode = document.createTextNode(text);

  checkBox.classList.add('todo-checkbox');
  checkBox.setAttribute('type', 'checkbox');
  checkBox.addEventListener('change', checkToDo);

  delBtn.classList.add('todo-delete');
  delBtn.innerText = '❌';
  delBtn.addEventListener('click', deleteToDo);

  li.id = id;
  li.classList.add('todo-item');
  li.appendChild(checkBox);
  li.appendChild(textNode);
  li.appendChild(delBtn);
  return li;
};

const paintToDo = (newId, content) => {
  const newToDo = ToDoItem(newId, content);
  $toDoList.appendChild(newToDo);
};

const calcRate = () => {
  const children = Array.from($toDoList.children);
  const total = children.length || 1;
  const completed = children.filter((item) =>
    Object.values(item.classList).includes('checked')
  ).length;

  const rate = Math.floor((completed * 100) / total);

  const progressBar = document.querySelector('.progress-bar');
  progressBar.value = rate;
  const progressPer = document.querySelector('.progress-per');
  progressPer.innerText = `${rate} %`;
};

const handleSubmit = (e) => {
  e.preventDefault();
  const content = e.target['todo-input'].value;
  if (validate(content)) {
    const newId = Math.random().toString(16).slice(2, 5);

    e.target['todo-input'].value = '';
    paintToDo(newId, content);
    calcRate();
  }
};

const validate = (content) => {
  return content || false;
};

const init = () => {
  const todoForm = document.querySelector('.todo-form');
  todoForm.addEventListener('submit', handleSubmit);
};

init();
