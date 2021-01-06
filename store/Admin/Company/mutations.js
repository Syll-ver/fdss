export default {
  setListCompanies(state, data) {
    if (state.listCompanies.length < 1) state.listCompanies = data;
  },

  addCompany(state, data) {
    state.listCompanies.push(data);
  },

  editCompany(state, data) {
    const index = state.listCompanies.findIndex(
      company => company.Code === data.Code
    );
    state.listCompanies[index].U_IS_ACTIVE = data.U_IS_ACTIVE;
  }
};
