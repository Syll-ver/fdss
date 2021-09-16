<template>
<div>
    <Loading v-if="showLoading" />
    <div>
      <b-alert
        :show="alert.showAlert"
        dismissible
        :variant="alert.variant"
        @dismissed="alert.showAlert = null"
      >
        <font-awesome-icon
          :icon="
            alert.variant == 'success' ? 'check-circle' : 'exclamation-triangle'
          "
          class="mr-1"
          style="font-size:20px"
        />
        {{ alert.message }}
      </b-alert>
    </div>
    <div>
      <!-- Main table -->
       
     <b-row>
      <b-col cols="12" md="4" lg="3" sm="5" xs="4" class="mt-3">
        <b-form-group>
          <b-input-group size="sm">
            <b-form-input
              v-model="filter"
              type="search"
              id="filterInput"
              placeholder="Search Company"
            ></b-form-input>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col cols="12" md="4" lg="3" sm="2" xs="4" class="mt-3" align="left">
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
      <b-col cols="12" md="4" lg="6" sm="5" xs="4" class="mt-3" align="right">
          <b-button
            id="add_action"
            size="sm"
            class="button-style"
            :variant="company == rci ? 'revive' : 'biotech'"
            @click="addCompany()"
             v-if="actions.add_company">
             Add Company
          </b-button>
      </b-col>
    </b-row>

      <!-- Main table element -->
      <b-table
      v-if="actions.view_company"
        id="company-table"
        class="table-style mt-3"
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
        responsive
        :busy="isBusy"
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
            id="companyedit"
            variant="edit"
            size="sm"
            @click="edit(row.item)"
            class="table-button"
            v-b-tooltip.hover
            title="Update Company"
            v-if="actions.edit_company"
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
                  ).Name}}
          </div>
        </template>

        <template v-slot:cell(CompanyName)="row">
          {{
            listCompanies.find(
              company => company.U_COMPANYCODE == row.item.U_COMPANYCODE
            )
              ? listCompanies.find(
                  company => company.U_COMPANYCODE == row.item.U_COMPANYCODE
                ).COMPANYNAME
              : ""
          }}
        </template>

        <template v-slot:cell(U_IS_ACTIVE)="row">
          <div style="font-size:13.5px">
            <b-badge
              style="width:70px"
              pill
              :variant="row.item.U_IS_ACTIVE ? 'success' : 'danger'"
              >{{ row.item.U_IS_ACTIVE ? "Active" : "Inactive" }}</b-badge
            >
          </div>
        </template>
      </b-table>

      <hr />

      <b-row>
        <b-col cols="1" class="mb-2 mt-1">
          <b-form-group class="mb-0">
            <b-form-select
              v-model="perPage"
              id="perPageSelect_companies-pagination"
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
          <div size="sm" style="color: gray; font-size: 11.5px;">
            {{ bottomLabel }}
          </div>
        </b-col>

        <b-col>
          <b-pagination
            id="company-pagination"
            pills
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="right"
            size="sm"
            aria-controls="company-table"
            limit="3"
            class="mt-1"
          ></b-pagination>
        </b-col>
      </b-row>

      <!-- Main table -->

      <!-- Add Action -->

      <b-modal
        size="md"
        :header-bg-variant="company == rci ? 'revive' : 'biotech'"
        header-text-variant="light"
        body-bg-variant="light"
        footer-bg-variant="light"
        no-close-on-backdrop
        hide-header-close
        id="add-company-modal"
        @hide="clearForm()"
      >
        <template v-slot:modal-title>
          <h6>Add Company</h6>
        </template>

        <small class="text-left">Company Code</small>
        <b-row align-h="center">
          <b-form-select
            id="add-company-code"
            v-model="company_form.U_COMPANYCODE"
            style="font-size: 10px;"
            class="mx-3"
            type="text"
            @change="selectedCompanyCode()"
          >
            <option id="select-company-code" :value="null" disabled
              >Select Company Code</option
            >
            <option
              v-for="(code, i) of listSAPcompanies"
              :key="i"
              :value="code.ID"
              >{{ code.ID + " - " + code.COMPANYNAME }}</option
            >
          </b-form-select>
        </b-row>

        <small class="text-left">Company Name</small>
        <b-row align-h="center">
          <b-form-input
            id="add-company-name"
            v-model="company_form.COMPANYNAME"
            class="mx-3"
            style="font-size:10px"
            disabled
          ></b-form-input>
        </b-row>

        <template v-slot:modal-footer="{ cancel }">
          
          <b-button
            id="add_action_modal"
            size="sm"
            :variant="company == rci ? 'revive' : 'biotech'"
            @click="addCompanyTable()"
            style="font-size:13px"
            class="button"
            :disabled="showLoading === true"
            >Add
          </b-button>
          <b-button
            id="cancel_add_action_modal"
            size="sm"
            @click="cancel()"
            style="font-size:13.5px;border: 0px;"
            :disabled="showLoading === true"
            >Cancel</b-button
          >
        </template>
      </b-modal>

      <!-- Add Action -->

      <!-- Edit Action -->

      <b-modal
        size="md"
        :header-bg-variant="company == rci ? 'revive' : 'biotech'"
        header-text-variant="light"
        body-bg-variant="light"
        footer-bg-variant="light"
        no-close-on-backdrop
        hide-header-close
        id="edit-company-modal"
        @hide="clearForm()"
      >
        <template v-slot:modal-title>
          <h6>Update Company</h6>
        </template>

        <small class="text-left">Company Code</small>
        <b-row align-h="center">
          <b-form-select
            id="edit-company-code"
            v-model="company_form.U_COMPANYCODE"
            style="font-size: 10px;"
            class="mx-3"
            type="text"
            @change="selectedCompanyCode()"
            disabled
          >
            <option id="select-company-code" :value="null" disabled
              >Select Company Code</option
            >
            <option
              v-for="(code, i) of listSAPcompanies"
              :key="i"
              :value="code.ID"
              >{{ code.ID + " - " + code.COMPANYNAME }}</option
            >
          </b-form-select>
        </b-row>

        <small class="text-left">Company Name</small>
        <b-row align-h="center">
          <b-form-input
            id="edit-company-name"
            v-model="company_form.COMPANYNAME"
            class="mx-3"
            style="font-size:10px"
            disabled
          ></b-form-input>
        </b-row>

        <small class="text-left">Status</small>
        <b-row align-h="center">
          <b-form-select
            class="mx-3"
            type="text"
            style="font-size:10px"
            v-model="company_form.U_IS_ACTIVE"
          >
            <option :value="1">Active</option>
            <option :value="0">Inactive</option>
          </b-form-select>
        </b-row>

        <template v-slot:modal-footer="{ cancel }">
        
          <b-button
            size="sm"
            :variant="company == rci ? 'revive' : 'biotech'"
            @click="editCompanyTable()"
            style="font-size:13px"
            class="button"
            :disabled="showLoading === true"
            >Update
          </b-button>
            <b-button
            size="sm"
            @click="cancel()"
            style="font-size:13.5px;border: 0px;"
            :disabled="showLoading === true"
            >Cancel</b-button
          >
        </template>
      </b-modal>
    </div>
</div>
</template>

<script>
import moment from "moment";
import { mapMutations } from "vuex";
import { mapGetters } from "vuex";
import Loading from "@/components/Loading/Loading.vue";

export default {
  components: {
    Loading
  },
  data() {
    return {
      rci: JSON.parse(localStorage.companyCode)['rci'],
      bfi: JSON.parse(localStorage.companyCode)['bfi'],
      company: null,
      isBusy: true,
      showLoading: false,
      filterStatus: [1],

      actions: {
        add_company: false,
        edit_company: false,
        view_company: false
      },

      alert: {
        showAlert: 0,
        variant: "success",
        message: ""
      },

      company_form: {
        Code: null,
        U_COMPANYCODE: null,
        COMPANYNAME: null,
        U_IS_ACTIVE: null
      },

      fields: [
        {
          key: "Code",
          label: "Code",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "U_COMPANYCODE",
          label: "Company Code",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "CompanyName",
          label: "Company Name",
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
      filterOn: []
    };
  },
  computed: {
    filterItems() {
      let count = 0;
      return this.listCompanies.filter(listCompanies => {
        if(this.filterStatus.includes(listCompanies.U_IS_ACTIVE)) {
          count++;
          this.totalRows = count;
          return listCompanies;
        }
        if(this.filterStatus.includes(!listCompanies.U_IS_ACTIVE)) {
          count++;
          this.totalRows = count;
          return listCompanies;
        }
      });
    },

    filterFields() {
      if (this.actions.edit_company === false) {
        return this.fields.filter(field => field.key !== "actions");
      } else {
        return this.fields;
      }
    },
    ...mapGetters({
      listCompanies: "Admin/Company/getListCompanies",
      listSAPcompanies: "SAP/Companies/getCompanyList"
    }),

    getListActions() {
      return this.listCompanies;
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
      this.company_form = {
        Code: null,
        U_COMPANYCODE: null,
        COMPANYNAME: null,
        U_IS_ACTIVE: null
      };
    },

    cancel() {
      this.alert.showAlert = 0;
    },

    selectedCompanyCode() {
      this.company_form.COMPANYNAME = this.listSAPcompanies.find(
        company => company.ID == this.company_form.U_COMPANYCODE
      ).COMPANYNAME;
    },

    editCompanyTable() {
      this.showLoading = true;
      this.$store
        .dispatch("Admin/Company/editCompany", {
          company_details: this.company_form,
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
              if (res.response.data.errorMsg === "Session restore error.") {
                this.$bvModal.show("session_modal");
              }
              this.showAlert(res.response.data.errorMsg, "danger");
            } else {
              this.showAlert(res.message, "danger");
            }
            this.showLoading = false;
          } else {
            this.showAlert("Success", "success");
            this.$bvModal.hide("edit-company-modal");
            this.clearForm();
            this.showLoading = false;
          }
        });
    },

    addCompanyTable() {
      this.showLoading = true;
      this.$store
        .dispatch("Admin/Company/addCompany", {
          U_CREATED_BY: JSON.parse(localStorage.user_details).Code,
          user_actions: JSON.parse(localStorage.user_actions),
          company_details: this.company_form,
          SessionId: localStorage.SessionId
        })
        .then(res => {
          if (res && res.name == "Error") {
            if (res.response && res.response.data.errorMsg) {
              if (res.response.data.errorMsg === "Invalid session.") {
                this.$bvModal.show("session_modal");
              }
              if (res.response.data.errorMsg === "Session restore error.") {
                this.$bvModal.show("session_modal");
              }
              this.showAlert(res.response.data.errorMsg, "danger");
            } else {
              this.showAlert(res.message, "danger");
            }
            this.showLoading = false;
          } else {
            this.showAlert("Success", "success");
            this.$bvModal.hide("add-company-modal");
            this.clearForm();
            this.showLoading = false;

            this.$store
              .dispatch("Admin/Company/fetchListCompany", {
                user_actions: JSON.parse(localStorage.user_actions),
                SessionId: localStorage.SessionId,
                Admin: "Y"
              })
              .then(res => {
                if (res && res.name == "Error") {
                  if (res.response && res.response.data.errorMsg) {
                    if (res.response.data.errorMsg === "Invalid session.") {
                      this.$bvModal.show("session_modal");
                    }
                    if (
                      res.response.data.errorMsg === "Session restore error."
                    ) {
                      this.$bvModal.show("session_modal");
                    }
                  }
                }
              });
          }
        });
    },

    addCompany() {
      this.$bvModal.show("add-company-modal");
    },

    edit(data) {
      this.company_form = { ...data };
      this.$bvModal.show("edit-company-modal");
    },

    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },

    onFiltered(filterItems) {
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
    if(!this.filter) {
      this.totalRows = this.filterItems ? this.filterItems.length : 0
    }

    //  this.showLoading = true;
    this.isBusy = true;

    await this.$store
      .dispatch("Admin/Company/fetchListCompany", {
        user_actions: JSON.parse(localStorage.user_actions),
        SessionId: localStorage.SessionId,
        Admin: "Y"
      })
      .then(res => {
        if (res && res.name == "Error") {
          if (res.response && res.response.data.errorMsg) {
            if (res.response.data.errorMsg === "Invalid session.") {
              this.$bvModal.show("session_modal");
            }
            if (res.response.data.errorMsg === "Session restore error.") {
              this.$bvModal.show("session_modal");
            }
          }
        }
      });

    await this.$store
      .dispatch("SAP/Companies/fetchCompanyList", {
        user_actions: JSON.parse(localStorage.user_actions),
        SessionId: localStorage.SessionId
      })
      .then(res => {
        if (res && res.name == "Error") {
          if (res.response && res.response.data.errorMsg) {
            if (res.response.data.errorMsg === "Invalid session.") {
              this.$bvModal.show("session_modal");
            }
            if (res.response.data.errorMsg === "Session restore error.") {
              this.$bvModal.show("session_modal");
            }
          }
        }
      });

    this.isBusy = false;
  },

  created() {
    const user_details = JSON.parse(localStorage.user_details);
    const user_role = JSON.parse(localStorage.user_role);
    if(user_role.Name.toLowerCase() !== 'administrator') {
      this.$router.push("/transaction/deliveryreceipt")
    }
    this.company = user_details.U_COMPANY_CODE;
    const userActions = JSON.parse(localStorage.user_actions)["Admin Module"];
    if (userActions.find(action => action.U_ACTION_NAME === "Add company")) {
      this.actions.add_company = true;
    }
    if (userActions.find(action => action.U_ACTION_NAME === "Edit company")) {
      this.actions.edit_company = true;
    }
    if (userActions.find(action => action.U_ACTION_NAME === "View companies")) {
      this.actions.view_company = true;
    }
    
  }
};
</script>
