
//currying: create a validator for checking if a string is empty
function createValidator(errorMessage) {
  return function (value) {
    if (!value || value.trim() === "") {
      alert(errorMessage);
      return false;
    }
    return true;
  };
}
// currying: create a validator to check if date is today or in the future
function createDateValidator(errorMessage) {
  return function (date) {
    if (!date) {
      alert("Please choose a date.");
      return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert(errorMessage);
      return false;
    }
    return true;
  };
}

//task class
class Task {
    constructor(title, date, priority, completed = false) {
        this.title = title;
        this.date = date;
        this.priority = priority;
        this.completed = completed;
    }
}

  // higher-order function to create a button with given text and click handler
  function createButton(label, onClickHandler) {
    const button = document.createElement("button");
    button.textContent = label;
    button.addEventListener("click", onClickHandler);
    return button;
  }


const form = document.getElementById('form');
form.addEventListener("submit", function(event) {
    event.preventDefault();
    //get input values
    const title = document.getElementById("task").value;
    const date = document.getElementById("taskDueDate").value;
    const formattedDate = new Date(date).toLocaleDateString();
    const priority = document.getElementById("taskPriority").value;

//Validate inputs
const validateTitle = createValidator("Please enter a task title.");

if (!validateTitle(title)) return;

const validateDate = createDateValidator("Please choose a date that is today or in the future.");

if (!validateDate(date)) return;


    //create a task object using the class
    const task = new Task(title, formattedDate, priority);


    createTaskElement(task);

    //Get current tasks from storage or start with empty array
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Add the new task
    tasks.push(task);

    // Save updated list to localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));   

    //clear input fields
    document.getElementById("task").value = "";
    document.getElementById("taskDueDate").value = "";
    document.getElementById("taskPriority").value = "low";

    //message after saving task
    const message = document.getElementById("message");
    message.textContent = "Task saved successfully!";
    message.style.visibility = "visible";
    message.style.opacity = "1";


    // hide message after 2 seconds
    setTimeout(() => {
        message.style.opacity = "0";
        setTimeout(() => {
        message.style.visibility = "hidden";
        }, 500);        
    }, 2000);

    // Reset the filter to show all tasks
    const filter = document.getElementById("priorityFilter");
    filter.value = "all";
    filter.dispatchEvent(new Event("change"));


});

//load tasks from storage when page loads
window.addEventListener("DOMContentLoaded", function() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  
    savedTasks.forEach(task => {
        createTaskElement(task);
      });
      
      
  });

    // Filter tasks by priority
    const priorityFilter = document.getElementById("priorityFilter");
    priorityFilter.addEventListener("change", function () {
    const selectedPriority = priorityFilter.value;
    const tasks = document.querySelectorAll("#taskList li");

    tasks.forEach(task => {
        if (selectedPriority === "all") {
        task.style.display = "flex";
        } else {
        if (task.classList.contains(selectedPriority)) {
            task.style.display = "flex";
        } else {
            task.style.display = "none";
        }
        }
    });
    });

  //create drag and drop functionality

  let draggedItem = null;

  function createTaskElement(task) {
    const li = document.createElement("li");
    li.textContent = `${task.title} – ${task.date} [${task.priority}]`;
    li.classList.add(task.priority.toLowerCase());
    li.setAttribute("draggable", "true");

    //add completed style if the task is completed
    if (task.completed) {
        li.classList.add("completed");
      }
      

    //Drag and drop
  li.addEventListener("dragstart", function (event) {
    event.dataTransfer.setData("text/plain", null);
    draggedItem = li;
  });

  li.addEventListener("dragover", function (event) {
    event.preventDefault();
  });

  li.addEventListener("drop", function (event) {
    event.preventDefault();
    const taskList = document.getElementById("taskList");
    const items = [...taskList.children];
    if (draggedItem !== li) {
        const from = items.indexOf(draggedItem);
        const to = items.indexOf(li);
        if (from < to) {
            taskList.insertBefore(draggedItem, li.nextSibling);
        } else {
            taskList.insertBefore(draggedItem, li);
        }   
    }
    });

  //Buttons container
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  //Done button
  const doneButton = createButton(task.completed ? "Undo" : "Done", function () {
    task.completed = !task.completed;
    li.classList.toggle("completed");
    doneButton.textContent = task.completed ? "Undo" : "Done";
  
    const newTarget = task.completed
      ? document.getElementById("completedList")
      : document.getElementById("taskList");
    newTarget.appendChild(li);
  
    updateTaskInStorage(task);
  });
  
  
  buttonContainer.appendChild(doneButton);

  //Delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", function () {
    li.remove();
    removeTaskFromStorage(task);
  });
  buttonContainer.appendChild(deleteButton);

  li.appendChild(buttonContainer);
  const targetList = task.completed
  ? document.getElementById("completedList")
  : document.getElementById("taskList");
targetList.appendChild(li);

}

//updates the completed status of a task in localstorage
function updateTaskInStorage(updatedTask) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map(task =>
    task.title === updatedTask.title &&
    task.date === updatedTask.date &&
    task.priority === updatedTask.priority
      ? { ...task, completed: updatedTask.completed }
      : task
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

//remove task from localstorage
function removeTaskFromStorage(taskToRemove) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(task =>
    task.title !== taskToRemove.title ||
    task.date !== taskToRemove.date ||
    task.priority !== taskToRemove.priority
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
}