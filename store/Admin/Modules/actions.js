import axios from "axios";
export default {
  async fetchListModules({ commit }, { user_actions, SessionId }) {
    return await axios({
      method: "POST",
      url: `${this.$axios.defaults.baseURL}/api/admin/modules`,
      headers: {
        Authorization: SessionId
      },

      data: {
        user_actions,
        SessionId
      }
    })
      .then(res => {
        if (Array.isArray(res.data.modules))
          commit("setListModules", res.data.modules);
        else commit("setListModules", []);

        return res;
      })
      .catch(err => err);
  },

  async createModule(
    { commit },
    { Code, user_actions, Name, SessionId, }
  ) {
    return await axios({
      method: "POST",
      url: `${this.$axios.defaults.baseURL}/api/admin/modules/add_module`,
      headers: {
        Authorization: SessionId
      },
      data: {
        Code,
        user_actions,
        Name,
        SessionId
      }
    })
      .then(res => {
        commit("addModule", res.data.results);
        return res;
      })
      .catch(err => err);
  },

  async modifyModule(
    { commit },
    { U_UPDATED_BY, user_actions, moduleData, SessionId }
  ) {
    return await axios({
      method: "PUT",
      url: `${this.$axios.defaults.baseURL}/api/admin/modules/edit_module/${moduleData.Code}`,
      headers: {
        Authorization: SessionId
      },
      data: {
        U_UPDATED_BY,
        user_actions,
        ...moduleData,
        SessionId
      }
    })
      .then(res => {
        if (res.status === 204) {
          commit("editModule", moduleData);
        }
        return res;
      })
      .catch(err => err);
  }
};
