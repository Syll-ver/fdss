import axios from "axios";
export default {
  async fetchUsers({ commit }, { user_actions, SessionId }) {
    return await axios({
      method: "POST",
      url: `${this.$axios.defaults.baseURL}/api/admin/users`,
      headers: {
        "Content-Type": "application/json",
        Authorization: SessionId
      },
      data: {
        user_actions
      }
    })
      .then(res => {
        if (Array.isArray(res.data.users)) commit("setUsers", res.data.users);
        else commit("setUsers", []);

        return res;
      })
      .catch(err => err);
  },

  async addUser({ commit }, { Code, user_actions, user, SessionId }) {
    delete user.Code;
    return await axios({
      method: "POST",
      url: `${this.$axios.defaults.baseURL}/api/admin/users/add_user`,
      headers: {
        Authorization: SessionId
      },
      data: {
        ...user,
        Code,
        user_actions
      }
    })
      .then(res => {
        commit("addUser", res.data.results);
        return res;
      })
      .catch(err => err);
  },

  async editUser(
    { commit },
    { U_UPDATED_BY, user_actions, userForm, SessionId }
  ) {
    return await axios({
      method: "PUT",
      url: `${this.$axios.defaults.baseURL}/api/admin/users/edit_user/${userForm.Code}`,
      headers: {
        Authorization: SessionId
      },
      data: {
        U_UPDATED_BY,
        user_actions,
        ...userForm,
        SessionId
      }
    })
      .then(res => {
        if (res.status === 204) commit("editUser", userForm);
        return res;
      })
      .catch(err => err);
  },

  async resetUserPassword(
    { commit },
    { U_UPDATED_BY, user_actions, userForm, SessionId }
  ) {
    return await axios({
      method: "PUT",
      url: `${this.$axios.defaults.baseURL}/api/admin/users/reset_password/${userForm.Code}`,
      headers: {
        Authorization: SessionId
      },
      data: {
        U_UPDATED_BY,
        user_actions,
        SessionId
      }
    })
      .then(res => {
        if (res.status === 204) commit("resetUserPassword", userForm);
        return res;
      })
      .catch(err => err);
  },

  async searchEmployees({ commit }, { SessionId, CompanyDB }) {
    return await axios({
      method: "GET",
      url: `${this.$axios.defaults.baseURL}/api/employees/${CompanyDB}`,
      headers: {
        Authorization: SessionId
      }
    })
      .then(res => {
        commit("setSearchedUsers", res.data.employees);
        return res;
      })
      .catch(err => err);
  },

  async clearSearch({ commit }) {
    commit("setSearchedUsers", []);
    return;
  },

};
