import apiClient from "../utils/apiClient.js";

class KanbanBoardApi {
  constructor() {}

  createNewTask(newTask) {
    return apiClient.post("/tasks", newTask);
  }

  getAllTasks() {
    return apiClient.get("/tasks");
  }

  deleteTask(taskId) {
    return apiClient.delete(`/tasks/${taskId}`);
  }

  getTaskById(taskId) {
    return apiClient.get(`/tasks/${taskId}`);
  }

  updateTask(taskId, updatedTask) {
    return apiClient.put(`/tasks/${taskId}`, updatedTask);
  }

  updateBulkTasks(updateTasks) {
    return apiClient.put(`/tasks/bulk-update`, updateTasks);
  }




}

export default new KanbanBoardApi();
