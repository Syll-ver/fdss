export default {
  setListModules(state, data) {
    state.listModules = data;
  },

  addModule(state, data) {
    state.listModules.push(data);
  },

  editModule(state, editedData) {
    const index = state.listModules.findIndex(
      modules => modules.Code === editedData.Code
    );
    state.listModules[index].Name = editedData.Name;
    state.listModules[index].U_IS_ACTIVE = editedData.U_IS_ACTIVE;
  }
};
