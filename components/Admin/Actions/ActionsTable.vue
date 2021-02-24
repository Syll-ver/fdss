<template>
    <div>
       <div>
      <b-alert
        id="alert_action"
        class="alerticon"
        :show="alert.showAlert"
        dismissible
        :variant="alert.variant"
        @dismissed="alert.showAlert = null"
      >
        <font-awesome-icon
          :icon="alert.variant == 'danger' ? 'exclamation' : 'check-circle'"
          class="mr-1 alerticon"
        
        />
        {{ alert.message }}
      </b-alert>
      <Loading v-if="showLoading" />
    </div>

      <b-row>
        <b-col cols="3" class="mt-3">
          <b-form-group>
            <b-input-group size="sm">
              <b-form-input
                v-model="filter"
                type="search"
                id="search_action"
                placeholder="Search Action"
              ></b-form-input>
            </b-input-group>
          </b-form-group>
        </b-col>

        <b-col cols="2" class="mt-3">
          <b-dropdown
            right
            id="filter_actions"
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
        </b-col>

        <b-col cols="7"  class="mt-3" align="right">
          <b-col>
            <b-button
              id="add_action"
              size="sm"
              class="button-style"
              variant="biotech"
              @click="addAction()"
              v-if="actions.add_action"
            >
              <font-awesome-icon icon="plus" class="mr-1" />Add Action
            </b-button>
          </b-col>
     
        </b-col>
      </b-row>

      <!-- Main table element -->
      <b-table
        id="action-table"
        class="table-style"
        show-empty
        scrollable
        sticky-header
        responsive
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
      >
        <template #table-busy>
          <div class="text-center text-danger my-2">
            <b-spinner small class="align-middle"  variant="dark">
            </b-spinner>
              <span class="loading_spinner">Loading...</span>
          </div>
        </template>

        <template v-slot:cell(index)="data">{{ data.index + 1 }}</template>

        <template v-slot:cell(actions)="row">
          <b-button
            size="sm"
            @click="edit(row.item)"
            class="table-button"
            variant ="edit"
            id="edit_action"
            v-b-tooltip.hover
            title="Update Action"
            v-if="actions.edit_action"
          >
            <font-awesome-icon icon="edit" />
          </b-button>
        </template>

        <template v-slot:cell(U_MODULE_NAME)="row">
          <div>
            {{
            row.item.U_MODULE_NAME
            ? row.item.U_MODULE_NAME
            : listModules.find(
            modules => modules.Code === row.item.U_MODULE_CODE
            ).Name
            }}
          </div>
        </template>

        <template v-slot:cell(U_IS_ACTIVE)="row">
            <b-badge
              class="table-badge"
              pill
              :variant="row.item.U_IS_ACTIVE ? 'success' : 'danger'"
            >{{ row.item.U_IS_ACTIVE ? "Active" : "Inactive" }}</b-badge>
        </template>
      </b-table>

      <hr />

      <b-row>
        <b-col cols="1" class="mb-2 mt-1">
          <b-form-group class="mb-0">
            <b-form-select
              v-model="perPage"
              id="perPageSelect_actions-pagination"
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
          <div size="sm" style="color: gray; font-size: 11.5px;"> {{ bottomLabel }}</div>
        </b-col>
        <b-col>
          <b-pagination
            id="actions-pagination"
            pills
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="right"
            size="sm"
            aria-controls="action-table"
            limit="3"
            class="mt-1"
          ></b-pagination>
        </b-col>
      </b-row>


      <!-- Add Action -->
      <b-modal
        size="sm"
        header-bg-variant="biotech"
        header-text-variant="light"
        body-bg-variant="light"
        id="add-action-modal"
        no-close-on-backdrop
        @hide="clearForm()"
      >
        <template v-slot:modal-title>
          <h6>Add Action</h6>
        </template>

        <small class="text-left">Select Module</small>
        <b-row align-h="center">
          <b-form-select
            id="select_module_modal"
            type="text"
            class="mx-3 form-text"
            v-model="action_form.U_MODULE_CODE"
          >
            <option :value="null" disabled>Select Module</option>
            <option
              :value="modules.Code"
              v-for="(modules, i) in listModules.filter(
                modules => modules.U_IS_ACTIVE
              )"
              :key="i"
            >{{ modules.Name }}</option>
          </b-form-select>
        </b-row>

        <small class="text-left">Action Name</small>
        <b-row align-h="center">
          <b-form-input
            id="add_ACTION_NAME_modal"
            type="text"
            class="mx-3 form-text"
            v-model="action_form.U_ACTION_NAME"
          ></b-form-input>
        </b-row>

        <template v-slot:modal-footer="{  cancel }">
          <b-button
            id="add_action_modal"
            size="sm"
            variant="biotech"
            @click="addActionTable()"
            style="font-size:13px"
            class="button-style"
            :disabled="showLoading === true"
          >
            Add
          </b-button>
          <b-button
            id="cancel_add_action_modal"
            size="sm"
            @click="cancel()"
            class="button-style"
          >Cancel</b-button>
        </template>
      </b-modal>

      <!-- End Add Action -->

      <!-- Edit Action -->
      <b-modal
        size="sm"
        header-bg-variant="biotech"
        header-text-variant="light"
        body-bg-variant="light"
        id="edit-action-modal"
        no-close-on-backdrop
        @hide="clearForm()"
      >
        <template v-slot:modal-title>
          <h6>Update Action</h6>
        </template>

        <small class="text-left">Select Module</small>
        <b-row align-h="center">
          <b-form-select
            id="update_selected_module"
            type="text"
            disabled
            class="mx-3 form-text"
            v-model="action_form.U_MODULE_CODE"
          >
            <option :value="null">Select Module</option>
            <option
              :value="modules.Code"
              v-for="(modules, i) in listModules"
              :key="i"
            >{{ modules.Name }}</option>
          </b-form-select>
        </b-row>

        <small class="text-left">Action Description</small>
        <b-row align-h="center">
          <b-form-input
            id="update_desc"
            type="text"
            disabled
            class="mx-3 form-text"
            v-model="action_form.U_ACTION_NAME"
          ></b-form-input>
        </b-row>

        <small class="text-left">Status</small>
        <b-row align-h="center">
          <b-form-select
            id="status_update"
            class="mx-3 form-text"
            type="text"
            v-model="action_form.U_IS_ACTIVE"
          >
            <option :value="1">Active</option>
            <option :value="0">Inactive</option>
          </b-form-select>
        </b-row>

        <template v-slot:modal-footer="{ cancel }">
          <b-button
            id="update_action"
            size="sm"
            variant="biotech"
            @click="editActionTable()"
            class="button-style"
            :disabled="showLoading === true"
          >
           Update
          </b-button>
          <b-button id="cancel_action" size="sm" @click="cancel()" class="button-style">Cancel</b-button>
        </template>
      </b-modal>
    </div>

    <!-- End Edit Action -->

</template>

<script>
import moment from "moment";
import Loading from "~/components/Loading/Loading.vue";
import { mapMutations } from "vuex";
import { mapGetters } from "vuex";

export default {
  components: {
    Loading
  },
  data() {
    return {
      showLoading: false,
      filterStatus: [1,0],

      actions: {
        add_action: false,
        edit_action: false
      },
      alert: {
        showAlert: 0,
        variant: "biotech",
        message: ""
      },

      action_form: {
        U_MODULE_CODE: null,
        U_ACTION_NAME: null,
        U_IS_ACTIVE: null
      },

      fields: [
        {
          key: "U_ACTION_NAME",
          label: "Action Name",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "U_MODULE_NAME",
          label: "Module Name",
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
      console.log(this.filterStatus.includes(1));
        return this.listActions.filter(listActions => {
          
        return this.filterStatus.includes(listActions.U_IS_ACTIVE) && (listActions.U_ACTION_NAME.toLowerCase().match(this.filter.toLowerCase()) || (listActions.U_ACTION_NAME.toLowerCase().match(this.filter.toLowerCase())))
      });
      
    },

    filterFields() {
      if (this.actions.editAction === false) {
        return this.fields.filter(field => field.key !== "actions");
      } else {
        return this.fields;
      }
    },
    ...mapGetters({
      listActions: "Admin/Actions/getListActions",
      listModules: "Admin/Modules/getListModules"
    }),

    getListActions() {
      return this.listActions;
    },
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key };
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
    }
  },

  methods: {
    clearForm() {
      this.action_form = {
        U_MODULE_CODE: null,
        U_ACTION_NAME: null,
        U_IS_ACTIVE: null
      };
    },
    cancel() {
      this.alert.showAlert = 0;
    },
    editActionTable() {
      this.showLoading = true;
      this.$store
        .dispatch("Admin/Actions/editAction", {
          U_UPDATED_BY: JSON.parse(localStorage.user_details).Code,
          user_actions: JSON.parse(localStorage.user_actions),
          action_details: this.action_form,
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
            this.showAlert("Successfully Updated", "success");

            this.$bvModal.hide("edit-action-modal");
            this.clearForm();
            this.showLoading = false;
          }
        });
    },
    addActionTable() {
      this.showLoading = true;

      this.$store
        .dispatch("Admin/Actions/addAction", {
          U_CREATED_BY: JSON.parse(localStorage.user_details).Code,
          user_actions: JSON.parse(localStorage.user_actions),
          U_MODULE_CODE: this.action_form.U_MODULE_CODE,
          U_ACTION_NAME: this.action_form.U_ACTION_NAME,
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
            this.showAlert("Successfully Added", "success");

            this.$bvModal.hide("add-action-modal");
            this.clearForm();
            this.showLoading = false;
          }
        });
    },

    addAction() {
      this.$bvModal.show("add-action-modal");
    },

    edit(data) {
      this.action_form = { ...data };
      this.$bvModal.show("edit-action-modal");
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

    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    onFiltered(filterItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filterItems.length;
      this.currentPage = 1;
    },

    showAlert(message, variant) {
      this.alert = {
        showAlert: 3,
        variant,
        message
      };
    }
  },

  async beforeCreate() {    
    this.isBusy = true;

    this.$store
      .dispatch("Admin/Actions/fetchListActions", {
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

    if (userActions.find(action => action.U_ACTION_NAME === "Add action")) {
      this.actions.add_action = true;
    }
    if (userActions.find(action => action.U_ACTION_NAME === "Edit action")) {
      this.actions.edit_action = true;
    }
  }
};
</script>
