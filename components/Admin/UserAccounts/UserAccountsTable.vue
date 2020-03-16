<template>
  <b-container fluid>
    <Loading v-if="showLoading" />
    <div>
      <b-alert
        :show="alert.showAlert"
        dismissible
        :variant="alert.variant"
        @dismissed="alert.showAlert = null"
      >
        <font-awesome-icon
          :icon="alert.variant == 'success' ? 'check-circle' : 'exclamation'"
          class="mr-1"
          style="font-size:20px"
        />
        {{ alert.message }}
      </b-alert>
    </div>
    <div>
      <!-- Main table -->
      <b-row>
        <b-col>
          <b-button
            id="add_user"
            size="sm"
            class="button"
            style="font-size:12px; box-shadow:0px 10px 20px -10px #000000 "
            @click="addUser()"
            v-if="actions.addUser"
          >
            <font-awesome-icon icon="plus" class="mr-1" />Add User
          </b-button>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="4" class="mt-3">
          <b-form-group>
            <b-input-group size="sm">
              <b-form-input
                v-model="filter"
                type="search"
                id="search_user"
                placeholder="Search User"
              ></b-form-input>
            </b-input-group>
          </b-form-group>
        </b-col>

        <b-col class="mt-3">
          <b-dropdown
            id="filter_module"
            text="Filter Status"
            style="font-size:1PX; width:8.4rem; position:relative; right:21px; box-shadow:10px 10px 15px -2px rgba(0,0,0,0.095)"
            size="sm"
            variant="secondary"
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

        <b-col cols="1" offset="4" class="mb-2 mt-3">
          <b-form-group class="mb-0">
            <b-form-select
              v-model="perPage"
              id="perPageSelect_user"
              size="sm"
              :options="pageOptions"
            ></b-form-select>
          </b-form-group>
        </b-col>
      </b-row>

      <!-- Main table element -->
      <b-table
        id="user-table"
        class="table"
        style="font-size:15.5px; max-height: 100%;"
        show-empty
        scrollable="true"
        sticky-header
        no-border-collapse
        :items="filterItems"
        :fields="filterFields"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        :filterIncludedFields="filterOn"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :sort-direction="sortDirection"
        @filtered="onFiltered"
        responsive
      >
        <template v-slot:cell(actions)="row">
          <b-button
            id="edit_user"
            size="sm"
            @click="edit(row.item)"
            class="mr-1 button-circle"
            style="font-size:12px; "
            v-b-tooltip.hover
            title="Edit"
            v-if="actions.editUser"
          >
            <font-awesome-icon icon="edit" />
          </b-button>

          <b-button
            id="update_user"
            size="sm"
            variant="info"
            @click="update(row.item)"
            class="mr-1 button-circle"
            style="font-size:12px; "
            v-b-tooltip.hover
            title="Update"
            v-if="actions.updateUser && row.item.ApplicationUserID"
          >
            <font-awesome-icon icon="sync" />
          </b-button>

          <b-button
            id="reset_user_password"
            size="sm"
            @click="resetpassword(row.item)"
            class="mr-1 button-circle"
            variant="danger"
            style="font-size:12px; "
            v-b-tooltip.hover
            title="Reset Password"
            v-if="actions.resetPassword && !row.item.ApplicationUserID"
          >
            <font-awesome-icon icon="undo-alt" />
          </b-button>
        </template>

        <template v-slot:cell(U_ROLE_CODE)="row">
          <div style="font-size:11.5px">
            {{
              listRoles.find(
                listRoles => listRoles.role_id === row.item.role_id
              )
                ? listRoles.find(
                    listRoles => listRoles.Code === row.item.U_ROLE_CODE
                  ).Name
                : ""
            }}
          </div>
        </template>

        <template v-slot:cell(U_IS_ACTIVE)="row">
          <div style="font-size:15px">
            <b-badge
              style="width:70px"
              pill
              :variant="row.item.U_IS_ACTIVE ? 'success' : 'secondary'"
              >{{ row.item.U_IS_ACTIVE ? "Active" : "Inactive" }}</b-badge
            >
          </div>
        </template>
      </b-table>

      <hr />

      <b-row>
        <b-col
          label-cols-sm
          class="mb-0 mt-1 text-left"
          cols="3"
          align-h="center"
        >
          <div size="sm" style="color: gray; font-size: 11px;">
            {{ bottomLabel }}
          </div>
        </b-col>
        <b-col cols="4" offset="5">
          <b-pagination
            id="modules-pagination"
            pills
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            align="right"
            size="sm"
            aria-controls="modules-table"
            limit="3"
          ></b-pagination>
        </b-col>
      </b-row>

      <!-- Main table -->

      <!-- Add User -->

      <b-modal
        size="lg"
        header-bg-variant="success"
        header-text-variant="light"
        body-bg-variant="light"
        id="add-user-modal"
      >
        <template v-slot:modal-title>
          <h6>Add User</h6>
        </template>

        <b-row>
          <b-col cols="6" class="mt-2">
            <b-card class="cardShadow" style="height:17.5rem">
              <b-row class="mb-3">
                <b-col cols="6">
                  <b-button
                    id="add_user"
                    size="sm"
                    variant="success"
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
                v-model="selectedUserDetails.FirstName"
                disabled
                style="font-size:10px"
              ></b-form-input>

              <small class="ml-1">Middle Name</small>
              <b-form-input
                id="mid_name_add_modal"
                type="text"
                v-model="selectedUserDetails.MiddleName"
                disabled
                style="font-size:10px"
              ></b-form-input>

              <small class="ml-1">Last Name</small>
              <b-form-input
                id="last_name_add_modal"
                type="text"
                v-model="selectedUserDetails.LastName"
                disabled
                style="font-size:10px"
              ></b-form-input>
            </b-card>

            <b-card class="cardShadow mt-4">
              <small class="ml-1">Email</small>
              <b-form-input
                id="email_add_modal"
                type="email"
                v-model="selectedUserDetails.eMail"
                disabled
                style="font-size:10px"
              ></b-form-input>
            </b-card>
          </b-col>

          <b-col class="mt-4">
            <b-card class="cardShadow" style="position:relative; bottom:14px">
              <small class="ml-1">SAP User</small>

              <b-form-select
                id="act_grp_add_modal"
                type="number"
                v-model="userDetails.U_IS_SAP_USER"
                style="font-size:10px"
                disabled
              >
                <option :value="null">Yes/No</option>
                <option :value="1">Yes</option>
                <option :value="0">No</option>
              </b-form-select>
            </b-card>

            <b-card
              class="cardShadow mt-4"
              style="position:relative; bottom:14px"
            >
              <small class="ml-1">Username</small>

              <b-form-input
                id="act_grp_add_modal"
                type="text"
                v-model="userDetails.U_USERNAME"
                style="font-size:10px"
                :disabled="userDetails.U_IS_SAP_USER === 1"
              ></b-form-input>
            </b-card>

            <b-card
              class="cardShadow mt-4"
              style="position:relative; bottom:14px"
            >
              <small class="ml-1">Role</small>
              <b-form-select
                id="role_add_modal"
                type="number"
                v-model="userDetails.U_ROLE_CODE"
                style="font-size:10px"
              >
                <option :value="null">Select Role</option>

                <option
                  :value="role.Code"
                  v-for="(role, i) in listRoles"
                  :key="i"
                  >{{ role.Name }}</option
                >
              </b-form-select>
            </b-card>

            <b-card
              class="cardShadow mt-4"
              style="position:relative; bottom:14px"
            >
              <small class="ml-1">Company</small>
              <b-form-select
                style="font-size:10px"
                v-model="userDetails.U_COMPANY_ACCESS"
              >
                <option :value="null" disabled>Select Company</option>
                <option :value="null">None</option>

                <option
                  v-for="(company, i) in companyList"
                  :key="i"
                  :value="company.ID"
                  >{{ company.COMPANYNAME }}</option
                >
              </b-form-select>
            </b-card>
          </b-col>

          <!-- <b-col cols="6" class="mt-3">
           
          </b-col>-->
        </b-row>

        <template v-slot:modal-footer="{}">
          <b-button
            id="add_add_modal"
            size="sm"
            variant="success"
            @click="addUserTable()"
            style="font-size:13px"
            class="button"
            :disabled="showButtonLoading === true"
          >
            <b-spinner
              v-show="showButtonLoading === true"
              small
              label="Spinning"
            ></b-spinner
            >Add
          </b-button>

          <b-button
            id="cancel_add_modal"
            size="sm"
            @click="cancelUser()"
            style="font-size:13px;border: 0px;"
            >Cancel</b-button
          >
        </template>
      </b-modal>

      <!-- Add User -->

      <!-- Find User -->

      <b-modal
        size="lg"
        header-bg-variant="success"
        header-text-variant="light"
        body-bg-variant="light"
        id="find-user-modal"
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
            :fields="userFields"
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
                id="modules-pagination"
                pills
                v-model="currentPageUser"
                :total-rows="rowsUsers"
                :per-page="perPages"
                align="right"
                size="sm"
                aria-controls="modules-table"
                limit="3"
              ></b-pagination>
            </b-col>
          </b-row>
        </b-card>

        <template v-slot:modal-footer="{ ok, cancel }">
          <b-button
            id="add_add_modal"
            size="sm"
            variant="success"
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

      <!-- Find User -->

      <!-- Edit -->

      <b-modal
        size="lg"
        body-bg-variant="light"
        header-bg-variant="success"
        header-text-variant="light"
        id="edit-modal"
      >
        <template v-slot:modal-title>
          <h6>Edit User</h6>
        </template>

        <b-row>
          <b-col cols="6">
            <b-card class="cardShadow" style="height:13.8rem">
              <small class="ml-1">First Name</small>
              <b-form-input
                id="fname_edit_modal"
                type="text"
                v-model="selectedUserDetails.FirstName"
                style="font-size:10px"
                disabled
              ></b-form-input>

              <small class="ml-1">Middle Name</small>
              <b-form-input
                id="mname_edit_modal"
                type="text"
                v-model="selectedUserDetails.MiddleName"
                style="font-size:10px"
                disabled
              ></b-form-input>

              <small class="ml-1">Last Name</small>
              <b-form-input
                type="text"
                id="lname_edit_modal"
                v-model="selectedUserDetails.LastName"
                style="font-size:10px"
                disabled
              ></b-form-input>
            </b-card>

            <b-card class="cardShadow mt-4">
              <small class="ml-1">Email</small>
              <b-form-input
                id="email_edit_modal"
                type="email"
                v-model="selectedUserDetails.eMail"
                style="font-size:10px"
                disabled
              ></b-form-input>
            </b-card>

            <!-- <h6 class="mb-4 mt-2">Employee ID</h6>
            <b-card class="cardShadow" style="position:relative; bottom:14px">
              <small class="ml-1">Employee ID</small>
              <b-form-input
                id="emp_id_edit_modal"
                type="number"
                v-model="userDetails.U_EMPLOYEE_CODE"
                style="font-size:10px"
              ></b-form-input>
            </b-card>-->
          </b-col>

          <b-col cols="6" class="mt-3">
            <b-card class="cardShadow" style="position:relative; bottom:14px">
              <small class="ml-1">SAP User</small>

              <b-form-select
                id="act_grp_add_modal"
                type="number"
                v-model="userDetails.U_IS_SAP_USER"
                style="font-size:10px"
                disabled
              >
                <option :value="null">Yes/No</option>
                <option :value="1">Yes</option>
                <option :value="0">No</option>
              </b-form-select>
            </b-card>

            <b-card
              class="cardShadow mt-4"
              style="position:relative; bottom:14px"
            >
              <small class="ml-1">Username</small>

              <b-form-input
                id="act_grp_add_modal"
                type="text"
                v-model="userDetails.U_USERNAME"
                style="font-size:10px"
                :disabled="userDetails.U_IS_SAP_USER === 1 ? '' : disabled"
              ></b-form-input>
            </b-card>

            <b-card class="cardShadow mt-3">
              <small class="ml-1">Role</small>
              <b-form-select
                id="role_edit_modal"
                type="number"
                v-model="userDetails.U_ROLE_CODE"
                style="font-size:10px"
              >
                <option :value="null" disabled>Select Role</option>
                <option
                  :value="role.Code"
                  v-for="(role, i) in listRoles"
                  :key="i"
                  >{{ role.Name }}</option
                >
              </b-form-select>
            </b-card>
          </b-col>
        </b-row>

        <b-row>
          <!-- <b-col cols="6">
            <b-card class="cardShadow mt-4" style="position:relative; TOP:14px">
              <small class="ml-1">Company</small>
              <b-form-select
                style="font-size:10px"
                v-model="userDetails.U_COMPANY_ACCESS"
              >
                <option :value="null" disabled>Select Company</option>
                <option :value="null">None</option>

                <option
                  v-for="(company, i) in companyList"
                  :key="i"
                  :value="company.ID"
                  >{{ company.COMPANYNAME }}</option
                >
              </b-form-select>
            </b-card>
          </b-col> -->

          <b-col cols="6" class="mt-4 mb-1">
            <b-card class="cardShadow">
              <small class="ml-1">Status</small>
              <b-form-select
                type="number"
                id="stat_edit_modal"
                v-model="userDetails.U_IS_ACTIVE"
                style="font-size:10px"
              >
                <option :value="1">Active</option>
                <option :value="0">Inactive</option>
              </b-form-select>
            </b-card>
          </b-col>

          <b-col cols="6" class="mt-4 mb-1">
            <b-card
              class="cardShadow"
            >
              <small class="ml-1">Company</small>
              <b-form-select
                style="font-size:10px"
                v-model="userDetails.U_COMPANY_ACCESS"
              >
                <option :value="null" disabled>Select Company</option>
                <option :value="null">None</option>

                <option
                  v-for="(company, i) in companyList"
                  :key="i"
                  :value="company.ID"
                  >{{ company.COMPANYNAME }}</option
                >
              </b-form-select>
            </b-card>
          </b-col>
        </b-row>

        <template v-slot:modal-footer="{ ok, cancel }">
          <b-button
            size="sm"
            id="edt_edit_modal"
            variant="success"
            @click="editTable()"
            style="font-size:13px"
            class="button"
            >Edit</b-button
          >
          <b-button
            size="sm"
            id="cncl_edit_modal"
            @click="cancel()"
            style="font-size:13px;border: 0px;"
            >Cancel</b-button
          >
        </template>
      </b-modal>

      <!-- Edit -->

      <!-- Update -->

      <b-modal
        size="sm"
        header-bg-variant="success"
        header-text-variant="light"
        id="update-user-modal"
      >
        <template v-slot:modal-title>
          <h6>Update SAP User</h6>
        </template>

        <div class="text-left">
          <h6>Do you want to update user?</h6>
        </div>

        <template v-slot:modal-footer="{ ok, cancel }">
          <b-button
            size="sm"
            class="button"
            variant="success"
            @click="confirmUpdate()"
            style="font-size:13px"
            >Update</b-button
          >
          <b-button
            size="sm"
            @click="cancel()"
            style="font-size:13px;border: 0px;"
            >Cancel</b-button
          >
        </template>
      </b-modal>
      <!-- Update modal -->

      <!-- Reset -->

      <b-modal
        size="sm"
        header-bg-variant="danger"
        header-text-variant="light"
        id="reset-modal"
      >
        <template v-slot:modal-title>
          <h6>Reset Password</h6>
        </template>

        <div class="text-left">
          <h6>Do you want to reset user password?</h6>
        </div>

        <template v-slot:modal-footer="{ ok, cancel }">
          <b-button
            size="sm"
            variant="danger"
            @click="confirmReset()"
            style="font-size:13px"
            >Reset</b-button
          >
          <b-button
            size="sm"
            @click="cancel()"
            style="font-size:13px;border: 0px;"
            >Cancel</b-button
          >
        </template>
      </b-modal>
      <!-- Reset modal -->
    </div>
  </b-container>
</template>

<script>
import moment from "moment";
import { mapMutations } from "vuex";
import { mapGetters } from "vuex";
import Loading from "~/components/Loading.vue";

export default {
  components: {
    Loading
  },
  data() {
    return {
      isBusy: false,
      selectedCompany: null,
      showButtonLoading: false,
      showLoading: false,
      findUser: null,
      filterStatus: [1],
      actions: {
        addUser: false,
        editUser: false,
        resetPassword: false,
        updateUser: false
      },
      alert: {
        showAlert: 0,
        variant: "success",
        message: ""
      },
      userDetails: {
        Code: null,
        U_EMPLOYEE_CODE: null,
        U_COMPANY_ACCESS: null,
        U_COMPANY_CODE: null,
        U_ROLE_CODE: null,
        U_IS_ACTIVE: null,
        U_IS_SAP_USER: 0,
        U_USERNAME: null
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
          key: "U_USERNAME",
          label: "User Name",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "U_ROLE_CODE",
          label: "Role",
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

      userFields: [
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
        }
      ],
      selectedUser: [],
      selectedUserDetails: {
        EmployeeID: null,
        FirstName: null,
        LastName: null,
        MiddleName: null,
        eMail: null
      },

      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      currentPageUser: 1,
      perPages: 5,
      pageOptions: [5, 10, 15],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterUser: null,
      filterOn: []
    };
  },
  computed: {
    filterSearchedUsers() {
      return this.SearchedUsers;
    },

    filterItems() {
      return this.Users.filter(Users => {
        return this.filterStatus.includes(Users.U_IS_ACTIVE);
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

      return `Showing ${start} to ${end} of ${this.filterItems.length} entries`;
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

    rowsUsers() {
      if (this.SearchedUsers) {
        return this.SearchedUsers.length;
      } else {
        return 0;
      }
    },

    rows() {
      return this.filterItems.length;
    },

    ...mapGetters({
      Users: "Admin/Users/getUsers",
      listRoles: "Admin/Roles/getListRoles",
      companyList: "Company/getCompanyList",
      SearchedUsers: "Admin/Users/getSearchedUsers"
    }),
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key };
        });
    },
    filterFields() {
      if (
        this.actions.resetPassword === false &&
        this.actions.editUser === false
      ) {
        return this.fields.filter(field => field.key !== "actions");
      } else {
        return this.fields;
      }
    }
  },

  methods: {
    confirmUpdate() {
      this.showLoading = true;
      this.$store
        .dispatch("Admin/Users/updateSAPUser", {
          userDetails: this.userDetails,
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
          } else {
            this.showAlert("Success", "success");
            this.$bvModal.hide("update-user-modal");
            this.clearForm();
          }
        });
      this.showLoading = false;
    },

    update(data) {
      this.userDetails = { ...data };
      this.$bvModal.show("update-user-modal");
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
    cancelUser() {
      this.clearForm();
      this.$bvModal.hide("add-user-modal");
      this.selectedUserDetails = {
        EmployeeID: null,
        FirstName: null,
        LastName: null,
        MiddleName: null,
        eMail: null
      };
    },

    selectUser() {
      this.selectedUserDetails = { ...this.selectedUser[0] };
      this.userDetails.U_EMPLOYEE_CODE = this.selectedUserDetails.EmployeeID;
      this.userDetails.U_IS_SAP_USER = 0;
      this.userDetails.U_COMPANY_CODE = this.selectedCompany;
      if (this.selectedUser[0].UserCode) {
        this.userDetails.U_USERNAME = this.selectedUser[0].UserCode;
        this.userDetails.U_IS_SAP_USER = 1;
      }
      this.$bvModal.hide("find-user-modal");
      this.findUser = null;
    },
    findUsers() {
      this.$bvModal.show("find-user-modal");
    },
    onRowSelected(items) {
      this.selectedUser = items;
    },
    confirmReset() {
      this.$store
        .dispatch("Admin/Users/resetUserPassword", {
          U_UPDATED_BY: JSON.parse(localStorage.user_details).Code,
          user_actions: JSON.parse(localStorage.user_actions),
          userForm: this.userDetails,
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
          } else {
            this.showAlert("Success", "success");
            this.$bvModal.hide("reset-modal");
            this.clearForm();
          }
        });
    },
    clearForm() {
      this.userDetails = {
        U_EMPLOYEE_CODE: null,
        U_ROLE_CODE: null,
        U_IS_ACTIVE: null
      };
      this.selectedUserDetails = {
        EmployeeID: null,
        FirstName: null,
        LastName: null,
        MiddleName: null,
        eMail: null
      };
    },
    showAlert(message, variant) {
      this.alert = {
        showAlert: 3,
        variant,
        message
      };
    },
    addUser() {
      this.$bvModal.show("add-user-modal");
    },

    addUserTable() {
      this.showButtonLoading = true;
      this.$store
        .dispatch("Admin/Users/addUser", {
          Code: JSON.parse(localStorage.user_details).Code,
          user_actions: JSON.parse(localStorage.user_actions),
          user: this.userDetails,
          SessionId: localStorage.SessionId
        })
        .then(res => {
          if (res && res.name == "Error") {
            this.showLoading = false;

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

            this.$bvModal.hide("add-user-modal");

            this.clearForm();

            this.showButtonLoading = false;
          }
        });
    },

    edit(data) {
      this.userDetails = {
        Code: data.Code,
        U_EMPLOYEE_CODE: data.U_EMPLOYEE_CODE,
        U_IS_ACTIVE: data.U_IS_ACTIVE,
        U_IS_SAP_USER: data.ApplicationUserID ? 1 : 0,
        U_ROLE_CODE: data.U_ROLE_CODE,
        U_USERNAME: data.U_USERNAME,
        U_COMPANY_CODE: data.U_COMPANY_CODE,
        U_COMPANY_ACCESS: data.U_COMPANY_ACCESS
      };
      this.selectedUserDetails = {
        FirstName: data.FirstName,
        LastName: data.LastName,
        eMail: data.eMail,
        MiddleName: data.MiddleName
      };
      this.$bvModal.show("edit-modal");
    },
    editTable() {
      console.log(this.userDetails);
      this.$store
        .dispatch("Admin/Users/editUser", {
          U_UPDATED_BY: JSON.parse(localStorage.user_details).Code,
          user_actions: JSON.parse(localStorage.user_actions),
          userForm: this.userDetails,
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
          } else {
            this.showAlert("Success", "success");

            this.$bvModal.hide("edit-modal");

            this.clearForm();
          }
        });
    },

    resetpassword(data) {
      this.userDetails = { ...data };

      this.$bvModal.show("reset-modal");
    },

    fetchPendingTransactions() {
      this.items = this.$store.state.transactions.pendingTransactions;
      return;
    },

    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      // this.totalRows = filteredItems.length;
      this.currentPage = 1;
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
      .dispatch("Admin/Users/fetchUsers", {
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
  },
  created() {
    const userActions = JSON.parse(localStorage.user_actions)["Admin Module"];
    const user_details = JSON.parse(localStorage.user_details);

    if (userActions.find(action => action.U_ACTION_NAME === "Add user")) {
      this.actions.addUser = true;
    }
    if (userActions.find(action => action.U_ACTION_NAME === "Edit user")) {
      this.actions.editUser = true;
    }
    if (
      userActions.find(action => action.U_ACTION_NAME === "Reset user password")
    ) {
      this.actions.resetPassword = true;
    }
    if (
      userActions.find(action => action.U_ACTION_NAME === "Update SAP user")
    ) {
      this.actions.updateUser = true;
    }
  }
};
</script>
