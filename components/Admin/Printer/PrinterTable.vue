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

    <b-row>
      <b-col cols="3" class="mt-3">
        <b-form-group>
          <b-input-group size="sm">
            <b-form-input
              v-model="filter"
              type="search"
              id="search_location_receipt"
              placeholder="Search Printer"
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
          @click="$bvModal.show('add-printerlocation-modal')"
        >
          <font-awesome-icon icon="plus" class="mr-1" />Add Printer
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
      id="add-printerlocation-modal"
      hide-header-close
      no-close-on-backdrop
      no-scrollable
    >
      <template v-slot:modal-title>
        <h6>Add Printer</h6>
      </template>
        
        <b-row>
          <b-col>
            <small class="text-left">Location</small>
            <b-form-select v-model="printer.location"
            size="sm"
            >
            <option :value="null">Select Locations</option>

            <option
              :value="loc.U_ADDRESS"
              v-for="(loc, i) in listLocations"
              :key="i"
              >{{ loc.U_ADDRESS }}</option
            >
            </b-form-select>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="mt-2">
            <small class="text-left">Printer IP Address</small>
            <b-form-input
              id="printer_ip"
              placeholder="Printer IP Address"
              class="form-text"
              v-model="printer.ip"
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
          @click="addPrinter()"
          :disabled="showLoading === true"
        >
          Create
        </b-button>
        <b-button
          id="cancel_add_action_modal"
          size="sm"
          class="button-style"
          @click="cancel()"
          >Cancel</b-button
        >
      </template>
    </b-modal>

    <!-- edit printer modal -->

      <b-modal
      size="large"
      header-bg-variant="biotech"
      header-text-variant="light"
      body-bg-variant="gray"
      id="edit-printerlocation-modal"
      hide-header-close
      no-close-on-backdrop
      no-scrollable
    >
      <template v-slot:modal-title>
        <h6>Edit Printer</h6>
      </template>
        
        <b-row>
          <b-col >
            <small class="text-left">Location</small>
            <b-form-select v-model="printer.location"
            placeholder="Select Location"
            size="sm"
            >
            <option
              :value="loc.U_ADDRESS"
              v-for="(loc, i) in listLocations"
              :key="i"
              >{{ loc.U_ADDRESS }}</option
            >
            </b-form-select>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="mt-2">
            <small class="text-left">Printer IP Address</small>
            <b-form-input
              id="printer_ip"
              placeholder="Printer IP Address"
              class="form-text"
              v-model="printer.ip"
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
          @click="updatePrinter()"
          :disabled="showLoading === true"
        >
          Update
        </b-button>
        <b-button
          id="cancel_add_action_modal"
          size="sm"
          class="button-style"
          @click="cancel()"
          >Cancel</b-button
        >
      </template>
    </b-modal>

    <!-- end edit printer modal -->

</div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import DateRangePicker from "vue2-daterange-picker";
import Loading from "~/components/Loading/Loading.vue";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";

export default {
  components: { DateRangePicker, Loading },
  data() {
    return {
      isBusy: false,
      showLoading: false,
      printer_ip: null,
      printer_location: null,
      itemsFields: [
        {
          key: "ip",
          label: "IP Address",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "location",
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
      printers: [],
      printer: [],
    };
  },
  computed: {    
    ...mapGetters({
      listPrinters: "Admin/Printer/getListPrinters",
      listLocations: "Admin/Location/getListLocations"
    }),

    filterItems(){
      console.log(this.listLocations);
      return this.listPrinters.filter(logs => {
        return (logs.location.toLowerCase().match(this.filter.toLowerCase()) ||
        logs.ip.match(this.filter))
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
    
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key };
        });
    }
  },
  async created(){
    // await this.getPrinter();
    // await this.getLocations();
  },

  methods: {
    // async getPrinter(){
    //   this.isBusy = true;
    //   const sessionId = localStorage.sessionId
    //     await axios({
    //       method: "GET",
    //       url: `${process.env.serverPrintUrl}/fdss/get`,
    //       headers: {
    //         authorization: `B1SESSION=${sessionId}`
    //       }
    //     }).then( res => {
    //       this.printers = res.data.view
    //     })
    //     .catch(e => {
    //       console.log(e);
    //     })
    //   this.isBusy = false;
    // },

    // async getLocations(){
    //   this.isBusy = true;
    //     await axios({
    //       method: "GET",
    //       url: `${this.$axios.defaults.baseURL}/api/location/select`
    //     }).then( res => {
    //       const v = res.data.view;
    //       this.listLocations.push({
    //         text: 'Please select a location',
    //         value: null,
    //         disabled: true
    //       })
    //       for(let i = 0; i < v.length; i++) {
    //         this.listLocations.push({
    //           text: v[i].U_ADDRESS,
    //           value: v[i].U_ADDRESS
    //         })
    //       }
    //     })
    //   this.isBusy = false;
    // },

    edit(data) {
      this.printer = [];
      this.printer = { ...data }
      this.$bvModal.show('edit-printerlocation-modal');
    },

    cancel() {
      this.$bvModal.hide('edit-printerlocation-modal');
      this.$bvModal.hide('add-printerlocation-modal');
      this.printer = [];
    },

    async addPrinter(){
      console.log(this.printer);

      if(this.printer.ip == null){
          this.showAlert("Please input IP Address", "danger");
      } else if(this.printer.location == null) {
          this.showAlert("Please input Location", "danger");
      } else {
        // check if either ip or location already exists
        // if not, add
        const existingIP = this.listPrinters.find(ip => ip.ip === this.printer.ip)
        const existingLoc = this.listLocations.find(loc => loc.location === this.printer.location)
        if(existingIP != null){
          this.showAlert("IP Address already exists", "danger");
        } else if(existingLoc != null) {
          this.showAlert("Location already exists", "danger");
        } else {
          this.$store.dispatch("Admin/Printer/addPrinter", {
            uuids: process.env.uuid,
            ip: this.printer.ip,
            location: this.printer.location
          }).then( res => {
            if (res && res.name == "Error") {
              if (res.response && res.response.data.error) {
                if (res.response.data.error === "Session expired") {
                  this.$bvModal.show("session_modal");
                }
              }
            } else {
              this.$bvModal.hide("add-printerlocation-modal");
              this.$store.dispatch("Admin/Printer/fetchListPrinters", {
                SessionId: localStorage.SessionId
              })
              this.showAlert("Successfully Added", "success");
            }
          }).catch( err => console.log(err));
        }
      }
    },

    async updatePrinter() {
      if(this.printer.ip == null){
        this.showAlert("Please input IP Address", "danger");
      } else if(this.printer.location == null) {
        this.showAlert("Please input Location", "danger");
      } else {
        // check if ip exists
        // if not, update
        // const existingIP = this.listPrinters.find(ip => ip.ip === this.printer.ip)
        // if(existingIP != null){
        //   this.showAlert("IP Address already exists", "danger");
        // } else {
          await axios({
            method: "PATCH",
            url: `${process.env.serverPrintUrl}/fdss/update`,
            data: {
              uuids: process.env.uuid,
              ip: this.printer.ip,
              location: this.printer.location
            }
          }).then( res => {
            this.$bvModal.hide("edit-printerlocation-modal");
            
            this.$store.dispatch("Admin/Printer/fetchListPrinters", {
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
            
            this.showAlert("Successfully Added", "success");
          })
          .catch(e => {
            console.log(e);
          })
        // }   
      }
    },

    showAlert(message, variant) {
      this.alert = {
        showAlert: 3,
        variant,
        message
      };
    },
    close() {
        (this.printer_ip = null),
        (this.printer_location = null)
      this.$bvModal.hide("add-location-modal");
    },
    onFiltered(filterItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filterItems.length;
      this.currentPage = 1;
    }
  },
  async beforeCreate() {
    this.isBusy = true;
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

    await this.$store.dispatch("Admin/Location/fetchListLocations").then( res => {
      if (res && res.name == "Error") {
        if (res.response && res.response.data.error) {
          if (res.response.data.error === "Session expired") {
            this.$bvModal.show("session_modal");
          }
        }
      }
    });

      this.isBusy = false;
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
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>