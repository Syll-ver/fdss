<template>
  <div class="component-margin">
    <Receipt ref="Receipt" v-show="false" />
    <!-- Main table -->
    <b-row>
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
    </b-row>

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
              <b-form-checkbox id="pending_supp_stat" value="Pending"
                >Pending</b-form-checkbox
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
      @filtered="filterStatus"
    >
      <template v-slot:cell(U_STATUS)="row">
        <b-badge
          v-show="row.item.U_STATUS === 'Pending'"
          class="table-badge"
          pill
          variant="pending"
          
          >{{ row.item.U_STATUS }}
        </b-badge>

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

      <template v-slot:cell(actions)="row">
        <div v-if="row.item.U_STATUS === 'Cancelled'">
       

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

        </div>
        <div v-else>
           <b-button
          variant="print"
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
          title="Cancel Transaction"
          @click="deleted(row.item)"
        >
          <font-awesome-icon icon="ban" />
        </b-button>
      
        </div>
      </template>

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

    <!-- Add Transaction -->

    <b-modal
      size="m"
      header-bg-variant="success"
      header-text-variant="light"
      body-bg-variant="gray"
      id="add-transaction-modal"
      scrollable
    >
      <template v-slot:modal-title>
        <h6>New Delivery Receipt</h6>
      </template>

      <!-- <b-row>
        <b-col cols="8">

        </b-col>

        <b-col cols="4"> -->
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
              <option value="Pick-up">Pick-up</option>
              <option value="Delivery">Delivery</option>
            </b-form-select>
             <small class="text-left">Commodity</small>
            <b-form-select
              id="commodity"
              v-model="U_CMMDTY"
              class="form-text"
            >
              
              <option value="Corn">Corn</option>
              <option value="Corn on Cobs">Corn on Cobs</option>
              <option value="Grains">Grain</option>
              <option value="Napier">Napier</option>
              
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
              v-model="U_FRMR_NAME"
              
            >
              <option value="Jesse Christian Bascon">Jesse Christian Bascon</option>
              <option value="Jose Trevor">Jose Trevor</option>
              <option value="John Dela Cruz">John Dela Cruz</option>
            </b-form-select>

            <small class="text-left">Address</small>
            <b-form-input
              id="customer_no"
              class="form-text"
              v-model="U_FRMR_ADD"
            />
            <b-row>
            <b-col cols="6">
             <small class="text-left">Helper's Name</small>
              <b-form-input
              id="helper_name"
              class="form-text"
              v-model="U_HLPR_NAME"
            />
            </b-col>
            <b-col cols="6">
            <small class="text-left">Driver's Name</small>
            <b-form-input
              id="tendered"
              v-model="U_DRVR_NAME"
              class="form-text"
            >
            </b-form-input>
            </b-col>
            </b-row>
          
            <small class="text-left">Plate Number</small>
            <b-form-input
              id="tendered"
              v-model="U_PLATE_NUMBER"
              class="form-text"
            >
              <!-- <option value="XYQ-0931">XYQ-0931</option>
              <option value="MKJ-2912">MKJ-2912</option> -->
            </b-form-input>
           
            <!-- <small class="text-left">Truck Type</small>
            <b-form-select
              id="tendered"
              v-model="U_TRUCK_TYPE"
              class="form-text"
            >
              <option value="Pick-Up">Suzuki Pick-Up</option>
              <option value="Canter 4 wheeler truck">Canter 4 wheeler truck</option>
            </b-form-select> -->
         

            <b-row v-if="U_TRANSACTION_TYPE === 'Delivery'">
            <b-col cols="6">
            <small class="text-left"># of Sacks</small>
            <b-form-input type="number" id="sacks" class="form-text" />
            </b-col>
            <b-col cols="6">
            <small class="text-left"># of Empty Sacks</small>
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
        <!-- </b-col>
      </b-row> -->

      <template v-slot:modal-footer="{cancel }">
        <b-button
          id="add_action_modal"
          size="sm"
          class="button-style"
          variant="success"
          @click="addActionTable(),$bvModal.hide('add-transaction-modal')"
          :disabled="showButtonLoading === true"
        >
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
      header-bg-variant="success"
      header-text-variant="light"
      body-bg-variant="gray"
      id="edit-transaction-modal"
      scrollable
    >
      <template v-slot:modal-title>
        <h6>Edit Transaction</h6>
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
            <small class="text-left">Helper's Name</small>
              <b-form-input
              id="helper_name"
              class="form-text"
              v-model="U_HLPR_NAME"
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
            <small class="text-left"># of Empty Sacks</small>
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


       

      <template v-slot:modal-footer="{cancelEdit }">
        <b-button
          id="edit_action_modal"
          size="sm"
          class="button-style"
          variant="success"
          @click="editActionTable()"
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
            <small class="text-left"># of Empty Sacks</small>
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
      showReceipt: false,
      U_TRANSACTION_TYPE: null,
      // Datepicker
      filter: null,
      filterOn: [],
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
          U_TRX_NO: "CDF-00001",
          U_CMMDTY: "Corn",
          U_FRMR_NAME: "Jose Trevor",
          U_CRTD_BY: "Zaina Fuentespina",
          U_DRVR_NAME: "Jon Magnolia",
          U_DTE_CRTD: "March 09, 2020",
          U_STATUS: "Pending"
        },
         {
          U_TRANSACTION_TYPE: "Pick-Up",
          U_TRX_NO: "CDF-00002",
          U_CMMDTY: "Corn",
          U_FRMR_NAME: "John Dela Cruz",
          U_CRTD_BY: "Zaina Fuentespina",
          U_DRVR_NAME: "Jon Magnolia",
          U_DTE_CRTD: "March 10, 2020",
          U_STATUS: "Cancelled"
        },
         {
          U_TRANSACTION_TYPE: "Pick-Up",
          U_TRX_NO: "CDF-00003",
          U_CMMDTY: "Corn on Cobs",
          U_FRMR_NAME: "Jimmy Dela Cruz",
          U_CRTD_BY: "Zaina Fuentespina",
          U_DRVR_NAME: "Jon Magnolia",
          U_DTE_CRTD: "March 10, 2020",
          U_STATUS: "Pending"
        }
      ],

      // ORFields: [
      //   {
      //     key: "U_OR_NO",
      //     label: "OR No.",
      //     sortable: true,
      //     sortDirection: "desc"
      //   },
      //   {
      //     key: "U_OR_AMOUNT",
      //     label: "Amount",
      //     sortable: true,
      //     sortDirection: "desc"
      //   },
      // ],

      deliveryreceiptFields: [
         
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
          key: "U_DRVR_NAME",
          label: "Driver's Name",
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

        { key: "actions", label: "Actions", class: "text-center" }
      ],

      // ItemFields: [
      //   {
      //     key: "line_number",
      //     label: "Line No.",
      //     sortable: true,
      //     sortDirection: "desc"
      //   },

      //   {
      //     key: "item_id",
      //     label: "Item ID",
      //     sortable: true,
      //     sortDirection: "desc"
      //   },

      //   {
      //     key: "description",
      //     label: "Description",
      //     sortable: true,
      //     sortDirection: "desc"
      //   },

      //   {
      //     key: "price",
      //     label: "Price",
      //     sortable: true,
      //     sortDirection: "desc"
      //   },

      //   {
      //     key: "quantity",
      //     label: "Quantity",
      //     sortable: true,
      //     sortDirection: "desc"
      //   }
      // ],

      // InvoiceFields: [
      //   {
      //     key: "transaction_number",
      //     label: "Transaction No.",
      //     sortable: true,
      //     sortDirection: "desc"
      //   },

      //   {
      //     key: "item",
      //     label: "Item",
      //     sortable: true,
      //     sortDirection: "desc"
      //   },

      //   {
      //     key: "Amount Pay",
      //     label: "Amount Pay",
      //     sortable: true,
      //     sortDirection: "desc"
      //   }
      // ],

      // CheckFields: [
      //   {
      //     key: "U_CHECK_TYPE",
      //     label: "Check Type",
      //     sortable: true,
      //     sortDirection: "desc"
      //   },

      //   {
      //     key: "U_CHECK_NO",
      //     label: "Check No.",
      //     sortable: true,
      //     sortDirection: "desc"
      //   },

      //   {
      //     key: "U_CHECK_BANK",
      //     label: "Bank",
      //     sortable: true,
      //     sortDirection: "desc"
      //   },

      //   {
      //     key: "U_CHECK_AMOUNT",
      //     label: "Amount",
      //     sortable: true,
      //     sortDirection: "desc"
      //   }
      // ],

      currentPage: 1,
      perPage: 10,
      pageOptions: [5, 10, 50],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc"
    };
  },

  methods: {
    addActionTable: function() {
      this.deliveryreceipt.push({
          U_TRANSACTION_TYPE: this.U_TRANSACTION_TYPE,
          U_TRX_NO: "CDF-00005",
          U_CMMDTY: this.U_CMMDTY,
          U_FRMR_NAME: this.U_FRMR_NAME,
          U_CRTD_BY: "Luis Belmonte",
          U_DRVR_NAME: this.U_DRVR_NAME,
          U_DTE_CRTD: "March 10, 2020",
          U_STATUS: "Pending",

      });
      this.clear()

    },
    clear: function(){
        this.U_TRANSACTION_TYPE= null,
          this.U_TRX_NO= null,
          this.U_CMMDTY= null,
          this.U_FRMR_NAME= null,
          this.U_FRMR_ADD= null,
          this.U_CRTD_BY= null,
          this.U_DRVR_NAME= null,
          this.U_DTE_CRTD= null,
          this.U_STATUS= null,
          this.U_PLATE_NUMBER= null,
          this.U_TRUCK_TYPE= null
    },
    // showTab() {
    //   switch (this.U_TRANSACTION_TYPE) {
    //     case "soa":
    //       this.U_RECEIPT_TYPE = "Standard";
    //       break;
    //     case "nonsale":
    //       this.U_RECEIPT_TYPE = "Miscellaneous";
    //       break;
    //   }
    // },

    // fillSubgroup() {
    //   this.U_SUB_GROUP = "BFI Delivery Receipt";
    // },
    // fetchInvoiceDetails() {

    //   this.U_CUSTOMER_NAME = "Genevie Mindajao";
    //   this.U_TRANSACTION_DATE = "2020-08-08";
    //   this.U_DUE_DATE = "2020-18-08";
    //   this.U_AMOUNT_DUE = 10000;
    //   this.U_AMOUNT_BALANCE = 10000;
    //   this.U_TYPE = "KCC Rent";
    //   this.U_AMOUNT_PAY = "10000"

    // },
    printReceipt(data) {
      // this.showReceipt = true;
      this.$refs.Receipt.print();
      console.log(data);
      // data.U_STATUS = "Printed";
    },
    edit(data) {
      this.$bvModal.show("edit-transaction-modal");
      // data.U_STATUS = "Completed";
    },
    deleted(data) {
      data.U_STATUS = "Cancelled";
      
    }
  },
      onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },



  // Date Picker

    resetDate() {
      this.datePicker.startDate = moment().format("MMM DD, YYYY");
      this.datePicker.endDate = moment().format("MMM DD, YYYY");

      this.$store
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
