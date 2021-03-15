export default {
    setListPrinters(state, data) {
      if (state.listPrinters.length < 1) state.listPrinters = data;
    },

    addPrinter(state, data) {
      state.listPrinters.push(data)
    },

    updatePrinter(state, data) {
      console.log(data);
      const printer = state.listPrinters.findIndex(loc => loc.Code === data.Code)
      state.listPrinters.splice(printer, 1);
    }

}