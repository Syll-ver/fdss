<template>
<div>
    <!-- Main table -->

    <b-row>
      <b-col cols="3" class="mt-3">
        <b-form-group>
          <b-input-group size="sm">
            <b-form-input
              v-model="filter"
              type="search"
              id="search_activity"
              placeholder="Search Activity"
            ></b-form-input>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col cols="4" class="mt-3">
        <b-input-group prepend="Date" style="height:10px" size="sm">
          <!-- <b-input-group-prepend>
              <div style="background-color: green">
                <v-icon color="#ffffff" small>fa-calendar-week</v-icon>
              </div>
          </b-input-group-prepend>-->
          <date-range-picker
            id="actvty_date"
            ref="picker"
            :opens="opens"
            :locale-data="localeData"
            :autoApply="true"
            :singleDatePicker="false"
            :showWeekNumbers="true"
            v-model="datePicker"
            @update="updateValues"
          >
            <div
              id="actvty_date"
              slot="input"
              style="height:2rem; font-size:14px;"
            >{{ datePicker.startDate }} - {{ datePicker.endDate }}</div>
          </date-range-picker>
          <b-input-group-append style="height:2rem; font-size:12px">
            <b-button @click="resetDate" id="date-reset" style="font-size:12px">Reset</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-col>
  <b-col ></b-col>

      <b-col cols="2"  class="mt-3" align="right">
        <!-- <b-form-group class="mb-0">
          <b-form-select
            id="perPageSelect_action"
            size="sm"
            :options="pageOptions"
          ></b-form-select>
        </b-form-group> -->
      
          <!-- <b-dropdown
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
            >
              <b-form-checkbox id="active_stat" :value="1">Active</b-form-checkbox>
              <b-form-checkbox id="inactive_stat" :value="0" unchecked-value="true">Inactive</b-form-checkbox>
            </b-form-checkbox-group>
          </b-dropdown> -->
     
      </b-col>
    </b-row>

    <!-- Main table element -->
    <b-table
      id="activity-table"
      show-empty
      class="table-style"
      scrollable
      sticky-header
      no-border-collapse
      responsive
      :busy="isBusy"
      :items="filterItems"
      :fields="fields"
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
          <b-spinner small class="align-middle" variant="dark">
          </b-spinner>
          <span class="loading_spinner">Loading...</span>
        </div>
      </template>

      <template v-slot:cell(actions)="row">
        <b-button
          id="view_activity"
          size="sm"
          @click="viewActivity(row.item)"
          class="mr-1 button-circle"
          style="font-size:12px; "
          v-b-tooltip.hover
          title="View Activity Log"
        >
          <font-awesome-icon icon="folder-open" />
        </b-button>
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
        <div size="sm" style="color: gray; font-size: 11px;">{{ bottomLabel }}</div>
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

    <!-- View Activity -->

    <b-modal
      size="lg"
      header-bg-variant="biotech"
      body-bg-variant="light"
      header-text-variant="light"
      id="view-activity-modal"
    >
      <template v-slot:modal-title>
        <h6>View Activity Log</h6>
      </template>
      <b-row>
        <b-col cols="6">
          <label>
            <strong style="color:biotech; font-size:1.1rem" class="ml-2">OLD DATA</strong>
          </label>
          <b-card class="card-logs cardShadow" style="border-radius:8px; font-size: 14px;">
            <ul class="list-unstyled">
              <li
                style="border-radius: 0px;padding-left:1rem; padding-bottom:5px; border-bottom: 1px solid #e5e5e5; padding-left:1rem; background-color: #fff"
                :key="i"
                v-for="(oldKey, i) in Object.keys(old_values)"
              >
                <div
                  class="mb-2"
                  :style="isNotEqual(old_values[oldKey], new_values[oldKey])"
                >
                  <font-awesome-icon style="font-size:11px; color: biotech" icon="circle" />&nbsp;
                  <strong style="color:#00401F;">{{ oldKey }}:</strong>&nbsp;
                  <!-- <span style="color:#00401F;">{{ old_values[oldKey] }}</span> -->
                  <span style="color:#00401F;">{{
                    alterKeyValue(oldKey, old_values[oldKey])
                  }}</span>
                </div>
              </li>
            </ul>
          </b-card>
        </b-col>

        <b-col cols="6">
          <label>
            <strong style="color:#A5CD39; font-size:1.1rem" class="ml-2 tex">NEW DATA</strong>
          </label>
          <b-card class="card-logs cardShadow" style="border-radius:8px; font-size: 14px">
            <ul class="list-unstyled">
              <li
                style="border-radius: 0px; padding-left:1rem; padding-bottom:5px; border-bottom: 1px solid #e5e5e5; padding-left:1rem; background-color: #fff;"
                :key="i"
                v-for="(newKey, i) in Object.keys(new_values)"
              >
                <div class="mb-2"
                  :style="isNotEqual(old_values[newKey], new_values[newKey])"
                >
                  <font-awesome-icon style="font-size:11px; color: #A5CD39" icon="circle" />&nbsp;
                  <strong style="color:#344012;">{{ newKey }}:</strong>&nbsp;
                  <!-- <span style="color:#344012;">{{ new_values[newKey] }}</span> -->
                  <span style="color:#00401F;">{{
                    alterKeyValue(newKey, new_values[newKey])
                  }}</span>
                </div>
              </li>
            </ul>
          </b-card>
        </b-col>
      </b-row>

      <template v-slot:modal-footer="{ cancel }">
        <b-button
          id="close_view_md"
          size="sm"
          @click="cancel()"
          style="font-size:13px;border: 0px;"
        >Close</b-button>
      </template>
    </b-modal>

    <!-- View Activity  -->
</div>
</template>

<script>
import moment from "moment";
import axios from "axios";
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";

export default {
  components: { DateRangePicker },
  data() {
    return {
      isBusy: true,
      old_values: [],
      new_values: [],
      activityLogsForm: {
        activity_log_id: null,
        action: null,
        table_name: null,
        user_id: null,
        old_values: null,
        new_values: null,
        date: null,
        userFullName: null
      },
      transaction_types: [],

      items: [
        {
          document_type_name: "Sales Invoice",
          status: "Active"
        }
      ],

      datePicker: {
        startDate: moment().format("MMM DD, YYYY"),
        endDate: moment().format("MMM DD, YYYY")
      },
      dateRange: {
        date_from: moment().format("YYYY-MM-DD"),
        date_to: moment().format("YYYY-MM-DD")
      },
      localeData: {
        direction: "ltr",
        format: moment().format("mmm dd, yyyy"),
        separator: " - "
      },

      fields: [
        {
          key: "U_TABLE",
          label: "Table Name",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "U_OPERATION",
          label: "Action",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "Employee",
          label: "Inserted/Updated By",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "U_LOG_DATE",
          label: "Date",
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
      return this.listActivityLogs.filter(listActivityLogs => {
        return (listActivityLogs.U_TABLE.toLowerCase().match(this.filter.toLowerCase()) || listActivityLogs.U_OPERATION.toLowerCase().match(this.filter.toLowerCase()) || listActivityLogs.Employee.toLowerCase().match(this.filter.toLowerCase()));
      });
    },

    bottomLabel() {
      let end = this.perPage * this.currentPage;
      let start = end - this.perPage + 1;

      if(!this.filterItems) {
        return;
      }

      if (end > this.listActivityLogs.length) {
        end = this.listActivityLogs.length;
      }

      if (this.filterItems.length === 0) {
        start = 0;
      }

      return `Showing ${start} to ${end} of ${this.filterItems.length} entries`;
    },

    ...mapGetters({
      listActivityLogs: "Admin/Activity_Logs/getActivityLogs",
      listRoles: "Admin/Roles/getListRoles",
      listUsers: "Admin/Users/getUsers"
    }),

    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key };
        });
    }
  },

  methods: {
    //     alterKey(key) {
    //      function replaceAll(string, search, replace) {
    //     return string.split(search).join(replace);
    //   }

    //   let result = replaceAll(key, "_", " ");

    //   if (result.search("U ") == 0) {
    //     result = result.replace("U ", "");
    //   }

    //   if (result.search("IS ") == 0) {
    //     result = result.replace("IS ", "");
    //   }

    //   if (
    //     result.search("COMPANY CODE") == 0 ||
    //     result.search("ROLE CODE") == 0
    //   ) {
    //     result = result.replace(" CODE", "");
    //   }

    //   return result;
    // },

    alterKeyValue(key, value) {
      if (key.search("U_CREATED_BY") == 0 || key.search("U_UPDATED_BY") == 0) {
        return this.getUserName(value);
      } else if (
        key.search("U_IS_SAP_USER") == 0 ||
        key.search("U_IS_ACTIVE") == 0
      ) {
        return value ? "Yes" : "No";
      } else if (key.search("U_ROLE_CODE") == 0) {
        return this.getRoleName(value);
      } else if (
        key.search("U_UPDATED_AT") == 0 ||
        key.search("U_CREATED_AT") == 0
      ) {
        return this.formatDate(value);
      } else if (
        key.search("U_UPDATED_DATE") == 0 ||
        key.search("U_CREATED_DATE") == 0 ||
        key.search("U_SCHEDULED_DATE") == 0 
      ) {
        return this.formatDate(value);
      } else if (
        key.search("U_UPDATED_TIME") == 0 ||
        key.search("U_CREATED_TIME") == 0 ||
        key.search("U_SCHEDULED_TIME") == 0 
      ) {
        return this.formatTime(value);
      // } else if (key.search("U_COMPANY_CODE") == 0) {
      //   return this.getCompanyName(value);
      // } else if (key.search("U_PASSWORD") == 0) {
      //   return this.formatPassword(value);
      // } else if (key.search("U_CARD_TYPE") == 0) {
      //   return this.getCardType(value);
      // } else if (key.search("U_ACTION_CODE") == 0) {
      //   return this.getActionName(value);
      } else if (key.search("U_ACTIVE") == 0) {
        return value ? "Yes" : "No";
      } else {
        return value;
      }
    },

    getUserName(Code){
      let User = null;
      let Name = null;
      if(this.listUsers.find(user => user.Code == Code)) {
        User = this.listUsers.find(user => user.Code == Code);

        Name = `${User.FirstName} ${User.LastName}`;
        return Name;
      }
    },

    getRoleName(Code) {
      let Role = null;

      if (this.listRoles.find(role => role.Code == Code)) {
        Role = this.listRoles.find(role => role.Code == Code).Name;
      }

      return Role;
    },

    getActionName(Code) {
      let Action = null;

      if (this.listActions.find(action => action.Code == Code)) {
        Action = this.listActions.find(action => action.Code == Code)
          .U_ACTION_NAME;
      }

      return Action;
    },

    formatDate(Code) {
      return moment(Code).format("MMM DD, YYYY");
    },

    formatTime(value) {
      let data = value.toString();
      if (data.length < 4) {
        data = "0" + data;
      }
      data = data.slice(0, 2) + ":" + data.slice(2);
      const now = moment().format("YYYY-MM-DD");
      const concat = now + " " + data;
      return moment(concat).format("hh:mm A");
    },

    isNotEqual(old, newVal) {
      if (old != newVal) {
        return "background-color:#DDFBBD; border-radius:2px";
      }
      return "";
    },

    async getTransactionType() {
      const res = await axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/api/transaction/types/select`,
        headers: {
          Authorization: localStorage.SessionId
        }
      });
      const v = res.data.view;

      for (let i = 0; i < v.length; i++) {
        this.transaction_types.push({
          text: v[i].U_DESCRIPTION,
          value: v[i].Code
        });
      }
    },

    async resetDate() {
      this.isBusy = true;
      this.datePicker.startDate = moment().format("MMM DD, YYYY");
      this.datePicker.endDate = moment().format("MMM DD, YYYY");

      await this.$store
        .dispatch("Admin/Activity_Logs/fetchActivtyLogs", {
          user_actions: JSON.parse(localStorage.user_actions),
          date_range: null,
          SessionId: localStorage.SessionId
        })
        .then(res => {
          this.isBusy = false;
        });
    },
    async updateValues() {
      this.isBusy = true;
      this.datePicker.startDate = moment(this.datePicker.startDate).format(
        "MMM DD, YYYY"
      );
      this.datePicker.endDate = moment(this.datePicker.endDate).format(
        "MMM DD, YYYY"
      );
      (this.dateRange.date_from = moment(this.datePicker.startDate).format(
        "YYYY-MM-DD"
      )),
        (this.dateRange.date_to = moment(this.datePicker.endDate).format(
          "YYYY-MM-DD"
        ));

      await this.$store
        .dispatch("Admin/Activity_Logs/fetchActivtyLogs", {
          user_actions: JSON.parse(localStorage.user_actions),
          date_range: {
            date_from: moment(this.datePicker.startDate).format("YYYY-MM-DD"),
            date_to: moment(this.datePicker.endDate).format("YYYY-MM-DD")
          },
          SessionId: localStorage.SessionId
        })
        .then(res => {
          this.isBusy = false;
        });
    },

    viewActivity(data) {
      this.old_values = { ...data.U_OLD_VALUES };
      this.new_values = { ...data.U_NEW_VALUES };

      this.$bvModal.show("view-activity-modal");
    },

    onFiltered(filterItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filterItems.length;
      this.currentPage = 1;
    }
  },
  async created() {
    if(!this.filter) {
      this.totalRows = this.filterItems ? this.filterItems.length : 0
    }
    this.isBusy = true;

    let dateRange = {
      startDate: moment().format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD")
    };

    await this.$store
      .dispatch("Admin/Activity_Logs/fetchActivtyLogs", {
        user_actions: JSON.parse(localStorage.user_actions),
        date_range: null,
        SessionId: localStorage.SessionId
      })
      .then(res => {
        this.isBusy = false;
      });

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
  }
};
</script>

<style>

.reportrange-text[data-v-8cc9549e] {
  /* background: #fff; */
  /* cursor: pointer; */
  /* padding: 5px 10px; */
  border: 1px solid #ccc;
  height: 2rem;
  width: 14rem;
  font-size: 12px;
}

.daterangepicker.show-ranges .drp-calendar.left {
  position: relative;
  right: 8px;
}

.daterangepicker.show-ranges .drp-calendar.left {
   border-left: 0px solid #ddd;
}

.daterangepicker .ranges li.active {
  background-color: #743013;
  color: #fff;
}

.daterangepicker td.active,
.daterangepicker td.active:hover {
  background-color: #743013;
  border-color: transparent;
  color: #fff;
}

.daterangepicker .ranges li.active {
  background-color: #743013;
  color: #fff;
}
</style>
