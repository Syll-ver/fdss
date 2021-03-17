<template>
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

    <b-row>
      <b-col cols="3" class="mt-3">
        <b-form-group>
          <b-input-group size="sm">
            <b-form-input
              v-model="filter"
              type="search"
              id="search_location_receipt"
              placeholder="Search Location"
            ></b-form-input>
          </b-input-group>
        </b-form-group>
      </b-col>

      <!-- <b-row> -->
      <b-col align="right">
        <b-button
          id="create"
          variant="biotech"
          class="button-style mt-3"
          size="sm"
          @click="$bvModal.show('add-location-modal')"
        >
          <font-awesome-icon icon="plus" class="mr-1" />Add Location
        </b-button>
      </b-col>
    <!-- </b-row> -->
    </b-row>

    <!-- Main table element -->
    <b-table
      id="location-table"
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

      <template v-slot:cell(actions)="row">
        <div>
          <b-button
            variant="edit"
            id="edit"
            class="table-button"
            size="sm"
            @click="edit(row.item)"
            v-b-tooltip.hover
            title="Edit Transaction"
          >
            <font-awesome-icon icon="edit" />
          </b-button>          
        </div>
      </template>

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
          aria-controls="location-table"
          limit="3"
          class="mt-1"
        ></b-pagination>
      </b-col>
    </b-row>

    <b-modal
      size="large"
      header-bg-variant="biotech"
      header-text-variant="light"
      body-bg-variant="gray"
      id="add-location-modal"
      hide-header-close
      no-close-on-backdrop
      no-scrollable
    >
      <template v-slot:modal-title>
        <h6>Add Printer</h6>
      </template>
        
      <b-row>
        <b-col class="mt-2">
          <small class="text-left">Location</small>
          <b-form-input
            id="location"
            placeholder="Location"
            class="form-text"
            v-model="new_location"
            required
            style="font-size: 13.5px"
          />
        </b-col>
      </b-row>

      <template v-slot:modal-footer="{}">
        <b-button
          id="add_action_modal"
          size="sm"
          class="button-style"
          variant="biotech"
          @click="add()"
          :disabled="showLoading === true"
        >
          Create
        </b-button>
        <b-button
          id="cancel_add_action_modal"
          size="sm"
          class="button-style"
          @click="close()"
          >Cancel</b-button
        >
      </template>
    </b-modal>

     <!-- edit location modal -->

      <b-modal
      size="large"
      header-bg-variant="biotech"
      header-text-variant="light"
      body-bg-variant="gray"
      id="edit-location-modal"
      hide-header-close
      no-close-on-backdrop
      no-scrollable
    >
      <template v-slot:modal-title>
        <h6>Edit Location</h6>
      </template>

      <b-row>
          <b-col class="mt-2">
            <small class="text-left">Code</small>
            <b-form-input
              id="location"
              placeholder="Location"
              class="form-text"
              v-model="location.Code"
              required
              style="font-size: 13.5px"
              disabled
            />
          </b-col>
        </b-row>
        
        <b-row>
          <b-col class="mt-2">
            <small class="text-left">Location</small>
            <b-form-input
              id="location"
              placeholder="Location"
              class="form-text"
              v-model="location.U_ADDRESS"
              required
              style="font-size: 13.5px"
            />
          </b-col>
        </b-row>

      <template v-slot:modal-footer="{}">
        <b-button
          id="add_action_modal"
          size="sm"
          class="button-style"
          variant="biotech"
          @click="updateLocation()"
          :disabled="showLoading === true"
        >
          Create
        </b-button>
        <b-button
          id="cancel_add_action_modal"
          size="sm"
          class="button-style"
          @click="close()"
          >Cancel</b-button
        >
      </template>
    </b-modal>

    <!-- end edit location modal -->

</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import DateRangePicker from "vue2-daterange-picker";
import Loading from "~/components/Loading/Loading.vue";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";

export default {
  components: { DateRangePicker,
  Loading },
  data() {
    return {
      isBusy: true,
      showLoading: false,
      printer_ip: null,
      printer_location: null,
      printer_port: null,
      action: [],
      itemsFields: [
        {
          key: "Code",
          label: "Code",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "U_ADDRESS",
          label: "Location",
          sortable: true,
          sortDirection: "desc"
        },
        { key: "actions", label: "Action", class: "text-center" }

      ],

      alert: {
        showAlert: 0,
        variant: "biotech",
        message: ""
      },
      totalRows: null,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: "",
      filterOn: [],
      locations: [],
      location: [],
      new_location: null,
    };
  },
  computed: {    
    ...mapGetters({
      listLocations: "Admin/Location/getListLocations",
      listPrinters: "Admin/Printer/getListPrinters",
    }),

    filterItems(){
      return this.listLocations.filter(logs => { 
        return (logs.U_ADDRESS.toLowerCase().match(this.filter.toLowerCase()));
      })
      this.totalRows = locations.length;
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
    edit(data) {
      this.location = [];
      this.location = { ...data }
      // this.location.old_value = data.U_ADDRESS
      this.$bvModal.show('edit-location-modal')
    },

    async updateLocation(){
      // console.log(this.listPrinters);
      // console.log(this.location);

      // const printer = this.listPrinters.find(print => print.U_ADDRESS === this.location.old_value);

      if(this.location.U_ADDRESS == null ){
        this.showAlert("Please input Location", "danger");
      } else {
        const existing = this.listLocations.find(loc => loc.U_ADDRESS === this.location.U_ADDRESS)

        if(existing != null) {
          this.showAlert(`${this.location.U_ADDRESS} already exists`, 'danger')
        } else {
          this.showLoading = true;
          const SessionId = localStorage.SessionId;
          this.$store.dispatch("Admin/Location/updateLocationn", {
            sessionId: SessionId,
            data: this.location,
          }).then( res => {
            if (res && res.name == "Error") {
              if (res.response && res.response.data.error) {
                if (res.response.data.error === "Session expired") {
                  this.$bvModal.show("session_modal");
                }
              }
              this.showLoading = false;
            } else {

              // if(printer) {
              //   axios({
              //     method: "PATCH",
              //     url: `${process.env.serverPrintUrl}/fdss/update`,
              //     data: {
              //       uuids: process.env.uuid,
              //       ip: printer.ip,
              //       location: this.location.U_ADDRESS
              //     }
              //   })
              // }

              this.showLoading = false;
              this.$bvModal.hide("edit-location-modal");
              this.new_location = null;
              this.showAlert("Successfully Added", "success");
              
              this.$store.dispatch("Admin/Location/fetchListLocations")
            }
          }).catch( e => {
            console.log(e);
          })
        }
      }
    },

    close(){
      this.$bvModal.hide('add-location-modal')
      this.$bvModal.hide('edit-location-modal')
      this.new_location = null
      this.location = [];
    },

    async add(){
      this.showLoading = true;
        if(this.new_location == null ){
            this.showAlert("Please input Location", "danger");
        } else {
          this.$store.dispatch("Admin/Location/addLocation", {
            sessionId: localStorage.SessionId,
            data: this.new_location,
          }).then( res => {
            if (res && res.name == "Error") {
              if (res.response && res.response.data.error) {
                if (res.response.data.error === "Session expired") {
                  this.$bvModal.show("session_modal");
                }
              }
              this.showLoading = false;
            } else {
              this.showLoading = false;
              this.$bvModal.hide("add-location-modal");
              this.new_location = null;
              this.showAlert("Successfully Added", "success");
              
              this.$store.dispatch("Admin/Location/fetchListLocations")
            }
          }).catch( e => {
            console.log(e);
          })
        }
    },
    showAlert(message, variant) {
      this.alert = {
        showAlert: 3,
        variant,
        message
      };
    },
    onFiltered(filterItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filterItems.length;
      this.currentPage = 1;
    }
  },
  async beforeCreate() {
    this.isBusy = true;

    await this.$store.dispatch("Admin/Location/fetchListLocations").then( res => {
      if (res && res.name == "Error") {
        if (res.response && res.response.data.error) {
          if (res.response.data.error === "Session expired") {
            this.$bvModal.show("session_modal");
          }
        }
      }
    });

    await this.$store.dispatch("Admin/Printer/fetchListPrinters", {
      SessionId: localStorage.SessionId
    })
    .then( res => {
      if (res && res.name == "Error") {
        if (res.response && res.response.data.error) {
          if (res.response.data.error === "Session expired") {
            this.$bvModal.show("session_modal");
          }
        }
      }
    });

      if(!this.filter) {
        this.totalRows = this.filterItems ? this.filterItems.length : 0
      }

      this.isBusy = false;
  },

  created(){
    const userActions = JSON.parse(localStorage.user_actions)["Admin Module"];

    if(userActions.find(action => action.U_ACTION_NAME === 'View location')) {
      this.actions.view_location = true;
    }

    if(userActions.find(action => action.U_ACTION_NAME === 'Add location')) {
      this.actions.add_location = true;
    }
    
    if(userActions.find(action => action.U_ACTION_NAME === 'Edit location')) {
      this.actions.edit_location = true;
    }
  },
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
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>