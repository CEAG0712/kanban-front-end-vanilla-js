import Swal from "sweetalert2";
import AuthenticationApi from "../../services/AuthenticationApi.js";
import store from "../../store/store.js";
import { navigateTo, eventEmitter } from "../../utils/helpers.js";

class Login {
  constructor() {
    this.loginForm = document.getElementById("login-form");
    this.render();
  }

  addSubmitEventListener() {
    this.loginForm.addEventListener(
      "submit",
      this.onSubmitLoginForm.bind(this)
    );
  }

  async onSubmitLoginForm(e) {
    e.preventDefault();

    const form = e.target;

    const payload = {
      email: form.querySelector("[name = 'email']").value,
      password: form.querySelector("[name = 'password']").value,
    };

    if (!payload.email || !payload.password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "All fields are required!",
      });
      return;
    }

    try {
      const res = await AuthenticationApi.login(payload);

      Swal.fire({
        title: "Login Successful!",
        text: "You are now ready work on your tasks!",
        icon: "success",
      });

      this.clearFieldsAfterSubmit([
        form.querySelector("[name = 'email']"),
        form.querySelector("[name = 'password']"),
      ]);

      store.auth.commit("setAuthUser", res.data.data);
      eventEmitter.emit("authStateChange", true);
      navigateTo("/dashboard");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Server Error, Please try again",
      });
    }
  }

  clearFieldsAfterSubmit(element) {
    element.forEach((item) => (item.value = ""));
  }

  render() {
    this.addSubmitEventListener();
  }
}

export default Login;
