<template>
  <div >
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
      <b-col cols="12" md="3" lg="3" sm="12" xs="1" class="mt-3">
        <b-form-group>
          <b-input-group size="sm">
            <b-form-input
              v-model="filter"
              type="search"
              id="search_delivery_receipt"
              placeholder="Search Delivery Slip"
            ></b-form-input>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col cols="12" md="6" lg="4" sm="8" xs="6" class="mt-3" style="display:flex" >
        <b-input-group style="height:10px" size="sm">
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
              style="height:2rem; font-size:14px;"
            >{{ datePicker.startDate }} - {{ datePicker.endDate }}</div>
          </date-range-picker>
          <b-input-group-append style="height:2rem; font-size:12px">
            <b-button @click="resetDate" id="date-reset" style="font-size:12px">Reset</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-col>
      <b-col cols="12" md="3" lg="5" sm="4" xs="10" class="mt-3" align="left">
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
              
              id="status_group0"
              name="flavour-2"
              class="pl-2"
              style="font-size:12px"
              v-model="filterStatus"
              v-b-tooltip.hover
              title="Filter Transaction Status"
            >
            Status <br>
              <b-form-checkbox id="pending_supp_stat" value="Completed"
                >Completed</b-form-checkbox
              >
              <b-form-checkbox id="cancelled_cust_stat" value="Cancelled"
                >Cancelled</b-form-checkbox
              >
            </b-form-checkbox-group>
            <b-form-checkbox-group
            id="status_group"
            name="flavour-2"
            class="pl-2"
            style="font-size:12px"
            v-model="filterTransaction"
            v-b-tooltip.hover
            title="Filter Transaction Type "
          >
          Transaction Type
            <b-form-checkbox id="Pick-up" value="Pick-up"
              >Pick-up</b-form-checkbox
            >
            <b-form-checkbox id="delivery" value="Delivery"
              >Delivery</b-form-checkbox
            >
            </b-form-checkbox-group>
             <!-- <b-form-checkbox-group
            id="status_group1"
            name="flavour-2"
            class="pl-2"
            style="font-size:12px"
            v-model="filterCompany"
            v-b-tooltip.hover
            title="Filter Company "
          >
         Company<br>
            <b-form-checkbox
                    size="sm"
                    :id="'choice' + index"
                    v-for="(items, index) in filterCompany"
                    :key="index"
                    :value="items"
                  >{{ items }}</b-form-checkbox>
                   <b-form-checkbox id="Biotech" value="BIOTECH_FARMS_INC_DEV_INTEG_TESTING"
              >Biotech</b-form-checkbox
            >
            <b-form-checkbox id="revive" value="REVIVE_DEV_INTEG_TESTING"
              >REvive</b-form-checkbox
            >
          </b-form-checkbox-group> -->
          </b-dropdown>
           <b-button
            size="sm"
            style="font-size:15px;"
            variant="dark"
            v-b-tooltip.hover
            title="Export to PDF"
            @click="print"
          >
            <font-awesome-icon style icon="file-pdf" />
          </b-button>
          <b-button
            align="right"
            size="sm"
            variant="completed"
            style="font-size:15px "
            v-b-tooltip.hover
            title="Export to Excel"
            @click="exportReports"
          >
            <font-awesome-icon icon="file-excel" />
          </b-button>
      </b-col>
    </b-row>

    <!-- Main table element -->
    <div id="printTable">
    <b-table
      id="delivery_receipt_table"
      show-empty
      class="table-style mt-3"
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
      :busy="isBusy"
      @row-clicked="show"
      @filtered="onFiltered"
      
    >
      <template #table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner small class="align-middle" variant="dark">
          </b-spinner>
          <span class="loading_spinner">Loading...</span>
        </div>
      </template>

      <template v-slot:cell(U_TRANSACTION_TYPE)="row">
        {{ row.item.U_TRANSACTION_TYPE == 'Delivery' ? 'Direct' : 'Pick-up' }}
      </template>
        <!-- :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection" -->
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
    </div>


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
        <b-col
          label-cols-sm
          class="mb-0 mt-2 text-left"
          cols="3"
          align-h="center"
        >
          <div size="sm" class="bottomlabel">{{ bottomLabel }}</div>
        </b-col>
        <b-col>
          <b-pagination
            id="reports-pagination"
            pills
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="right"
            size="sm"
            aria-controls="reports-table"
            limit="3"
            class="mt-1"
          ></b-pagination>
        </b-col>
      </b-row>

    <!-- Main table -->

  

    <!-- View Transaction -->

    <b-modal
      size="m"
      header-bg-variant="biotech"
      header-text-variant="light"
      body-bg-variant="gray"
      id="view-transaction-modal"
      no-close-on-backdrop
      scrollable
    >


  <template v-slot:modal-title>
        <h6>View Delivery Slip</h6>
      </template>

         <b-card class="card-shadow">
              <div id="receipt">
    <b-row>
      <div class=" mr-4" :style="(U_TRANSACTION_TYPE == 'Pick-up' && U_ARRIVAL != null && U_DEPARTURE != null && U_TIME_START != null && U_TIME_END != null ) ? 'width:31rem; height:50rem' : 'width:31rem; height:43rem'">
        <span>
          <b-img src="/logo1.png" class="receipt-logo" center/>
        </span>

        <center>
          <span>
            DELIVERY SLIP | {{ U_TRANSACTION_TYPE == 'Delivery' ? 'Direct' : 'Pick-up' }}
          </span>
          <br>
          <span><small>
            Date: {{U_DTE_CRTD}} 
          </small></span>
        </center>
        
        <br />

        <span>
        Transaction Number : {{ U_TRX_NO }}
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
                : {{ U_FRMR_NAME }}
              </span>
            </div>
             <div class="dotted-border">
              <span class="mt-1">
                : {{ U_FRMR_ADD }}
              </span>
            </div>
          </b-col>
        </b-row>
        
        <b-row v-show="U_APP_ProjCode">
          <b-col cols="4">
            <span>Plot Code</span>
          </b-col>
          <b-col cols="8">
            <div class="dotted-border">
              <span> : {{ U_APP_ProjCode }} </span>
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
                : {{U_CMMDTY}}
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
                : {{U_DRVR_NAME}}
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
                : {{U_PLATE_NUMBER}}
              </span>
            </div>
          </b-col>
        </b-row>
         <b-row>
          <b-col cols="4">
            <span>
              Requested Bags
            </span>
          </b-col>

          <b-col cols="8">
            <div class="dotted-border">
              <span>
                : {{U_REQUESTED_SACKS}}
              </span>
            </div>
          </b-col>
        </b-row>
        <div v-if="U_TRANSACTION_TYPE === 'Pick-up'">
                        <b-row >
          <b-col cols="4">
            <span>
              Quantity
            </span>
          </b-col>

          <b-col cols="8">
            <div class="dotted-border">
              <span>
                : {{U_SACKS}} {{ U_UOM }}
              </span>
            </div>
          </b-col>
        </b-row>
                       <b-row>
          <b-col cols="4">
            <span>
               Empty Bags
            </span>
          </b-col>

          <b-col cols="8">
            <div class="dotted-border">
              <span>
                : {{U_EMPTY_SACKS}}
              </span>
            </div>
          </b-col>
        </b-row>
        </div>
        <div v-else>
               <b-row >
          <b-col cols="4">
            <span>
              Quantity
            </span>
          </b-col>

          <b-col cols="8">
            <div class="dotted-border">
              <span>
                : {{U_SACKS}} {{ U_UOM}}
              </span>
            </div>
          </b-col>
        </b-row>
                       <b-row>
          <b-col cols="4">
            <span>
               Empty Bags
            </span>
          </b-col>

          <b-col cols="8">
            <div class="dotted-border">
              <span>
                : {{U_EMPTY_SACKS}} 
              </span>
            </div>
          </b-col>
        </b-row>
      </div>

      <!-- <b-form-group v-show="!(U_ARRIVAL == null || U_DEPARTURE == null || U_TIME_START == null || U_TIME_END == null )"> -->
          <b-form-group v-if="(U_TRANSACTION_TYPE === 'Pick-up') && 
          ( U_ARRIVAL != null && U_DEPARTURE != null && 
            U_TIME_START != null && U_TIME_END )">
          <b-row>
            <b-col cols="4">
              <span>
                Arrival Time
              </span>
            </b-col>

            <b-col cols="8">
              <div class="dotted-border">
                <span>
                  : {{U_ARRIVAL}}
                </span>
              </div>
            </b-col>
          </b-row>

          <b-row>
            <b-col cols="4">
              <span>
                Time Start
              </span>
            </b-col>

            <b-col cols="8">
              <div class="dotted-border">
                <span>
                  : {{U_TIME_START}}
                </span>
              </div>
            </b-col>
          </b-row>

          <b-row>
            <b-col cols="4">
              <span>
                Time End
              </span>
            </b-col>

            <b-col cols="8">
              <div class="dotted-border">
                <span>
                  : {{U_TIME_END}}
                </span>
              </div>
            </b-col>
          </b-row>

          <b-row>
            <b-col cols="4">
              <span>
                Departure Time
              </span>
            </b-col>

            <b-col cols="8">
              <div class="dotted-border">
                <span>
                  : {{U_DEPARTURE}}
                </span>
              </div>
            </b-col>
          </b-row>

          <b-row>
            <b-col cols="4">
              <span>
                Unloading Time
              </span>
            </b-col>

            <b-col cols="8">
              <div class="dotted-border">
                <span>
                  : {{U_UNLOADING}}
                </span>
              </div>
            </b-col>
          </b-row>
        </b-form-group>

        <b-form-group>
          <b-row>
            <b-col cols="4">
              <span>Remarks:</span>
            </b-col>
            <b-col cols="8">
              <div class="dotted-border">
                <span> : {{ U_REMARKS }} </span>
              </div>
            </b-col>
          </b-row>
        </b-form-group>
    

<br>
        <b-row class="my-4">
          <b-col cols="6">

              <center>
              <span style="font-size:9px">
                {{U_FRMR_NAME}}
              </span>
              <br>
              <span style="font-size:9px;border-top-style: solid; border-width:1px;margin:0;padding:0"><B>
               &nbsp;&nbsp; FARMER'S NAME & SIGNATURE
               &nbsp;&nbsp; </B>
              </span>
              </center>

          </b-col >

          <b-col cols="6" >
              
              <center>
              <span style="font-size:9px;margin:0;padding:0">
                {{U_HLPR_NAME}}
              </span>
              <br>
              <span style="font-size:9px;border-top-style: solid; border-width:1px;margin:0;padding:0"><B>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; REVIEWED BY
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </B>
              </span>
              </center> 
                
          </b-col>
        </b-row>
 

        <center>
          
        <span style="font-size:9px">
            &nbsp;&nbsp;{{U_CRTD_BY}}&nbsp;&nbsp;
        </span>
      <br>
        <span style="border-top-style: solid; border-width:1px;font-size:9px;">
            <b>&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VERIFIED BY
              &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>
        </span>

        </center>
        <b-row style="float:right" class="mr-1 mt-1">

        </b-row>
<br>

      </div>
    </b-row>
  </div>

          </b-card>

      <template v-slot:modal-footer="{}">
        <!-- <b-button
        v-show="(U_TRANSACTION_TYPE == 'Pick-up' && 
        ( U_ARRIVAL == null ||
          U_DEPARTURE == null ||
          U_TIME_START == null ||
          U_TIME_END == null ||
          U_UNLOADING == null ))"
          id="add-time-logs"
          size="sm"
          variant="biotech"
          class="button-style"
          @click="updateTime()"
          >Add Time Logs</b-button
        > -->
        <b-button
          id="cancel_add_action_modal"
          size="sm"
          class="button-style"
          @click="cancel()"
          >Close</b-button
        >
      </template>
    </b-modal>


    <!-- Add Time Logs -->
      <b-modal
      size="sm"
      header-bg-variant="biotech"
      header-text-variant="light"
      body-bg-variant="gray"
      id="add-time-logs-modal"
      hide-header-close
      no-close-on-backdrop
      no-scrollable
    >
      <template v-slot:modal-title>
        <h6>Add Time Logs</h6>
      </template>
        
        <b-card>
          <b-form-group>
            <b-row class="mt-0">
              <b-col cols="12">
                <small class="text-left">Arrival Time</small>
                <b-form-input
                  id="helper_name"
                  placeholder="First Name"
                  class="form-text"
                  v-model="U_ARRIVAL"
                  type="time"
                  required
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col cols="12">
                <small class="text-left">Time Start</small>
                <b-form-input
                  id="helper_name"
                  placeholder="First Name"
                  class="form-text"
                  v-model="U_TIME_START"
                  type="time"
                  required
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col cols="12">
                <small class="text-left">Time End</small>
                <b-form-input
                  id="tendered"
                  placeholder="Last Name"
                  v-model="U_TIME_END"
                  class="form-text"
                  type="time"
                  required
                ></b-form-input>
              </b-col>
            </b-row>

            <b-row>
              <b-col cols="12">
                <small class="text-left">Departure Time</small>
                <b-form-input
                  id="tendered"
                  placeholder="Last Name"
                  v-model="U_DEPARTURE"
                  class="form-text"
                  type="time"
                  required
                ></b-form-input>
              </b-col>
            </b-row>

            <b-row>
              <b-col cols="12">
                <small class="text-left">Unloading Time</small>
                <b-form-input
                  id="tendered"
                  placeholder="Last Name"
                  v-model="U_UNLOADING"
                  class="form-text"
                  type="time"
                  required
                ></b-form-input>
              </b-col>
            </b-row>

          </b-form-group>
        </b-card>

      <template v-slot:modal-footer="{}">
        <b-button
          id="add_action_modal"
          size="sm"
          class="button-style"
          variant="biotech"
          @click="addTime()"
          :disabled="showLoading === true"
        >
          Add
        </b-button>
        <b-button
          id="cancel_add_action_modal"
          size="sm"
          class="button-style"
          @click="cancelTimeLog()"
          >Cancel</b-button
        >
      </template>
    </b-modal>

    <!-- End Add Time Logs -->


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
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import Receipt from "~/components/transaction/Receipt.vue";
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
import Loading from "~/components/Loading/Loading.vue";
import Papa from "papaparse";
import VueHtmlToPaper from "vue-html-to-paper";


export default {
  components: {
    Receipt,
    DateRangePicker,
    Loading
  },
  async created() {
    this.companyCode = JSON.parse(localStorage.user_details).U_COMPANY_CODE;
    await this.getTransactions();
    await this.getTransactionType();
    await this.getCompanyList();
    // await this.getFarmer();
    // await this.getCommodity();
    this.totalRows = this.items.length;
    const userActions = JSON.parse(localStorage.user_actions)["Reports Module"];

    if (userActions.find(action => action.U_ACTION_NAME === "View Reports")) {
      this.actions.viewReports = true;
    }
  },
  data() {
    return {
      actions: {
        viewReports: false
      },
      rci: process.env.rci,
      bfi: process.env.bfi,
      filterStatus:["Completed","Cancelled"],
       showLoading: false,
      alert: {
        showAlert: 0,
        variant: "biotech",
        message: ""
      },
      companyCode: null,
      showReceipt: false,
      TRANSACTION_COMPANY:null,
      U_TRANSACTION_TYPE: null,
     U_UOM: { UomName: "", UomEntry: "" },
      U_FRMR_NAME:null,
      U_FRMR_ADD:null,
      U_APP_ProjCode: null,
      U_CMMDTY:null,
      U_DRVR_LNAME:null,
      U_DRVR_FNAME:null,
      U_REQUESTED_SACKS:null,
      U_HLPR_FNAME:null,
      U_HLPR_LNAME:null,
      U_PLATE_NUMBER:null,
      U_DTE_CRTD:null,
      U_TME_CRTD:null,
      U_CRTD_BY:null,
      U_TRX_NO:null,
      U_DRVR_NAME:null,
      U_SACKS:null,
      U_EMPTY_SACKS:null,
      U_HLPR_NAME:null,
      opens1:"",
      U_ARRIVAL: null,
      U_TIME_START: null,
      U_TIME_END: null,
      U_DEPARTURE: null,
      U_UNLOADING: null,
      U_REMARKS: null,

      filterCompany:[],
      filterTransaction:["Pick-up","Delivery"],
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
          key: "TRANSACTION_COMPANY",
          label: "Company",
          sortable: true,
          sortDirection: "asc"
        },
        
        {
          key: "U_TRX_NO",
          label: "Transaction No.",
          sortable: true,
          sortDirection: "asc"
        },

        {
          key: "U_TRANSACTION_TYPE",
          label: "Transaction Type",
          sortable: true,
          sortDirection: "asc"
        },

        {
          key: "U_CMMDTY",
          label: "Commodity",
          sortable: true,
          sortDirection: "asc"
        },

        {
          key: "U_UOM",
          label: "Unit of Measure",
          sortable: true,
          sortDirection: "desc"
        },

         {
          key: "U_SACKS",
          label: "Quantity",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "U_FRMR_NAME",
          label: "Farmer's Name",
          sortable: true,
          sortDirection: "asc"
        },

        {
          key: "U_CRTD_BY",
          label: "Created By",
          sortable: true,
          sortDirection: "asc"
        },

        {
          key: "U_DTE_CRTD",
          label: "Date Completed",
          sortable: true,
          sortDirection: "asc"
        },
        {
          key: "U_RMRKS",
          label: "Remarks",
          sortable: true,
          sortDirection: "asc"
        },

        {
          key: "U_STATUS",
          label: "Status",
          sortable: true,
          sortDirection: "asc"
        },

      ],
      totalRows: null,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15],
      sortBy: "U_TRX_NO",
      sortDesc: false,
      sortDirection: "desc",
      filter: null,
      filterOn: []
    };
  },
   computed: {
    filterItems() {
      let count = 0;
      return this.items.filter(request => {
        if (this.filterStatus.includes(request.U_STATUS) && this.filterTransaction.includes(request.U_TRANSACTION_TYPE) ) {
          count++
          this.totalRows = count;
          return request;
        }
        if (this.filterTransaction.includes(request.U_TRANSACTION_TYPE) && this.filterStatus.includes(request.U_STATUS) ) {
          count++
          this.totalRows = count;
          return request;
        }
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
    cancel() {
      // this.U_ARRIVAL = null;
      // this.U_TIME_START = null;
      // this.U_TIME_END = null;
      // this.U_DEPARTURE = null;
      this.$bvModal.hide("view-transaction-modal");
    },

    showAlert(message, variant) {
      this.alert = {
        showAlert: 3,
        variant,
        message
      };
    },

    async addTime() {
      // update

      if(this.U_ARRIVAL == null) {
          this.showAlert("Please input Arrival Time", "danger");
        } else if(this.U_DEPARTURE == null) {
          this.showAlert("Please input Departure Time", "danger");
        } else if(this.U_TIME_START == null) {
          this.showAlert("Please input Time Start", "danger");
        } else if(this.U_TIME_END == null) {
          this.showAlert("Please input Time End", "danger");
        } else if(this.U_UNLOADING == null) {
          this.showAlert("Please input Unloading Time", "danger");
        } else {

          try {
            this.showLoading = true;

            const userDetails = JSON.parse(localStorage.user_details);

            const intToTime = i => {
              if (i) {
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
              } else {
                return `00:00`;
              }
            };
            
            const json = {
              comapany: this.TRANSACTION_COMPANY_ID,
              uom_id: this.U_UOM_ID,
              driver_name: this.U_DRVR_NAME,
              helper_name: this.U_HLPR_NAME,
              no_of_requested_bags: this.U_REQUESTED_SACKS,
              no_of_bags: this.U_SACKS,
              no_of_empty_bags: this.U_EMPTY_SACKS,
              employee_id: userDetails.Code,
              plate_number: this.U_PLATE_NUMBER,
              scheduled_date: this.U_SCHEDULED_DATE,
              scheduled_time: intToTime(this.U_SCHEDULED_TIME),

              arrival: this.U_ARRIVAL,
              time_start: this.U_TIME_START,
              time_end: this.U_TIME_END,
              departure: this.U_DEPARTURE,
              unloading: this.U_UNLOADING
            };

            console.log("json", json);

            await axios({
              method: "PUT",
              url: `${this.$axios.defaults.baseURL}/api/transaction/update/${this.remarks}`,
              headers: {
                Authorization: `B1SESSION=${localStorage.SessionId}`
              },
              data: {
                ...json
              }
            }).then((res) => {
              if (res && res.name == "Error") {
                if (res.response && res.response.data.errorMsg) {
                  if (res.response.data.errorMsg === "Invalid session.") {
                    this.$bvModal.show("session_modal");
                  }
                }
                this.showLoading = false;
              } else {
                this.U_ARRIVAL = null;
                this.U_TIME_START = null;
                this.U_TIME_END = null;
                this.U_DEPARTURE = null;
                this.U_UNLOADING = null;
                this.showLoading = false;
                this.getTransactions();
                this.$bvModal.hide('add-time-logs-modal')
                this.showAlert("Successfully Added", "success");
              }
            })
            
          } catch (e) {
            console.log(e);
            this.showLoading = false;
            if (e.response && e.response.data.error) {
              this.showAlert(e.response.data.error, "danger");
            } else {
              this.showAlert("Please input all fields", "danger");
            }
          }

        }

    },

    cancelTimeLog() {
      this.U_ARRIVAL = null;
      this.U_TIME_START = null;
      this.U_TIME_END = null;
      this.U_DEPARTURE = null;
      this.U_UNLOADING = null;
      this.$bvModal.hide('add-time-logs-modal')
    },

    updateTime() {
      this.$bvModal.hide("view-transaction-modal");
      this.$bvModal.show('add-time-logs-modal')
      this.U_ARRIVAL = moment(this.U_ARRIVAL, 'hh:mm A').format('HH:mm')
      this.U_DEPARTURE = moment(this.U_DEPARTURE, 'hh:mm A').format('HH:mm')
      this.U_TIME_START = moment(this.U_TIME_START, 'hh:mm A').format('HH:mm')
      this.U_TIME_END = moment(this.U_TIME_END, 'hh:mm A').format('HH:mm')
      this.U_UNLOADING = moment(this.U_UNLOADING, 'hh:mm A').format('HH:mm')
      console.log(this.U_ARRIVAL, this.U_DEPARTURE, this.U_TIME_START, this.U_TIME_END, this.U_UNLOADING);
    },
    
    async print() {
      // Pass the element id here
      // this.$htmlToPaper("printTable");
          //  this.$bvModal.hide("export-pdf-modal");
      let content = [];
      // let Total = 0;

     await new Promise(resolve => {
        this.filterItems.forEach(acknowledgement => {
          console.log(acknowledgement);
          const valuesArray = [];
          // const d = moment(v[i].CREATED_DATE).format("MMM DD, YYYY");
          // const t = this.intToTime(v[i].CREATED_TIME);
          // const date = moment(`${d}  ${t}`).format("MMM DD, YYYY | hh:mm A");
          valuesArray.push(acknowledgement.U_DTE_CRTD);
          valuesArray.push(acknowledgement.U_TRX_NO);
          valuesArray.push(acknowledgement.U_TRANSACTION_TYPE);
          valuesArray.push(acknowledgement.U_CMMDTY);
          valuesArray.push(acknowledgement.U_SACKS+" "+acknowledgement.U_UOM);
          valuesArray.push(acknowledgement.U_FRMR_NAME);
          valuesArray.push(acknowledgement.U_CRTD_BY);
          // valuesArray.push(acknowledgement.U_RMRKS);
          valuesArray.push(acknowledgement.U_STATUS);
          content.push(valuesArray);
        });
        resolve();
      });

      const userDetails = JSON.parse(localStorage.user_details);

      const doc = new jsPDF();
      doc.setFontSize(18);

      let fillcolor;
      if(userDetails.U_COMPANY_CODE == this.rci) {
        doc.text("REvive Croptech Incorporated", 65, 12);
        fillcolor = [116, 48, 19];
      } else if(userDetails.U_COMPANY_CODE == this.bfi) {
        doc.text("BiotechFARMS Incorporated", 65, 12);
        fillcolor = [40, 167, 69];
      }

      doc.setFontSize(12);
      doc.text("Farmers' Deliver Slip System", 78, 17);

      // doc.setFontSize(10);
      // doc.text(
      //   `as of ${this.datePicker.startDate} to  ${this.datePicker.endDate}`,
      //   76,
      //   21
      // );

      doc.autoTable({
        theme: "striped",
        headStyles: { fillColor: fillcolor },
        margin: { top: 2, right: 2, bottom: 0, left: 2 },
        styles: { fontSize: 6, cellWidth: "auto" },
        head: [["Date Completed", "Transaction No.", "Type", "Commodity", "Quantity", "Farmer's Name", "Created By", "Status"]],
        body: content,
        margin: { top: 28 }
      });

      doc.save(
        `Farmers Delivery Slip (${this.dateRange.date_from} - ${this.dateRange.date_to}).pdf`
      );
      return doc;
      
    },

     exportReports() {
      const csv = Papa.unparse(this.items, { header: true });
      let csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      let csvURL = null;
      if (navigator.msSaveBlob) {
        csvURL = navigator.msSaveBlob(csvData, `${moment().format()}.csv`);
      } else {
        csvURL = window.URL.createObjectURL(csvData);
      }
      var tempLink = document.createElement("a");
      tempLink.href = csvURL;
      tempLink.setAttribute("download", `${moment().format()}.csv`);
      tempLink.click();
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
      // },
    async getCompanyList() {
      this.companyList = [];
      const res = await axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/admin/companies`,
        headers: {
          Authorization: localStorage.SessionId
        }
      });
      const v = res.data.companies;

      for (let i = 0; i < v.length; i++) {
        if (v[i].U_IS_ACTIVE == 1) {
          this.companyList.push({
            text: v[i].COMPANYDBNAME,
            value: v[i].U_COMPANYCODE
          });
        }
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
  show(data) {
    this.U_ARRIVAL = null;
    this.U_TIME_START = null;
    this.U_TIME_END = null;
    this.U_DEPARTURE = null;
    this.U_UNLOADING = null;

    const userDetails = JSON.parse(localStorage.user_details);
    this.remarks = data.U_TRX_ID;
    this.U_APP_ProjCode = "";     
       this.TRANSACTION_COMPANY = data.TRANSACTION_COMPANY;
       this.TRANSACTION_COMPANY_ID = userDetails.U_COMPANY_CODE;
      (this.U_UOM = data.U_UOM);
      this.U_DTE_CRTD = data.U_DTE_CRTD;
      this.U_TME_CRTD = data.U_TME_CRTD;
      this.U_CRTD_BY = data.U_CRTD_BY;
      this.U_TRX_ID = data.U_TRX_ID;
      this.U_TRX_NO = data.U_TRX_NO;
      this.U_UOM_ID = data.U_UOM_ID;
      this.U_TRANSACTION_TYPE = data.U_TRANSACTION_TYPE;
      this.U_CMMDTY = data.U_CMMDTY;
      this.U_FRMR_NAME = data.U_FRMR_NAME;
      this.U_FRMR_ADD = data.U_FRMR_ADD;
      if(data.U_APP_ProjCode){
        this.U_APP_ProjCode = data.U_APP_ProjCode;
      }
      this.U_REMARKS = data.U_REMARKS;
      this.U_DRVR_NAME = data.U_DRVR_NAME;
      this.U_HLPR_NAME = data.U_HLPR_NAME;
      this.U_REQUESTED_SACKS = data.U_REQUESTED_SACKS;
      this.U_SACKS= data.U_SACKS;
      this.U_EMPTY_SACKS = data.U_EMPTY_SACKS;
      this.U_PLATE_NUMBER = data.U_PLATE_NUMBER;
      this.U_SCHEDULED_DATE = data.U_SCHEDULED_DATE;
      this.U_SCHEDULED_TIME = data.U_SCHEDULED_TIME;
      this.U_SCHEDULED_DATE_AND_TIME = data.U_SCHEDULED_DATE_AND_TIME;
      if(data.U_ARRIVAL != null && 
          data.U_DEPARTURE != null && 
          data.U_TIME_START != null && 
          data.U_TIME_START != null && 
          data.U_UNLOADING != null ){
            this.U_ARRIVAL = moment(data.U_ARRIVAL, ["HH.mm"]).format("hh:mm A");
            this.U_DEPARTURE = moment(data.U_DEPARTURE, ["HH.mm"]).format("hh:mm A");
            this.U_TIME_START = moment(data.U_TIME_START, ["HH.mm"]).format("hh:mm A");
            this.U_TIME_END = moment(data.U_TIME_END, ["HH.mm"]).format("hh:mm A");
            this.U_UNLOADING = moment(data.U_UNLOADING, ["HH.mm"]).format("hh:mm A");
          }
     
      this.$bvModal.show("view-transaction-modal");
    },
  

      onFiltered(filterItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filterItems.length;
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
      this.isBusy = false;
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
      this.isBusy = false;
    },
  async getTransactions() {
      try {
        const userDetails = JSON.parse(localStorage.user_details)
        const roleDetails = JSON.parse(localStorage.user_role)

        const employee_id = userDetails.Code
        const employee_role = roleDetails.Name

          
        this.isBusy = true;
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
        if(v.length > 0){
          for (let i = 0; i < v.length; i++) {
            const d = moment(v[i].CREATED_DATE).format("MMM DD, YYYY");
            const t = this.intToTime(v[i].CREATED_TIME);
            const date = moment(`${d}  ${t}`).format("MMM DD, YYYY | hh:mm A");
            if(v[i].U_PLOT_CODE === null){
              this.items.push({
                U_TRX_NO: v[i].U_TRX_NO,
                TRANSACTION_COMPANY: v[i].TRANSACTION_COMPANY,
                // U_TME_CRTD : t,
                U_UOM: v[i].UOM_NAME,
                U_TRX_ID: v[i].TRANSACTION_ID,
                U_TRANSCTION_TYPE_ID: v[i].TRANSACTION_TYPE_ID,
                U_ITEM: v[i].ITEM_ID,
                U_UOM_ID: v[i].UOM_ID,
                U_SUPP: v[i].SUPPLIER_ID,
                U_TRX_NO: v[i].TRANSACTION_NUMBER,
                U_TRANSACTION_TYPE: v[i].TRANSACTION_TYPE,
                U_CMMDTY: v[i].ITEM_NAME ,
                U_FRMR_NAME : v[i].FARMER_NAME ,  
                U_FRMR_ADD : v[i].FARMER_ADDRESS ,  
                // U_APP_ProjCode: v[i].U_PLOT_CODE,
                U_DTE_CRTD: date,
                U_CRTD_BY: v[i].CREATED_BY,
                U_STATUS: v[i].STATUS,
                U_RMRKS: v[i].REMARKS,
                U_PLATE_NUMBER: v[i].PLATE_NUMBER,
                U_REQUESTED_SACKS: v[i].NUMBER_OF_REQUESTED_BAGS,
                U_HLPR_NAME: v[i].HELPER_NAME,
                U_DRVR_NAME: v[i].DRIVER_NAME,
                U_EMPTY_SACKS: v[i].NUMBER_OF_EMPTY_BAGS,
                U_SACKS: v[i].NUMBER_OF_BAGS,
                U_SCHEDULED_DATE_AND_TIME: date,
                U_SCHEDULED_DATE: moment(v[i].SCHEDULED_DATE).format("YYYY-MM-DD"),
                U_SCHEDULED_TIME: v[i].SCHEDULED_TIME,
                TRANSACTION_COMPANY_ID: v[i].TRANSACTION_COMPANY_ID,
                U_ARRIVAL: v[i].U_ARRIVAL,
                U_DEPARTURE: v[i].U_DEPARTURE,
                U_TIME_START: v[i].U_TIME_START,
                U_TIME_END: v[i].U_TIME_END,
                U_UNLOADING: v[i].U_UNLOADING,
                U_REMARKS: v[i].U_REMARKS
              });
            } else {
              this.items.push({
                U_TRX_NO: v[i].U_TRX_NO,
                TRANSACTION_COMPANY: v[i].TRANSACTION_COMPANY,
                // U_TME_CRTD : t,
                U_UOM: v[i].UOM_NAME,
                U_TRX_ID: v[i].TRANSACTION_ID,
                U_TRANSCTION_TYPE_ID: v[i].TRANSACTION_TYPE_ID,
                U_ITEM: v[i].ITEM_ID,
                U_UOM_ID: v[i].UOM_ID,
                U_SUPP: v[i].SUPPLIER_ID,
                U_TRX_NO: v[i].TRANSACTION_NUMBER,
                U_TRANSACTION_TYPE: v[i].TRANSACTION_TYPE,
                U_CMMDTY: v[i].ITEM_NAME ,
                U_FRMR_NAME : v[i].FARMER_NAME ,  
                U_FRMR_ADD : v[i].FARMER_ADDRESS , 
                U_APP_ProjCode: v[i].U_PLOT_CODE,
                U_DTE_CRTD: date,
                U_CRTD_BY: v[i].CREATED_BY,
                U_STATUS: v[i].STATUS,
                U_RMRKS: v[i].REMARKS,
                U_PLATE_NUMBER: v[i].PLATE_NUMBER,
                U_REQUESTED_SACKS: v[i].NUMBER_OF_REQUESTED_BAGS,
                U_HLPR_NAME: v[i].HELPER_NAME,
                U_DRVR_NAME: v[i].DRIVER_NAME,
                U_EMPTY_SACKS: v[i].NUMBER_OF_EMPTY_BAGS,
                U_SACKS: v[i].NUMBER_OF_BAGS,
                U_SCHEDULED_DATE_AND_TIME: date,
                U_SCHEDULED_DATE: moment(v[i].SCHEDULED_DATE).format("YYYY-MM-DD"),
                U_SCHEDULED_TIME: v[i].SCHEDULED_TIME,
                TRANSACTION_COMPANY_ID: v[i].TRANSACTION_COMPANY_ID,
                U_ARRIVAL: v[i].U_ARRIVAL,
                U_DEPARTURE: v[i].U_DEPARTURE,
                U_TIME_START: v[i].U_TIME_START,
                U_TIME_END: v[i].U_TIME_END,
                U_UNLOADING: v[i].U_UNLOADING,
                U_REMARKS: v[i].U_REMARKS,
              });
            }
          }
          this.isBusy = false;
          console.log("transactions",this.items);
        } else {
          this.isBusy = false;
        }

      } catch (e) {
        console.log(e);
        this.isBusy = false;
      }
      this.isBusy = false;
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