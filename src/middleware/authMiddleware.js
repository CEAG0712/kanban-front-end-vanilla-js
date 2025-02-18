import store from "../store/store.js";
import { navigateTo } from "../utils/helpers.js";
import Swal from "sweetalert2";

export const authMiddleware = (route, next) => {
    const authState = store.auth.getState();

    if (!authState?.isAuthenticated && route.auth) {
        Swal.fire({
          icon: "warning",
          title: "Wait!",
          text: "To access your Kanban Board, Please log in first!",
        });
        navigateTo("/login");
        return false;
      }

      if (authState?.isAuthenticated && !route.auth) {
        Swal.fire({
            icon: "info",
            title: "You are logged in!",
            text: "To access the register or login form, please log out",
          });
        navigateTo("/dashboard");
        return false;
      }


        next();
}