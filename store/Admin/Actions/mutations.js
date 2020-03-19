export default {
  setListActions(state, data) {
    state.listActions = data;
  },

  addAction(state, data) {
    state.listActions.push(data);
  },

  editAction(state, data) {
    const index = state.listActions.findIndex(
      action => action.Code === data.Code
    );
    state.listActions[index].U_IS_ACTIVE = data.U_IS_ACTIVE;
  }
};
