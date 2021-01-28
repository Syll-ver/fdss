import axios from "axios";
export default {


  async fetchCompany({ commit }, { SessionId }) {
    return await axios({
      method: "GET",
      url: `${this.$axios.defaults.baseURL}/api/companies`,
      headers: {
        Authorization: SessionId
      }
    })
      .then(res => {
        if (Array.isArray(res.data.companies))
          commit("setCompanyList", res.data.companies);
        else commit("setCompanyList", []);
        return res;
      })
      .catch(err => err);

  }




};
