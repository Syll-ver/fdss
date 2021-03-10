export default {
    setListLocations(state, data) {
      if (state.listLocations.length < 1) state.listLocations = data;
    },

    setListPrinterLocations(state, data) {
      if (state.listPrinterLocations.length < 1) state.listPrinterLocations = data;
    },

}