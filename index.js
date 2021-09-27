

/* eslint-enable */

const list = document.querySelector('.list');
const refresh = document.getElementById('delete-to-do');
const addButton = document.getElementById('add');
const clearAll = document.getElementById('clearall');

const tasks = JSON.parse(localStorage.getItem('tasksList')) || [];

function checkedTasksEvent(tasksArr, checkbox) {
  checkbox.forEach((box) => box.addEventListener('change', (e) => {
    const tmp = tasksArr.findIndex((el) => el.index === parseInt(e.target.id, 10));

    if (e.target.checked === true) {
      tasksArr[tmp].completed = true;
      e.target.nextElementSibling.classList.add('completed');
    } else {
      tasksArr[tmp].completed = false;
      e.target.nextElementSibling.classList.remove('completed');
    }

    JSON.parse(localStorage.getItem('tasksList'));
    localStorage.setItem('tasksList', JSON.stringify(tasksArr));
  }));
}


function addTaskToStorage() {
  const tasksInfo = JSON.stringify(tasks);
  localStorage.setItem('tasksList', tasksInfo);
}

function AddTask() {
  const task = {
    description: document.querySelector('.input-task').value,
    completed: false,
    index: tasks.length,
  };

  tasks.push(task);
  addTaskToStorage();
}

function deleteCompletedTask(taskArr) {
  const storeLength = JSON.parse(localStorage.getItem('tasksList')).length;

  taskArr = taskArr.filter((task) => task.completed === false);

  localStorage.setItem('tasksList', JSON.stringify(taskArr));

  window.location.reload();
  /* eslint-disable */
  taskArr.forEach((task, i) => task.index = Array.from(Array(storeLength).keys())[i]);
  /* eslint-enable */
  localStorage.setItem('tasksList', JSON.stringify(taskArr));
}

function moveToTrash(taskArr) {
  const trashCan = [...document.querySelectorAll('.trash')];
  const storeLength = JSON.parse(localStorage.getItem('tasksList')).length;

  trashCan.forEach((can) => can.addEventListener('click', () => {
    taskArr = taskArr.filter((task) => task.index !== parseInt(can.id[6], 10));
    localStorage.setItem('tasksList', JSON.stringify(taskArr));
    window.location.reload();
    /* eslint-disable */
    taskArr.forEach((task, i) => task.index = Array.from(Array(storeLength).keys())[i]);
    /* eslint-enable */
    localStorage.setItem('tasksList', JSON.stringify(taskArr));
  }));
}

function editTask(description, taskArr, event) {
  if (event.target && event.target.matches('li.li-task')) {
    if ([...description.attributes][1].value === 'false') {
      event.target.style.backgroundColor = '#fff176';
      [...description.attributes][1].value = true;

      [...[...[...event.target.children][2].children][0].children][1].classList.add('trash-active');
      [...[...[...event.target.children][2].children][0].children][0].style.display = 'none';
      moveToTrash(taskArr);
    } else if ([...description.attributes][1].value === 'true') {
      [...[...event.target.children][1].attributes][1].value = false;
      event.target.style.backgroundColor = 'white';
      const tmp = taskArr.findIndex((el) => el.index === parseInt([...description.id][5], 10));
      taskArr[tmp].description = description.textContent;

      [...[...[...event.target.children][2].children][0].children][1].classList.remove('trash-active');
      [...[...[...event.target.children][2].children][0].children][0].style.display = 'inline-block';
      addTaskToStorage();
    }
  }
}


function sortTasksbyIndex(arrTasks) {
  arrTasks.sort((task1, task2) => task1.index - task2.index);
}

function hidden() {
  while (list.lastElementChild) {
    list.removeChild(list.lastElementChild);
  }
}

function createTask(index, description, taskState) {
  const taskInfo = document.createElement('li');
  const update = document.createElement('a');

  if (taskState === true) {
    update.innerHTML = '<button  class="remove" > <i class="ellipse fa fa-ellipsis-v" aria-hidden="true"></i> <i class="trash fa fa-trash" aria-hidden="true"></i> </button>';
    taskInfo.innerHTML = `<input type="checkbox" id="${index}" class="task-box" checked> 
                            <span id ="task-${index}" contenteditable='false' class= "task-description completed"> ${description} </span>`;

    taskInfo.classList.add('li-task');
    taskInfo.appendChild(update);
    list.appendChild(taskInfo);
  } else {
    update.innerHTML = `<button   class="remove"> <i class="fa fa-ellipsis-v" aria-hidden="true"></i><i id ="trash-${index}"  class="trash fa fa-trash" aria-hidden="true"></i> </button>`;
    taskInfo.innerHTML = `<input type="checkbox" id="${index}" class="task-box"> 
                            <span id ="task-${index}" contenteditable='false' class= "task-description"> ${description} </span>`;

    taskInfo.classList.add('li-task');
    taskInfo.appendChild(update);
    list.appendChild(taskInfo);
  }
}

function loadDomList() {
  sortTasksbyIndex(tasks);
  hidden();
  tasks.forEach((task) => {
    createTask(task.index, task.description, task.completed);
  });
}
document.addEventListener('DOMContentLoaded', () => {
  JSON.parse(localStorage.getItem('tasksList'));
  loadDomList();
  const checkbox = [...document.querySelectorAll('.task-box')];
  checkedTasksEvent(tasks, checkbox);
});

addButton.addEventListener('click', () => {
  AddTask();
  loadDomList();
  window.location.reload();
});

list.addEventListener('click', (e) => {
  const desc = [...e.target.children][1];
  editTask(desc, tasks, e);
});

refresh.addEventListener('click', () => {
  localStorage.setItem('tasksList', JSON.stringify([]));
  window.location.reload();
});

clearAll.addEventListener('click', () => {
  deleteCompletedTask(tasks);
});

