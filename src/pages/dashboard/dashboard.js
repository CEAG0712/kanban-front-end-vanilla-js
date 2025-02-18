import KanbanBoardApi from "../../services/KanbanBoardApi.js";
import Swal from "sweetalert2";
import { COLUMN_STATUS } from "../../utils/constants.js";

class Dashboard {
  constructor() {
    this.todoList = document.querySelector("#todoList");
    this.inProgressList = document.querySelector("#inProgressList");
    this.doneList = document.querySelector("#doneList");
    this.listColumns = document.querySelectorAll(".drag-item-list");
    this.createForm = document.querySelector("#newTaskForm");
    this.updateForm = document.querySelector("#updateForm");

    this.draggedItems = document.getElementsByClassName("draggableItem");
    this.dragging = false;
    this.draggedItem = `<li></li>`;

    this.taskList = [];
    this.getAllTasksFromApi();
  }

  addCreateFormSubmitEventListener() {
    this.createForm.addEventListener(
      "submit",
      this.onSubmitCreateForm.bind(this)
    );
  }

  async onSubmitCreateForm(event) {
    console.log(
      "onSubmitCreateForm form called on the create task modal submit event"
    );
    event.preventDefault();
    event.stopImmediatePropagation();

    if (!this.createForm.taskSummary.value) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Task Summary is a required field",
      });
      return;
    }

    if (this.createForm.status.value === "") {
      this.createForm.status.value = "TO_DO";
    }

    const task = {
      taskSummary: this.createForm.taskSummary.value,
      acceptanceCriteria: this.createForm.acceptanceCriteria.value,
      status: this.createForm.status.value,
    };

    try {
      await KanbanBoardApi.createNewTask(task);
      await this.getAllTasksFromApi();
      this.clearFieldsAfterSubmit();
    } catch (error) {
      console.log(error);
    }
  }

  clearFieldsAfterSubmit() {
    (this.createForm.taskSummary.value = ""),
      (this.createForm.acceptanceCriteria.value = ""),
      (this.createForm.status.value = "");
  }

  async getAllTasksFromApi() {
    try {
      const res = await KanbanBoardApi.getAllTasks();
      this.taskList = res.data.data;
    } catch (error) {
      console.log(error);
    }

    this.render();
  }

  createTaskCard = (task) => {
    const taskHTML = `
          <li draggable="true"  class="draggableItem">
           <div class="card project-task">
               <h5 class="card-header">Task ID: ${task._id}</h5>
               <div class="card-body" data-id="${task._id}">
                 <h5 class="card-title">${task.taskSummary}</h5>
                  <a href="" type="button"
                  class="btn btn-primary view-button"
                  data-bs-toggle="modal"
                   data-bs-target="#viewUpdateTaskModal">View / Update</a>
                 <button class="btn btn-danger">Delete</button>
               </div>
             </div>
           </li> 
     `;
    return taskHTML;
  };

  createTaskList = () => {
    let columns = [
      { status: COLUMN_STATUS.TO_DO_STATUS, tag: this.todoList },
      { status: COLUMN_STATUS.IN_PROGRESS_STATUS, tag: this.inProgressList },
      { status: COLUMN_STATUS.DONE_STATUS, tag: this.doneList },
    ];

    columns.forEach((item) => {
      let sortedListItemsByHierarchy = this.taskList.filter(
        (el) => el.status === item.status
      ); // Filter tasks by status
      // .sort((a, b) => a.hierarchy - b.hierarchy); // Sort by hierarchy in ascending order - DnD

      if (item?.tag) {
        item.tag.innerHTML = sortedListItemsByHierarchy
          .map((task) => {
            const taskHTML = this.createTaskCard(task);
            return taskHTML;
          })
          .join("");
      }
    });
  };

  deleteEventListener() {
    this.todoList.addEventListener("click", (event) => {
      this.deleteTaskOnClick(event);
    });
    this.inProgressList.addEventListener("click", (event) => {
      this.deleteTaskOnClick(event);
    });
    this.doneList.addEventListener("click", (event) => {
      this.deleteTaskOnClick(event);
    });
  }

  deleteTaskOnClick(event) {
    if (event.target.classList.contains("btn-danger")) {
      event.stopImmediatePropagation();
      const taskId = event.target.parentElement.dataset.id;
      this.onDelete(taskId);
    }
  }

  onDelete(taskId) {
    Swal.fire({
      title: "You are deleting project task",
      text: "this action cannot be undone",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await KanbanBoardApi.deleteTask(taskId);
          await this.getAllTasksFromApi();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Unable to delete the task at this time",
            // footer: '<a href="#">Why do I have this issue?</a>'
          });
        }
      } else {
        return;
      }
    });
  }

  viewUpdateEventListener() {
    this.todoList.addEventListener("click", (event) => {
      this.renderViewUpdateForm(event, this.updateForm);
    });
    this.inProgressList.addEventListener("click", (event) => {
      this.renderViewUpdateForm(event, this.updateForm);
    });
    this.doneList.addEventListener("click", (event) => {
      this.renderViewUpdateForm(event, this.updateForm);
    });
  }

  async renderViewUpdateForm(event) {
    if (event.target.classList.contains("view-button")) {
      event.stopImmediatePropagation();
      const taskId = event.target.parentElement.dataset.id;

      const taskToUpdate = await KanbanBoardApi.getTaskById(taskId);

      this.updateForm.taskSummary.value = taskToUpdate.data.data.taskSummary;
      this.updateForm.acceptanceCriteria.value =
        taskToUpdate.data.data.acceptanceCriteria;
      this.updateForm.status.value = taskToUpdate.data.data.status;
      this.updateForm._id.value = taskToUpdate.data.data._id;

      this.updateForm.addEventListener(
        "submit",
        this.onUpdateSubmit.bind(this)
      );
    }
  }

  async onUpdateSubmit(event) {
    event.preventDefault();

    if (!this.updateForm.taskSummary.value) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Task Summary is a required field",
        // footer: '<a href="#">Why do I have this issue?</a>'
      });
      return;
    }

    const task = {
      taskSummary: this.updateForm.taskSummary.value,
      acceptanceCriteria: this.updateForm.acceptanceCriteria.value,
      status: this.updateForm.status.value,
    };

    const taskId = this.updateForm._id.value;

    try {
      await KanbanBoardApi.updateTask(taskId, task);
      this.getAllTasksFromApi();
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Unable to update task at this time, try again later",
      });
    }
  }

  dragEventListener() {
    Array.from(this.draggedItems).map((index) =>
      index.addEventListener("dragstart", (event) => {
        this.dragTask(event);
      })
    );
  }

  dragTask = (event) => {
    if (event.target.classList.contains("draggableItem")) {
      event.stopImmediatePropagation();
      this.draggedItem = event.target;
      this.draggedItem.classList.add("dragging");

      this.dragging = true;

      // console.log(this.draggedItem);
      // console.log(this.dragging);
    }
  };

  allowDropEventListener() {
    this.listColumns.forEach((list) => {
      list.addEventListener("dragenter", (event) => this.dragEnter(list));
      list.addEventListener("dragover", (event) => this.allowDrop(event));
      list.addEventListener("drop", (event) => this.drop(event, list));
    });
  }

  dragEnter(list) {
    this.currentColumn = list;
  }

  allowDrop = (event) => {
    event.preventDefault();
  };

  drop = async (event, list) => {
    event.preventDefault();
    if (!this.dragging) return;

    const afterElement = this.getDragAfterElements(list, event.clientY);
    if (!afterElement) {
      list.appendChild(this.draggedItem);
    } else {
      list.insertBefore(this.draggedItem, afterElement);
    }

    this.dragging = false;
    this.draggedItem.classList.remove("dragging");
    const taskId = this.draggedItem.querySelector(".card-body").dataset.id;

    const listIdToStatusMap = {
      todoList: "TO_DO",
      inProgressList: "IN_PROGRESS",
      doneList: "DONE",
    };
    const statusToListIdMap = {
      TO_DO: "todoList",
      IN_PROGRESS: "inProgressList",
      DONE: "doneList",
    };

    await this.arrangeNewHierarchyInNewColumn(event, listIdToStatusMap, list);
    await this.arrangeNewHierarchyInPreviousColumn(taskId, statusToListIdMap);


  };

  getDragAfterElements = (list, y) => {
    let draggableElements = [
      ...list.querySelectorAll(".draggableItem:not(.dragging)"),
    ];
    console.log("draggableElements", draggableElements, "Y", y);

    console.log("getDragAfterElements called");

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        console.log("box.top", box.top, "box.height", box.height);
        const offset = y - box.top - box.height / 2;
        console.log("offset", offset);

        if (offset < 0 && offset > closest.offset) {
          console.log("child ", child);

          return {
            offset,
            element: child,
          };
        } else {
          console.log("closest ", closest);

          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  };

  async arrangeNewHierarchyInNewColumn(event, listIdToStatusMap, list) {
    const listId =
      event.target.id || event.target.closest(".drag-item-list").id;
    const newStatus = listIdToStatusMap[listId];

    const updatedTask = this.reArrangeTasks(list);

    try {
      await KanbanBoardApi.updateBulkTasks({
        tasks: updatedTask.map((task) => ({ ...task, status: newStatus })),
      });
      console.log(`Tasks updated successfully`);

    } catch (error) {
      console.error("Failed to update tasks:", error);
    }
  }

  async arrangeNewHierarchyInPreviousColumn(taskId, statusToListIdMap) {
    const task = this.taskList.find((el) => el._id === taskId);
    const previousList = document.getElementById(
      statusToListIdMap[task.status]
    );
    const updatedPreviousTasks = this.reArrangeTasks(previousList);

    console.log("arrangeNewHierarchyInPreviousColumn called");

    if (updatedPreviousTasks.length)
      try {
        await KanbanBoardApi.updateBulkTasks({ tasks: updatedPreviousTasks });
      } catch (error) {
        console.error("Failed to update previous list tasks:", error);
      }
  }




  reArrangeTasks = (list) => {
    let updatedTask = [];
    let tasksInColumn = Array.from(list.children);

    tasksInColumn.forEach((task, index) => {
      let taskId = task.querySelector(".card-body").dataset.id;
      let currentTask = this.taskList.find((el) => el._id === taskId);
      currentTask.hierarchy = index + 1;
      updatedTask.push(currentTask);
    });

    return updatedTask;
  };

  render() {
    this.createTaskList();
    this.dragEventListener();
    this.allowDropEventListener();
    this.deleteEventListener();
    this.addCreateFormSubmitEventListener();
    this.viewUpdateEventListener();
  }
}
export default Dashboard;
