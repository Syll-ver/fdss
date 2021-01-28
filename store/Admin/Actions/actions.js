import axios from "axios";

export default {
  async fetchListActions({ commit }, { user_actions, SessionId }) {
    return await axios({
      method: "POST",
      url: `${this.$axios.defaults.baseURL}/api/admin/actions`,
      headers: {
        Authorization: SessionId
      },
      data: {
        user_actions
      }
    })
      .then(res => {
        if (Array.isArray(res.data.actions))
          commit("setListActions", res.data.actions);
        else commit("setListActions", []);
        return res;
      })
      .catch(err => err);
  },

  async addAction(
    { commit },
    {
      U_CREATED_BY,
      user_actions,
      U_MODULE_CODE,
      U_ACTION_NAME,
      SessionId
    }
  ) {
    return await axios({
      method: "POST",
      url: `${this.$axios.defaults.baseURL}/api/admin/actions/add_action`,
      headers: {
        Authorization: SessionId
      },
      data: {
        U_CREATED_BY,
        user_actions,
        U_MODULE_CODE,
        U_ACTION_NAME
      }
    })
      .then(res => {
        commit("addAction", res.data.results);

        return res;
      })
      .catch(err => err);
  },

  async editAction(
    { commit },
    { U_UPDATED_BY, user_actions, action_details, SessionId }
  ) {
    return await axios({
      method: "PUT",
      url: `${this.$axios.defaults.baseURL}/api/admin/actions/edit_action/${action_details.Code}`,
      headers: {
        Authorization: SessionId
      },
      data: {
        user_actions,
        U_UPDATED_BY,
        ...action_details
      }
    })
      .then(async res => {
        if (res.status === 204) commit("editAction", action_details);

        return res;
      })
      .catch(err => err);
  }
};
