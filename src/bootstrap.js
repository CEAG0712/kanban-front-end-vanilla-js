const bootstrap = async (path) => {
  try {
    let module;

    switch (path) {

      case "/login":
        module = await import("./pages/auth/login.js");
        break;

      case "/register":
        module = await import("./pages/auth/register.js");
        break;

        case "/dashboard":
        module = await import("./pages/dashboard/dashboard.js");
        break;


      default:
        console.log(`no module found for ${path}`);
        break;
    }

    if(module){
      const Class = module.default || module;

      if (typeof Class === "function") {
        console.log("new class instantiated");
        new Class();
      }

    }


  } catch (error) {
    console.log(error, "error loading the module");
  }
};

export default bootstrap;
