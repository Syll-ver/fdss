<template>
  <b-container fluid>
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
            id="add_role"
            size="sm"
            class="button"
            style="font-size:12px; box-shadow:0px 10px 20px -10px #000000 "
            @click="addRole()"
            v-if="actions.addRoleAndAccess"
          >
            <font-awesome-icon icon="plus" class="mr-1" />Add Role
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
                id="search_role"
                placeholder="Search Role"
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
              id="perPageSelect_roles_and_access"
              size="sm"
              :options="pageOptions"
            ></b-form-select>
          </b-form-group>
        </b-col>
      </b-row>

      <!-- Main table element -->
      <b-table
        id="role-table"
        class="table"
        style="font-size:11.5px; max-height: 100%;"
        show-empty
        scrollable="true"
        sticky-header
        no-border-collapse
        stacked="md"
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
            id="edit_roles_and_access"
            size="sm"
            @click="edit(row.item)"
            class="mr-1 button-circle"
            style="font-size:12px; "
            v-b-tooltip.hover
            title="Edit Roles"
            v-if="actions.editRoleAndAccess"
          >
            <font-awesome-icon icon="edit" />
          </b-button>
        </template>

        <template v-slot:cell(U_IS_ACTIVE)="row">
          <div style="font-size:13.5px">
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

      <!-- Add Role -->

      <b-modal
        size="xl"
        header-bg-variant="success"
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
          <!-- <small class="ml-1"> Role</small>
          <b-form-input type="text" style="font-size:10px"></b-form-input>-->

          <b-row>
            <b-col cols="2">
              <b-form-checkbox
                id="user_approver"
                :value="true"
                :unchecked-value="false"
                v-model="checkApprover"
                >Approver</b-form-checkbox
              >
            </b-col>

            <b-col cols="2" v-if="checkApprover">
              <b-form-select
                type="text"
                style="font-size:10px"
                v-model="approverLevel"
              >
                <option :value="null" disabled>Select Level</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </b-form-select>
            </b-col>

            <b-col cols="3" v-else>
              <b-form-input
                id="role_name_add_modal"
                type="text"
                style="font-size:10px"
                placeholder="Type Role Name"
                v-model="roleName"
              ></b-form-input>
            </b-col>
          </b-row>
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
              <span><b>Supplier Module</b></span>
              <b-form-checkbox-group
                id="checkbox_supplier_module_add_modal"
                name="supplier module actions"
                stacked
                switches
                v-model="selectedAction"
              >
                <b-form-checkbox
                  :value="action.Code"
                  v-for="(action, i) in activeActions.filter(
                    action => action.U_MODULE_NAME === 'Suppliers Module'
                  )"
                  :key="i"
                  >{{ action.U_ACTION_NAME }}</b-form-checkbox
                >
              </b-form-checkbox-group>
            </b-col>

            <b-col cols="4">
              <span><b>Customer Module</b></span>
              <b-form-checkbox-group
                id="checkbox_customer_module_add_modal"
                name="customer module actions"
                stacked
                switches
                v-model="selectedAction"
              >
                <b-form-checkbox
                  :value="action.Code"
                  v-for="(action, i) in activeActions.filter(
                    action => action.U_MODULE_NAME === 'Customers Module'
                  )"
                  :key="i"
                  >{{ action.U_ACTION_NAME }}</b-form-checkbox
                >
              </b-form-checkbox-group>
            </b-col>
          </b-row>
          <b-row class="mt-4 mb-1 ml-3">
            <b-col cols="4">
              <span><b>Item Module</b></span>
              <b-form-checkbox-group
                id="checkbox_item_module_add_modal"
                name="item module actions"
                stacked
                switches
                v-model="selectedAction"
              >
                <b-form-checkbox
                  :value="action.Code"
                  v-for="(action, i) in activeActions.filter(
                    action => action.U_MODULE_NAME === 'Item Module'
                  )"
                  :key="i"
                  >{{ action.U_ACTION_NAME }}</b-form-checkbox
                >
              </b-form-checkbox-group>
            </b-col>

            <b-col cols="4">
              <span><b>Item Master Data Module</b></span>
              <b-form-checkbox-group
                id="checkbox_item_master_data_module_add_modal"
                name="item master data module actions"
                stacked
                switches
                v-model="selectedAction"
              >
                <b-form-checkbox
                  :value="action.Code"
                  v-for="(action, i) in activeActions.filter(
                    action => action.U_MODULE_NAME === 'Item Master Data Module'
                  )"
                  :key="i"
                  >{{ action.U_ACTION_NAME }}</b-form-checkbox
                >
              </b-form-checkbox-group>
            </b-col>

            <b-col cols="4">
              <span><b>Approval Module</b></span>
              <b-form-checkbox-group
                id="checkbox_approval_module_add_modal"
                name="approval module actions"
                stacked
                switches
                v-model="selectedAction"
              >
                <b-form-checkbox
                  :value="action.Code"
                  v-for="(action, i) in listActions.filter(
                    action => action.U_MODULE_NAME === 'Approval Module'
                  )"
                  :key="i"
                  >{{ action.U_ACTION_NAME }}</b-form-checkbox
                >
              </b-form-checkbox-group>
            </b-col>

            <b-col cols="4">
              <span><b>Report Module</b></span>
              <b-form-checkbox-group
                id="checkbox_report_module_add_modal"
                name="report module actions"
                stacked
                switches
                v-model="selectedAction"
              >
                <b-form-checkbox
                  :value="action.Code"
                  v-for="(action, i) in listActions.filter(
                    action => action.U_MODULE_NAME === 'Report Module'
                  )"
                  :key="i"
                  >{{ action.U_ACTION_NAME }}</b-form-checkbox
                >
              </b-form-checkbox-group>
            </b-col>
          </b-row>
        </b-card>

        <template v-slot:modal-footer="{ ok, cancel }">
          <b-button
            id="add_roles_and_access_modal"
            size="sm"
            variant="success"
            @click="addRoleAccessTable()"
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
            id="cancel_add_roles_and_access_modal"
            size="sm"
            @click="cancel()"
            style="font-size:13px;border: 0px;"
            >Cancel</b-button
          >
        </template>
      </b-modal>

      <!-- Add Role -->

      <!-- Edit Role -->

      <b-modal
        size="xl"
        header-bg-variant="success"
        header-text-variant="light"
        body-bg-variant="light"
        id="edit-role-modal"
        @hide="clearForm()"
        scrollable
      >
        <template v-slot:modal-title>
          <h6>Edit Role</h6>
        </template>
        <b-card class="cardShadow">
          <b-row>
            <b-col cols="2">
              <b-form-checkbox
                id="user_approver"
                v-model="checkApprover"
                :value="true"
                :unchecked-value="false"
                >Approver
              </b-form-checkbox>
            </b-col>

            <b-col cols="2" v-if="checkApprover">
              <b-form-select
                type="text"
                style="font-size:10px"
                v-model="approverLevel"
              >
                <option :value="null" disabled>Select Level</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </b-form-select>
            </b-col>

            <b-col cols="3" v-else>
              <b-form-input
                id="edit_role_name_edit_modal"
                type="text"
                style="font-size:10px"
                v-model="roleName"
              ></b-form-input>
            </b-col>

            <b-col cols="3">
              <b-form-select
                id="edit_status_edit_modal"
                type="text"
                style="font-size:10px"
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
              <span><b>Supplier Module</b></span>
              <b-form-checkbox-group
                id="checkbox_supplier_module_edit_modal"
                name="supplier module actions"
                stacked
                switches
                v-model="selectedAction"
              >
                <b-form-checkbox
                  :value="action.Code"
                  v-for="(action, i) in activeActions.filter(
                    action => action.U_MODULE_NAME === 'Suppliers Module'
                  )"
                  :key="i"
                  >{{ action.U_ACTION_NAME }}</b-form-checkbox
                >
              </b-form-checkbox-group>
            </b-col>

            <b-col cols="4">
              <span><b>Customer Module</b></span>
              <b-form-checkbox-group
                id="checkbox_customer_module_edit_modal"
                name="customer module actions"
                stacked
                switches
                v-model="selectedAction"
              >
                <b-form-checkbox
                  :value="action.Code"
                  v-for="(action, i) in activeActions.filter(
                    action => action.U_MODULE_NAME === 'Customers Module'
                  )"
                  :key="i"
                  >{{ action.U_ACTION_NAME }}</b-form-checkbox
                >
              </b-form-checkbox-group>
            </b-col>
          </b-row>
          <b-row class="mt-4 mb-1 ml-3">
            <b-col cols="4">
              <span><b>Item Module</b></span>
              <b-form-checkbox-group
                id="checkbox_item_module_edit_modal"
                name="item module actions"
                stacked
                switches
                v-model="selectedAction"
              >
                <b-form-checkbox
                  :value="action.Code"
                  v-for="(action, i) in activeActions.filter(
                    action => action.U_MODULE_NAME === 'Item Module'
                  )"
                  :key="i"
                  >{{ action.U_ACTION_NAME }}</b-form-checkbox
                >
              </b-form-checkbox-group>
            </b-col>

            <b-col cols="4">
              <span><b>Item Master Data Module</b></span>
              <b-form-checkbox-group
                id="checkbox_item_master_data_module_edit_modal"
                name="item master data module actions"
                stacked
                switches
                v-model="selectedAction"
              >
                <b-form-checkbox
                  :value="action.Code"
                  v-for="(action, i) in activeActions.filter(
                    action => action.U_MODULE_NAME === 'Item Master Data Module'
                  )"
                  :key="i"
                  >{{ action.U_ACTION_NAME }}</b-form-checkbox
                >
              </b-form-checkbox-group>
            </b-col>
            <b-col cols="4">
              <span><b>Approval Module</b></span>
              <b-form-checkbox-group
                id="checkbox_approval_module_add_modal"
                name="approval module actions"
                stacked
                switches
                v-model="selectedAction"
              >
                <b-form-checkbox
                  :value="action.Code"
                  v-for="(action, i) in listActions.filter(
                    action => action.U_MODULE_NAME === 'Approval Module'
                  )"
                  :key="i"
                  >{{ action.U_ACTION_NAME }}</b-form-checkbox
                >
              </b-form-checkbox-group>
            </b-col>

            <b-col cols="4">
              <span><b>Report Module</b></span>
              <b-form-checkbox-group
                id="checkbox_report_module_edit_modal"
                name="report module actions"
                stacked
                switches
                v-model="selectedAction"
              >
                <b-form-checkbox
                  :value="action.Code"
                  v-for="(action, i) in listActions.filter(
                    action => action.U_MODULE_NAME === 'Report Module'
                  )"
                  :key="i"
                  >{{ action.U_ACTION_NAME }}</b-form-checkbox
                >
              </b-form-checkbox-group>
            </b-col>
          </b-row>
        </b-card>
        <!-- <b-row class="mt-3 mb-3">
        <b-col cols="3">Admin Module</b-col>
        <b-col cols="3">Transaction Module</b-col>
        <b-col cols="3">Report Module</b-col>
        </b-row>-->

        <template v-slot:modal-footer="{ ok, cancel }">
          <b-button
            id="edit_roles_and_access_edit_modal"
            size="sm"
            variant="success"
            @click="editRoleTable()"
            style="font-size:13px"
            class="button"
            :disabled="showButtonLoading === true"
          >
            <b-spinner
              v-show="showButtonLoading === true"
              small
              label="Spinning"
            ></b-spinner
            >Edit
          </b-button>
          <b-button
            size="sm"
            id="cancel_roles_and_access_edit_modal"
            @click="cancel()"
            style="font-size:13px;border: 0px;"
            >Cancel</b-button
          >
        </template>
      </b-modal>

      <!-- Edit User -->
    </div>
  </b-container>
</template>

<script>
import moment from "moment";
import { mapMutations } from "vuex";
import { mapGetters } from "vuex";

export default {
  components: {},
  data() {
    return {
      showButtonLoading: false,
      filterStatus: [1],
      actions: { addRoleAndAccess: false, editRoleAndAccess: false },
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

      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: []
    };
  },
  computed: {
    filterItems() {
      return this.listRoles.filter(listRoles => {
        return this.filterStatus.includes(listRoles.U_IS_ACTIVE);
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

    rows() {
      return this.filterItems.length;
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
      this.showButtonLoading = true;
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
            this.showButtonLoading = false;
          } else {
            this.$store.dispatch("Admin/Roles/fetchRoles", {
              user_actions: JSON.parse(localStorage.user_actions),
              SessionId: localStorage.SessionId
            });
            this.showAlert("Success", "success");

            this.$bvModal.hide("add-role-modal");

            this.clearForm();
            this.showButtonLoading = false;
          }
        });
    },
    editRoleTable() {
      this.showButtonLoading = true;
      if (this.approverLevel) {
        this.roleForm.Name = `Approver ${this.approverLevel}`;
        this.roleForm.U_STAGE_ID = this.approverLevel;
      } else {
        this.roleForm.Name = this.roleName;
      }
      const finalActions = [];
      // console.log(this.roleForm.actions);
      // console.log(this.selectedAction);

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
            this.showButtonLoading = false;
          } else {
            this.$store.dispatch("Admin/Roles/fetchRoles", {
              user_actions: JSON.parse(localStorage.user_actions),
              SessionId: localStorage.SessionId
            });
            this.showAlert("Success", "success");

            this.$bvModal.hide("edit-role-modal");

            this.clearForm();

            this.showButtonLoading = false;
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
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      // this.totalRows = filteredItems.length;
      this.currentPage = 1;
    }
  },
  beforeCreate() {
    this.$store
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

    this.$store
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
  },
  created() {
    const userActions = JSON.parse(localStorage.user_actions)["Admin Module"];

    if (
      userActions.find(
        action => action.U_ACTION_NAME === "Add role and access rights"
      )
    ) {
      this.actions.addRoleAndAccess = true;
    }
    if (
      userActions.find(
        action => action.U_ACTION_NAME === "Edit role and access rights"
      )
    ) {
      this.actions.editRoleAndAccess = true;
    }
  }
};
</script>
