<template>
  <div >
        <Loading v-if="showLoading" />

    <Receipt ref="Receipt" v-show="false" />
    <!-- Main table -->
    <!-- <b-row>
      <b-col>
        <b-button
          variant="biotech"
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
              id="search_delivery_receipt"
              placeholder="Search Delivery Receipt"
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
            :opens="opens1"
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
              <b-form-checkbox id="pending_supp_stat" value="Completed"
                >Completed</b-form-checkbox
              >
              <b-form-checkbox id="cancelled_cust_stat" value="Cancelled"
                >Cancelled</b-form-checkbox
              >
            </b-form-checkbox-group>
          </b-dropdown>
     
      </b-col>
    </b-row>

    <!-- Main table element -->
    <b-table
      id="delivery_receipt_table"
      show-empty
      class="table-style"
      scrollable
      sticky-header
      no-border-collapse
      :items="filterItems"
      :filter="filter"
      :filterIncludedFields="filterOn"
      :fields="itemsFields"
      :current-page="currentPage"
      :per-page="perPage"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      @row-cliked="showDR(row)"
      
    >
      <template v-slot:cell(U_STATUS)="row">
        <!-- <b-badge
          v-show="row.item.U_STATUS === 'Pending'"
          class="table-badge"
          pill
          variant="pending"
          
          >{{ row.item.U_STATUS }}
        </b-badge> -->

        <b-badge
          v-show="row.item.U_STATUS === 'Cancelled'"
          class="table-badge"
          pill
          variant="danger"
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
        <div v-if="row.item.U_STATUS === 'Cancelled'">
       

        <b-button
          variant="secondary"
          id="view"
          class="table-button"
          size="sm"
          @click="$bvModal.show('view-transaction-modal')"
          v-b-tooltip.hover
          title="View Delivery Receipt"
        >
         @click="$bvModal.show('view-transaction-modal')"
          <font-awesome-icon icon="folder-open" />
        </b-button>

        </div>
        <div v-else>
           <b-button
          variant="print"
          id="print"
          class="table-button"
          size="sm"
          @click="printReceipt(row.item)"
          v-b-tooltip.hover
          title="Print Delivery Receipt"
        >
          <font-awesome-icon icon="print" />
        </b-button>

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

        <b-button
          variant="secondary"
          id="view"
          class="table-button"
          size="sm"
          @click="$bvModal.show('view-transaction-modal')"
          v-b-tooltip.hover
          title="View Delivery Receipt"
        >
          <font-awesome-icon icon="folder-open" />
        </b-button>

        <b-button
          variant="danger"
          id="void"
          class="table-button"
          size="sm"
          v-b-tooltip.hover
          title="Cancel Transaction"
          @click="deleted(row.item)"
        >
          <font-awesome-icon icon="ban" />
        </b-button>
      
        </div>
      </template> -->

    </b-table>



 <b-row>
        <b-col  label-cols-sm
        class="mb-0 mt-1 text-left"
        cols="3"
        align-h="receipt">
          <div size="sm" class="bottomlabel">{{ bottomLabel }}</div>
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

    <!-- Add Transaction -->

    <b-modal
      size="m"
      header-bg-variant="biotech"
      header-text-variant="light"
      body-bg-variant="gray"
      id="add-transaction-modal"
      no-close-on-backdrop
      scrollable
    >
      <template v-slot:modal-title>
        <h6>New Delivery Receipt</h6>
      </template>

          <b-card class="card-shadow">

            <small class="text-left">Transaction Type</small>
            <b-form-select
              id="transact_type"
              v-model=" U_TRANSACTION_TYPE"
              class="form-text"
              :options="transaction_types"
              required
            >
            

            </b-form-select>
             <small class="text-left">Item</small>
            <b-form-select
              id="commodity"
              v-model=" U_CMMDTY"
              class="form-text"
              :options="commodity"
              required
            >
          
            </b-form-select>

            <small class="text-left">Farmer's Name</small>
            <b-form-select
              id="customer"
              class="form-text"
              v-model=" U_FRMR_NAME"
              :options="farmer"
              @change="test"
              required
              
            >
            </b-form-select>

            <small class="text-left">Address</small>
            <b-form-input
              id="farmer_add"
              class="form-text"
              v-model=" U_FRMR_ADD"
              
            />
            <b-row>
            <b-col cols="6">
             <small class="text-left">Helper's Name</small>
              <b-form-input
              id="helper_name"
              placeholder="First Name"
              class="form-text"
              v-model=" U_HLPR_FNAME"
            />
            </b-col>
            <b-col cols="6">
            <small class="text-left">&nbsp;</small>
            <b-form-input
              id="tendered"
              placeholder="Last Name"
              v-model="U_HLPR_LNAME"
              class="form-text"
            >
            </b-form-input>
            </b-col>
            </b-row>
             <b-row>
            <b-col cols="6">
             <small class="text-left">Driver's Name</small>
              <b-form-input
              id="helper_name"
              placeholder="First Name"
              class="form-text"
              v-model=" U_DRVR_FNAME"
            />
            </b-col>
            <b-col cols="6">
              <small class="text-left">&nbsp;</small>
            <b-form-input
              id="tendered"
              placeholder="Last Name"
              v-model=" U_DRVR_LNAME"
              class="form-text"
            >
            </b-form-input>
            </b-col>
            </b-row>
          
            <small class="text-left">Plate Number</small>
            <b-form-input
              id="tendered"
              v-model=" U_PLATE_NUMBER"
              class="form-text"
            >
            </b-form-input>

            <b-row v-if="U_TRANSACTION_TYPE === '2'">
            <b-col cols="6">
            <small class="text-left"># of Sacks</small>
            <b-form-input type="number" id="sacks" class="form-text" v-model="U_SACKS" />
            </b-col>
            <b-col cols="6">
            <small class="text-left"># of Empty Sacks</small>
            <b-form-input type="number" id="emptysacks" class="form-text" v-model="U_EMPTY_SACKS" />
            </b-col>
            </b-row>
                <b-row v-else>
                </b-row>
          </b-card>


      <template v-slot:modal-footer="{cancel }">
        <b-button
          id="add_action_modal"
          size="sm"
          class="button-style"
          variant="biotech"
          @click="newDR()"
          
        >
        <!-- @click="addActionTable(),$bvModal.hide('add-transaction-modal')" -->
          <b-spinner
            v-show="showButtonLoading === true"
            small
            label="Spinning"
          ></b-spinner
          >Create
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

    <!-- Edit Transaction -->

    <b-modal
      size="m"
      header-bg-variant="biotech"
      header-text-variant="light"
      body-bg-variant="gray"
      id="edit-transaction-modal"
      scrollable
    >
      <template v-slot:modal-title>
        <h6>Update Transaction</h6>
      </template>

       <b-card class="card-shadow">


            <small class="text-left">Transaction Type</small>
            <b-form-select
              id="transact_type"
              v-model=" U_TRANSACTION_TYPE"
              class="form-text"
              :options="transaction_types"
              disabled
            >
            

            </b-form-select>
             <small class="text-left">Item</small>
            <b-form-select
              id="commodity"
              v-model=" U_CMMDTY"
              class="form-text"
              :options="commodity"
              disabled
            >
          
            </b-form-select>

            <small class="text-left">Farmer's Name</small>
            <b-form-input
              id="customer"
              class="form-text"
              v-model=" U_FRMR_NAME"
              disabled
              
            >
            </b-form-input>

            <small class="text-left">Address</small>
            <b-form-input
              id="farmer_add"
              class="form-text"
              v-model=" U_FRMR_ADD"
              disabled
            />
            <b-row>
            <b-col cols="6">
             <small class="text-left">Helper's Name</small>
              <b-form-input
              id="helper_name"
              placeholder="First Name"
              class="form-text"
              v-model=" U_HLPR_FNAME"
            />
            </b-col>
            <b-col cols="6">
            <small class="text-left">&nbsp;</small>
            <b-form-input
              id="tendered"
              placeholder="Last Name"
              v-model="U_HLPR_LNAME"
              class="form-text"
            >
            </b-form-input>
            </b-col>
            </b-row>
             <b-row>
            <b-col cols="6">
             <small class="text-left">Driver's Name</small>
              <b-form-input
              id="helper_name"
              placeholder="First Name"
              class="form-text"
              v-model=" U_DRVR_FNAME"
            />
            </b-col>
            <b-col cols="6">
              <small class="text-left">&nbsp;</small>
            <b-form-input
              id="tendered"
              placeholder="Last Name"
              v-model=" U_DRVR_LNAME"
              class="form-text"
            >
            </b-form-input>
            </b-col>
            </b-row>
          
            <small class="text-left">Plate Number</small>
            <b-form-input
              id="tendered"
              v-model=" U_PLATE_NUMBER"
              class="form-text"
            >
            </b-form-input>

            <b-row v-if="U_TRANSACTION_TYPE === '2'">
            <b-col cols="6">
            <small class="text-left"># of Sacks</small>
            <b-form-input type="number" id="sacks" class="form-text" v-model="U_SACKS" />
            </b-col>
            <b-col cols="6">
            <small class="text-left"># of Empty Sacks</small>
            <b-form-input type="number" id="emptysacks" class="form-text" v-model="U_EMPTY_SACKS" />
            </b-col>
            </b-row>
                <b-row v-else>
                </b-row>

          </b-card>


       

      <template v-slot:modal-footer="{cancelEdit }">
        <b-button
          id="edit_action_modal"
          size="sm"
          class="button-style"
          variant="biotech"
          @click="updateDR(U_TRX_ID)"
          
          :disabled="showButtonLoading === true"
        >
          <b-spinner
            v-show="showButtonLoading === true"
            small
            label="Spinning"
          ></b-spinner
          >Save
        </b-button>
        <b-button
          id="cancel_edit_action_modal"
          size="sm"
          class="button-style"
          @click="cancelEdit()"
          >Cancel</b-button
        >
      </template>
    </b-modal>

    <!-- Edit Transaction -->

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
        <h6>View Delivery Receipt</h6>
      </template>

         <b-card class="card-shadow">
              <div id="receipt">
    <b-row>
      <div class=" mr-4" style="width:31rem; height:40rem">
            <span>
             
                 <b-img src="/revive.png" class="receipt-logo" center/>
       
           
            </span>
    

    <center>
 
            <span>
              DELIVERY RECEIPT | PICK-UP
            </span>
            <br>
            <span><small>
              Date: 27-Jan-2020 | 10:00 AM
            </small></span>
    </center>

        <br />

 <span>
Transaction Number : CDF-00001
</span>
<br/><br>

        <b-row>
          <b-col cols="4">
            <div>
            <span>
              Farmer's Name
            </span>
            </div>
            <div><span>
              Address
            </span></div>
          </b-col>
          <b-col cols="8">
            <div class="dotted-border">
              <span>
                : Jose Trevor
              </span>
            </div>
             <div class="dotted-border">
              <span class="mt-1">
                : Purok 8 Block 10, San. Vicente, Banga,
              </span>
            </div>
            <div class="dotted-border">
              <span class="mt-1">
                &nbsp; South Cotabato, 9511
              </span>
            </div>
          </b-col>
        </b-row>



        <b-row>
          <b-col cols="4">
            <span>
              Item
            </span>
          </b-col>

          <b-col cols="8">
            <div class="dotted-border">
              <span>
                : Corn on Cobs
              </span>
            </div>
          </b-col>
        </b-row>


        <b-row>
          <b-col cols="4">
            <span>
              Driver's Name
            </span>
          </b-col>

          <b-col cols="8">
            <div class="dotted-border">
              <span>
                : Jon Magnolia
              </span>
            </div>
          </b-col>
        </b-row>
                <b-row>
          <b-col cols="4">
            <span>
              Plate Number
            </span>
          </b-col>

          <b-col cols="8">
            <div class="dotted-border">
              <span>
                : XXZ-9919
              </span>
            </div>
          </b-col>
        </b-row>
                        <b-row>
          <b-col cols="4">
            <span>
              Number of Sacks
            </span>
          </b-col>

          <b-col cols="8">
            <div class="dotted-border">
              <span>
                : 
              </span>
            </div>
          </b-col>
        </b-row>
                       <b-row>
          <b-col cols="4">
            <span>
               Empty Sacks
            </span>
          </b-col>

          <b-col cols="8">
            <div class="dotted-border">
              <span>
                : 
              </span>
            </div>
          </b-col>
        </b-row>

        <br />
        <br>
        <br>

        <b-row>
          <b-col>
            <b-form inline>
              <span>
                Approved By:
              </span>
              &nbsp;&nbsp;&nbsp;
              <span style="border-bottom-style: solid; border-width:1px;font-size:9px">
               &nbsp;JOSE TREVOR&nbsp;
              </span>
            </b-form>
          </b-col>

          <b-col cols="auto" class="mr-3">
          
              <span>
                Reviewed By:
              </span>
              &nbsp;&nbsp;&nbsp;
              <span style="border-bottom-style: solid; border-width:1px;font-size:9px">
               &nbsp;JON MAGNOLIA&nbsp;
              </span>
          
          </b-col>
        </b-row>
        <br><br>
        <center>
        <span>
         Verified By:
        </span>
         &nbsp;&nbsp;&nbsp;
        <span style="border-bottom-style: solid; border-width:1px;font-size:9px">
            &nbsp;IRYNNE DOROMAL&nbsp;
        </span>
        </center>
        <b-row style="float:right" class="mr-1 mt-1">
          <span>
            <b>
           
            </b>
          </span>
        </b-row>
<br>
        <!-- <b-row class="mt-4">
          <b-col>
            <span style="font-size:10px" class="mr-2">
              <i>
                This does not serve as an Official Receipt
              </i>
            </span>

            <span style="font-size:12px; float:right" class="mr-1">
              <b>
                Farmer's Copy
              </b>
            </span>
          </b-col>
        </b-row> -->
      </div>
    </b-row>
  </div>

          </b-card>

      <template v-slot:modal-footer="{cancel }">
        <b-button
          id="cancel_add_action_modal"
          size="sm"
          class="button-style"
          @click="cancel()"
          >Close</b-button
        >
      </template>
    </b-modal>
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

    <!-- View Transaction -->
  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
import Receipt from "~/components/transaction/Receipt.vue";
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
import Loading from "~/components/Loading/Loading.vue";


export default {
  components: {
    Receipt,
    DateRangePicker,
    Loading
  },
  async created() {
    await this.getTransactions();
    await this.getTransactionType();
    await this.getFarmer();
    await this.getCommodity();
    this.totalRows = this.items.length;
  },
  data() {
    return {
      filterStatus:["Completed","Cancelled"],
       showButtonLoading: false,
      alert: {
        showAlert: 0,
        variant: "biotech",
        message: ""
      },
      showReceipt: false,
      U_TRANSACTION_TYPE: null,
      U_FRMR_NAME:null,
      U_FRMR_ADD:null,
      U_CMMDTY:null,

    
      
      transaction_types:[],
      farmer:[],
      farmerAdd:[],
      commodity:[],
      status:"",
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
      items:[],
      itemsFields: [
         
        {
          key: "U_TRX_NO",
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
          key: "U_CMMDTY",
          label: "Commodity",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "U_FRMR_NAME",
          label: "Farmer's Name",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "U_CRTD_BY",
          label: "Created By",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "U_DTE_CRTD",
          label: "Date Created",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "U_STATUS",
          label: "Status",
          sortable: true,
          sortDirection: "desc"
        },

        // { key: "actions", label: "Actions", class: "text-center" }
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
    filterItems() {
      return this.items.filter(request => {
        if (this.filterStatus.includes(request.U_STATUS)) {
          return request;
        }
      });
    },

     bottomLabel() {
      let end = this.perPage * this.currentPage;
      let start = end - this.perPage + 1;

      if (end > this.filterItems.length) {
        end = this.filterItems.length;
      }

      if (this.filterItems.length === 0) {
        start = 0;
      }

      return `Showing ${start} to ${end} of ${this.filterItems.length} entries`;
    },

    rows() {
      return this.filterItems.length;
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
       console.log(data)
       this.U_TRX_ID = data.U_TRX_ID;
      this.U_TRANSACTION_TYPE = data.U_TRANSCTION_TYPE_ID;
      this.U_CMMDTY = data.U_ITEM;
      this.U_FRMR_NAME = data.U_FRMR_NAME;
      this.U_FRMR_ADD = data.U_FRMR_ADD;
      const driver_name = data.U_DRVR_NAME.split(", ");
      const helper_name = data.U_HLPR_NAME.split(", ");
      this.U_HLPR_FNAME= helper_name[1];
      this.U_HLPR_LNAME= helper_name[0] ;
      this.U_DRVR_FNAME= driver_name[1];
      this.U_DRVR_LNAME= driver_name[0] ;
      this.U_SACKS= data.U_SACKS;
      this.U_EMPTY_SACKS = data.U_EMPTY_SACKS;
      this.U_PLATE_NUMBER = data.U_PLATE_NUMBER;
      //      farmer_id: this.U_FRMR_NAME.id,  
      //      driver_name: this.U_DRVR_LNAME +", " + this.U_DRVR_FNAME,
      //      helper_name: this.U_HLPR_LNAME +", " + this.U_HLPR_FNAME,
      //      no_of_bags: this.U_SACKS,
      //      no_of_empty_bags: this.U_EMPTY_SACKS,
      //      employee_id: userDetails.Code,
      //      plate_number: this.U_PLATE_NUMBER
      // this.moduleForm.Code = data.Code;
      // this.moduleForm.Name = data.Name;
      // this.moduleForm.U_IS_ACTIVE = data.U_IS_ACTIVE;
      this.$bvModal.show("edit-transaction-modal");
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
          text : v[i].U_DESCRIPTION,
          value: v[i].Code
        });
      }
    },
    async getCommodity() {
      const res = await axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/api/items/select`,
        headers: {
          Authorization: localStorage.SessionId
        }
      });
      const v = res.data.view;

      for (let i = 0; i < v.length; i++) {
        this.commodity.push({
          text : v[i].ItemName,
          value: v[i].ItemCode
        });
      }
    },
        async getFarmer() {
      const res = await axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/api/suppliers/select`,
        headers: {
          Authorization: localStorage.SessionId
        }
      });
      const v = res.data.view;
     
      for (let i = 0; i < v.length; i++) {
        this.farmer.push({
          text : v[i].SUPPLIER_NAME,
          value: { id: v[i].SUPPLIER_ID, address: v[i].SUPPLIER_ADDRESS}
          
        });
        
      }
    },
    test(){
      
      this.U_FRMR_ADD= this.U_FRMR_NAME.address
    },
    async newDR() {
      try {
        this.showLoading = true;
        let items= [];

        const userDetails = JSON.parse(localStorage.user_details);
      
          // const date = moment(`${d}  ${t}`).format("MMM DD, YYYY | hh:mm A");
        const json = {
           transaction_type_id: this.U_TRANSACTION_TYPE,
           item_id: this.U_CMMDTY ,
           farmer_id: this.U_FRMR_NAME.id,  
           driver_name: this.U_DRVR_LNAME +", "+ this.U_DRVR_FNAME,
           helper_name: this.U_HLPR_LNAME +", " + this.U_HLPR_FNAME,
           no_of_bags: this.U_SACKS,
           no_of_empty_bags: this.U_EMPTY_SACKS,
           employee_id: userDetails.Code,
           plate_number: this.U_PLATE_NUMBER
        };

        const res = await axios({
          method: "POST",
          url: `${this.$axios.defaults.baseURL}/api/transaction/add`,
          headers: {
            Authorization: `B1SESSION=${localStorage.SessionId}`
          },
          data: {
            ...json
          }
        });
        this.showLoading = false;
        this.getTransactions();
        this.$bvModal.hide("add-transaction-modal");
      } catch (e) {
        console.log(e);
        this.showLoading = false;
        
      }
    },
    async updateDR(U_TRX_ID) {
     console.log(U_TRX_ID)
      try {
        this.showLoading = true;
        let items= [];

        const userDetails = JSON.parse(localStorage.user_details);

        const json = {
          //  transaction_type_id: this.U_TRANSACTION_TYPE,
          //  item_id: this.U_CMMDTY ,
          //  farmer_id: this.U_FRMR_NAME,  
           driver_name: this.U_DRVR_LNAME +", " + this.U_DRVR_FNAME,
           helper_name: this.U_HLPR_LNAME +", " + this.U_HLPR_FNAME,
           no_of_bags: this.U_SACKS,
           no_of_empty_bags: this.U_EMPTY_SACKS,
           employee_id: userDetails.Code,
           plate_number: this.U_PLATE_NUMBER
        };

        const res = await axios({
         
          method: "PUT",
          url: `${this.$axios.defaults.baseURL}/api/transaction/update/${U_TRX_ID}`,
          headers: {
            Authorization: `B1SESSION=${localStorage.SessionId}`
          },
          data: {
            ...json
          }
        });
        this.showLoading = false;
        this.getTransactions();
        this.$bvModal.hide("edit-transaction-modal");
      } catch (e) {
        console.log(e);
        this.showLoading = false;
        
      }
    },

      onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
     intToTime(i) {
      const str = i.toString();
      const len = str.length;
      let time = null;
      if (len == 4) {
        const hour = str.substring(0, 2);
        const min = str.substring(2, 4);
        time = `${hour}:${min}`;
        return time;
      } else if (len == 3) {
        const hour = str.substring(0, 1);
        const min = str.substring(1, 3);
        time = `0${hour}:${min}`;
        return time;
      } else {
        return `00:00`;
      }
    },

  async resetDate() {
      this.isBusy = true;
      this.datePicker.startDate = moment().format("MMM DD, YYYY");
      this.datePicker.endDate = moment().format("MMM DD, YYYY");
      await this.getTransactions();
      this.totalRows = this.items.length;
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
      await this.getTransactions();
      this.totalRows = this.items.length;
    },
    async getTransactions() {
      console.log(JSON.parse(localStorage.user_details))
      try {
        const userDetails = JSON.parse(localStorage.user_details)
        const roleDetails = JSON.parse(localStorage.user_role)

        const employee_id = userDetails.Code
        const employee_role = roleDetails.Name

        this.showLoading = true;
        this.items = [];
        const res = await axios({
          method: "POST",
          url: `${this.$axios.defaults.baseURL}/api/report/select`,
          headers: {
            Authorization: `B1SESSION=${localStorage.SessionId}`
          },
          data: {
            date_from: moment(this.datePicker.startDate).format("YYYY-MM-DD"),
            date_to: moment(this.datePicker.endDate).format("YYYY-MM-DD"),
            employee_id,
            employee_role
          }
        });
       
        const v = res.data.view;
         console.log(v);
        for (let i = 0; i < v.length; i++) {
          const d = moment(v[i].CREATED_DATE).format("MMM DD, YYYY");
          // const t = this.intToTime(v[i].CREATED_TIME);
          // const date = moment(`${d}  ${t}`).format("MMM DD, YYYY | hh:mm A");
          this.items.push({
              U_TRX_ID: v[i].TRANSACTION_ID,
              U_TRANSCTION_TYPE_ID: v[i].TRANSACTION_TYPE_ID,
              U_ITEM: v[i].ITEM_ID,
              U_SUPP: v[i].SUPPLIER_ID,
              U_TRX_NO: v[i].TRANSACTION_NUMBER,
              U_TRANSACTION_TYPE: v[i].TRANSACTION_TYPE,
              U_CMMDTY: v[i].ITEM_NAME ,
              U_FRMR_NAME : v[i].FARMER_NAME ,  
              U_FRMR_ADD : v[i].FARMER_ADDRESS ,  
              U_DTE_CRTD: d,
              U_CRTD_BY: v[i].CREATED_BY,
              U_STATUS: v[i].STATUS,
              U_PLATE_NUMBER: v[i].PLATE_NUMBER,
              U_HLPR_NAME: v[i].HELPER_NAME,
              U_DRVR_NAME: v[i].DRIVER_NAME,
              U_EMPTY_SACKS: v[i].NUMBER_OF_EMPTY_BAGS,
              U_SACKS: v[i].NUMBER_OF_BAGS
          });
        }

        this.showLoading = false;
      } catch (e) {
        console.log(e);
        this.showLoading = false;
      }
    }
  },
  reloadFunction() {
    this.values = [{ label: "2" }, { label: "3" }];
  },
}
    // End 

</script>
<style>

.reportrange-text[data-v-8cc9549e] {
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