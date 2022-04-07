const setTDos = (newTodos) => {
  todos = newTodos;
};

const getTodos = () => {
  return todos;
};

const add_todo = () => {
  const newId = id++;
  const todoInputElem = document.getElementById('todo-input');
  const newTodos = [
    ...getTodos(),
    { id: newId, content: todoInputElem.value, isCompleted: false },
  ];
  todoInputElem.value = '';
  setTodos(newTodos);
  paintTodos();
  calcRate();
};

const delete_todo = (todoId) => {
  new_todos = todos.filter((todo) => todo.id !== todoId);
  setTodos(new_todos);
  paintTodos();
  calcRate();
};

const complete_todo = (todoId) => {
  new_todos = todos.map((todo) =>
    todo.id === todoId
      ? { id: todo.id, content: todo.content, isCompleted: !todo.isCompleted }
      : todo
  );
  setTodos(new_todos);
  paintTodos();
  calcRate();
};

const ToDoList = () => {};

const paintTodos = () => {
  const todoListElem = document.getElementById('todo-list');
  todoListElem.innerHTML = null;

  todos.forEach((todo) => {
    const todoItemElem = document.createElement('li');
    todoItemElem.classList.add('todo-item');

    const checkboxElem = document.createElement('div');
    checkboxElem.classList.add('checkbox');
    checkboxElem.addEventListener('click', () => {
      complete_todo(todo.id);
    });

    const todoElem = document.createElement('div');
    todoElem.classList.add('todo');
    todoElem.innerText = todo.content;

    const delBtnElem = document.createElement('div');
    delBtnElem.classList.add('delBtn');
    delBtnElem.addEventListener('click', () => {
      delete_todo(todo.id);
    });
    delBtnElem.innerText = '❌';

    if (todo.isCompleted) {
      todoItemElem.classList.add('checked');
      checkboxElem.innerText = '✅';
    } else {
      checkboxElem.innerText = '⬜';
    }

    todoItemElem.appendChild(checkboxElem);
    todoItemElem.appendChild(todoElem);
    todoItemElem.appendChild(delBtnElem);

    todoListElem.appendChild(todoItemElem);
  });
};

const calcRate = () => {
  const total = todos.length;
  const completedTodos = todos.filter((todo) => todo.isCompleted === true);
  const completed = completedTodos.length;
  const rate = Math.floor((completed * 100) / total);

  const rateBarElem = document.getElementById('rate-bar');
  rateBarElem.value = rate;

  const ratePerElem = document.getElementById('rate-per');
  ratePerElem.innerText = `${rate} %`;
};

const init = () => {
  const addBtn = document.getElementById('addBtn');
  addBtn.addEventListener('click', () => {
    add_todo();
  });
};

init();
