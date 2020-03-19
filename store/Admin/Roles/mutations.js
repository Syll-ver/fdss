export default {
  addRole(state, data) {
    state.listRoles.push(data);
  },

  editRole(state, editedData) {
    const index = state.listRoles.findIndex(
      roles => roles.role_id === editedData.role
    );
    state.listRoles[index] = editedData;
  },

  setListRoles(state, data) {
    state.listRoles = data;
  }
};
