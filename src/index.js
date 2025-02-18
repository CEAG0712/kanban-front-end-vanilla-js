import "./styles/stylekanban.css";
import routes from "./routes.js";
import bootstrap from "./bootstrap.js";
import { controlNavigation } from "./utils/helpers.js";
import { runMiddleware } from "./middleware/runMiddleware.js";

export const router = async () => {
  const app = document.getElementById("app");
  const path = location.pathname || "/";
  const route = routes[path]; // "/"

  ///
  //middleware can check the route here
  runMiddleware(route, async () => {
    try {
      const res = await fetch(route.path);
      const html = await res.text();
      app.innerHTML = html;

      bootstrap(path);
    } catch (error) {
      console.log(error);
      app.innerHTML = "<h1> 404 PAGE NOT FOUND </h1>";
    }
  }); // end of runMiddleware function call
};

controlNavigation();
