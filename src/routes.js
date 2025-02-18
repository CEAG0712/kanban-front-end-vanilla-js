const routes = {
  "/": {
    path: "/pages/landing.html",
  },

  "/register": {
    path: "/pages/auth/register.html",
  },

  "/login": {
    path: "/pages/auth/login.html",
  },

  "/dashboard": {
    path: "/pages/dashboard/dashboard.html",
    auth: true,
  },
};

export default routes;
