import axios from "axios";
import Swal from "sweetalert2";

const apiClient = axios.create({
  baseURL: "https://kanban-board-vanilla-backend.azurewebsites.net/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response || error.response.status === 401) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Session time out, please login again",
      });
      localStorage.removeItem("auth");

      setTimeout(() => {
        location.href = "/login";
      }, 3000);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
