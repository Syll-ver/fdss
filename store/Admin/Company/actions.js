import axios from "axios";
export default {
  async fetchListCompany({ commit }, { user_actions, SessionId }) {
    return await axios({
      method: "POST",
      url: `${this.$axios.defaults.baseURL}/admin/companies`,
      headers: {
        Authorization: SessionId
      },
      data: {
        user_actions
      },
      proxy: {
        host: '192.168.36.35',
        port: 3128
      }
      // params: {
      //   Admin: Admin ? "Y" : null
      // }
    })
      .then(res => {
        if (Array.isArray(res.data.companies))
          commit("setListCompanies", res.data.companies);
        else commit("setListCompanies", []);
        return res;
      })
      .catch(err => err);
  },

  async addCompany(
    { commit },
    { U_CREATED_BY, user_actions, company_details, SessionId }
  ) {
    return await axios({
      method: "POST",
      url: `${this.$axios.defaults.baseURL}/admin/companies/add`,
      headers: {
        Authorization: SessionId
      },
      data: {
        U_CREATED_BY,
        user_actions,
        ...company_details
      }
    })
      .then(res => {
        commit("addCompany", res.data.result);

        return res;
      })
      .catch(err => err);
  },

  async editCompany(
    { commit },
    { company_details, U_UPDATED_BY, user_actions, SessionId }
  ) {
    return await axios({
      method: "PUT",
      url: `${this.$axios.defaults.baseURL}/admin/companies/edit/${company_details.Code}`,
      headers: {
        Authorization: SessionId
      },
      data: {
        ...company_details,
        U_UPDATED_BY,
        user_actions
      }
    })
      .then(async res => {
        if (res.status === 204) commit("editCompany", company_details);

        return res;
      })
      .catch(err => err);
  }
};
