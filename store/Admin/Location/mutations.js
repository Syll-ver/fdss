export default {
    setListLocations(state, data) {
      if (state.listLocations.length < 1) state.listLocations = data;
    },

    setListPrinterLocations(state, data) {
      if (state.listPrinterLocations.length < 1) state.listPrinterLocations = data;
    },

    addLocation(state, data) {
      state.listLocations.push(data)
    },

    updateLocation(state, data) {
      console.log(data);
      const location = state.listLocations.findIndex(loc => loc.Code === data.Code)
      state.listLocations.splice(location, 1);
      state.listLocations.unshift(data);
    }

}