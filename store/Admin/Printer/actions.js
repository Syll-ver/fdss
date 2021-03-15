import axios from "axios";
export default {
  async fetchListPrinters({ commit }, data) {
    return await axios({
      method: "GET",
      url: `${process.env.serverPrintUrl}/fdss/get`,
    })
      .then(res => {
        if (Array.isArray(res.data.view))
          commit("setListPrinters", res.data.view);
        else commit("setListPrinters", []);
        return res;
      })
      .catch(err => err);
  },

  async addPrinter({commit}, data) {
    console.log(data);
    return await axios({
      method: "POST",
      url: `${process.env.serverPrintUrl}/fdss/add`,
      headers: {
        Authorization : `B1SESSION=${data.SessionId}`
      },
      data: {
        uuids: data.uuids,
        ip: data.ip,
        location: data.location
      }
    }).then( res => {
      console.log(res);
      if(Array.isArray(res.data.view)){
        commit("addPrinter", res.data.view);
      } else {
        commit("addPrinter", []);
      }
    }).catch(err => err);
  },

  async updatePrinter({commit}, data) {
    return await axios({
      method: "PUT",
      url: `${process.env.serverPrintUrl}/fdss/update/${data.data.Code}`,
      headers: {
        Authorization : `B1SESSION=${data.sessionId}`
      },
      data: {
        U_ADDRESS: data.data.U_ADDRESS
      },
      validateStatus: () => true
    }).then( res => {
      if(Array.isArray(res.data.view)) {
        commit("updatePrinter", res.data.view);
      } else {
        commit("updatePrinter", []);
      }
      return res.data
    }).catch(err => console.log(err));

  }
}