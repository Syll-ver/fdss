export default {
    setListLocations(state, data) {
      if (state.listLocations.length < 1) state.listLocations = data;
    },

}