<template>
<div>
    <!-- Main table -->

    <b-row>
      <b-col cols="12" md="4" lg="3" sm="5" xs="4" class="mt-3">
        <b-form-group>
          <b-input-group size="sm">
            <b-form-input
              v-model="filter"
              type="search"
              id="search_activity"
              placeholder="Search PrintLogs"
            ></b-form-input>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col cols="12" md="8" lg="6" sm="7" xs="4" class="mt-3" align="right">
        <b-input-group style="height:10px" size="sm">
          <!-- <b-input-group-prepend>
              <div style="background-color: green">
                <v-icon color="#ffffff" small>fa-calendar-week</v-icon>
              </div>
          </b-input-group-prepend>-->
          <date-range-picker
            id="actvty_date"
            ref="picker"
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
    </b-row>

    <!-- Main table element -->
    <b-table
      id="print-table"
      class="table-style"
      show-empty
      scrollable="true"
      sticky-header
      no-border-collapse
      :items="filterItems"
      :fields="itemsFields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      :filterIncludedFields="filterOn"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      @filtered="onFiltered"
      :busy="isBusy"
      responsive
    >
      <template #table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner small class="align-middle"  variant="dark">
          </b-spinner>
          <span class="loading_spinner">Loading...</span>
        </div>
      </template>

      <template v-slot:cell(U_CREATED_DATE)="row">{{ formatDate(row.item.U_CREATED_DATE) }}</template>

      <!-- <template v-slot:cell(actions)="row">
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
      </template> -->
    </b-table>
    <hr />

    <b-row>
      <b-col cols="1" class="mb-2 mt-1">
          <b-form-group class="mb-0">
            <b-form-select
              v-model="perPage"
              id="perPageSelect_printLogs-pagination"
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
        <div size="sm" style="color: gray; font-size: 11px;">{{ bottomLabel }}</div>
      </b-col>
      <b-col>
        <b-pagination
          id="printLogs-pagination"
          pills
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="right"
          size="sm"
          aria-controls="print-table"
          limit="3"
          class="mt-1"
        ></b-pagination>
      </b-col>
    </b-row>

    <!-- Main table -->

    <!-- View Activity -->
<!-- 
    <b-modal
      size="lg"
      header-bg-variant="success"
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
            <strong style="color:#00A651; font-size:1.1rem" class="ml-2">OLD DATA</strong>
          </label>
          <b-card class="card-logs cardShadow" style="border-radius:8px; font-size: 14px;">
            <ul class="list-unstyled">
              <li
                style="border-radius: 0px;padding-left:1rem; padding-bottom:5px; border-bottom: 1px solid #e5e5e5; padding-left:1rem; background-color: #fff"
                :key="i"
                v-for="(oldKey, i) in Object.keys(old_values)"
              >
                <div class="mb-2">
                  <font-awesome-icon style="font-size:11px; color: #00A651" icon="circle" />&nbsp;
                  <strong style="color:#00401F;">{{ oldKey }}:</strong>&nbsp;
                  <span style="color:#00401F;">{{ old_values[oldKey] }}</span>
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
                <div class="mb-2">
                  <font-awesome-icon style="font-size:11px; color: #A5CD39" icon="circle" />&nbsp;
                  <strong style="color:#344012;">{{ newKey }}:</strong>&nbsp;
                  <span style="color:#344012;">{{ new_values[newKey] }}</span>
                </div>
              </li>
            </ul>
          </b-card>
        </b-col>
      </b-row>

      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button
          id="close_view_md"
          size="sm"
          @click="cancel()"
          style="font-size:13px;border: 0px;"
        >Close</b-button>
      </template>
    </b-modal> -->

    <!-- View Activity  -->
</div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";

export default {
  components: { DateRangePicker },
  data() {
    return {
      rci: JSON.parse(localStorage.companyCode)['rci'],
      bfi: JSON.parse(localStorage.companyCode)['bfi'],
      company: null,
      windowWidth: window.innerWidth,
      actions: {
        view_printlogs: false,
      },
      isBusy: true,
    //   old_values: [],
    //   new_values: [],
    //   activityLogsForm: {
    //     activity_log_id: null,
    //     action: null,
    //     table_name: null,
    //     user_id: null,
    //     old_values: null,
    //     new_values: null,
    //     date: null,
    //     userFullName: null
    //   },

    //   items: [
    //     {
    //       document_type_name: "Sales Invoice",
    //       status: "Active"
    //     }
    //   ],

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

      itemsFields: [
        {
          key: "U_EMPLOYEE_CODE",
          label: "Employee ID",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "CREATED_BY",
          label: "Employee Name",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "U_TRANSACTION_ID",
          label: "Transaction Number",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "U_CREATED_DATE",
          label: "Date Printed",
          sortable: true,
          sortDirection: "desc"
        },
        // { key: "actions", label: "Actions" }
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
  created() {
    const user_details = JSON.parse(localStorage.user_details);
    const user_role = JSON.parse(localStorage.user_role);
    if(user_role.Name.toLowerCase() !== 'administrator') {
      this.$router.push("/transaction/deliveryreceipt")
    }
    this.company = user_details.U_COMPANY_CODE;
  },
  computed: {    
    filterItems(){
      let count = 0;
      return this.listPrintLogs.filter(logs => { 
        console.log(logs);
        count++;
        this.totalRows = count;
        return logs;
      })
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
      listPrintLogs: "Admin/Print_Logs/getPrintLogs"
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
    async resetDate() {
      this.isBusy = true;
      let date = new Date();
      await this.$store
      .dispatch("Admin/Print_Logs/fetchPrintLogs", {
        user_actions: JSON.parse(localStorage.user_actions),
        date_range: {
          date_from: moment(date).format("YYYY-MM-DD"),
          date_to: moment(date).format("YYYY-MM-DD"),
          company:(JSON.parse(localStorage.user_details).U_COMPANY_CODE)
        },
        SessionId: localStorage.SessionId,
      })
      .then(res => {
        this.isBusy = false;
      });

      if(!this.filter) {
        this.totalRows = this.filterItems ? this.filterItems.length : 0
      }
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
        .dispatch("Admin/Print_Logs/fetchPrintLogs", {
          user_actions: JSON.parse(localStorage.user_actions),
          date_range: {
            date_from: moment(this.datePicker.startDate).format("YYYY-MM-DD"),
            date_to: moment(this.datePicker.endDate).format("YYYY-MM-DD"),
            company:(JSON.parse(localStorage.user_details).U_COMPANY_CODE)
          },
          SessionId: localStorage.SessionId,
          
        })
        .then(res => {
          this.isBusy = false;
        });
        this.totalRows = this.listPrintLogs.length;
    },
    formatDate(date) {
      return moment(date).format("DD MMMM, YYYY");
    },

    // viewActivity(data) {
    //   this.old_values = { ...data.U_OLD_VALUES };
    //   this.new_values = { ...data.U_NEW_VALUES };

    //   this.$bvModal.show("view-activity-modal");
    // },

    onFiltered(filterItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filterItems.length;
      this.currentPage = 1;
    }
  },
  async beforeCreate() {
    this.isBusy = true;

    let date = new Date();

        
    await this.$store
      .dispatch("Admin/Print_Logs/fetchPrintLogs", {
        user_actions: JSON.parse(localStorage.user_actions),
        date_range: {
          date_from: moment(date).format("YYYY-MM-DD"),
          date_to: moment(date).format("YYYY-MM-DD"),
          company:(JSON.parse(localStorage.user_details).U_COMPANY_CODE)
        },
        SessionId: localStorage.SessionId,
        // user_actions: JSON.parse(localStorage.user_actions),
        // date_range: null,
        // SessionId: localStorage.SessionId,
      })
      .then(res => {
        this.isBusy = false;
      });

      if(!this.filter) {
        this.totalRows = this.filterItems ? this.filterItems.length : 0
      }
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