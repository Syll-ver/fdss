import axios from "axios";

export default {
  async fetchRoles({ commit }, { user_actions, SessionId }) {
    return await axios({
      method: "POST",
      url: `${this.$axios.defaults.baseURL}/api/admin/roles`,
      headers: {
        "Content-Type": "application/json",
        Authorization: SessionId
      },
      data: {
        user_actions
      }
    })
      .then(res => {
        if (Array.isArray(res.data.roles))
          commit("setListRoles", res.data.roles);
        else commit("setListRoles", []);

        return res;
      })
      .catch(err => err);
  },

  async addRole(
    { commit },
    { U_CREATED_BY, roleForm, user_actions, SessionId }
  ) {
    return await axios({
      method: "POST",
      url: `${this.$axios.defaults.baseURL}/api/admin/roles/add_role`,
      headers: {
        Authorization: SessionId
      },
      data: {
        ...roleForm,
        U_CREATED_BY,
        user_actions
      }
    })
      .then(res => {
        if(res.status === 201) commit("addRole", roleForm);
        return res;
      })
      .catch(err => err);
  },

  async editRole(
    { commit },
    { U_UPDATED_BY, role_form, user_actions, SessionId }
  ) {
    return await axios({
      method: "PUT",
      url: `${this.$axios.defaults.baseURL}/api/admin/roles/edit_role/${role_form.Code}`,
      headers: {
        Authorization: SessionId
      },
      data: {
        ...role_form,
        U_UPDATED_BY,
        user_actions
      }
    })
      .then(res => {
        if (res.status === 204) commit("editRole", role_form);
        return res;
      })
      .catch(err => err);
  }
};
