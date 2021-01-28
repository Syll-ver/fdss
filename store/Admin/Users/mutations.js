export default {
  setUsers(state, data) {
    state.Users = data;
  },

  addUser(state, data) {
    state.Users.unshift(data);
  },

  editUser(state, data) {
    const index = state.Users.findIndex(user => user.Code === data.Code);
    let temp = state.Users[index];
    temp = { ...temp, ...data };

    state.Users.splice(index, 1);

    state.Users.push(temp);
  },

  resetUserPassword(state, data) {
    const index = state.Users.findIndex(user => user.Code === data.Code);
    state.Users.splice(index, 1);
    state.Users.push(data);
  },
  setSearchedUsers(state, data) {
    state.SearchedUsers = data;
  },
  updateSAPUser(state, user) {
    const index = state.Users.findIndex(user => user.Code == user.Code)
    state.Users[index].U_USERNAME = user.U_USERNAME
  }
};
