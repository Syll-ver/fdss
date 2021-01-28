<template>
  <div class="component-margin">
    <Receipt ref="Receipt" v-show="false" />
    <!-- Main table -->
    <!-- <b-row>
      <b-col>
        <b-button
          variant="success"
          class="button-style"
          size="sm"
          @click="$bvModal.show('add-transaction-modal')"
        >
          <font-awesome-icon icon="plus" class="mr-1" />Create Delivery Receipt
        </b-button>
      </b-col>
    </b-row> -->


    <b-row>
      <b-col cols="4" class="mt-3">
        <b-form-group>
          <b-input-group size="sm">
            <b-form-input
              v-model="filter"
              type="search"
              id="filterInput"
              placeholder="Search Delivery Receipt"
            ></b-form-input>
            <b-input-group-append>
            <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col cols="4" class="mt-3">
        <b-input-group prepend="Date" size="sm">
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
        </b-input-group>
      </b-col>
  <b-col ></b-col>
 
      <b-col cols="3"  class="mt-3" align="right">
        <!-- <b-form-group class="mb-0">
          <b-form-select
            id="perPageSelect_action"
            size="sm"
            :options="pageOptions"
          ></b-form-select>
        </b-form-group> -->
      
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
            >
              <b-form-checkbox id="completed_supp_stat" value="Completed"
                >Completed</b-form-checkbox
              >
              <b-form-checkbox id="cancelled_cust_stat" value="Cancelled"
                >Cancelled</b-form-checkbox
              >
            </b-form-checkbox-group>
          </b-dropdown>

           <b-button
            size="sm"
            style="font-size:15px;"
            variant="dark"
            v-b-tooltip.hover
            title="Print Report"
          >
            <font-awesome-icon style icon="print" />
          </b-button>
          <b-button
            align="right"
            size="sm"
            variant="completed"
            style="font-size:15px "
            v-b-tooltip.hover
            title="Export Report to Excel"
          >
            <font-awesome-icon icon="file-excel" />
          </b-button>
     
      </b-col>
    </b-row>

    <!-- Main table element -->
    <b-table
      id="delivery_receipt_table"
      show-empty
      class="table-style"
      scrollable
      sticky-header
      no-breceipt-collapse
      :filter="filter"
      :filterIncludedFields="filterOn"
      :fields="deliveryreceiptFields"
      :items="deliveryreceipt"
      :current-page="currentPage"
      :per-page="perPage"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      @row-clicked="$bvModal.show('view-transaction-modal')"
     
      @filtered="filterStatus"
    >
    <!--  @row-clicked="onRowClicked" @row-clicked="$bvModal.show('view-transaction-modal')" -->
      <template v-slot:cell(U_STATUS)="row">
        <b-badge
          v-show="row.item.U_STATUS === 'Pending'"
          class="table-badge"
          pill
          variant="orange"
          
          >{{ row.item.U_STATUS }}
        </b-badge>

        <b-badge
          v-show="row.item.U_STATUS === 'Printed'"
          class="table-badge"
          pill
          variant="primary"
          >{{ row.item.U_STATUS }}
        </b-badge>

        <b-badge
          v-show="row.item.U_STATUS === 'Completed'"
          class="table-badge"
          pill
          variant="completed"
          >{{ row.item.U_STATUS }}
        </b-badge>
      </template>

      <!-- <template v-slot:cell(actions)="row">
        <b-button
          variant="primary"
          id="print"
          class="table-button"
          size="sm"
          @click="printReceipt(row.item)"
          v-b-tooltip.hover
          title="Print Transaction"
        >
          <font-awesome-icon icon="print" />
        </b-button>

        <b-button
          variant="info"
          id="edit"
          class="table-button"
          size="sm"
          @click="edit(row.item)"
          v-b-tooltip.hover
          title="Edit Transaction"
        >
          <font-awesome-icon icon="edit" />
        </b-button>

        <b-button
          variant="secondary"
          id="view"
          class="table-button"
          size="sm"
          @click="$bvModal.show('view-transaction-modal')"
          v-b-tooltip.hover
          title="View Transaction"
        >
          <font-awesome-icon icon="folder-open" />
        </b-button>

        <b-button
          variant="danger"
          id="void"
          class="table-button"
          size="sm"
          v-b-tooltip.hover
          title="Void Transaction"
        >
          <font-awesome-icon icon="ban" />
        </b-button>
      </template> -->
    </b-table>

    <hr />

    <b-row>
      <b-col
        label-cols-sm
        class="mb-0 mt-1 text-left"
        cols="3"
        align-h="receipt"
      >
        <div size="sm" style="color: gray; font-size: 11px;"></div>
      </b-col>
      <b-col cols="4" offset="5">
        <b-pagination
          id="delivery-pagination"
          pills
          :per-page="perPage"
          align="right"
          size="sm"
          aria-controls="modules-table"
          limit="3"
        ></b-pagination>
      </b-col>
    </b-row>

    <!-- Main table -->

 


    <!-- View Transaction -->

    <b-modal
      size="m"
      header-bg-variant="success"
      header-text-variant="light"
      body-bg-variant="gray"
      id="view-transaction-modal"
      scrollable
    >
      <template v-slot:modal-title>
        <h6>View Transaction</h6>
      </template>

         <b-card class="card-shadow">
            <!-- <small class="text-left"> Date</small>
            <b-form-input id="date" type="date" class="form-text" /> -->
<!-- 
            <small class="text-left">Organization</small>
            <b-form-select
              id="org"
              v-model="U_ORGANIZATION"
              @change="fillSubgroup()"
              class="form-text"
            >
              <option value="kcc_gensan">Biotech Farms Inc</option>
            </b-form-select>

            <small class="text-left">Sub Group</small>
            <b-form-input
              id="sub"
              class="form-text"
              v-model="U_SUB_GROUP"
              disabled=""
            /> -->

            <small class="text-left">Transaction Type</small>
            <b-form-select
              id="transact_type"
              v-model="U_TRANSACTION_TYPE"
              class="form-text"
            >
              <option value="pick-up">Pick-up</option>
              <option value="delivery">Delivery</option>
            </b-form-select>
             <small class="text-left">Commodity</small>
            <b-form-select
              id="commodity"
              v-model="U_COMMODITY"
              class="form-text"
            >
              
              <option value="corn">Corn</option>
              <option value="cornoncobs">Corn on Cobs</option>
              <option value="grains">Grain</option>
              <option value="napier">Napier</option>
              
            </b-form-select>

            <!-- <small class="text-left">Receipt Type</small>
            <b-form-input
              v-model="U_RECEIPT_TYPE"
              id="receipt"
              type="text"
              class="form-text"
              disabled=""
            /> -->

            <!-- <small class="text-left">Group Type</small>
            <b-form-select id="group" class="form-text" /> -->

            <small class="text-left">Farmer's Name</small>
            <b-form-select
              id="customer"
              class="form-text"
            
              @change="showTab()"
            >
              <option value="1">Jesse Christian Bascon</option>
              <option value="2">Jose Trevor</option>
              <option value="3">John Dela Cruz</option>
            </b-form-select>

            <small class="text-left">Address</small>
            <b-form-input
              id="customer_no"
              class="form-text"
              :disabled="U_RECEIPT_TYPE == 'Miscellaneous'"
            />

            <small class="text-left">Driver's Name</small>
            <b-form-select
              id="tendered"
              v-model="U_DRIVERS_NAME"
              class="form-text"
            >
              <option value="1">Jose Mariano</option>
              <option value="2">Jon Magnolia</option>
            </b-form-select>
            <b-row>
            <b-col cols="6">
            <small class="text-left">Plate Number</small>
            <b-form-select
              id="tendered"
              v-model="U_PLATE_NUMBER"
              class="form-text"
            >
              <option value="XYQ-0931">XYQ-0931</option>
              <option value="MKJ-2912">MKJ-2912</option>
            </b-form-select>
            </b-col>
            <b-col cols="6">
            <small class="text-left">Truck Type</small>
            <b-form-select
              id="tendered"
              v-model="U_TRUCK_TYPE"
              class="form-text"
            >
              <option value="Pick-Up">Suzuki Pick-Up</option>
              <option value="Canter 4 wheeler truck">Canter 4 wheeler truck</option>
            </b-form-select>
            </b-col>
            </b-row>

            <b-row v-if="U_TRANSACTION_TYPE === 'delivery'">
            <b-col cols="6">
            <small class="text-left"># of Sacks</small>
            <b-form-input type="number" id="sacks" class="form-text" />
            </b-col>
            <b-col cols="6">
            <small class="text-left"># of Returned Sacks</small>
            <b-form-input type="number" id="emptysacks" class="form-text" />
            </b-col>
            </b-row>
                <b-row v-else>
                </b-row>
            <!-- <small class="text-left">Remarks</small>
            <b-form-textarea type="text" id="remarks" class="form-text" /> -->
<!-- 
            <small class="text-left">Paid By</small>
            <b-form-input
              type="text"
              id="paid"
              class="form-text"
              :disabled="U_RECEIPT_TYPE == 'Standard'"
            />

            <small class="text-left">Remarks</small>
            <b-form-input type="text" id="remarks" class="form-text" />

            <small class="text-left">Reviewed By</small>
            <b-form-input
              type="text"
              id="reviewed"
              class="form-text"
              disabled=""
            /> -->
          </b-card>

      <template v-slot:modal-footer="{ cancel }">
        <b-button
          id="cancel_add_action_modal"
          size="sm"
          class="button-style"
          @click="cancel()"
          >Close</b-button
        >
      </template>
    </b-modal>

    <!-- View Transaction -->
  </div>
</template>

<script>
import Receipt from "~/components/Receipt.vue";
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
import moment from "moment";

export default {
  components: {
    Receipt,
    DateRangePicker
  },
  data() {
    return {
      filterOn:[],
      filter:null,
      showReceipt: false,
      U_TRANSACTION_TYPE: null,
      U_TENDERED_TYPE: null,
      U_SUB_GROUP: null,
      U_ORGANIZATION: null,
      U_RECEIPT_TYPE: null,
      U_ITEM_CODE: null,
      U_TRNSCTN_NO: null,
      U_CUSTOMER_NAME: null,
      U_TRANSACTION_DATE: null,
      U_DUE_DATE: null,
      U_AMOUNT_DUE: null,
      U_AMOUNT_BALANCE: null,
      U_AMOUNT_PAY: null,
      U_TYPE: null,

      // Datepicker
      opens: "receipt",
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
      //


      deliveryreceipt: [
        {
          U_TRANSACTION_TYPE: "Pick-Up",
          U_RCPT_NO: "CDF-00001",
          U_CSTMR_NO: "Corn",
          U_CSTMR_NAME: "Jose Trevor",
          U_RCPT_AMOUNT: "Zaina Fuentespina",
          U_RCPT_DATE: "Jon Magnolia",
          U_RCPT_TYPE: "March 09, 2020",
          U_STATUS: "Completed"
        }
      ],

      ORFields: [
        {
          key: "U_OR_NO",
          label: "OR No.",
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "U_OR_AMOUNT",
          label: "Amount",
          sortable: true,
          sortDirection: "desc"
        },
      ],

      deliveryreceiptFields: [
         
        {
          key: "U_RCPT_NO",
          label: "Transaction No.",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "U_TRANSACTION_TYPE",
          label: "Transaction Type",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "U_CSTMR_NO",
          label: "Commodity",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "U_CSTMR_NAME",
          label: "Farmer's Name",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "U_RCPT_DATE",
          label: "Driver's Name",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "U_RCPT_AMOUNT",
          label: "Created By",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "U_RCPT_TYPE",
          label: "Date Created",
          sortable: true,
          sortDirection: "desc"
        },

        // {
        //   key: "U_GROUP",
        //   label: "Group",
        //   sortable: true,
        //   sortDirection: "desc"
        // },

        {
          key: "U_STATUS",
          label: "Status",
          sortable: true,
          sortDirection: "desc"
        },

        // { key: "actions", label: "Actions" }
      ],

      ItemFields: [
        {
          key: "line_number",
          label: "Line No.",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "item_id",
          label: "Item ID",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "description",
          label: "Description",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "price",
          label: "Price",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "quantity",
          label: "Quantity",
          sortable: true,
          sortDirection: "desc"
        }
      ],

      InvoiceFields: [
        {
          key: "transaction_number",
          label: "Transaction No.",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "item",
          label: "Item",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "Amount Pay",
          label: "Amount Pay",
          sortable: true,
          sortDirection: "desc"
        }
      ],

      CheckFields: [
        {
          key: "U_CHECK_TYPE",
          label: "Check Type",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "U_CHECK_NO",
          label: "Check No.",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "U_CHECK_BANK",
          label: "Bank",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "U_CHECK_AMOUNT",
          label: "Amount",
          sortable: true,
          sortDirection: "desc"
        }
      ],

      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 50],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc"
    };
  },

  methods: {
     onRowClicked (items, index) {
        this.show = {...items}
        console.log(items)
        // this.status = item.status
      this.$root.$emit("bv::show::modal", this.view-transaction-modal);
    },


    fillSubgroup() {
      this.U_SUB_GROUP = "BFI Delivery Receipt";
    },
    fetchInvoiceDetails() {

      this.U_CUSTOMER_NAME = "Genevie Mindajao";
      this.U_TRANSACTION_DATE = "2020-08-08";
      this.U_DUE_DATE = "2020-18-08";
      this.U_AMOUNT_DUE = 10000;
      this.U_AMOUNT_BALANCE = 10000;
      this.U_TYPE = "KCC Rent";
      this.U_AMOUNT_PAY = "10000"

    },
    printReceipt(data) {
      // this.showReceipt = true;
      this.$refs.Receipt.print();
      console.log(data);
      data.U_STATUS = "Printed";
    },
    edit(data) {
      this.$bvModal.show("edit-transaction-modal");
      data.U_STATUS = "Completed";
    }
  },

  // Date Picker

    resetDate() {
      this.datePicker.startDate = moment().format("MMM DD, YYYY");
      this.datePicker.endDate = moment().format("MMM DD, YYYY");

      this.$store
        .dispatch("Transactions/fetchPendingTransactions", {
          user_actions: JSON.parse(localStorage.user_actions),
          SessionId: localStorage.SessionId
        })
        .then(res => {
          if (res.name == "Error") {
            if (res.response && res.response.data.errorMsg) {
              if (res.response.data.errorMsg === "Invalid session.") {
                this.$bvModal.show("session_modal");
              }
            }
          }
        });
    },
    updateValues() {
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

      this.$store
        .dispatch("Transactions/fetchPendingTransactions", {
          user_actions: JSON.parse(localStorage.user_actions),
          SessionId: localStorage.SessionId,
          date_range: this.dateRange
        })
        .then(res => {
          if (res.name == "Error") {
            if (res.response && res.response.data.errorMsg) {
              if (res.response.data.errorMsg === "Invalid session.") {
                this.$bvModal.show("session_modal");
              }
            }
          }
        });
    },

    // End 


  beforeCreate() {},

  created() {}
};
</script>
<style>

/* Date Range */

.reportrange-text[data-v-fffebcea] {
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
