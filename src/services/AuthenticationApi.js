import apiClient from "../utils/apiClient.js";

class AuthenticationApi {
    constructor() {}

    register(payload){
        return apiClient.post(`/users/auth/create`, payload);
    }

    login(payload) {
        return apiClient.post(`/users/auth/login`, payload);
      }


  }


  export default new AuthenticationApi();