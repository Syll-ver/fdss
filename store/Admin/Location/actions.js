import axios from "axios";
export default {
  async fetchListLocations({ commit }) {
    return await axios({
      method: "GET",
      url: `${this.$axios.defaults.baseURL}/api/location/select`,
    })
      .then(res => {
        if (Array.isArray(res.data.view))
          commit("setListLocations", res.data.view);
        else commit("setListLocations", []);
        return res;
      })
      .catch(err => err);
  },
}