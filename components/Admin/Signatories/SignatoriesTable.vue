<template>
  <b-container fluid>
    <Loading v-if="showLoading" />
    <!-- User Interface controls -->
    <div>
      <b-row>
        <b-col lg="4" class="my-1">
          <b-form-group>
            <b-input-group size="sm">
              <b-form-input
                v-model="filter"
                type="search"
                id="signatories-search"
                placeholder="Type to Search"
              ></b-form-input>
              <b-input-group-append>
                <b-button
                  id="signatories-clear"
                  :disabled="!filter"
                  @click="filter = ''"
                  >Clear</b-button
                >
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>

        <b-col class="mt-1">
          <b-dropdown
            id="filter_signatories"
            class="shadows"
            text="Filter Status"
            style="font-size:1PX; width:8.4rem; position:relative; right:21px"
            size="sm"
            variant="outline-secondary"
          >
            <b-form-checkbox-group
              id="status_group"
              name="flavour-2"
              class="pl-2"
              style="font-size:14px"
              v-model="filterStatus"
            >
              <b-form-checkbox id="active_stat" :value="1"
                >Active</b-form-checkbox
              >
              <b-form-checkbox id="inactive_stat" :value="0"
                >Inactive</b-form-checkbox
              >
            </b-form-checkbox-group>
          </b-dropdown>
        </b-col>

        <b-col class="my-1" align="right">
          <b-button
            id="signatories-add"
            size="md"
            @click="addSignatories()"
            class="button-sq"
            variant="biotech"
            >Add Signatories
          </b-button>
        </b-col>
      </b-row>

      <!-- Main table element -->
      <div>
        <b-table
          class="table"
          id="signatories-table"
          style="font-size:15px"
          scrollable="true"
          sticky-header
          no-border-collapse
          responsive
          :filter="filter"
          show-empty
          empty-text="There are no 'Signatories' to display"
          :empty-filtered-text="`No search for ${filter}`"
          :items="filterItems"
          :fields="fields"
          :per-page="perPage"
          :current-page="currentPage"
        >
          <template v-slot:cell(U_IS_ACTIVE)="row">
            <div class="badge-font-size" v-if="row.item.U_IS_ACTIVE">
              <b-badge pill style="background-color:#3CB371">Active</b-badge>
            </div>
            <div class="badge-font-size" v-else>
              <b-badge pill variant="danger">Inactive</b-badge>
            </div>
          </template>

          <template v-slot:cell(actions)="row">
            <b-button
              id="signatories-edit"
              size="sm"
              @click="editSignatories(row.item)"
              class="button-circle mr-1"
              v-b-tooltip.hover
              title="Edit"
            >
              <font-awesome-icon style="font-size:11px" icon="edit" />
            </b-button>
          </template>
        </b-table>
      </div>

      <hr />

      <!-- table footer -->
      <div>
        <b-row>
          <b-col sm="5"> </b-col>
          <b-col sm="2" label-cols-sm class="mb-0">
            <b-form-group
              label-cols-sm="5"
              label-cols-md="2"
              label-cols-lg="3"
              label-align-sm="right"
              label-size="sm"
              label-for="perPageSelect"
              class="mb-0"
            >
              <b-form-select
                v-model="perPage"
                id="signatories-perPageSelect"
                size="sm"
                style="font-size: 12px"
                :options="pageOptions"
              ></b-form-select>
            </b-form-group>
          </b-col>
          <b-col label-cols-sm class="mb-0 mt-1">
            <div align="right" size="sm" style="color: gray; font-size: 13px;">
              {{ bottomLabel }}
            </div>
          </b-col>
          <b-col>
            <b-pagination
              id="signatories-pagination"
              pills
              v-model="currentPage"
              :total-rows="rows"
              :per-page="perPage"
              align="right"
              size="sm"
              aria-controls="signatories-table"
              limit="3"
            ></b-pagination>
          </b-col>
        </b-row>
      </div>

      <!-- ADD SIGNATORIES MODAL -->
      <b-modal
        size="md"
        header-bg-variant="biotech"
        header-text-variant="light"
        body-bg-variant="light"
        footer-bg-variant="light"
        id="bv-modal-addSignatories"
        class="modal"
        hide-header-close
        no-close-on-backdrop
      >
        <template v-slot:modal-title>
          <h6>Add Signatory</h6>
        </template>

        <b-row>
          <b-col cols="12" class="mt-2">
            <b-card class="cardShadow" style="height:19rem">
              <b-row class="mb-3">
                <b-col cols="6">
                  <b-button
                    id="add_user"
                    size="sm"
                    variant="biotech"
                    class="button"
                    style="font-size:12px; box-shadow:0px 10px 20px -10px #000000 "
                    @click="findUsers()"
                  >
                    <font-awesome-icon icon="search" class="mr-1" />Find User
                  </b-button>
                </b-col>
              </b-row>

              <small class="ml-1">First Name</small>
              <b-form-input
                id="first_name_add_modal"
                type="text"
                v-model="selectedSignatoryDetails.FirstName"
                disabled
                style="font-size:10px"
              ></b-form-input>

              <small class="ml-1">Middle Name</small>
              <b-form-input
                id="mid_name_add_modal"
                type="text"
                v-model="selectedSignatoryDetails.MiddleName"
                disabled
                style="font-size:10px"
              ></b-form-input>

              <small class="ml-1">Last Name</small>
              <b-form-input
                id="last_name_add_modal"
                type="text"
                v-model="selectedSignatoryDetails.LastName"
                disabled
                style="font-size:10px"
              ></b-form-input>

              <small class="ml-1">Position</small>
              <b-form-input
                id="position_add_modal"
                type="text"
                v-model="selectedSignatoryDetails.Position"
                disabled
                style="font-size:10px"
              ></b-form-input>
            </b-card>
          </b-col>
        </b-row>

        <template v-slot:modal-footer="{}">
          <b-button
            id="cancel-add-signatory"
            size="sm"
            @click="cancelAddSignatories()"
            style="font-size:13px;border: 0px;"
          >
            Cancel
          </b-button>
          <b-button
            id="save-add-signatory"
            size="sm"
            variant="biotech"
            @click="saveAddSignatories()"
            style="font-size:13px"
            class="button"
            :disabled="showButtonLoading === true"
            ><b-spinner
              v-show="showButtonLoading === true"
              small
              label="Spinning"
            ></b-spinner
            >Save
          </b-button>
        </template>
      </b-modal>

      <!-- EDIT SIGNATORIES MODAL -->
      <b-modal
        size="md"
        header-bg-variant="biotech"
        header-text-variant="light"
        body-bg-variant="light"
        footer-bg-variant="light"
        id="bv-modal-editSignatories"
        class="modal"
        hide-header-close
        no-close-on-backdrop
      >
        <template v-slot:modal-title>
          <h6>Edit Signatory</h6>
        </template>

        <b-row>
          <b-col cols="12" class="mt-2">
            <b-card class="cardShadow" style="height:20rem">
              <small class="ml-1">First Name</small>
              <b-form-input
                id="first_name_edit_modal"
                type="text"
                v-model="selectedSignatoryDetails.FirstName"
                disabled
                style="font-size:10px"
              ></b-form-input>

              <small class="ml-1">Middle Name</small>
              <b-form-input
                id="mid_name_edit_modal"
                type="text"
                v-model="selectedSignatoryDetails.MiddleName"
                disabled
                style="font-size:10px"
              ></b-form-input>

              <small class="ml-1">Last Name</small>
              <b-form-input
                id="last_name_edit_modal"
                type="text"
                v-model="selectedSignatoryDetails.LastName"
                disabled
                style="font-size:10px"
              ></b-form-input>

              <small class="ml-1">Position</small>
              <b-form-input
                id="position_edit_modal"
                type="text"
                v-model="selectedSignatoryDetails.Position"
                disabled
                style="font-size:10px"
              ></b-form-input>

              <small class="ml-1">Status</small>
              <b-form-select
                id="status"
                type="number"
                v-model="signatoryDetails.U_IS_ACTIVE"
                style="font-size:10px"
              >
                <option :value="1">Active</option>
                <option :value="0">Inactive</option>
              </b-form-select>
            </b-card>
          </b-col>
        </b-row>

        <template v-slot:modal-footer="{ ok, cancel }">
          <b-button
            id="cancel-update-signatory"
            size="sm"
            @click="cancel()"
            style="font-size:13px;border: 0px;"
          >
            Cancel
          </b-button>
          <b-button
            id="save-update-signatory"
            size="sm"
            variant="biotech"
            @click="saveUpdate()"
            style="font-size:13px"
            class="button"
            :disabled="showButtonLoading === true"
            ><b-spinner
              v-show="showButtonLoading === true"
              small
              label="Spinning"
            ></b-spinner
            >Save
          </b-button>
        </template>
      </b-modal>

      <!-- FIND USER MODAL -->

      <b-modal
        size="lg"
        header-bg-variant="biotech"
        header-text-variant="light"
        body-bg-variant="light"
        id="find-user-modal"
        hide-header-close
        no-close-on-backdrop
      >
        <template v-slot:modal-title>
          <h6>Find Users</h6>
        </template>

        <b-card class="cardShadow">
          <b-row class="mb-2">
            <b-col cols="4">
              <b-form-select
                style="font-size:12px"
                v-model="selectedCompany"
                @change="fetchEmployees()"
              >
                <option :value="null">Select Company</option>
                <option
                  v-for="(company, i) in companyList"
                  :key="i"
                  :value="company.ID"
                  >{{ company.COMPANYNAME }}</option
                >
              </b-form-select>
            </b-col>
            <b-col>
              <b-form-input
                id="first_name_add_modal"
                type="text"
                placeholder="Search User"
                v-model="filterUser"
                style="font-size:12px"
              ></b-form-input>
            </b-col>
            <!-- <b-button variant="success" class="button mr-1" size="sm"
              >Search

              <font-awesome-icon icon="search" />
            </b-button>-->
          </b-row>

          <b-table
            class="mt-4"
            ref="selectableTable"
            selectable
            show-empty
            :busy="isBusy"
            select-mode="single"
            :current-page="currentPageUser"
            :per-page="perPages"
            :items="SearchedUsers"
            :fields="signatoryFields"
            :filter="filterUser"
            @row-selected="onRowSelected"
            responsive="sm"
          >
            <!-- Example scoped slot for select state illustrative purposes -->
            <template v-slot:cell(selected)="{ rowSelected }">
              <template v-if="rowSelected">
                <span aria-hidden="true">&check;</span>
                <span class="sr-only">Selected</span>
              </template>
              <template v-else>
                <span aria-hidden="true">&nbsp;</span>
                <span class="sr-only">Not selected</span>
              </template>
            </template>

            <template v-slot:table-busy>
              <div class="text-center text-secondary my-2">
                <b-spinner small class="align-middle"></b-spinner>
                <strong>&nbsp;Loading...</strong>
              </div>
            </template>
          </b-table>

          <hr />

          <b-row align-h="start">
            <b-col
              label-cols-sm
              class="mb-0 mt-1 text-left"
              cols="3"
              align-h="center"
            >
              <div size="sm" style="color: gray; font-size: 11px;">
                {{ bottomLabelUser }}
              </div>
            </b-col>

            <b-col>
              <b-pagination
                id="signatories-pagination"
                pills
                v-model="currentPageUser"
                :total-rows="rowsUsers"
                :per-page="perPages"
                align="right"
                size="sm"
                aria-controls="signatories-table"
                limit="3"
              ></b-pagination>
            </b-col>
          </b-row>
        </b-card>

        <template v-slot:modal-footer="{ ok, cancel }">
          <b-button
            id="add_add_modal"
            size="sm"
            variant="biotech"
            @click="selectedUser.length > 0 ? selectUser() : ''"
            style="font-size:13px"
            class="button"
            >Select</b-button
          >
          <b-button
            id="cancel_add_modal"
            size="sm"
            @click="cancel()"
            style="font-size:13px;border: 0px;"
            >Cancel</b-button
          >
        </template>
      </b-modal>
    </div>

    <div>
      <b-alert
        id="alert-user-signatories"
        :show="alert.showAlert"
        dismissible
        :variant="alert.variant"
        @dismissed="alert.showAlert = null"
      >
        <font-awesome-icon
          :icon="
            alert.variant == 'biotech' ? 'check-circle' : 'exclamation-triangle'
          "
          class="mr-1"
          style="font-size:20px"
        />
        {{ alert.message }}
      </b-alert>
    </div>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      isBusy: false,
      selectedCompany: null,
      findUser: null,
      showButtonLoading: false,
      filterStatus: [1, 0],
      fetchData: null,
      alert: {
        showAlert: 0,
        variant: "biotech",
        message: ""
      },

      fields: [
        {
          key: "FirstName",
          label: "First Name",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "MiddleName",
          label: "Middle Name",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "LastName",
          label: "Last Name",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "Position",
          label: "Position",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "U_IS_ACTIVE",
          label: "Status",
          sortable: true,
          sortDirection: "desc"
        },

        { key: "actions", label: "Actions" }
      ],
      totalRows: null,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15],
      currentPageUser: 1,
      perPages: 5,
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterUser: null,
      filterOn: [],
      signatoryFields: [
        {
          key: "FirstName",
          label: "First Name",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "MiddleName",
          label: "Middle Name",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "LastName",
          label: "Last Name",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "Position",
          label: "Position",
          sortable: true,
          sortDirection: "desc"
        }
      ],
      selectedUser: [],
      selectedSignatoryDetails: {
        EmployeeID: null,
        FirstName: null,
        LastName: null,
        MiddleName: null,
        Position: null
      },
      signatoryDetails: {
        Code: null,
        U_EMPLOYEE_CODE: null,
        U_COMPANY_CODE: null,
        U_IS_ACTIVE: null
      }
    };
  },

  computed: {
    filterSearchedUsers() {
      return this.SearchedUsers;
    },

    filterItems() {
      return this.signatories.filter(signatories => {
        return this.filterStatus.includes(signatories.U_IS_ACTIVE);
      });
    },

    bottomLabel() {
      let end = this.perPage * this.currentPage;
      let start = end - this.perPage + 1;

      if (end > this.filterItems.length) {
        end = this.filterItems.length;
      }

      if (this.filterItems.length === 0) {
        start = 0;
      }

      return `Showing ${start} - ${end} of ${this.filterItems.length} entries`;
    },

    bottomLabelUser() {
      if (!this.filterSearchedUsers) return;

      let end = this.perPages * this.currentPageUser;
      let start = end - this.perPages + 1;

      if (end > this.filterSearchedUsers.length) {
        end = this.filterSearchedUsers.length;
      }

      if (this.filterSearchedUsers.length === 0) {
        start = 0;
      }

      return `Showing ${start} to ${end} of ${this.filterSearchedUsers.length} entries`;
    },

    ...mapGetters({
      signatories: "Admin/Signatories/getSignatoriesList",
      companyList: "Company/getCompanyList",
      SearchedUsers: "Admin/Users/getSearchedUsers"
    }),

    // rows() {
    //   return this.getListSignatories.length
    // },

    rowsUsers() {
      if (this.SearchedUsers) {
        return this.SearchedUsers.length;
      } else {
        return 0;
      }
    }
  },

  //   mounted() {
  //     // Set the initial number of items
  //     this.totalRows = this.signatories ? this.signatories.length : 0;
  //   },

  methods: {
    showAlert(message, variant) {
      this.alert = {
        showAlert: 3,
        variant,
        message
      };
    },

    // clearSelected() {
    //   this.modalOpen = false;
    //   this.$refs.userAccountstable.clearSelected();
    // },

    findUsers() {
      this.$bvModal.show("find-user-modal");
    },

    onRowSelected(items) {
      this.selectedUser = items;
    },

    fetchEmployees() {
      this.isBusy = true;
      this.$store
        .dispatch("Admin/Users/searchEmployees", {
          SessionId: localStorage.SessionId,
          CompanyDB: this.selectedCompany
        })

        .then(res => {
          if (res && res.name == "Error") {
            if (res.response && res.response.data.errorMsg) {
              if (res.response.data.errorMsg === "Invalid session.") {
                this.$bvModal.show("session_modal");
              }
              this.showAlert(res.response.data.errorMsg, "danger");
            } else {
              this.showAlert(res.message, "danger");
            }
          }

          this.isBusy = false;
        });
    },

    selectUser() {
      this.selectedSignatoryDetails = { ...this.selectedUser[0] };
      this.signatoryDetails.U_EMPLOYEE_CODE = this.selectedSignatoryDetails.EmployeeID;
      this.signatoryDetails.U_COMPANY_CODE = this.selectedCompany;
      this.$bvModal.hide("find-user-modal");
      this.findUser = null;
    },

    clearForm() {
      this.signatoryDetails = {
        U_EMPLOYEE_CODE: null,
        U_IS_ACTIVE: null
      };
      this.selectedSignatoryDetails = {
        EmployeeID: null,
        FirstName: null,
        LastName: null,
        MiddleName: null,
        Position: null
      };
    },

    addSignatories() {
      this.$bvModal.show("bv-modal-addSignatories");
    },

    editSignatories(item) {
      this.selectedSignatoryDetails = {
        FirstName: item.FirstName,
        LastName: item.LastName,
        MiddleName: item.MiddleName,
        Position: item.Position
      };
      this.signatoryDetails = {
        Code: item.Code,
        U_EMPLOYEE_CODE: item.U_EMPLOYEE_CODE,
        U_COMPANY_CODE: item.U_COMPANY_CODE,
        U_IS_ACTIVE: item.U_IS_ACTIVE
      };
      this.$bvModal.show("bv-modal-editSignatories");
    },

    async saveAddSignatories() {
      this.showButtonLoading = true;
      await this.$store
        .dispatch("Admin/Signatories/addSignatory", {
          signatoryData: this.signatoryDetails,
          signatoryDetails: this.selectedSignatoryDetails,
          U_CREATED_BY: JSON.parse(localStorage.user_details).Code,
          user_actions: JSON.parse(localStorage.user_actions),
          SessionId: localStorage.SessionId
        })
        .then(res => {
          if (res && res.name == "Error") {
            if (res.response && res.response.data.errorMsg) {
              if (res.response.data.errorMsg === "Invalid session.") {
                this.$bvModal.show("session_modal");
              }
              this.showAlert(res.response.data.errorMsg, "danger");
            } else {
              this.showAlert(res.message, "danger");
            }
            this.showButtonLoading = false;
          } else {
            this.showAlert("Success", "success");

            this.showButtonLoading = false;
            this.$bvModal.hide("bv-modal-addSignatories");
            this.clearForm();
          }
        });
    },

    cancelAddSignatories() {
      this.$bvModal.hide("bv-modal-addSignatories");
      this.resetFields();
    },

    async saveUpdate() {
      this.showButtonLoading = true;

      await this.$store
        .dispatch("Admin/Signatories/editSignatory", {
          signatoryData: this.signatoryDetails,
          signatoryDetails: this.selectedSignatoryDetails,
          U_UPDATED_BY: JSON.parse(localStorage.user_details).Code,
          user_actions: JSON.parse(localStorage.user_actions),
          SessionId: localStorage.SessionId
        })
        .then(res => {
          if (res && res.name == "Error") {
            if (res.response && res.response.data.errorMsg) {
              if (res.response.data.errorMsg === "Invalid session.") {
                this.$bvModal.show("session_modal");
              }
              this.showAlert(res.response.data.errorMsg, "danger");
            } else {
              this.showAlert(res.message, "danger");
            }
            this.showButtonLoading = false;
          } else {
            this.showAlert("Success", "success");

            this.showButtonLoading = false;
            this.$bvModal.hide("bv-modal-editSignatories");
            this.clearForm();
          }
        });
    },

    resetFields() {
      this.selectedSignatoryDetails = {
        U_APPROVER_CODE: null,
        U_COMPANY_NAME: null,
        U_FIRST_NAME: null,
        U_MIDDLE_NAME: null,
        U_LAST_NAME: null,
        U_POSITION: null,
        U_IS_ACTIVE: null
      };
    }
  },

  async beforeCreate() {
    this.$store
      .dispatch("Company/fetchCompany", {
        SessionId: localStorage.SessionId
      })

      .then(res => {
        if (res && res.name == "Error") {
          if (res.response && res.response.data.errorMsg) {
            if (res.response.data.errorMsg === "Invalid session.") {
              this.$bvModal.show("session_modal");
            }
          }
        }
      });

    this.showLoading = true;
    await this.$store
      .dispatch("Admin/Signatories/fetchSignatories", {
        SessionId: localStorage.SessionId,
        user_actions: JSON.parse(localStorage.user_actions)
      })
      .then(res => {
        if (res && res.name == "Error") {
          if (res.response && res.response.data.errorMsg) {
            if (res.response.data.errorMsg === "Invalid session.") {
              this.$bvModal.show("session_modal");
            }
          }
        }
      });
    await this.$store
      .dispatch("Admin/Roles/fetchRoles", {
        user_actions: JSON.parse(localStorage.user_actions),
        SessionId: localStorage.SessionId
      })
      .then(res => {
        if (res && res.name == "Error") {
          if (res.response && res.response.data.errorMsg) {
            if (res.response.data.errorMsg === "Invalid session.") {
              this.$bvModal.show("session_modal");
            }
          }
        }
      });

    this.showLoading = false;

    // this.$store.dispatch("Accounting_Group/fetchAccountingGroup", {
    //   token: localStorage.token
    // });
  }
};
</script>

<style>
.page-link {
  color: hsl(150, 82%, 29%);
}

.button {
  background-color: hsl(150, 82%, 29%);
  border: 0px;
}
ul {
  list-style-type: none;
}
li {
  margin-bottom: 12px;
}
.button {
  font-size: 75%;
  border: 0px;
}
.logo {
  height: 5%;
  width: 5%;
}
.table {
  overflow-y: hidden;
  font-size: 75%;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin: 0;
}

.button-circle {
  border-radius: 50%;
  width: 28px;
  height: 28px;
}

.page-item.active .page-link {
  z-index: 1;
  color: #fff;
  background-color: #0d874a;
  border-color: #0d874a;
}
.borders {
  border: 1px solid black;
}
.signature {
  font-weight: bold;
  font-size: 13px;
  position: relative;
  font-style: italic;
  bottom: 11px;
  left: 52px;
}
.custom-control-input:checked ~ .custom-control-label::before {
  color: #fff;
  border-color: #00a651;
  background-color: #00a651;
}

.steppers {
  background-color: #00a651;
  width: 49rem;
}

.cardShadow {
  box-shadow: 0px 10px 18px -19px black;
}

a {
  color: #5f6368;
  text-decoration: none;
  background-color: transparent;
}
.nav-tabs .nav-link.active,
.nav-tabs .nav-item.show .nav-link {
  background-color: white;
  border-color: white white #00a651 white;
  border-width: 0px 0px 4px 0px;
  border-radius: 0px;
  font-weight: bold;
}

.card-header {
  padding: 0.75rem 1.25rem;
  margin-bottom: 0;
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}

a:hover {
  color: #00a651;
  text-decoration: underline;
  background-color: rgb(250, 250, 250);
}

.bg-success {
  background-color: hsl(150, 82%, 29%) !important;
}
</style>
