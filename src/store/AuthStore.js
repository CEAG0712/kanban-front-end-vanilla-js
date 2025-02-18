class AuthStore {
  constructor() {
    this.state = JSON.parse(localStorage.getItem("auth")) || {
      user: null,
      isAuthenticated: false,
    };
  }

  getState() {
    return this.state;
  }

  commit(mutation, payload) {
    if (this.mutations[mutation]) {
      this.mutations[mutation](this.state, payload);
      this.saveState();
    } else {
      console.log(`this mutation: ${mutation} does not exist`);
    }
  }


  mutations = {
    setAuthUser(state, user) {
        state.user = user;
        state.isAuthenticated = true;
      },

      clearAuthUser(state) {
        state.user = null;
        state.isAuthenticated = false;
      },

  };

  saveState() {
    localStorage.setItem("auth", JSON.stringify(this.state));
  }

  clearState() {
    localStorage.removeItem("auth");
    this.state = {
      user: null,
      isAuthenticated: false,
    };
  }
}
export const authStore = new AuthStore();
