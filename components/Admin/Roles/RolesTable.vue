<template>
<div>
    <div>
      <b-alert
        id="alert"
        class="alerticon"
        :show="alert.showAlert"
        dismissible
        :variant="alert.variant"
        @dismissed="alert.showAlert = null"
      >
        <font-awesome-icon
          :icon="alert.variant == 'danger' ?  'exclamation' : 'check-circle'"
          class="mr-1 alerticon"
          
        />
        {{ alert.message }}
      </b-alert>
      <Loading v-if="showLoading" />
    </div>

    <b-row>
      <b-col cols="12" md="4" lg="3" sm="5" xs="4" class="mt-3">
        <b-form-group>
          <b-input-group size="sm">
            <b-form-input
              v-model="filter"
              type="search"
              id="filterInput"
              placeholder="Search Roles"
            ></b-form-input>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col cols="12" md="4" lg="3" sm="2" xs="4" class="mt-3"  align="left">
        <b-dropdown
            right
            id="filter_roles"
            class="button-sq"
            size="sm"
            variant="dark"
          >
          <template v-slot:button-content>
            <font-awesome-icon icon="filter" class="mr-1" />   
          </template> 
            <b-form-checkbox-group
              id="status_group"
              name="flavour-2"
              class="pl-2"
              style="font-size:12px"
              v-model="filterStatus"
              v-b-tooltip.hover
              title="Filter Status"
              
            >
              <b-form-checkbox id="active_stat" :value="1">Active</b-form-checkbox>
              <b-form-checkbox id="inactive_stat" :value="0" unchecked-value="true">Inactive</b-form-checkbox>
            </b-form-checkbox-group>
          </b-dropdown>
        <!-- <b-input-group prepend="Date" size="sm">
          <date-range-picker
            id="date_pending"
            ref="picker"
            :opens="opens1"
            :locale-data="localeData"
            :autoApply="true"
            :singleDatePicker="false"
            :showWeekNumbers="true"
            v-model="datePicker"
            @update="updateValues"
          >
            <div slot="input" id="date_pending" >
              {{ datePicker.startDate }} - {{ datePicker.endDate }}
            </div>
          </date-range-picker>
          <b-input-group-append style="height:2rem; font-size:12px">
            <b-button
              @click="resetDate"
              id="date_reset_pending"
              style="font-size:12px"
              >Reset</b-button
            >
          </b-input-group-append>
        </b-input-group> -->
      </b-col>
 
      <b-col cols="12" md="4" lg="6" sm="5" xs="4" class="mt-3" align="right">
        <b-button
          id="add_role"
          size="sm"
          class="button-style"
          :variant="company == rci ? 'revive' : 'biotech'"
          @click="addRole()"
          v-if="actions.add_roleAccess"
        >
           Add Role
        </b-button>
      </b-col>
    </b-row>

      <!-- Main table element -->
      <b-table
      v-if="actions.view_roleAccess"
        id="roles-table"
        class="table-style mt-3"
        show-empty
        scrollable
        sticky-header
        no-border-collapse
        :busy="isBusy"
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
        <template #table-busy>
          <div class="text-center text-danger my-2">
            <b-spinner small class="align-middle"  variant="dark">
            </b-spinner>
            <span class="loading_spinner">Loading...</span>
          </div>
        </template>

        <template v-slot:cell(actions)="row">
          <b-button
            id="edit_roles_and_access"
            size="sm"
            variant="edit"
            @click="edit(row.item)"
            class="table-button"
            v-b-tooltip.hover
            title="Update Roles"
            v-if="actions.edit_roleAccess"
          >
            <font-awesome-icon icon="edit" />
          </b-button>
        </template>

        <template v-slot:cell(U_IS_ACTIVE)="row">
          <font-awesome-icon
            v-if="windowWidth < 576"
            icon="circle"
            :class="row.item.U_IS_ACTIVE 
              ? 'active-status' : 'inactive-status'"
          />

          <b-badge
          v-else
            class="table-badge"
            pill
            :variant="row.item.U_IS_ACTIVE ? 'success' : 'danger'"
            >{{ row.item.U_IS_ACTIVE ? "Active" : "Inactive" }}</b-badge
          >
        </template>
      </b-table>

      <hr />

      <b-row>
        <b-col cols="1" class="mb-2 mt-1">
          <b-form-group class="mb-0">
            <b-form-select
              v-model="perPage"
              id="perPageSelect_modules-pagination"
              size="sm"
              :options="pageOptions"
            ></b-form-select>
          </b-form-group>
        </b-col> 
        <b-col
          label-cols-sm
          class="mb-0 mt-2 text-left"
          cols="3"
          align-h="center"
        >
          <div size="sm" class="bottomlabel">
            {{ bottomLabel }}
          </div>
        </b-col>
        <b-col>
          <b-pagination
            id="roles-pagination"
            pills
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="right"
            size="sm"
            aria-controls="roles-table"
            limit="3"
            class="mt-1"
          ></b-pagination>
        </b-col>
      </b-row>

      <!-- end Main table -->

      <!-- Add Role -->

      <b-modal
        size="xl"
        :header-bg-variant="company == rci ? 'revive' : 'biotech'"
        header-text-variant="light"
        body-bg-variant="light"
        id="add-role-modal"
        @hide="clearForm()"
        scrollable
      >
        <template v-slot:modal-title>
          <h6>Add Role</h6>
        </template>

        <b-card class="cardShadow">
          <b-col cols="3">
            <b-form-input
              id="role_name_add_modal"
              type="text"
              class="form-text"
              placeholder="Type Role Name"
              v-model="roleName"
            ></b-form-input>
          </b-col>
        </b-card>
        <b-card class="cardShadow mt-4 mb-1">
          <b-row class="mt-4 mb-1 ml-3">
            <b-col cols="4">
              <span><b>Admin Module</b></span>
              <b-form-checkbox-group
                id="checkbox_admin_module_add_modal"
                name="admin module actions"
                stacked
                switches
                v-model="selectedAction"
              >
                <b-form-checkbox
                  :value="action.Code"
                  v-for="(action, i) in activeActions.filter(
                    action => action.U_MODULE_NAME === 'Admin Module'
                  )"
                  :key="i"
                  >{{ action.U_ACTION_NAME }}</b-form-checkbox
                >
              </b-form-checkbox-group>
            </b-col>

            <b-col cols="4">
              <span><b>Delivery Receipt Module</b></span>
              <b-form-checkbox-group
                id="checkbox_delivery_receipt_module_add_modal"
                name="delivery receipt Module actions"
                stacked
                switches
                v-model="selectedAction"
              >
                <b-form-checkbox
                  :value="action.Code"
                  v-for="(action, i) in activeActions.filter(
                    action => action.U_MODULE_NAME === 'Delivery Receipt Module'
                  )"
                  :key="i"
                  >{{ action.U_ACTION_NAME }}</b-form-checkbox
                >
              </b-form-checkbox-group>
            </b-col>

            <b-col cols="4">
              <span><b>Reports Module</b></span>
              <b-form-checkbox-group
                id="checkbox_reports_module_add_modal"
                name="reports module actions"
                stacked
                switches
                v-model="selectedAction"
              >
                <b-form-checkbox
                  :value="action.Code"
                  v-for="(action, i) in activeActions.filter(
                    action => action.U_MODULE_NAME === 'Reports Module'
                  )"
                  :key="i"
                  >{{ action.U_ACTION_NAME }}</b-form-checkbox
                >
              </b-form-checkbox-group>
            </b-col>
          </b-row>
        </b-card>

        <template v-slot:modal-footer="{ cancel }">
          <b-button
            id="add_roles_and_access_modal"
            size="sm"
            :variant="company == rci ? 'revive' : 'biotech'"
            @click="addRoleAccessTable()"
            style="font-size:13px"
            class="button-style"
            :disabled="showLoading === true"
          >
            
            Add
          </b-button>
          <b-button
            id="cancel_add_roles_and_access_modal"
            size="sm"
            @click="cancel()"
            class="button-style"
            >Cancel</b-button
          >
        </template>
      </b-modal>

      <!-- end Add Role -->

      <!-- Edit Role -->
      <b-modal
        size="xl"
        :header-bg-variant="company == rci ? 'revive' : 'biotech'"
        header-text-variant="light"
        body-bg-variant="light"
        id="edit-role-modal"
        no-close-on-backdrop
        @hide="clearForm()"
        scrollable
      >
        <template v-slot:modal-title>
          <h6>Update Role</h6>
        </template>
        <b-card class="cardShadow">
          <b-row>
           

            <b-col cols="3" >
              <b-form-input
                id="edit_role_name_edit_modal"
                type="text"
                class="form-text"
                v-model="roleName"
              ></b-form-input>
            </b-col>

            <b-col cols="3">
              <b-form-select
                id="edit_status_edit_modal"
                type="text"
                class="form-text"
                v-model="roleForm.U_IS_ACTIVE"
              >
                <option :value="1">Active</option>
                <option :value="0">Inactive</option>
              </b-form-select>
            </b-col>
          </b-row>
        </b-card>

        <b-card class="cardShadow mt-4 mb-1">
          <b-row class="mt-4 mb-1 ml-3">
            <b-col cols="4">
              <span><b>Admin Module</b></span>
              <b-form-checkbox-group
                id="checkbox_admin_module_edit_modal"
                name="admin module actions"
                stacked
                switches
                v-model="selectedAction"
              >
                <b-form-checkbox
                  :value="action.Code"
                  v-for="(action, i) in activeActions.filter(
                    action => action.U_MODULE_NAME === 'Admin Module'
                  )"
                  :key="i"
                  >{{ action.U_ACTION_NAME }}</b-form-checkbox
                >
              </b-form-checkbox-group>
            </b-col>

                <b-col cols="4">
              <span><b>Delivery Receipt Module</b></span>
              <b-form-checkbox-group
                id="checkbox_delivery_receipt_module_add_modal"
                name="delivery receipt Module actions"
                stacked
                switches
                v-model="selectedAction"
              >
                <b-form-checkbox
                  :value="action.Code"
                  v-for="(action, i) in activeActions.filter(
                    action => action.U_MODULE_NAME === 'Delivery Receipt Module'
                  )"
                  :key="i"
                  >{{ action.U_ACTION_NAME }}</b-form-checkbox
                >
              </b-form-checkbox-group>
            </b-col>

            <b-col cols="4">
              <span><b>Reports Module</b></span>
              <b-form-checkbox-group
                id="checkbox_reports_module_add_modal"
                name="reports module actions"
                stacked
                switches
                v-model="selectedAction"
              >
                <b-form-checkbox
                  :value="action.Code"
                  v-for="(action, i) in activeActions.filter(
                    action => action.U_MODULE_NAME === 'Reports Module'
                  )"
                  :key="i"
                  >{{ action.U_ACTION_NAME }}</b-form-checkbox
                >
              </b-form-checkbox-group>
            </b-col>
          </b-row>
        </b-card>

        <template v-slot:modal-footer="{ cancel }">
          <b-button
            id="edit_roles_and_access_edit_modal"
            size="sm"
            :variant="company == rci ? 'revive' : 'biotech'"
            @click="editRoleTable()"
            class="button-style"
            :disabled="showLoading === true"
          >
            Update
          </b-button>
          <b-button
            size="sm"
            id="cancel_roles_and_access_edit_modal"
            @click="cancel()"
            class="button-style"
            >Cancel</b-button
          >
        </template>
      </b-modal>

      <!-- end Edit User -->
    </div>

</template>

<script>
import moment from "moment";
import Loading from "~/components/Loading/Loading.vue";
import { mapGetters } from "vuex";

export default {
  components: {Loading},
  data() {
    return {
      rci: JSON.parse(localStorage.companyCode)['rci'],
      bfi: JSON.parse(localStorage.companyCode)['bfi'],
      company: null,
      windowWidth: window.innerWidth,
      showLoading: false,
      filterStatus: [1],
      actions: { 
        add_roleAccess: false, 
        edit_roleAccess: false,
        view_roleAccess: false,
      },
      alert: {
        showAlert: 0,
        variant: "success",
        message: ""
      },
      roleForm: {
        actions: [],
        Name: null,
        U_STAGE_ID: null
      },
      selectedAction: [],

      rolePrefix: null,
      roleName: null,
      approverLevel: null,
      checkApprover: false,
      items: [
        {
          roles: "Accounting-Head",
          status: "Active"
        }
      ],

      fields: [
        {
          key: "Name",
          label: "Roles",
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
      isBusy: true,
      totalRows: null,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: "",
      filterOn: []
    };
  },
  computed: {
    filterItems() {
      let count = 0;
      return this.listRoles.filter(listRoles => {
        if(this.filterStatus.includes(listRoles.U_IS_ACTIVE)) {
          count++;
          this.totalRows = count;
          return listRoles;
        }
        if(this.filterStatus.includes(!listRoles.U_IS_ACTIVE)) {
          count++;
          this.totalRows = count;
          return listRoles;
        }
      });
    },

    bottomLabel() {
      let end = this.perPage * this.currentPage;
      let start = end - this.perPage + 1;

      if(!this.filterItems) {
        return;
      }

      if (end > this.filterItems.length) {
        end = this.filterItems.length;
      }

      if (this.filterItems.length === 0) {
        start = 0;
      }

      return `Showing ${start} to ${end} of ${this.filterItems.length} entries`;
    },

    ...mapGetters({
      listActions: "Admin/Actions/getListActions",
      listRoles: "Admin/Roles/getListRoles"
    }),

    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key };
        });
    },

    activeActions() {
      console.log("actions: ", this.listActions.filter(action => action.U_IS_ACTIVE === 1 && action.U_MODULE_NAME === 'Delivery Receipt Module'));
      return this.listActions.filter(action => action.U_IS_ACTIVE === 1);
    },

    filterFields() {
      if (this.actions.editRoleAndAccess === false) {
        return this.fields.filter(field => field.key !== "actions");
      } else {
        return this.fields;
      }
    }
  },
  mounted() {
    // Set the initial number of items
  },
  methods: {
    updateRoleAccess(){
      const access = JSON.parse(localStorage.user_actions)['Admin Module'];
    },

    test() {
      console.log(this.checkApprover);
    },
    clearForm() {
      this.roleForm = {
        actions: [],
        Name: null
      };
      this.selectedAction = [];
      this.rolePrefix = null;
      this.roleName = null;
      this.approverLevel = null;
      this.checkApprover = false;
    },
    showAlert(message, variant) {
      this.alert = {
        showAlert: 3,
        variant,
        message
      };
    },
    async addRoleAccessTable() {
      this.showLoading = true;
      if (this.approverLevel) {
        this.roleForm.Name = `Approver ${this.approverLevel}`;
        this.roleForm.U_STAGE_ID = this.approverLevel;
      } else {
        this.roleForm.Name = this.roleName;
      }

      await this.selectedAction.forEach(selected => {
        this.roleForm.actions.push(
          this.listActions.find(action => action.Code === selected)
        );
      });

      this.$store
        .dispatch("Admin/Roles/addRole", {
          roleForm: this.roleForm,
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
            this.showLoading = false;
          } else {
            this.$store.dispatch("Admin/Roles/fetchRoles", {
              user_actions: JSON.parse(localStorage.user_actions),
              SessionId: localStorage.SessionId
            });
            this.showAlert("Successfully Added", "success");

            this.$bvModal.hide("add-role-modal");

            this.clearForm();
            this.showLoading = false;
          }
        });
    },
    updateLocalStorageActions() {
      console.log("selectedAction",this.selectedAction);
      console.log(this.roleForm);

      let activeActions  = this.listActions.filter(actions => actions.U_IS_ACTIVE === 1)
      console.log(activeActions);
      const userActions_admin = JSON.parse(localStorage.user_actions)['Admin Module']
      const userActions_reports = JSON.parse(localStorage.user_actions)['Reports Module']
      const userActions_transactions = JSON.parse(localStorage.user_actions)['Transactions Module']
      let userRolesAccess = {};
      let existing = {};
      let admin = [];
      let reports = [];
      let transactions = [];

      if(userActions_admin) {
        this.selectedAction.forEach(actions => {
          existing = userActions_admin.find(access => 
            access.U_ACTION_CODE === actions)
          if(existing) {
            admin.push(existing)
          }
        })

        if(admin){
          userRolesAccess['Admin Module'] = admin
        }
      }

      if(userActions_reports){
        this.selectedAction.forEach(actions => {
          let existing = userActions_reports.find(access => 
            access.U_ACTION_CODE === actions)
          if(existing) {
            reports.push(existing)
          }
        })

        if(reports){
          userRolesAccess['Reports Module'] = reports
        }
      }

      if(userActions_transactions) {
        this.selectedAction.forEach(actions => {
          let existing = userActions_transactions.find(access => 
            access.U_ACTION_CODE === actions)
          if(existing) {
            transactions.push(existing)
          }
        })

        if(transactions){
          userRolesAccess['Transactions Module'] = transactions
        }
      }

      console.log(userRolesAccess);
    },

    editRoleTable() {
      this.showLoading = true;
      if (this.approverLevel) {
        this.roleForm.Name = `Approver ${this.approverLevel}`;
        this.roleForm.U_STAGE_ID = this.approverLevel;
      } else {
        this.roleForm.Name = this.roleName;
      }
      const finalActions = [];

      this.listActions.forEach(action => {
        const existingAction = this.roleForm.actions.find(
          roleAction => roleAction.U_ACTION_CODE === action.Code
        );

        if (
          this.selectedAction.find(
            checkedAction => checkedAction === action.Code
          )
        ) {
          finalActions.push({
            Code: existingAction ? existingAction.Code : null,
            U_ACTION_CODE: action.Code,
            U_IS_ACTIVE: 1
          });
        } else {
          if (existingAction) {
            finalActions.push({
              Code: existingAction ? existingAction.Code : null,

              U_ACTION_CODE: action.Code,
              U_IS_ACTIVE: 0
            });
          }
        }
      });

      this.roleForm.actions = finalActions;
      this.$store
        .dispatch("Admin/Roles/editRole", {
          U_UPDATED_BY: JSON.parse(localStorage.user_details).Code,
          role_form: this.roleForm,
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
            this.showLoading = false;
          } else {
            this.$store.dispatch("Admin/Roles/fetchRoles", {
              user_actions: JSON.parse(localStorage.user_actions),
              SessionId: localStorage.SessionId
            });
            this.showAlert("Successfully Updated", "success");

            this.$bvModal.hide("edit-role-modal");

            this.clearForm();

            this.showLoading = false;
          }
        });
    },
    addRole() {
      this.$bvModal.show("add-role-modal");
    },

    edit(data) {
      this.roleForm = data;
      this.roleName = this.roleForm.Name;
      this.selectedAction = this.roleForm.actions
        .filter(action => action.U_IS_ACTIVE)
        .map(action => action.U_ACTION_CODE);

      this.approverLevel = data.U_STAGE_ID;
      if (data.U_STAGE_ID) {
        this.checkApprover = true;
      }
      this.$bvModal.show("edit-role-modal");
    },

    resetpassword() {
      this.$bvModal.show("reset-modal");
    },

    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    onFiltered(filterItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filterItems.length;
      this.currentPage = 1;
    }
  },

  mounted() {
    window.addEventListener("resize", () => {
      this.windowWidth = window.innerWidth
    })
  },

  async beforeCreate() {

    this.isBusy = true;

    await this.$store
      .dispatch("Admin/Actions/fetchListActions", {
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
        if(!this.filter) {
          this.totalRows = this.filterItems ? this.filterItems.length : 0
        }
        this.isBusy = false;

        if (res && res.name == "Error") {
          if (res.response && res.response.data.errorMsg) {
            if (res.response.data.errorMsg === "Invalid session.") {
              this.$bvModal.show("session_modal");
            }
          }
        }
      });

    

  },
  created() {
    const user_details = JSON.parse(localStorage.user_details);
    const user_role = JSON.parse(localStorage.user_role);
    if(user_role.Name.toLowerCase() !== 'administrator') {
      this.$router.push("/transaction/deliveryreceipt")
    }
    this.company = user_details.U_COMPANY_CODE;
    const userActions = JSON.parse(localStorage.user_actions)["Admin Module"];

    if (userActions.find(action => action.U_ACTION_NAME === "Add role and access rights" )) {
        this.actions.add_roleAccess = true;
    }
    if (userActions.find(action => action.U_ACTION_NAME === "Edit role and access rights")) {
      this.actions.edit_roleAccess = true;
    }
    if (userActions.find(action => action.U_ACTION_NAME === "View roles and access rights")) {
      this.actions.view_roleAccess = true;
    }
  }
};
</script>
