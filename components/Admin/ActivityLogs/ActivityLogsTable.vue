<template>
<div>
    <!-- Main table -->

    <b-row>
      <b-col cols="4" class="mt-3">
        <b-form-group>
          <b-input-group size="sm">
            <b-form-input
              v-model="filter"
              type="search"
              id="search_activity"
              placeholder="Search Activity"
            ></b-form-input>
            <b-input-group-append>
            <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
            </b-input-group-append>
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
              style="min-width: 150px;"
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
            >
              <b-form-checkbox id="active_stat" :value="1">Active</b-form-checkbox>
              <b-form-checkbox id="inactive_stat" :value="0" unchecked-value="true">Inactive</b-form-checkbox>
            </b-form-checkbox-group>
          </b-dropdown>
     
      </b-col>
    </b-row>

    <!-- Main table element -->
    <b-table
      id="activity-table"
      style="font-size:15.5px; max-height: 100%;"
      show-empty
      scrollable="true"
      sticky-header
      no-border-collapse
      :items="listActivityLogs"
      :fields="fields"
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
      <template v-slot:table-busy>
        <div class="text-center text-secondary my-2">
          <b-spinner small class="align-middle"></b-spinner>
          <strong>&nbsp;Loading...</strong>
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

    <!-- View Activity -->

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
    </b-modal>

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
      isBusy: false,
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
    bottomLabel() {
      let end = this.perPage * this.currentPage;
      let start = end - this.perPage + 1;

      if (end > this.listActivityLogs.length) {
        end = this.listActivityLogs.length;
      }

      if (this.listActivityLogs.length === 0) {
        start = 0;
      }

      return `Showing ${start} to ${end} of ${this.listActivityLogs.length} entries`;
    },

    rows() {
      return this.listActivityLogs.length;
    },

    ...mapGetters({
      listActivityLogs: "Admin/Activity_Logs/getActivityLogs"
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

    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      // this.totalRows = filteredItems.length;
      this.currentPage = 1;
    }
  },
  async created() {
    this.isBusy = true;
    await this.$store
      .dispatch("Admin/Activity_Logs/fetchActivtyLogs", {
        user_actions: JSON.parse(localStorage.user_actions),
        date_range: null,
        SessionId: localStorage.SessionId
      })
      .then(res => {
        this.isBusy = false;
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
