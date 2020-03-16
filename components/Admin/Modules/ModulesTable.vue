<template>
  <b-container fluid>
    <div>
      <!-- Main table -->
      <b-row>
        <b-col>
          <b-button
            id="add_module"
            size="sm"
            class="button-sq"
            variant="biotech"
            style="font-size:12px; box-shadow:0px 10px 20px -10px #000000"
            @click="addModule()"
            v-if="actions.add_module"
          >
            <font-awesome-icon icon="plus" class="mr-1" />Add Module
          </b-button>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="4" class="mt-3">
          <b-form-group>
            <b-input-group size="sm">
              <b-form-input
                id="search_module"
                v-model="filter"
                type="search"
                placeholder="Search Module"
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
            variant="outline-secondary"
          >
            <b-form-checkbox-group
              id="status_group"
              name="flavour-2"
              class="pl-2"
              style="font-size:14px"
              v-model="filterStatus"
            >
              <b-form-checkbox id="active_stat" :value="1">Active</b-form-checkbox>
              <b-form-checkbox id="inactive_stat" :value="0" unchecked-value="true">Inactive</b-form-checkbox>
            </b-form-checkbox-group>
          </b-dropdown>
        </b-col>

        <b-col cols="1" offset="5" class="mb-2 mt-3">
          <b-form-group class="mb-0">
            <b-form-select
              v-model="perPage"
              id="perPageSelect_module"
              size="sm"
              :options="pageOptions"
            ></b-form-select>
          </b-form-group>
        </b-col>
      </b-row>

      <!-- Main table element -->
      <b-table
        id="module-table"
        class="table"
        show-empty
        scrollable
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
      >
        <template v-slot:cell(actions)="row">
          <b-button
            id="edit_module"
            size="sm"
            @click="edit(row.item)"
            class="mr-1 button-circle"
            style="font-size:12px; "
            v-b-tooltip.hover
            title="Edit Module"
            v-if="actions.edit_module"
          >
            <font-awesome-icon icon="edit" />
          </b-button>
        </template>

        <template v-slot:cell(U_IS_ACTIVE)="row">
          <div style="font-size:13.5px">
            <b-badge
              style="width:70px"
              pill
              :variant="row.item.U_IS_ACTIVE ? 'biotech' : 'danger'"
            >{{ row.item.U_IS_ACTIVE ? "Active" : "Inactive" }}</b-badge>
          </div>
        </template>
      </b-table>

      <hr />

      <b-row>
        <b-col label-cols-sm class="mb-0 mt-1 text-left" cols="3" align-h="center">
          <div size="sm" style="color: gray; font-size: 11px;">{{ bottomLabel }}</div>
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

      <!-- Add Module -->

      <b-modal
        size="sm"
        header-bg-variant="biotech"
        header-text-variant="light"
        body-bg-variant="light"
        id="add-module-modal"
        @hide="clearForm()"
      >
        <template v-slot:modal-title>
          <h6>Add Module</h6>
        </template>

        <small class="text-left">Module Name</small>
        <b-row align-h="center">
          <b-form-input
            id="add_module_name_modal"
            type="text"
            class="mx-3"
            v-model="moduleForm.Name"
            style="font-size:10px"
          ></b-form-input>
        </b-row>

        <template v-slot:modal-footer="{ ok, cancel }">
          <b-button
            id="add_module_modal"
            size="sm"
            variant="biotech"
            @click="saveModule()"
            style="font-size:13px"
            class="button"
            :disabled="showButtonLoading === true"
          >
            <b-spinner v-show="showButtonLoading === true" small label="Spinning"></b-spinner>Add
          </b-button>
          <b-button
            id="cancel_add_module_modal"
            size="sm"
            @click="cancel()"
            style="font-size:13px;border: 0px;"
          >Cancel</b-button>
        </template>
      </b-modal>

      <!-- Add Module -->

      <!-- Edit Module -->

      <b-modal
        size="sm"
        header-bg-variant="biotech"
        header-text-variant="light"
        id="edit-module-modal"
        body-bg-variant="light"
        @hide="clearForm()"
      >
        <template v-slot:modal-title>
          <h6>Edit Module</h6>
        </template>

        <small class="text-left">Module Name</small>
        <b-row align-h="center">
          <b-form-input
            type="text"
            class="mx-2"
            v-model="moduleForm.Name"
            disabled
            style="font-size:10px"
          ></b-form-input>
        </b-row>
        <small class="text-left">Status</small>
        <b-row align-h="center">
          <b-form-select
            id="edit_status_modal"
            type="text"
            class="mx-2"
            v-model="moduleForm.U_IS_ACTIVE"
            style="font-size:10px"
          >
            <option :value="1">Active</option>
            <option :value="0">Inactive</option>
          </b-form-select>
        </b-row>

        <template v-slot:modal-footer="{ ok, cancel }">
          <b-button
            id="edit_module_modal"
            size="sm"
            variant="biotech"
            @click="editModule()"
            style="font-size:13px"
            class="button"
            :disabled="showButtonLoading === true"
          >
            <b-spinner v-show="showButtonLoading === true" small label="Spinning"></b-spinner>Edit
          </b-button>
          <b-button
            id="cancel_edit_module_modal"
            size="sm"
            @click="cancel()"
            style="font-size:13px;border: 0px;"
          >Cancel</b-button>
        </template>
      </b-modal>

      <!-- Edit Module -->
    </div>

    <div>
      <b-alert
        :show="alert.showAlert"
        dismissible
        :variant="alert.variant"
        @dismissed="alert.showAlert = null"
      >
        <font-awesome-icon
          :icon="alert.variant == 'biotech' ? 'check-circle' : 'exclamation'"
          class="mr-1"
          style="font-size:20px"
        />
        {{ alert.message }}
      </b-alert>
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
      actions: {
        add_module: false,
        edit_module: false
      },
      alert: {
        showAlert: 0,
        variant: "biotech",
        message: ""
      },

      moduleForm: {
        Name: null,
        Code: null,
        U_IS_ACTIVE: null
      },

      fields: [
        {
          key: "Name",
          label: "Modules",
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
      return this.listModules.filter(listModules => {
        return this.filterStatus.includes(listModules.U_IS_ACTIVE);
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
      listModules: "Admin/Modules/getListModules"
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
      if (this.actions.edit_module === false) {
        return this.fields.filter(field => field.key !== "actions");
      } else {
        return this.fields;
      }
    }
  },

  methods: {
    trues() {},

    falses() {
      console.log("hello");
    },
    clearForm() {
      this.moduleForm = {
        Name: null,
        Code: null,
        U_IS_ACTIVE: null
      };
    },

    showAlert(message, variant) {
      this.alert = {
        showAlert: 3,
        variant,
        message
      };
    },
    editModule() {
      this.showButtonLoading = true;

      this.$store
        .dispatch("Admin/Modules/modifyModule", {
          U_UPDATED_BY: JSON.parse(localStorage.user_details).Code,
          user_actions: JSON.parse(localStorage.user_actions),
          moduleData: this.moduleForm,
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
            this.showAlert("Success", "biotech");

            this.$bvModal.hide("edit-module-modal");
            this.clearForm();
            this.showButtonLoading = false;
          }
        });
    },

    addModule() {
      this.$bvModal.show("add-module-modal");
    },

    saveModule() {
      this.showButtonLoading = true;
      this.$store
        .dispatch("Admin/Modules/createModule", {
          Code: JSON.parse(localStorage.user_details).Code,
          user_actions: JSON.parse(localStorage.user_actions),
          Name: this.moduleForm.Name,
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
            this.showAlert("Success", "biotech");

            this.$bvModal.hide("add-module-modal");
            this.clearForm();
            this.showButtonLoading = false;
          }
        });
    },

    edit(data) {
      this.moduleForm.Code = data.Code;
      this.moduleForm.Name = data.Name;
      this.moduleForm.U_IS_ACTIVE = data.U_IS_ACTIVE;
      this.$bvModal.show("edit-module-modal");
    },

    saveInfo() {
      this.$bvModal.show("save-modal");
    },

    fetchPendingTransactions() {
      this.items = this.$store.state.transactions.pendingTransactions;
      return;
    },
    addDocument() {
      this.transactionForm.documentListValues.push({
        documentType: null,
        number: null
      });
    },
    removeDocument(id) {
      if (this.transactionForm.documentListValues.length === 1) {
        //Create an error message. Document must contain 1 or more
      } else {
        this.transactionForm.documentListValues.splice(id, 1);
      }
    },
    info(data) {
      this.transactionForm = data;
      this.$bvModal.show("process-modal");
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
      .dispatch("Admin/Modules/fetchListModules", {
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

    if (userActions.find(action => action.U_ACTION_NAME === "Add module")) {
      this.actions.add_module = true;
    }
    if (userActions.find(action => action.U_ACTION_NAME === "Edit module")) {
      this.actions.edit_module = true;
    }
  }
};
</script>
