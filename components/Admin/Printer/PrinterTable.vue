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
      <b-col cols="12" md="4" lg="3" sm="5" xs="4" class="mt-3">
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

      <b-col cols="12" md="8" lg="9" sm="7" xs="4" class="mt-3" align="right">
        <b-button
          v-if="actions.add_printer"
          id="create"
          :variant="company == rci ? 'revive' : 'biotech'"
          class="button-style"
          size="sm"
          @click="$bvModal.show('add-printerlocation-modal')"
        >
          Add Printer
        </b-button>
      </b-col>
      <!-- </b-row> -->
    </b-row>

    <!-- Main table element -->
    <span>
      <b-table
        v-if="actions.view_printer"
        id="location-table"
        class="table-style mt-3"
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
            <b-spinner small class="align-middle" variant="dark"> </b-spinner>
            <span class="loading_spinner">Loading...</span>
          </div>
        </template>

        <template v-slot:cell(U_CREATED_DATE)="row">{{
          formatDate(row.item.U_CREATED_DATE)
        }}</template>

        <template v-slot:cell(actions)="row">
          <div>
            <b-button
              v-if="actions.edit_printer"
              variant="edit"
              id="edit"
              class="table-button"
              size="sm"
              @click="edit(row.item)"
              v-b-tooltip.hover
              title="Edit Printer"
            >
              <font-awesome-icon icon="edit" />
            </b-button>
          </div>
        </template>
      </b-table>
    </span>
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
        <div size="sm" style="color: gray; font-size: 11px;">
          {{ bottomLabel }}
        </div>
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
      :header-bg-variant="company == rci ? 'revive' : 'biotech'"
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
          <b-form-select v-model="printer.U_LOCATION_ID" size="sm">
            <option :value="null">Select Locations</option>

            <option
              :value="loc.Code"
              v-for="(loc, i) in listLocations"
              :key="i"
              >{{ loc.U_ADDRESS }}</option
            >
          </b-form-select>
        </b-col>
      </b-row>

      <div class="mt-2">
        <small class="text-left">IP Address</small>
        <b-row>
          <b-col class="mt-0">
            <b-form-input
              placeholder="000"
              class="form-text"
              required
              style="font-size: 13.5px"
              id="ips1"
              @keyup="ipFormat2($event, 1)"
              v-model="ips[0].ip1"
              type="number"
            />
          </b-col>
          <b-col class="mt-0">
            <b-form-input
              placeholder="000"
              class="form-text"
              v-model="ips[0].ip2"
              required
              style="font-size: 13.5px"
              id="ips2"
              @keyup="ipFormat2($event, 2)"
              type="number"
            />
          </b-col>
          <b-col class="mt-0">
            <b-form-input
              placeholder="000"
              class="form-text"
              v-model="ips[0].ip3"
              required
              style="font-size: 13.5px"
              id="ips3"
              @keyup="ipFormat2($event, 3)"
              type="number"
            />
          </b-col>
          <b-col class="mt-0">
            <b-form-input
              placeholder="000"
              class="form-text"
              v-model="ips[0].ip4"
              required
              style="font-size: 13.5px"
              id="ips4"
              @keyup="ipFormat2($event, 4)"
              type="number"
            />
          </b-col>
        </b-row>

        <!-- <b-row>
          <b-col class="mt-2">
            <small class="text-left">IP Address</small>
            <b-form-input
              id="printer_ip"
              placeholder="Printer IP"
              class="form-text"
              type="text"
              v-model="printer.U_IP_ADD"
              disabled
              style="font-size: 13.5px"
              @keydown="ipFormat($event)"
            />
          </b-col>
        </b-row> -->
      </div>

      <template v-slot:modal-footer="{}">
        <b-button
          id="add_action_modal"
          size="sm"
          class="button-style"
          :variant="company == rci ? 'revive' : 'biotech'"
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
      :header-bg-variant="company == rci ? 'revive' : 'biotech'"
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
        <b-col>
          <small class="text-left">Location</small>
          <b-form-select
            v-model="printer.U_LOCATION_ID"
            placeholder="Select Location"
            size="sm"
            disabled
          >
            <option
              :value="loc.Code"
              v-for="(loc, i) in listLocations"
              :key="i"
              >{{ loc.U_ADDRESS }}</option
            >
          </b-form-select>
        </b-col>
      </b-row>
      <div class="mt-2">
        <small class="text-left">IP Address</small>
        <b-row>
          <b-col class="mt-0">
            <b-form-input
              
              class="form-text"
              required
              style="font-size: 13.5px"
              id="ips1"
              @keyup="ipFormat2($event, 1)"
              v-model="ips[0].ip1"
              type="number"
            />
          </b-col>
          <b-col class="mt-0">
            <b-form-input
              
              class="form-text"
              v-model="ips[0].ip2"
              required
              style="font-size: 13.5px"
              id="ips2"
              @keyup="ipFormat2($event, 2)"
              type="number"
            />
          </b-col>
          <b-col class="mt-0">
            <b-form-input
              
              class="form-text"
              v-model="ips[0].ip3"
              required
              style="font-size: 13.5px"
              id="ips3"
              @keyup="ipFormat2($event, 3)"
              type="number"
            />
          </b-col>
          <b-col class="mt-0">
            <b-form-input
              
              class="form-text"
              v-model="ips[0].ip4"
              required
              style="font-size: 13.5px"
              id="ips4"
              @keyup="ipFormat2($event, 4)"
              type="number"
            />
          </b-col>
        </b-row>

        <!-- <b-row>
          <b-col class="mt-2">
            <small class="text-left">IP Address</small>
            <b-form-input
              id="printer_ip"
              placeholder="Printer IP"
              class="form-text"
              type="text"
              v-model="printer.U_IP_ADD"
              disabled
              style="font-size: 13.5px"
              @keydown="ipFormat($event)"
            />
          </b-col>
        </b-row> -->
      </div>

      <template v-slot:modal-footer="{}">
        <b-button
          id="add_action_modal"
          size="sm"
          class="button-style"
          :variant="company == rci ? 'revive' : 'biotech'"
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
import DateRangePicker from "vue2-daterange-picker";
import Loading from "~/components/Loading/Loading.vue";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";

export default {
  components: { DateRangePicker, Loading },
  data() {
    return {
      rci: JSON.parse(localStorage.companyCode)['rci'],
      bfi: JSON.parse(localStorage.companyCode)['bfi'],
      company: null,
      windowWidth: window.innerWidth,
      actions: {
        view_printer: false,
        add_printer: false,
        edit_printer: false
      },
      isBusy: true,
      showLoading: false,
      printer_ip: null,
      printer_location: null,
      // action: [],
      itemsFields: [
        {
          key: "U_IP_ADD",
          label: "IP Address",
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
      printers: [],
      printer: [],
      cnt: 0,

      ips: [
        {
          ip1: "",
          ip2: "",
          ip3: "",
          ip4: ""
        }
      ]
    };
  },

  computed: {
    ...mapGetters({
      listPrinters: "Admin/Printer/getListPrinters",
      listLocations: "Admin/Location/getListLocations"
    }),

    filterItems() {
      return this.listPrinters.filter(logs => {
        return logs;
        // return logs
      });
    },

    bottomLabel() {
      let end = this.perPage * this.currentPage;
      let start = end - this.perPage + 1;

      if (!this.filterItems) {
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
    ipFormat2(event, part) {
      let i = part;
      // console.log(part);
      if (part == 1) {
        if (this.ips[0].ip1.length >= 4) {
          this.ips[0].ip2 = this.ips[0].ip1.slice(3, 4);

          document.getElementById("ips2").focus();

          this.ips[0].ip1 = this.ips[0].ip1.slice(0, 3);
        }
      } else if (part == 2) {
        // console.log("test");
        if (this.ips[0].ip2.length >= 4) {
          this.ips[0].ip3 = this.ips[0].ip2.slice(3, 4);

          document.getElementById("ips3").focus();

          this.ips[0].ip2 = this.ips[0].ip2.slice(0, 3);
        }
      } else if (part == 3) {
        if (this.ips[0].ip3.length >= 4) {
          this.ips[0].ip4 = this.ips[0].ip3.slice(3, 4);

          document.getElementById("ips4").focus();

          this.ips[0].ip3 = this.ips[0].ip3.slice(0, 3);
        }
      } else if (part == 4) {
        if (this.ips[0].ip4.length >= 4) {
          this.ips[0].ip4 = this.ips[0].ip4.slice(0, 3);
        }
      }

      // if (event.key == "Enter" || event.key == " ") {
        
      // }
      //  i = i + 1;
        if (i == 5) {
          document.getElementById("ips" + i).focus();
          //  this.printer.U_IP_ADD =
          //   this.ips[0].ip1 +
          //   "." +
          //   this.ips[0].ip2 +
          //   "." +
          //   this.ips[0].ip3 +
          //   "." +
          //   this.ips[0].ip4;
        } else {
          console.log("no more fields");
          this.printer.U_IP_ADD =
            this.ips[0].ip1 +
            "." +
            this.ips[0].ip2 +
            "." +
            this.ips[0].ip3 +
            "." +
            this.ips[0].ip4;
        }

      console.log("test", i);
      if (this.ips[0].ip4.length == 4) {
        this.printer.U_IP_ADD = (this.ips[0].ip1 +"." +this.ips[0].ip2 + "." + this.ips[0].ip3 + "." + this.ips[0].ip4);
      }
    },

    edit(data) {
      // console.log(data);
      console.log(data.U_IP_ADD.split("."));
      // split IP Address in 4 components.
      this.ips[0].ip1 = data.U_IP_ADD.split(".")[0];
      this.ips[0].ip2 = data.U_IP_ADD.split(".")[1];
      this.ips[0].ip3 = data.U_IP_ADD.split(".")[2];
      this.ips[0].ip4 = data.U_IP_ADD.split(".")[3];
      this.printer = [];
      this.printer = { ...data };
      this.$bvModal.show("edit-printerlocation-modal");
    },

    cancel() {
      this.$bvModal.hide("edit-printerlocation-modal");
      this.$bvModal.hide("add-printerlocation-modal");
      this.printer = [];
      this.ips[0].ip1 = "";
      this.ips[0].ip2 = "";
      this.ips[0].ip3 = "";
      this.ips[0].ip4 = "";
    },

    async addPrinter() {
      console.log(this.printer.U_IP_ADD);

      if (this.printer.U_IP_ADD == null) {
        this.showAlert("Please input IP Address", "danger");
      } else if (this.printer.U_LOCATION_ID == null) {
        this.showAlert("Please input Location", "danger");
      } else {
        const existingIP = this.listPrinters.find(
          ip => ip.U_IP_ADD === this.printer.U_IP_ADD
        );
        if (existingIP != null) {
          this.showAlert("IP Address already exists", "danger");
        } else {
          this.isBusy = true;
          this.showLoading = true;
          const SessionId = localStorage.SessionId;
          this.$store
            .dispatch("Admin/Printer/addPrinter", {
              data: this.printer,
              // U_IP_ADD: this.printer.ip,
              // U_LOCATION_ID: this.printer.location,
              sessionID: SessionId
            })
            .then(res => {
              if (res && res.name == "Error") {
                if (res.response && res.response.data.error) {
                  if (res.response.data.error === "Session expired") {
                    this.$bvModal.show("session_modal");
                  }
                }
              } else {
                this.$store.dispatch("Admin/Printer/fetchListPrinters");
                this.showLoading = false;
                this.isBusy = false;
                this.$bvModal.hide("add-printerlocation-modal");
                this.showAlert("Successfully Added", "success");
              }
            })
            .catch(err => console.log(err));
        }
      }
    },

    async updatePrinter() {
      if (this.printer.U_IP_ADD == null) {
        this.showAlert("Please input IP Address", "danger");
      } else if (this.printer.U_LOCATION_ID == null) {
        this.showAlert("Please input Location", "danger");
      } else {
        this.isBusy = true;
        this.showLoading = true;
        const SessionId = localStorage.SessionId;

        await this.$store
          .dispatch("Admin/Printer/updatePrinter", {
            sessionId: SessionId,
            data: this.printer
          })
          .then(res => {
            if (res && res.name == "Error") {
              if (res.response && res.response.data.error) {
                if (res.response.data.error === "Session expired") {
                  this.$bvModal.show("session_modal");
                }
              }
              this.showLoading = false;
            } else {
              this.$bvModal.hide("edit-printerlocation-modal");
              this.showLoading = false;
              this.isBusy = false;
              this.printer = [];
              this.showAlert("Successfully Added", "success");
            }
            this.getPrinter();
          })
          .catch(e => {
            console.log(e);
          });
        // }
      }
    },

    async getPrinter() {
      this.isBusy = true;
      await this.$store.dispatch("Admin/Location/fetchListPrinters");
      this.isBusy = false;
    },

    showAlert(message, variant) {
      this.alert = {
        showAlert: 3,
        variant,
        message
      };
    },
    close() {
      (this.printer_ip = null), (this.printer_location = null);
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
    await this.$store
      .dispatch("Admin/Printer/fetchListPrinters", {
        SessionId: localStorage.SessionId
      })
      .then(res => {
        if (res && res.name == "Error") {
          if (res.response && res.response.data.error) {
            if (res.response.data.error === "Session expired") {
              this.$bvModal.show("session_modal");
            }
          }
        }
      });

    if (!this.filter) {
      this.totalRows = this.filterItems ? this.filterItems.length : 0;
    }

    await this.$store
      .dispatch("Admin/Location/fetchListLocations")
      .then(res => {
        if (res && res.name == "Error") {
          if (res.response && res.response.data.error) {
            if (res.response.data.error === "Session expired") {
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
    if (user_role.Name.toLowerCase() !== "administrator") {
      this.$router.push("/transaction/deliveryreceipt");
    }
    this.company = user_details.U_COMPANY_CODE;

    const userActions = JSON.parse(localStorage.user_actions)["Admin Module"];

    if (userActions.find(action => action.U_ACTION_NAME === "View Printer")) {
      this.actions.view_printer = true;
      console.log(this.actions.view_printer);
    }

    if (userActions.find(action => action.U_ACTION_NAME === "Add Printer")) {
      this.actions.add_printer = true;
    }

    if (userActions.find(action => action.U_ACTION_NAME === "Edit Printer")) {
      this.actions.edit_printer = true;
    }
  }
};
</script>

<style scoped>
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
