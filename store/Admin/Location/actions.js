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

  async fetchListPrinterLocations({ commit }) {
    return await axios({
      method: "GET",
      url: `${process.env.serverPrintUrl}/fdss/get`,
    })
      .then(res => {
        if (Array.isArray(res.data.view))
          commit("setListPrinterLocations", res.data.view);
        else commit("setListPrinterLocations", []);
        return res;
      })
      .catch(err => err);
  },

  async addLocation({commit}, data) {
    return await axios({
      method: "POST",
      url: `${this.$axios.defaults.baseURL}/api/location/add`,
      headers: {
        Authorization : `B1SESSION=${data.sessionId}`
      },
      data: {
        U_ADDRESS: data.data
      }
    }).then( res => {
      if(res.data){
        commit("addLocation", data.data);
      } else {
        commit("addLocation", []);
      }
    }).catch(err => err);
  },

  async updateLocationn({commit}, data) {
    return await axios({
      method: "PUT",
      url: `${this.$axios.defaults.baseURL}/api/location/update/${data.data.Code}`,
      headers: {
        Authorization : `B1SESSION=${data.sessionId}`
      },
      data: {
        U_ADDRESS: data.data.U_ADDRESS
      },
      validateStatus: () => true
    }).then( res => {
      if(res.data.patched) {
        commit("updateLocation", data.data);
      } else {
        commit("updateLocation", []);
      }
      return res.data
    }).catch(err => console.log(err));

  }
}