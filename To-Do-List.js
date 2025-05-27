let taskList = document.getElementById("taskList");
let addTodoButton1 = document.getElementById("addTodoButton");
let saveTodoButton = document.getElementById("saveButton");
let todoUndoButton = document.getElementById("undoButton");
let todoResetButton = document.getElementById("resetButton");
let deletedTodosStock = [];



function getTodoListFromLocalStorage(){
  let stringifiedTodoList = localStorage.getItem("todoList");
  let parsedTodoList = JSON.parse(stringifiedTodoList);
  if (parsedTodoList === null){
    return[];
  }else {
    return parsedTodoList;
  }
}

let todoList = getTodoListFromLocalStorage();

/*let todoList = [
  {
    text: "HTML",
    uniqueId: 1
  },
  {
    text: "CSS",
    uniqueId: 2
  },
  {
    text: "JS",
    uniqueId: 3
  }
];*/

let todoCount = parseInt(localStorage.getItem("todoCount")) || 0;

saveTodoButton.onclick = function(){

  localStorage.setItem("todoList", JSON.stringify(todoList));
  localStorage.setItem("todoCount", todoCount);

  deletedTodosStock = [];
  todoUndoButton.disabled = true;
};

function addTodoButton(){
  
  let userInputElement = document.getElementById("taskInput");
  let userInputValue = userInputElement.value;

  if (userInputValue === ""){
    alert("Enter Valid Input");
    return;
  }

  todoCount += 1;
  localStorage.setItem("todoCount", todoCount);

  let newTodo = {
    text: userInputValue,
    uniqueId: todoCount,
    isChecked: false
  };
  todoList.push(newTodo);
  createAndAppendTodo(newTodo);
  userInputElement.value= "";

}

addTodoButton1.onclick = function(){
  addTodoButton();
}

taskList.addEventListener("keydown", function(event){
  if (event.key == "Enter") {
    addTodoButton()
  }
});


function onTodoStatusChange(labelId, todoId){
  
  let labelElement = document.getElementById(labelId);
  labelElement.classList.toggle("checked");
  
  let todoObjectIndex = todoList.findIndex(function(eachTodo){
    let eachTodoId = "todoId" + eachTodo.uniqueId;
    if (eachTodoId === todoId){
      return true;
    }else {
      return false;
    }
  })
  let todoObject = todoList[todoObjectIndex];

  if (todoObject.isChecked === true){
    todoObject.isChecked = false;
  }else {
    todoObject.isChecked = true;
  }
}

function onDeleteTodo(todoId){
  let deleteList = document.getElementById(todoId);
  taskList.removeChild(deleteList);

  let deleteTodoIndex = todoList.findIndex(function(eachTodo){
    let eachTodoId = "todoId" + eachTodo.uniqueId;
    if (eachTodoId === todoId){
      return true;
    }else{
      return false;
    }

  });

  if (deleteTodoIndex !== -1){
    deletedTodosStock.push(todoList[deleteTodoIndex]);
    todoUndoButton.disabled = false;
  }

  todoList.splice(deleteTodoIndex, 1);
}


todoUndoButton.onclick = function(){
  if (deletedTodosStock.length === 0)return;

  let lastDeleted = deletedTodosStock.pop();
  todoList.push(lastDeleted);
  createAndAppendTodo(lastDeleted);

  if (deletedTodosStock === 0){
    todoUndoButton.disabled = true;
  }
}

todoResetButton.onclick = function(){
  let confirmReset = confirm("Are you sure want to reset all tasks?");
  if (!confirmReset) return;

  localStorage.removeItem("todoList");
  localStorage.removeItem("todoCount");

  todoList = [];
  todoCount = 0;
  deletedTodosStock = [];

  taskList.innerHTML = "";
  todoUndoButton.disabled = true;

  alert("Todo list has been reset.");
}


 /* if (checkboxElement.checked === true){
    labelElement.classList.add("checked");
  }
  else{
    labelElement.classList.remove("checked");
  }
}
*/

function createAndAppendTodo(todo){
  let checkboxId = "checkboxInput"+todo.uniqueId;
  let labelId = "labelId"+todo.uniqueId;
  let todoId = "todoId"+todo.uniqueId;

  let todoElement = document.createElement("li");
  todoElement.classList.add("todo-item-container", "d-flex", "flex-row");
  todoElement.id = todoId;
  taskList.appendChild(todoElement);

  let checkboxElement = document.createElement("input");
  checkboxElement.type = "checkbox";
  checkboxElement.id = checkboxId;
  checkboxElement.classList.add("checkbox-input");
  checkboxElement.checked = todo.isChecked;
  checkboxElement.onclick = function(){
    onTodoStatusChange(labelId, todoId);
  }
  todoElement.appendChild(checkboxElement);

  let labelElement = document.createElement("label");
  labelElement.setAttribute('for', checkboxId);
  labelElement.id = labelId;
  labelElement.classList.add("checkbox-label");
  labelElement.textContent = todo.text;
  if (todo.isChecked === true){
    labelElement.classList.add("checked");
  }
  todoElement.appendChild(labelElement);

  let deleteIcon = document.createElement("i");
  deleteIcon.classList.add("delete-icon", "far", "fa-trash-alt", "delete-icon");
  deleteIcon.onclick = function(){
    onDeleteTodo(todoId);
  }
  todoElement.appendChild(deleteIcon);

}



for (let todo of todoList){
    createAndAppendTodo(todo);
  }
