import Swal from "sweetalert2";

import { navigateTo } from "../../utils/helpers.js";

import AuthenticationApi from "../../services/AuthenticationApi.js";

class Register {
  constructor() {
    this.registrationForm = document.getElementById("registration-form");
    this.render();
  }

  addSubmitEventListener() {
    this.registrationForm.addEventListener(
      "submit",
      this.onSubmitRegisterForm.bind(this)
    );
  }

  async onSubmitRegisterForm(e) {
    e.preventDefault();
    const form = e.target;

    const payload = {
      name: form.querySelector("[name='name']").value,
      email: form.querySelector("[name = 'email']").value,
      password: form.querySelector("[name = 'password']").value,
      confirmPassword: form.querySelector("[name = 'confirmPassword']").value,
    };

    //payload.name, payload.email, payload.password, and payload.confirmPassword.

    if (
      !payload.name ||
      !payload.email ||
      !payload.password ||
      !payload.confirmPassword
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "All fields are required!",
      });

      return;
    }

    if (payload.password !== payload.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Your password do not match",
      });
      return;
    }

    try {
      await AuthenticationApi.register(payload);

      this.clearFieldsAfterSubmit([
        form.querySelector("[name='name']"),
        form.querySelector("[name = 'email']"),
        form.querySelector("[name = 'password']"),
        form.querySelector("[name = 'confirmPassword']"),
      ]);

      Swal.fire({
        title: "Registration Successful!",
        text: "You are now ready to login!",
        icon: "success",
      });

      navigateTo("/login");
    } catch (error) {
      console.log(error);

      //alert(error?.response?.data?.message ?? " Something went wrong"); //coalesce
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error?.response?.data ?? " Something went wrong",
        // footer: '<a href="#">Why do I have this issue?</a>'
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

export default Register;
