<template>
 <div >
<Loading v-if="showLoading" />
      <!-- Main table -->
      <!-- <b-row>
        <b-col>
          <b-button
            id="add_module"
            size="sm"
            class="button-style"
            variant="biotech"
            @click="addModule()"
            v-if="actions.add_module"
          >
            <font-awesome-icon icon="plus" class="mr-1" />Add Module
          </b-button>
        </b-col>
      </b-row> -->

    <b-row>
      <b-col cols="3" class="mt-3">
        <b-form-group>
          <b-input-group size="sm">
            <b-form-input
              v-model="filter"
              type="search"
              id="filterInput"
              placeholder="Search Module"
            ></b-form-input>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col class="mt-3">
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
 
      <b-col cols="2"  class="mt-3" align="right">
        <!-- <b-form-group class="mb-0">
          <b-form-select
            id="perPageSelect_action"
            size="sm"
            :options="pageOptions"
          ></b-form-select>
        </b-form-group> -->
      
          <b-col>
          <b-button
            id="add_module"
            size="sm"
            class="button-style"
            variant="biotech"
            @click="addModule()"
            v-if="actions.add_module"
          >
            <font-awesome-icon icon="plus" class="mr-1" />Add Module
          </b-button>
        </b-col>
     
      </b-col>
    </b-row>

      <!-- Main table element -->
      <b-table
        id="module-table"
        class="table-style"
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
      >
      <template #table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner small class="align-middle"  variant="dark">
          </b-spinner>
          <strong class="loading_spinner">Loading...</strong>
        </div>
      </template>

        <template v-slot:cell(actions)="row">
          <b-button
            id="edit_module"
            variant ="edit"
            size="sm"
            @click="edit(row.item)"
            class="table-button"
            v-b-tooltip.hover
            title="Update Module"
            v-if="actions.edit_module"
          >
            <font-awesome-icon icon="edit" />
          </b-button>
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
              id="perPageSelect_modules-pagination"
              size="sm"
              :options="pageOptions"
            ></b-form-select>
          </b-form-group>
        </b-col> 

        <b-col  label-cols-sm
          class="mb-0 mt-2 text-left"
          cols="3"
          align-h="center">
          <div size="sm" style="color: gray; font-size: 11.5px;">{{ bottomLabel }}</div>
        </b-col>
        <b-col>
          <b-pagination
            id="modules-pagination"
            pills
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="right"
            size="sm"
            aria-controls="modules-table"
            limit="3"
            class="mt-1"
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
        no-close-on-backdrop
        @hide="clearForm()"
      >
        <template v-slot:modal-title>
          <h6>Add Module</h6>
        </template>

        <small class="text-left">Module Name</small>
        <b-row >
          <b-form-input
            size="xs"
            id="add_module_name_modal"
            type="text"
            class="mx-3 form-text"
            v-model="moduleForm.Name"
          ></b-form-input>
        </b-row>

        <template v-slot:modal-footer="{  cancel }">
          <b-button
            id="add_module_modal"
            size="sm"
            variant="biotech"
            @click="saveModule()"
            class="button-style"
            :disabled="showLoading === true"
          >
      Add
          </b-button>
          <b-button
            id="cancel_add_module_modal"
            size="sm"
            @click="cancel()"
            class="button-style"
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
        no-close-on-backdrop
        @hide="clearForm()"
      >
        <template v-slot:modal-title>
          <h6>Update Module</h6>
        </template>

        <small class="text-left">Module Name</small>
        <b-row align-h="center">
          <b-form-input
            id="inpute_module"
            type="text"
            class="mx-2 form-text"
            v-model="moduleForm.Name"
            disabled
          ></b-form-input>
        </b-row>
        <small class="text-left">Status</small>
        <b-row align-h="center">
          <b-form-select
            id="edit_status_modal"
            type="text"
            class="mx-2 form-text"
            v-model="moduleForm.U_IS_ACTIVE"
          >
            <option :value="1">Active</option>
            <option :value="0">Inactive</option>
          </b-form-select>
        </b-row>

        <template v-slot:modal-footer="{ cancel }">
          <b-button
            id="edit_module_modal"
            size="sm"
            variant="biotech"
            @click="editModule()"
            class="button-style"
            :disabled="showLoading === true"
          >
            Update
          </b-button>
          <b-button
            id="cancel_edit_module_modal"
            size="sm"
            @click="cancel()"
            class="button-style"
          >Cancel</b-button>
        </template>
      </b-modal>

      <!-- Edit Module -->
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
          :icon="alert.variant == 'danger' ? 'exclamation' : 'check-circle'"
          class="mr-1 alerticon"
        />
        {{ alert.message }}
      </b-alert>
    </div>

   
 </div>
</template>

<script>
import moment from "moment";
import Loading from "~/components/Loading/Loading.vue";
import { mapMutations } from "vuex";
import { mapGetters } from "vuex";

export default {
  components: {Loading},
  data() {
    return {
      showLoading: false,
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

      totalRows: null,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: "",
      filterOn: [],
      isBusy: true,
    };
  },
  computed: {
    filterItems() {
      return this.listModules.filter(listModules => {
        return this.filterStatus.includes(listModules.U_IS_ACTIVE) && (listModules.Name.toLowerCase().match(this.filter.toLowerCase()));
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
      this.showLoading = true;

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
            this.showLoading = false;
          } else {
            this.showAlert("Successfully Updated", "success");

            this.$bvModal.hide("edit-module-modal");
            this.clearForm();
            this.showLoading = false;
          }
        });
    },

    addModule() {
      this.$bvModal.show("add-module-modal");
    },

    saveModule() {
      this.showLoading = true;
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
            this.showLoading = false;
          } else {
            this.showAlert("Successfully Added", "success");

            this.$bvModal.hide("add-module-modal");
            this.clearForm();
            this.showLoading = false;
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

    // fetchPendingTransactions() {
    //   this.items = this.$store.state.transactions.pendingTransactions;
    //   return;
    // },
    // addDocument() {
    //   this.transactionForm.documentListValues.push({
    //     documentType: null,
    //     number: null
    //   });
    // },
    // removeDocument(id) {
    //   if (this.transactionForm.documentListValues.length === 1) {
    //     //Create an error message. Document must contain 1 or more
    //   } else {
    //     this.transactionForm.documentListValues.splice(id, 1);
    //   }
    // },
    // info(data) {
    //   this.transactionForm = data;
    //   this.$bvModal.show("process-modal");
    // },

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

  async beforeCreate() {
    if(!this.filter) {
      this.totalRows = this.filterItems ? this.filterItems.length : 0
    }

    this.isBusy = true;

    this.$store
      .dispatch("Admin/Modules/fetchListModules", {
        user_actions: JSON.parse(localStorage.user_actions),
        SessionId: localStorage.SessionId
      })
      .then(res => {
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

