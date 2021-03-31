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

    <b-alert
      id="alert_action"
      class="alerticon"
      :show="alert1.showAlert1"
      dismissible
      :variant="alert1.variant1"
      @dismissed="alert1.showAlert1 = null"
    >
      <font-awesome-icon
        :icon="alert1.variant1 == 'warning' ? 'exclamation' : 'check-circle'"
        class="mr-1 alerticon"
      />
      {{ alert1.message1 }}
    </b-alert>
    <Loading v-if="showLoading" />

    <Receipt ref="Receipt" v-show="false" />
    <b-row>
      <b-col cols="3" class="mt-3">
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

      <b-col class="mt-3">
        <b-input-group size="sm">
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
            size="sm"
            style="height:2rem; font-size:12px"
          >
            <div id="actvty_date" slot="input" style="height:2rem; font-size:14px;">
              {{ datePicker.startDate }} - {{ datePicker.endDate }}
            </div>
          </date-range-picker>
          <b-input-group-append style="height:2rem; font-size:12px">
            <b-button @click="resetDate" id="date-reset" style="font-size:12px"
              >Reset</b-button
            >
          </b-input-group-append>
        </b-input-group>
        
      </b-col>

      <b-col class="mt-3">
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
         
                   <b-form-checkbox id="Biotech" value="BIOTECH_FARMS_INC_DEV_INTEG_TESTING"
              >Biotech</b-form-checkbox
            >
            <b-form-checkbox id="revive" value="REVIVE_DEV_INTEG_TESTING"
              >REvive</b-form-checkbox
            >
          </b-form-checkbox-group> -->
        </b-dropdown>
      </b-col>

      <!-- <b-row> -->
      <b-col align="right">
        <b-button
          id="create"
          variant="biotech"
          class="button-style mt-3"
          size="sm"
          @click="$bvModal.show('add-transaction-modal')"
        >
          <font-awesome-icon icon="plus" class="mr-1" />Create Delivery Slip
        </b-button>
      </b-col>
    <!-- </b-row> -->
    </b-row>

    <!-- Main table element -->
    <b-table
      id="delivery_receipt_table"
      show-empty
      class="table-style"
      scrollable
      sticky-header
      no-border-collapse
      responsive
      :busy="isBusy"
      :items="filterItems"
      :filter="filter"
      :filterIncludedFields="filterOn"
      :fields="itemsFields"
      :current-page="currentPage"
      :per-page="perPage"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      :tbody-tr-class="rowClassMain"
      @filtered="onFiltered"
    >
    <template #table-busy>
      <div class="text-center text-danger my-2">
        <b-spinner small class="align-middle"  variant="dark">
        </b-spinner>
        <span class="loading_spinner">Loading...</span>
      </div>
    </template>

      <template v-slot:cell(U_STATUS)="row">
        <b-badge
          v-show="row.item.U_STATUS === 'Pending'"
          class="table-badge"
          pill
          variant="pending"
          >{{ row.item.U_STATUS }}</b-badge
        >

        <b-badge
          v-show="row.item.U_STATUS === 'Printed'"
          class="table-badge"
          pill
          variant="edit"
          >{{ row.item.U_STATUS }}</b-badge
        >

        <!--  <b-badge
          v-show="row.item.U_STATUS === 'Completed'"
          class="table-badge"
          pill
          variant="completed"
          >{{ row.item.U_STATUS }}
        </b-badge>-->
      </template>

      <template v-slot:cell(actions)="row">
        <div v-if="row.item.U_STATUS === 'Pending'">
          <b-button
            variant="print"
            id="print"
            class="table-button"
            size="sm"
            @click="printed(row)"
            v-b-tooltip.hover
            title="Print Delivery Slip"
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
            @click="show(row.item)"
            v-b-tooltip.hover
            title="View Delivery Slip"
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
            @click="cancel(row.item)"
          >
            <font-awesome-icon icon="ban" />
          </b-button>

          <!-- @click="$bvModal.show('view-transaction-modal')" -->
        </div>
        <div v-else>
          <b-button
            variant="print"
            id="print"
            class="table-button"
            size="sm"
            @click="printed(row.item)"
            v-b-tooltip.hover
            title="Print Delivery Slip"
          >
            <font-awesome-icon icon="print" />
          </b-button>

          <b-button
            variant="secondary"
            id="view"
            class="table-button"
            size="sm"
            @click="show(row.item)"
            v-b-tooltip.hover
            title="View Delivery Slip"
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
            @click="cancel(row.item)"
          >
            <font-awesome-icon icon="ban" />
          </b-button>
        </div>
      </template>
    </b-table>

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
        <div size="sm" style="color: gray; font-size: 11.5px;">{{ bottomLabel }}</div>
      </b-col>
      <b-col>
        <b-pagination
          id="delivery-pagination"
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

    <!-- Confirm Cancel -->
    <b-modal
      size="sm"
      header-bg-variant="biotech"
      header-text-variant="light"
      id="bv-modal-confirmCancel"
      class="modal-small"
      no-close-on-backdrop
      hide-header-close
    >
      <template v-slot:modal-title>
        <h6>Confirmation Message</h6>
      </template>
      <h6>Are you sure?</h6>
      <div style="font-size: 13px">
        This will automatically 'Cancel' your created Delivery Slip.
      </div>
      <br /><b-form-textarea
        id="remarks"
        v-model="remarks"
        placeholder="Please Input Remarks..."
        rows="3"
        max-rows="6"
      ></b-form-textarea>
      <template v-slot:modal-footer="{}">
        <b-button
          id="btn_submit_request"
          size="sm"
          variant="biotech"
          @click="confirmCancel()"
          class="button-style"
          >Yes</b-button
        >
        <b-button
          id="btn_cancel_requestSupplier"
          size="sm"
          @click="close1()"
          class="button-style"
          >No</b-button
        >
      </template>
    </b-modal>

    <b-modal
      size="sm"
      header-bg-variant="biotech"
      header-text-variant="light"
      id="bv-modal-confirmPrint"
      class="modal-small"
      no-close-on-backdrop
      hide-header-close
    >
      <template v-slot:modal-title>
        <h6>Confirmation Message</h6>
      </template>
      <h6>Are you sure you want to print this Delivery Slip?</h6>
      <div style="font-size: 13px">
        You cannot UPDATE and CANCEL anymore the transaction after doing this.
      </div>
      <template v-slot:modal-footer="{}">
        <b-button
          id="btn_submit_request"
          size="sm"
          variant="biotech"
          @click="printed()"
          class="button-style"
          >Yes</b-button
        >
        <b-button
          id="btn_cancel_requestSupplier"
          size="sm"
          @click="close()"
          class="button-style"
          >No</b-button
        >
      </template>
    </b-modal>
    <!-- Add Transaction -->

    <b-modal
      size="large"
      header-bg-variant="biotech"
      header-text-variant="light"
      body-bg-variant="gray"
      id="add-transaction-modal"
      hide-header-close
      no-close-on-backdrop
      no-scrollable
    >
      <template v-slot:modal-title>
        <h6>New Delivery Slip</h6>
      </template>

      <b-card class="card-shadow">
        <small>Schedule Date</small>
        <br />
        <date-time-picker v-bind="datetimeScheme" @onChange="onChangeHandler" />

        <small class="text-left">Transaction Type</small>
        <b-form-select
          id="transact_type"
          v-model="U_TRANSACTION_TYPE"
          class="form-text"
          :options="transaction_types"
          required
        ></b-form-select>
        <small class="text-left">Item</small>
        <multiselect
          id="commodity"
          placeholder="Select Item"
          v-model="U_CMMDTY.value"
          class="form-text"
          :options="commodity"
          @input="getUOM"
          required
          label="text"
          track-by="text"
        ></multiselect>
        <small class="text-left">Unit of Measure</small>
        <b-form-select
          id="uom"
          v-model="U_UOM"
          class="form-text"
          :options="unit"
          required
        ></b-form-select>

        <small class="text-left">Farmer's Name</small>
        <multiselect
          id="customer"
          :options="farmer"
          placeholder="Select Farmer"
          class="form-text"
          v-model="U_FRMR_NAME"
          label="text"
          track-by="text"
          @input="test"
          required
        ></multiselect>
        <!-- <b-form-select
          id="customer"
          class="form-text"
          v-model=" U_FRMR_NAME"
          :options="farmer"
          @change="test"    
          required
        ></b-form-select> -->

        <small class="text-left" v-show="companyCode == '4360' " >Plot Code</small>
        <multiselect
          v-show="companyCode == '4360' "
          id="plot_code"
          :options="plotCode"
          placeholder="Select Plot Code"
          class="form-text"
          v-model="U_APP_ProjCode"
          label="text"
          track-by="text"
          @input="getPlotAddress"
          required
        ></multiselect>

        <small class="text-left">Address</small>
        <b-form-input
          disabled
          id="farmer_add"
          class="form-text"
          v-model="U_FRMR_ADD"
        />

        <b-row>
          <b-col cols="6">
            <small class="text-left">Helper's Name</small>
            <b-form-input
              id="helper_name"
              placeholder="First Name"
              class="form-text"
              v-model="U_HLPR_FNAME"
              required
            />
          </b-col>
          <b-col cols="6">
            <small class="text-left">&nbsp;</small>
            <b-form-input
              id="tendered"
              placeholder="Last Name"
              v-model="U_HLPR_LNAME"
              class="form-text"
              required
            ></b-form-input>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="6">
            <small class="text-left">Driver's Name</small>
            <b-form-input
              id="helper_name"
              placeholder="First Name"
              class="form-text"
              v-model="U_DRVR_FNAME"
              required
            />
          </b-col>
          <b-col cols="6">
            <small class="text-left">&nbsp;</small>
            <b-form-input
              id="tendered"
              placeholder="Last Name"
              v-model="U_DRVR_LNAME"
              class="form-text"
              required
            ></b-form-input>
          </b-col>
        </b-row>

        <small class="text-left">Plate Number</small>
        <b-form-input
          id="tendered"
          v-model="U_PLATE_NUMBER"
          class="form-text"
          required
        ></b-form-input>
        <b-row v-if="U_TRANSACTION_TYPE === '1'">
          <b-col cols="12" v-if="U_UOM.UomName === 'BAG'">
            <small class="text-left"># of Requested Bags</small>
            <b-form-input
              id="requestedsacks"
              type="number"
              v-model="U_REQUESTED_SACKS"
              class="form-text"
              required
            ></b-form-input>
          </b-col>
        </b-row>
        <b-row v-if="U_UOM.UomName === 'TRUCK LOAD'">
          <b-col cols="12">
            <small class="text-left">Quantity</small>
            <b-form-input
              id="Bags"
              type="number"
              v-model="U_SACKS"
              class="form-text"
              required
            ></b-form-input>
          </b-col>
        </b-row>
        <b-row v-else></b-row>

        <b-row v-if="U_TRANSACTION_TYPE === '2'">
          <b-col cols="6" v-if="U_UOM.UomName === 'BAG'">
            <small class="text-left"># of Requested Bags</small>
            <b-form-input
              id="requestedsacks"
              type="number"
              v-model="U_REQUESTED_SACKS"
              class="form-text"
              required
            ></b-form-input>
            <small class="text-left"># of Filled Bags</small>
            <b-form-input
              type="number"
              id="Bags"
              class="form-text"
              v-model="U_SACKS"
            />
          </b-col>
          <!-- <b-col cols="6" v-else>
            <small class="text-left">Quantity</small>
            <b-form-input type="number" id="Bags" class="form-text" v-model="U_SACKS" />
          </b-col> -->
          <b-col cols="6" v-if="U_UOM.UomName === 'BAG'">
            <small class="text-left"># of Empty Bags</small>
            <b-form-input
              type="number"
              id="emptysacks"
              class="form-text"
              v-model="U_EMPTY_SACKS"
            />
          </b-col>
          <b-col cols="6" v-else></b-col>
        </b-row>
        <b-row v-else> </b-row>
      </b-card>

      <template v-slot:modal-footer="{}">
        <b-button
          id="add_action_modal"
          size="sm"
          class="button-style"
          variant="biotech"
          @click="saveDR()"
          :disabled="showLoading === true"
        >
          <!-- @click="addActionTable(),$bvModal.hide('add-transaction-modal')" -->
          <!-- <b-spinner small v-show="showLoading === true" small label="Spinning"></b-spinner> -->
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

    <!-- Edit Transaction -->

    <b-modal
      size="m"
      header-bg-variant="biotech"
      header-text-variant="light"
      body-bg-variant="gray"
      id="edit-transaction-modal"
      no-close-on-backdrop
      hide-header-close
      no-scrollable
    >
      <template v-slot:modal-title>
        <h6>Update Transaction</h6>
      </template>

      <b-card class="card-shadow">
        <!-- <small class="text-left">Company</small>
        <br />
        <b> {{ this.TRANSACTION_COMPANY }}</b>
         <b-form-select
          id="company"
          v-model="selectedcompany"
          class="form-text"
          :options="companyList"
          @change="getCommodity(), getFarmer()"
          required
        ></b-form-select> {{this.TRANSACTION_COMPANY_ID}} 
        <br /> -->

        <small>Schedule Date</small>

        <date-time-picker
          v-bind="datetimeScheme2"
          @onChange="onChangeHandler"
        />

        <small class="text-left">Transaction Type</small>
        <b-form-select
          id="transact_type"
          v-model="U_TRANSACTION_TYPE"
          class="form-text"
          :options="transaction_types"
        ></b-form-select>
        <small class="text-left">Item</small>
        <multiselect
          id="commodity"
          placeholder="Select Item"
          v-model="U_CMMDTY"
          class="form-text"
          :options="commodity"
          @input="updateUOM"
          required
          label="text"
          track-by="text"
          disabled
        ></multiselect>
        <!-- <b-form-select
          id="commodity"
          v-model=" U_CMMDTY"
          class="form-text"
          :options="commodity"
          @input="getUOM"
          disabled
        ></b-form-select> -->
        <small class="text-left">Unit of Measure</small>

        <b-form-select
          id="uom"
          v-model="U_UOM"
          class="form-text"
          :options="unit"
          required
        ></b-form-select>

        <small class="text-left">Farmer's Name</small>
        <b-form-input
          id="customer"
          class="form-text"
          v-model="U_FRMR_NAME"
          disabled
        ></b-form-input>

        <small class="text-left">Address</small>
        <b-form-input
          id="farmer_add"
          class="form-text"
          v-model="U_FRMR_ADD"
          disabled
        />

        <small v-show="U_APP_ProjCode" class="text-left">Plot Code</small>
        <b-form-input
          v-show="U_APP_ProjCode"
          disabled
          id="farmer_plot_code"
          class="form-text"
          v-model="U_APP_ProjCode"
        />

        <b-row>
          <b-col cols="6">
            <small class="text-left">Helper's Name</small>
            <b-form-input
              id="helper_name"
              placeholder="First Name"
              class="form-text"
              v-model="U_HLPR_FNAME"
            />
          </b-col>
          <b-col cols="6">
            <small class="text-left">&nbsp;</small>
            <b-form-input
              id="tendered"
              placeholder="Last Name"
              v-model="U_HLPR_LNAME"
              class="form-text"
            ></b-form-input>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="6">
            <small class="text-left">Driver's Name</small>
            <b-form-input
              id="helper_name"
              placeholder="First Name"
              class="form-text"
              v-model="U_DRVR_FNAME"
            />
          </b-col>
          <b-col cols="6">
            <small class="text-left">&nbsp;</small>
            <b-form-input
              id="tendered"
              placeholder="Last Name"
              v-model="U_DRVR_LNAME"
              class="form-text"
            ></b-form-input>
          </b-col>
        </b-row>

        <small class="text-left">Plate Number</small>
        <b-form-input
          id="tendered"
          v-model="U_PLATE_NUMBER"
          class="form-text"
        ></b-form-input>

        <b-row v-if="U_TRANSACTION_TYPE === '1'">
          <b-col cols="12" v-if="U_UOM.UomName === 'BAG'">
            <small class="text-left"># of Requested Bags</small>
            <b-form-input
              id="requestedsacks"
              type="number"
              v-model="U_REQUESTED_SACKS"
              class="form-text"
              required
            ></b-form-input>
          </b-col>
        </b-row>
        <b-row v-if="U_UOM.UomName === 'TRUCK LOAD'">
          <b-col cols="12">
            <small class="text-left">Quantity</small>
            <b-form-input
              id="Bags"
              type="number"
              v-model="U_SACKS"
              class="form-text"
              required
            ></b-form-input>
          </b-col>
        </b-row>
        <b-row v-else></b-row>

        <b-row v-if="U_TRANSACTION_TYPE === '2'">
          <b-col>
            <small class="text-left"># of Requested Bags</small>
            <b-form-input
              id="requestedsacks"
              v-model="U_REQUESTED_SACKS"
              class="form-text"
              required
            ></b-form-input>
          </b-col>
          <b-col cols="6" v-if="U_UOM.UomName === 'BAG'">
            <small class="text-left"># of Filled Bags</small>
            <b-form-input
              type="number"
              id="Bags"
              class="form-text"
              v-model="U_SACKS"
            />
          </b-col>
          <!-- <b-col cols="6" v-else>
            <small class="text-left">Quantity</small>
            <b-form-input type="number" id="Bags" class="form-text" v-model="U_SACKS" />
          </b-col> -->
          <b-col cols="6" v-if="U_UOM.UomName === 'BAG'">
            <small class="text-left"># of Empty Bags</small>
            <b-form-input
              type="number"
              id="emptysacks"
              class="form-text"
              v-model="U_EMPTY_SACKS"
            />
          </b-col>
          <b-col cols="6" v-else></b-col>
        </b-row>
        <b-row v-else> </b-row>
      </b-card>

      <template v-slot:modal-footer="{}">
        <b-button
          id="edit_action_modal"
          size="sm"
          class="button-style"
          variant="biotech"
          @click="updateDR(U_TRX_ID)"
          :disabled="showLoading === true"
        >
          <!-- <b-spinner small v-show="showLoading === true" small label="Spinning"></b-spinner>Save -->
          Save
        </b-button>
        <b-button
          id="cancel_edit_action_modal"
          size="sm"
          class="button-style"
          @click="close"
          >Cancel</b-button
        >
      </template>
    </b-modal>

    <!-- Edit Transaction -->

    <!-- View Transaction -->

    <b-modal
      size="m"
      header-bg-variant="biotech"
      header-text-variant="light"
      body-bg-variant="gray"
      id="view-transaction-modal"
      no-close-on-backdrop
      hide-header-close
      scrollable
    >
      <template v-slot:modal-title>
        <h6>View Delivery Slip</h6>
      </template>

      <b-card class="card-shadow">
        <div id="app" ref="testHtml">
          <div id="receipt">
            <b-row>
              <div class="mr-4" style="width:31rem; height:40rem">
                <span>
                  <b-img src="/logo1.png" class="receipt-logo" center />
                </span>

                <center>
                  <span>DELIVERY SLIP | {{ U_TRANSACTION_TYPE }}</span>
                  <br />
                  <span>
                    <small>Date: {{ U_DTE_CRTD }}</small>
                  </span>
                </center>

                <br />

                <span>Transaction Number : {{ U_TRX_NO }}</span>
                <br />
                <span>Schedule : {{ U_SCHEDULED_DATE_AND_TIME }}</span>
                <br />
                <br />

                <b-row>
                  <b-col cols="4">
                    <div>
                      <span>Farmer's Name</span>
                    </div>
                    <div>
                      <span>Address</span>
                    </div>
                  </b-col>
                  <b-col cols="8">
                    <div class="dotted-border">
                      <span>: {{ U_FRMR_NAME }}</span>
                    </div>
                    <div class="dotted-border">
                      <span class="mt-1">: {{ U_FRMR_ADD }}</span>
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
                    <span>Item</span>
                  </b-col>

                  <b-col cols="8">
                    <div class="dotted-border">
                      <span>: {{ U_CMMDTY }}</span>
                    </div>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col cols="4">
                    <span>Driver's Name</span>
                  </b-col>

                  <b-col cols="8">
                    <div class="dotted-border">
                      <span>: {{ U_DRVR_NAME }}</span>
                    </div>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col cols="4">
                    <span>Plate Number</span>
                  </b-col>

                  <b-col cols="8">
                    <div class="dotted-border">
                      <span>: {{ U_PLATE_NUMBER }}</span>
                    </div>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col cols="4">
                    <span>Requested Bags</span>
                  </b-col>

                  <b-col cols="8">
                    <div class="dotted-border">
                      <span>: {{ U_REQUESTED_SACKS }}</span>
                    </div>
                  </b-col>
                </b-row>
                <div
                  v-if="
                    U_TRANSACTION_TYPE === 'Pick-up' && U_UOM.UomEntry === 'BAG'
                  "
                >
                  <b-row>
                    <b-col cols="4">
                      <span>Quantity</span>
                    </b-col>

                    <b-col cols="8">
                      <div class="dotted-border">
                        <span>:</span>
                      </div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="4">
                      <span>Empty Bags</span>
                    </b-col>

                    <b-col cols="8">
                      <div class="dotted-border">
                        <span>:</span>
                      </div>
                    </b-col>
                  </b-row>
                </div>

                <div
                  v-else-if="
                    U_TRANSACTION_TYPE === 'Pick-up' &&
                      U_UOM.UomName === 'TRUCK LOAD'
                  "
                >
                  <b-row>
                    <b-col cols="4">
                      <span>Quantity</span>
                    </b-col>

                    <b-col cols="8">
                      <div class="dotted-border">
                        <span>: {{ U_SACKS }} {{ U_UOM.UomEntry }}</span>
                      </div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="4">
                      <span>Empty Bags</span>
                    </b-col>

                    <b-col cols="8">
                      <div class="dotted-border">
                        <span>: {{ U_EMPTY_SACKS }}</span>
                      </div>
                    </b-col>
                  </b-row>
                </div>

                <div v-else>
                  <b-row>
                    <b-col cols="4">
                      <span>Quantity</span>
                    </b-col>

                    <b-col cols="8">
                      <div class="dotted-border">
                        <span>: {{ U_SACKS }} {{ U_UOM.UomEntry }}</span>
                      </div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="4">
                      <span>Empty Bags</span>
                    </b-col>

                    <b-col cols="8">
                      <div class="dotted-border">
                        <span>: {{ U_EMPTY_SACKS }}</span>
                      </div>
                    </b-col>
                  </b-row>
                </div>

                <!-- <b-row>
          <b-col cols="6">           
            <span style="font-size:9px">
              {{U_FRMR_NAME}}
            </span>
          </b-col>
          <b-col cols="6" text-align="center">           
            <span style="font-size:9px">
              {{U_HLPR_NAME}}
            </span>
          </b-col>
              </b-row>-->

                <br />
                <b-row class="my-2">
                  <b-col cols="6">
                    <center>
                      <span style="font-size:9px">{{ U_FRMR_NAME }}</span>
                      <br />
                      <span
                        style="font-size:9px;border-top-style: solid; border-width:1px;margin:0;padding:0"
                      >
                        <B>
                          &nbsp;&nbsp; FARMER'S NAME & SIGNATURE &nbsp;&nbsp;
                        </B>
                      </span>
                    </center>
                  </b-col>

                  <b-col cols="6">
                    <center>
                      <span style="font-size:9px;margin:0;padding:0">{{
                        U_HLPR_NAME
                      }}</span>
                      <br />
                      <span
                        style="font-size:9px;border-top-style: solid; border-width:1px;margin:0;padding:0"
                      >
                        <B>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          REVIEWED BY
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </B>
                      </span>
                    </center>
                  </b-col>
                </b-row>

                <center>
                  <span style="font-size:9px"
                    >&nbsp;&nbsp;{{ U_CRTD_BY }}&nbsp;&nbsp;</span
                  >
                  <br />
                  <span
                    style="border-top-style: solid; border-width:1px;font-size:9px;"
                  >
                    <b>
                      &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VERIFIED
                      BY &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </b>
                  </span>
                </center>
                <b-row style="float:right" class="mr-1 mt-1"></b-row>
                <br />
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
              </b-row>-->
              </div>
            </b-row>
          </div>
        </div>
      </b-card>

      <template v-slot:modal-footer="{}">
        <!-- <button class="btn btn-danger" @click="generatePdf">generate PDF</button> -->
        <b-button
          id="cancel_add_action_modal"
          size="sm"
          class="button-style"
          @click="close1"
          >Close</b-button
        >
      </template>
    </b-modal>
    <!-- <alert/> -->
    <!-- ALERT SUCCESSFUL -->
    <b-modal
      id="pin"
      no-close-on-backdrop
      hide-header-close
      header-bg-variant="biotech"
      header-text-variant="light"
    >
      <template v-slot:modal-title>
        <h6>Security Purposes</h6>
      </template>
      <div class="container1">
        <h5>Enter Your Pincode</h5>
        <div class="pinBox">
          <input
            id="input-code"
            class="pinEntry"
            ref="pins"
            v-model="pincode"
            type="password"
            maxlength="4"
            name="pin"
            pattern="[0-9]{4}"
          />
        </div>
      </div>

      <template v-slot:modal-footer>
        <p class="pinError">{{ pinError }}</p>
        <b-button
          id="save"
          size="sm"
          variant="biotech"
          @click="confirmpin()"
          style="font-size:13px"
          >Save</b-button
        >
        <b-button
          id="cancel"
          size="sm"
          @click="closePinModal()"
          style="font-size:13px;border: 0px;"
          >Cancel</b-button
        >
      </template>
    </b-modal>

    <!-- signature modal -->
    <b-modal
      id="signature"
      no-close-on-backdrop
      header-bg-variant="biotech"
      header-text-variant="light"
      size="xl"
      hide-header-close
    >
      <template v-slot:modal-title>
        <h6>Draw Signature</h6>
      </template>

      <div>
        <div class="col-12">
          <VueSignaturePad
            id="signature"
            width="100%"
            height="450px"
            ref="signaturePad"
            :options="{
              onBegin: () => {
                $refs.signaturePad.resizeCanvas();
              }
            }"
          />
        </div>
        <div class="col-3 mt-2">
          <b-button
            variant="dark"
            style="font-size:13px;border: 0px;"
            @click="clearSignature"
            >Undo</b-button
          >
        </div>
      </div>

      <template v-slot:modal-footer>
        <b-button
          id="rmaf-verify"
          size="sm"
          variant="biotech"
          @click="addSignature()"
          style="font-size:13px"
          >Save</b-button
        >
        <b-button
          id="rmaf-verify-cancel"
          size="sm"
          @click="closeSignatureModal()"
          style="font-size:13px;border: 0px;"
          >Cancel</b-button
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
      <!-- <VueQrcode
        id="QRcode"
        type="String"
        :value="receiptData1"
      ></VueQrcode> -->
    </div>

    <!-- View Transaction -->
  </div>
</template>

<script>
// import { mapMutations } from "vuex";
// import { mapGetters } from "vuex";
import moment from "moment";
import axios from "axios";
import Receipt from "~/components/transaction/Receipt.vue";
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
import Loading from "~/components/Loading/Loading.vue";
import VueSignaturePad from "vue-signature-pad";
import "@lazy-copilot/datetimepicker/dist/datetimepicker.css";
import { DateTimePicker } from "@lazy-copilot/datetimepicker";
import Multiselect from "vue-multiselect";
import jsPDF from "jspdf";
import VueQrcode from "@chenfengyuan/vue-qrcode";
export default {
  components: {
    jsPDF,
    Multiselect,
    DateTimePicker,
    Receipt,
    DateRangePicker,
    Loading,
    VueSignaturePad,
    VueQrcode
  },
  async created() {
    this.companyCode = JSON.parse(localStorage.user_details).U_COMPANY_CODE;
    await this.getTransactions();
    await this.getCommodity();
    await this.getTransactionType();
    // await this.getFarmer();
    await this.getLocationIP();
    // await this.networkPrintInit();
    this.totalRows = this.items.length;
  },
  data() {
    return {
      isBusy: true,
      isPrinterAvailable: true,
      receiptData: {},
      receiptData1: {},
      qrString: null,
      data2: null,
      networkPrinter: null,
      selectedcompany: null,
      remarks: null,
      datetimeScheme: {
        singleDate: true,
        alignRight: true,
        timeFormat: "HH:mm",
        // id: 'U_SCHEDULED_DATE',
        label: "Select Date",
        required: true
      },

      datetimeScheme2: {
        startDate: null,
        singleDate: true,
        alignRight: true,
        timeFormat: "HH:mm",
        // id: 'U_SCHEDULED_DATE',
        label: "Select Date",
        required: true
      },
      plotCodes: [],
      U_SCHEDULED_DATE: null,
      U_SCHEDULED_TIME: null,
      filterStatus: ["Pick-up", "Delivery"],
      filterCompany: [],
      showLoading: false,
      alert: {
        showAlert: 0,
        variant: "biotech",
        message: ""
      },
      showReceipt: false,
      alert: {
        showAlert: 0,
        variant: "biotech",
        message: ""
      },
      alert1: {
        showAlert1: 0,
        variant1: "biotech",
        message1: ""
      },
      // U_PRICELIST:null,
      // pricelist:[],
      unit: [],
      TRANSACTION_COMPANY: null,
      U_UOM: { UomName: "", UomEntry: "" },
      U_TRANSACTION_TYPE: null,
      U_FRMR_NAME: null,
      U_FRMR_ADD: null,
      U_APP_ProjCode: null,
      U_FRMR_PLOTCODE: [],
      U_CMMDTY: { value: "", text: "" },
      U_DRVR_LNAME: null,
      U_DRVR_FNAME: null,
      U_HLPR_FNAME: null,
      U_HLPR_LNAME: null,
      U_PLATE_NUMBER: null,
      U_DTE_CRTD: null,
      U_CRTD_BY: null,
      U_TRX_NO: null,
      U_DRVR_NAME: null,
      U_SACKS: 0,
      U_REQUESTED_SACKS: 0,
      U_EMPTY_SACKS: 0,
      U_HLPR_NAME: null,
      U_SCHEDULED_DATE_AND_TIME: null,
      transaction_types: [],
      companyList: null,
      farmer: [],
      bfi_farmer: [],
      farmer_plotcode: [],
      farmerAdd: [],
      commodity: [],
      plotCode: [],
      status: "",
      // Datepicker
      opens1: "",
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
      items: [],
      itemsFields: [
        {
          key: "TRANSACTION_COMPANY",
          label: "Company",
          sortable: true
        },

        {
          key: "U_TRX_NO",
          label: "Transaction No.",
          sortable: true
        },

        {
          key: "U_TRANSACTION_TYPE",
          label: "Transaction Type",
          sortable: true
        },

        {
          key: "U_CMMDTY",
          label: "Commodity",
          sortable: true
        },

        {
          key: "U_UOM",
          label: "Unit of Measure",
          sortable: true
        },

        {
          key: "U_SACKS",
          label: "Quantity",
          sortable: true
        },

        {
          key: "U_FRMR_NAME",
          label: "Farmer's Name",
          sortable: true
        },

        {
          key: "U_CRTD_BY",
          label: "Created By",
          sortable: true
        },

        {
          key: "U_SCHEDULED_DATE_AND_TIME",
          label: "Date Scheduled",
          sortable: true
        },

        {
          key: "U_STATUS",
          label: "Status",
          sortable: true
        },

        { key: "actions", label: "Actions", class: "text-center" }
      ],
      signaturePath: null,
      pincode: null,
      pinError: null,
      totalRows: null,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15],
      sortBy: "U_SCHEDULED_DATE_AND_TIME",
      sortDesc: true,
      sortDirection: "asc",
      filter: "",
      filterOn: [],
      printerIP: null,
    };
  },
  computed: {
    filterItems() {
      let count = 0;
      this.totalRows = count;
      return this.items.filter(request => {
        if(this.filterStatus.includes(request.U_TRANSACTION_TYPE)) {
          count++;
          this.totalRows = count;
          return (request.U_TRANSACTION_TYPE.toLowerCase().match(this.filter.toLowerCase()) || request.U_CMMDTY.toLowerCase().match(this.filter.toLowerCase()) || request.U_FRMR_NAME.toLowerCase().match(this.filter.toLowerCase()) || request.U_UOM.toLowerCase().match(this.filter.toLowerCase(), this.totalRows = request.length))
        }
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

  methods: { 
    rowClassMain(items) {
      if(items){
        if(items.IFPASSRMRS != null){
          return items.IFPASSRMRS ? "" : "table-danger";
        }
      }
    },

    clearSignature() {
      this.$refs.signaturePad.undoSignature();
    },
    fixTime(t) {
      try {
        const arr = t.split(":", 2);
        const raw = `${arr[0]}${arr[1]}`;
        const time = raw;
        return time;
      } catch (e) {
        console.log("Error: ", e);
      }
    },
    onChangeHandler: function(data) {
      (this.U_SCHEDULED_DATE = moment(data.startDate).format("YYYY-MM-DD")),
        (this.U_SCHEDULED_TIME = this.fixTime(
          moment(data.startDate).format("HH:mm")
        ));
      console.log(data);
    },
    async saveDR() {
      if (this.U_SCHEDULED_DATE == null) {
        this.showAlert("Please input Schedule Date", "danger");
      } else if (this.U_TRANSACTION_TYPE == null) {
        this.showAlert("Please select Transaction Type", "danger");
      } else if (this.U_CMMDTY == null) {
        this.showAlert("Please select Commodity", "danger");
      } else if (this.U_UOM == null) {
        this.showAlert("Please select Unit of Measure", "danger");
      } else if (this.U_FRMR_NAME == null) {
        this.showAlert("Please select Farmer Name", "danger");
      } else if (this.U_HLPR_FNAME.trim() == null || this.U_HLPR_LNAME.trim() == null) {
        this.showAlert("Please input Helper Name", "danger");
      } else if (this.U_DRVR_FNAME.trim() == null || this.U_DRVR_LNAME.trim() == null || this.U_DRVR_FNAME.trim() == "" || this.U_DRVR_LNAME.trim() == "") {
        this.showAlert("Please input Driver Name", "danger");
      } else if (this.U_PLATE_NUMBER == null) {
        this.showAlert("Please input Plate Number", "danger");
      } else if (this.U_UOM.UomName == "TRUCK LOAD" && this.U_SACKS < 1) {
        this.showAlert("Please input quantity not less than zero", "danger");
      } else if (this.U_TRANSACTION_TYPE == 2 && this.U_SACKS < 1) {
        this.showAlert("Please input # of Filled Bags not less than zero", "danger");
        // } else if (this.U_SACKS < "1" ) {
        //   this.showAlert("Please input quantity/# of Filled Bags  not less than zero", "danger");
      } else {
        console.log(this.U_CMMDTY.value);
        this.$bvModal.show("pin");
        setTimeout(() => {
          this.$refs.pins.focus();
        }, 500);
        return;
      }
    },
    async closePinModal() {
      this.pincode = null;
      this.$bvModal.hide("pin");
      return;
    },
    async confirmpin() {
      try {
        this.showLoading = true;
        const userDetails = JSON.parse(localStorage.user_details);
        const employee_id = userDetails.Code;
        const res = await axios({
          method: "POST",
          url: `${this.$axios.defaults.baseURL}/api/transaction/check-pin`,
          data: {
            employee_id,
            pin: this.pincode,
            mode: localStorage.mode
          },
          headers: {
            authorization: `B1SESSION=${localStorage.session}`
          }
        });
        this.showLoading = false;

        console.log("hide me");
        this.$bvModal.hide("pin");
        this.$bvModal.show("signature");
        this.pincode = null;
        return;
      } catch (e) {
        console.log(e);
        this.showLoading = false;
        if (e.response && e.response.data.error) {
          this.showAlert(e.response.data.error, "danger");
        } else {
          this.showAlert("Invalid Pin!", "danger");
        }
      }
    },
    async addSignature() {
      this.showLoading = true;
      const userDetails = JSON.parse(localStorage.user_details);
      const employee_id = userDetails.Code;

      function srcToFile(src, fileName, mimeType) {
        return fetch(src)
          .then(function(res) {
            return res.arrayBuffer();
          })
          .then(function(buf) {
            return new File([buf], fileName, { type: mimeType });
          });
      }

      const data = this.$refs.signaturePad.saveSignature();

      if (data.data) {
        const image = new Image();
        image.src = data.data;
        // const fileName =
        //   moment().format("YYYY-MM-DD_HHmmss") + "_" + employeeId;

        const time = moment().format("YYYY-MM-DD_HHmmss");
        const fileName = `${time}-${employee_id}.png`;
        const url = this.$axios.defaults.baseURL;

        const file = await srcToFile(image.src, fileName, "image/png");
        // const path = await srcToFile(image.src, fileName, "image/png").then(
        //   async function(file) {
        //     var fd = new FormData();
        //     fd.append("image", file, file.name);
        //     // fd.append("mode", localStorage.mode);

        //     const res = await axios.post(`${url}/api/transaction/add`, fd, {
        //       headers: { Authorization: `B1SESSION=${localStorage.session}` }
        //     });

        //     const path = res.data.imagePath;

        //     return path;
        //   }
        // );
// test
        // this.signaturePath = path;
        this.showLoading = false;

        await this.newDR(file);
      } else {
        this.showLoading = false;
        this.showAlert("Please input all fields", "danger");
      }
    },
    closeSignatureModal() {
      this.pincode = null;
      this.$bvModal.hide("signature");
      return;
    },
    close() {
      (this.U_TRANSACTION_TYPE = null),
        (this.U_FRMR_NAME = null),
        (this.U_FRMR_ADD = null),
        (this.U_APP_ProjCode = null),
        (this.U_UOM = { value: "", text: "" }),
        (this.U_CMMDTY = { value: "", text: "" }),
        (this.U_DRVR_LNAME = null),
        (this.U_DRVR_FNAME = null),
        (this.U_HLPR_FNAME = null),
        (this.U_HLPR_LNAME = null),
        (this.U_PLATE_NUMBER = null),
        (this.U_DTE_CRTD = null),
        (this.U_CRTD_BY = null),
        (this.U_TRX_NO = null),
        (this.U_DRVR_NAME = null),
        (this.U_REQUESTED_SACKS = 0),
        (this.U_SACKS = 0),
        (this.U_EMPTY_SACKS = 0),
        (this.U_HLPR_NAME = null);
      this.U_SCHEDULED_DATE = null;
      this.U_SCHEDULED_TIME = null;
      this.$bvModal.hide("add-transaction-modal");
      this.$bvModal.hide("edit-transaction-modal");
    },
    close1() {
      (this.U_TRANSACTION_TYPE = null),
        (this.U_FRMR_NAME = null),
        (this.U_FRMR_ADD = null),
        (this.U_APP_ProjCode = null),
        (this.U_UOM = { value: "", text: "" }),
        (this.U_CMMDTY = { value: "", text: "" }),
        (this.U_DRVR_LNAME = null),
        (this.U_DRVR_FNAME = null),
        (this.U_HLPR_FNAME = null),
        (this.U_HLPR_LNAME = null),
        (this.U_PLATE_NUMBER = null),
        (this.U_DTE_CRTD = null),
        (this.U_CRTD_BY = null),
        (this.U_TRX_NO = null),
        (this.U_DRVR_NAME = null),
        (this.U_REQUESTED_SACKS = 0),
        (this.U_SACKS = 0),
        (this.U_EMPTY_SACKS = 0),
        (this.U_HLPR_NAME = null);
      this.U_SCHEDULED_DATE = null;
      this.U_SCHEDULED_TIME = null;
      this.$bvModal.hide("bv-modal-confirmCancel");
      this.$bvModal.hide("view-transaction-modal");
    },
    showAlert(message, variant) {
      this.alert = {
        showAlert: 3,
        variant,
        message
      };
    },
    showAlert1(message1, variant1) {
      this.alert1 = {
        showAlert1: 3,
        variant1,
        message1
      };
    },
    async networkPrint(data) {
      let QRCode = require("qrcode");

      this.qrString = JSON.stringify(data.U_TRX_NO);

      const qr = await QRCode.toDataURL(data.U_TRX_NO);

      let canvas1 = document.createElement("canvas");
      canvas1.width = 100;
      canvas1.height = 100;

      let biotechLogoContext = canvas1.getContext("2d");

      const biotechLogo = await new Promise(resolve => {
        let image1 = new Image();
        image1.src = qr;
        image1.onload = () => resolve(image1);
      });

      biotechLogoContext.drawImage(biotechLogo, 0, 0, 100, 100);

      let canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 100;

      let revivelogoContext = canvas.getContext("2d");

      const revivelogo = await new Promise(resolve => {
        let image = new Image();
        image.src = "/logo1.png";
        image.onload = () => resolve(image);
      });

      revivelogoContext.drawImage(revivelogo, 0, 0, 180, 100);

      this.networkPrinter.addTextAlign(this.networkPrinter.ALIGN_CENTER);
      this.networkPrinter.addImage(revivelogoContext, 0, 0, 180, 95);
      this.networkPrinter.addText(`CROPTECH INC.\n`);
      this.networkPrinter.addTextFont(this.networkPrinter.FONT_B);

      this.networkPrinter.addText(
        `Delivery Receipt | ${data.U_TRANSACTION_TYPE}\n`
      );
      this.networkPrinter.addText(`${data.U_DTE_CRTD}\n`);

      this.networkPrinter.addText(`\n`);
      // this.networkPrinter.align('right');
      this.networkPrinter.addTextAlign(this.networkPrinter.ALIGN_LEFT);
      // this.networkPrinter.addTextFont(this.networkPrinter.FONT_B);
      this.networkPrinter.addText(`Transaction Number: ${data.U_TRX_NO}\n`);

      this.networkPrinter.addText(
        `Delivery Schedule: ${data.U_SCHEDULED_DATE_AND_TIME}\n`
      );
      this.networkPrinter.addText(`Farmer's Name: ${data.U_FRMR_NAME}\n`);
      this.networkPrinter.addText(`Address: ${data.U_FRMR_ADD}\n`);
      if(data.U_APP_ProjCode){
        this.networkPrinter.addText(`Plot Code: ${data.U_APP_ProjCode}\n`)
      }
      this.networkPrinter.addText(`\n`);
      this.networkPrinter.addText(`Item: ${data.U_CMMDTY}\n`);
      this.networkPrinter.addText(
        `Requested Empty Sacks: ${data.U_REQUESTED_SACKS}\n`
      );
      if (data.U_TRANSACTION_TYPE == "Delivery") {
        this.networkPrinter.addText(
          `Quantity:  ${data.U_SACKS} ${data.U_UOM}\n`
        );
      } else if (
        data.U_TRANSACTION_TYPE == "Pick-up" &&
        data.U_UOM.UomName == "TRUCK LOAD"
      ) {
        this.networkPrinter.addText(
          `Quantity:  ${data.U_SACKS} ${data.U_UOM}\n`
        );
      } else {
        this.networkPrinter.addText(`Quantity:  \n`);
      }
      this.networkPrinter.addText(
        `Returned Empty Sacks: ${data.U_EMPTY_SACKS}\n`
      );
      this.networkPrinter.addText(`Driver's Name: ${data.U_DRVR_NAME}\n`);
      this.networkPrinter.addText(`Plate Number: ${data.U_PLATE_NUMBER}\n`);
      this.networkPrinter.addText(`\n`);
      this.networkPrinter.addTextAlign(this.networkPrinter.ALIGN_LEFT);

      this.networkPrinter.addText(`SIGNED BY:         REVIEWED BY: \n`);
      this.networkPrinter.addText(`\n`);
      this.networkPrinter.addText(
        `${data.U_FRMR_NAME}    ${data.U_HLPR_NAME}\n`
      );
      this.networkPrinter.addTextAlign(this.networkPrinter.ALIGN_CENTER);
      this.networkPrinter.addText(`\n`);
      this.networkPrinter.addText(`VERIFIED BY: \n`);
      this.networkPrinter.addText(`\n`);
      this.networkPrinter.addText(`${data.U_CRTD_BY}\n`);
      this.networkPrinter.addImage(biotechLogoContext, 0, 0, 100, 100);
      // this.networkPrinter.addText(`Item: ${data.header.item}\n`);
      // this.networkPrinter.addText(
      //   `Supplier Code: ${data.header.supplier_code}\n`
      // );
      // this.networkPrinter.addText(`DR #: ${data.header.dr}\n`);
      // this.networkPrinter.addText(`${data.header.date}\n`);

      this.networkPrinter.addText("\n");
      this.networkPrinter.addCut(); // for auto cutting
      

      // this.networkPrinter.send();
    },
    async networkPrintInit() {
        
      let ePosDev = new epson.ePOSDevice();

      let ipAddress = 'tcp://'+process.env.networkPrinterIp,
      // let ipAddress = localStorage.printer_ip,
        port = process.env.networkPrinterPort;
        // port = localStorage.printer_port;

      let deviceId = "bfi_printer";
      let options = { crypto: false, buffer: false };

      const connectionResult = await new Promise(resolve => {
        ePosDev.connect(ipAddress, port, resultConnect => {
          resolve(resultConnect);
        });
      });

      if (!(connectionResult == "OK" || connectionResult == "SSL_CONNECT_OK")) {
          this.isPrinterAvailable = false;
        console.log("Connecting to IP address and port failed");
        this.showLoading = false;
        // this.showAlert("Print error: Connecting to Printer failed" , "danger");
        return;
      }

      const createDeviceResult = await new Promise(resolve => {
        ePosDev.createDevice(
          deviceId,
          ePosDev.DEVICE_TYPE_PRINTER,
          options,
          (deviceObj, errorCode) => {
            resolve(deviceObj);
          }
        );
      });

      console.log(createDeviceResult);

      if (createDeviceResult === null) {
        console.log("Creating device failed");
        this.showLoading = false;
        return;
      }

      this.networkPrinter = createDeviceResult;

      this.networkPrinter.onreceive = response => {
        console.log(response);
        if (response.success) {
        
          console.log("Callback create device response success");
        } else {
        
          console.log("Callback create device response failed");
        }
      };

       
    },
    // async printReceipt(data) {
    //   console.log(data);
    //   // this.$refs.Receipt.print(data);
    //   this.networkPrint(data);
    // },
    //    console.log(data);
    //    if (this.U_STATUS === 'Pending'){
    //   this.showLoading = true
    //   const userDetails = JSON.parse(localStorage.user_details);

    //   const employee_id = userDetails.Code;

    //   const res = await axios({
    //     method: "PUT",
    //     url: `${this.$axios.defaults.baseURL}/api/transaction/print/${data}`,
    //     headers: {
    //       Authorization: `B1SESSION=${localStorage.SessionId}`
    //     },
    //     data: {
    //       employee_id,

    //     }
    //   });

    //   // this.showReceipt = true;
    //   this.$refs.Receipt.print(data);
    //   // data.U_STATUS = "Printed";
    //    } else{
    //   this.$refs.Receipt.print(data);
    //    }
    // },
    async printed(transaction) {
      this.showLoading = true;
      let data 
      if(transaction.item) {
        data = transaction.item
      } else {
        data = transaction
      }

      if(!this.printerIP) {
        this.showAlert("Please provide IP Address", "danger")
      }
      
      await axios({
        method: "POST",
        url: `${process.env.serverPrintUrl}/fdss/print`,
        data: {
          header: data,
          qrcode: data.U_TRX_NO,
          uuids: process.env.uuid,
          ip: this.printerIP
        },
      })
      .then((res) => {
        this.showLoading = false;
        this.showAlert("Printed Successfully", "success");
      })
      .catch((err => {
        console.log("error: ", err);
        this.showLoading = false;
      }))

      try {
        this.showLoading = true;
        const userDetails = JSON.parse(localStorage.user_details);

        const employee_id = userDetails.Code;

        const res = await axios({
          method: "PUT",
          url: `${this.$axios.defaults.baseURL}/api/transaction/print/${data.U_TRX_ID}`,
          headers: {
            Authorization: `B1SESSION=${localStorage.SessionId}`
          },
          data: {
            employee_id,
            U_TRX_ID: data.U_TRX_NO
          }
        });
        this.showLoading = false;
        // this.networkPrint(U_TRX_ID);
        this.showAlert("Printed Successfully", "success");
        this.getTransactions();
      } catch (e) {
        console.log(e);
        this.showAlert("Print error: Printer not connected", "danger");
        this.showLoading = false;
        this.showAlert(res.message, "danger");
      }
    },
    async confirmCancel(U_TRX_ID) {
      try {
        this.showLoading = true;
        const userDetails = JSON.parse(localStorage.user_details);

        const employee_id = userDetails.Code;

        const res = await axios({
          method: "PUT",
          url: `${this.$axios.defaults.baseURL}/api/transaction/cancel/${this.U_TRX_ID}`,
          headers: {
            Authorization: `B1SESSION=${localStorage.SessionId}`
          },
          data: {
            employee_id,
            U_TRX_ID: this.U_TRX_ID,
            remarks: this.remarks
          }
        });
        this.showLoading = false;
        this.showAlert("Successfully Cancelled", "success");
        this.$bvModal.hide("bv-modal-confirmCancel");
        this.getTransactions();
      } catch (e) {
        console.log(e);
        this.showLoading = false;
        this.showAlert("Please Input Remarks", "danger");
      }
    },

    cancel(data) {
      this.U_APP_ProjCode = null;
      this.remarks = null;
      this.U_CRTD_BY = data.U_CRTD_BY;
      this.U_TRX_ID = data.U_TRX_ID;
      this.U_TRX_NO = data.U_TRX_NO;
      this.U_TRANSACTION_TYPE = data.U_TRANSCTION_TYPE_ID;
      this.U_CMMDTY = data.U_ITEM;
      (this.U_UOM = data.U_UOM), (this.U_FRMR_NAME = data.U_FRMR_NAME);
      this.U_FRMR_ADD = data.U_FRMR_ADD;
      if(data.U_APP_ProjCode){
        this.U_APP_ProjCode = data.U_APP_ProjCode;
      }
      const driver_name = data.U_DRVR_NAME.split(", ");
      const helper_name = data.U_HLPR_NAME.split(", ");
      this.U_HLPR_FNAME = helper_name[1];
      this.U_HLPR_LNAME = helper_name[0];
      this.U_DRVR_FNAME = driver_name[1];
      this.U_DRVR_LNAME = driver_name[0];
      this.U_REQUESTED_SACKS = data.U_REQUESTED_SACKS;
      this.U_SACKS = data.U_SACKS;
      this.U_EMPTY_SACKS = data.U_EMPTY_SACKS;
      this.U_PLATE_NUMBER = data.U_PLATE_NUMBER;
      this.$bvModal.show("bv-modal-confirmCancel");
    },
    print(data) {
      // this.U_CRTD_BY = data.U_CRTD_BY;
      // this.U_TRX_ID = data.U_TRX_ID;
      // this.U_TRX_NO = data.U_TRX_NO;
      // this.U_TRANSACTION_TYPE = data.U_TRANSCTION_TYPE_ID;
      // this.U_CMMDTY = data.U_ITEM;
      // this.U_FRMR_NAME = data.U_FRMR_NAME;
      // this.U_FRMR_ADD = data.U_FRMR_ADD;
      // this.U_DRVR_NAME = data.U_DRVR_NAME;
      // this.U_HLPR_NAME = data.U_HLPR_NAME;
      // this.U_SACKS= data.U_SACKS;
      // this.U_EMPTY_SACKS = data.U_EMPTY_SACKS;
      // this.U_PLATE_NUMBER = data.U_PLATE_NUMBER;
      this.$bvModal.show("bv-modal-confirmPrint");
    },

    async edit(data) {
      console.log(data);
      // this.TRANSACTION_COMPANY_ID ={text: data.TRANSACTION_COMPA};
      // this.TRANSACTION_COMPANY_ID = data.TRANSACTION_COMPANY_ID;
      // this.selectedcompany= {text: data.TRANSACTION_COMPANY, value:TRANSACTION_COMPANY_ID};
      this.TRANSACTION_COMPANY = data.TRANSACTION_COMPANY;
      this.TRANSACTION_COMPANY_ID = data.TRANSACTION_COMPANY_ID;
      this.U_CRTD_BY = data.U_CRTD_BY;
      this.U_TRX_ID = data.U_TRX_ID;
      this.U_TRX_NO = data.U_TRX_NO;
      this.U_TRANSACTION_TYPE = data.U_TRANSCTION_TYPE_ID;
      this.U_UOM = data.U_UOM.UomName;
      (this.U_CMMDTY = { value: data.U_ITEM, text: data.U_CMMDTY }),
        // (this.U_UOM = { UomName: data.U_UOM, UomEntry: data.U_UOM_ID });
      this.U_FRMR_NAME = data.U_FRMR_NAME;
      this.U_FRMR_ADD = data.U_FRMR_ADD;
      this.U_APP_ProjCode = data.U_APP_ProjCode;
      const driver_name = data.U_DRVR_NAME.split(", ");
      const helper_name = data.U_HLPR_NAME.split(", ");
      this.U_HLPR_FNAME = helper_name[1];
      this.U_HLPR_LNAME = helper_name[0];
      this.U_DRVR_FNAME = driver_name[1];
      this.U_DRVR_LNAME = driver_name[0];
      this.U_REQUESTED_SACKS = data.U_REQUESTED_SACKS;
      this.U_SACKS = data.U_SACKS;
      this.U_EMPTY_SACKS = data.U_EMPTY_SACKS;
      this.U_PLATE_NUMBER = data.U_PLATE_NUMBER;
      this.U_SCHEDULED_DATE = data.U_SCHEDULED_DATE;
      this.U_SCHEDULED_TIME = data.U_SCHEDULED_TIME;

      this.datetimeScheme2.startDate = new Date(
        moment(
          `${data.U_SCHEDULED_DATE} ${this.intToTime(data.U_SCHEDULED_TIME)}`
        ).format("YYYY-MM-DD HH:mm")
      );
      console.log(
        new Date(
          moment(
            `${data.U_SCHEDULED_DATE} ${this.intToTime(data.U_SCHEDULED_TIME)}`
          ).format("YYYY-MM-DD HH:mm")
        )
      );
      this.$bvModal.show("edit-transaction-modal");

      this.updateUOM();
      console.log(this.unit);
      this.U_UOM = { UomName: data.U_UOM, UomEntry: data.U_UOM_ID };
    },
    show(data) {
      // this.U_UOM = data.U_UOM.UomName;
      this.TRANSACTION_COMPANY = data.TRANSACTION_COMPANY;
      this.U_DTE_CRTD = data.U_DTE_CRTD;
      this.U_CRTD_BY = data.U_CRTD_BY;
      this.U_TRX_ID = data.U_TRX_ID;
      this.U_TRX_NO = data.U_TRX_NO;
      this.U_TRANSACTION_TYPE = data.U_TRANSACTION_TYPE;
      this.U_CMMDTY = data.U_CMMDTY;
      (this.U_UOM.UomEntry = data.U_UOM), (this.U_FRMR_NAME = data.U_FRMR_NAME);
      this.U_FRMR_ADD = data.U_FRMR_ADD;
      this.U_APP_ProjCode = data.U_APP_ProjCode;
      this.U_DRVR_NAME = data.U_DRVR_NAME;
      this.U_HLPR_NAME = data.U_HLPR_NAME;
      this.U_REQUESTED_SACKS = data.U_REQUESTED_SACKS;
      this.U_SACKS = data.U_SACKS;
      this.U_EMPTY_SACKS = data.U_EMPTY_SACKS;
      this.U_PLATE_NUMBER = data.U_PLATE_NUMBER;
      this.U_SCHEDULED_DATE_AND_TIME = data.U_SCHEDULED_DATE_AND_TIME;
      this.$bvModal.show("view-transaction-modal");
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
    async updateUOM() {
      this.showLoading = true;
      this.unit = [];
      const res = await axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/api/items/selectUom/${this.U_CMMDTY.value}`,
        headers: {
          Authorization: localStorage.SessionId
        },
        data: {
          company: this.TRANSACTION_COMPANY_ID
        } 
      });
      const v = res.data.view;

      for (let i = 0; i < v.length; i++) {
        this.unit.push({
          text: v[i].UomName,
          value: { UomName: v[i].UomName, UomEntry: v[i].UomEntry }
        });
      }
      this.showLoading = false;

    },
    async getUOM() {
      this.showLoading = true;
      const userDetails = JSON.parse(localStorage.user_details);
      this.unit = [];
      const res = await axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/api/items/selectUom/${this.U_CMMDTY.value.value}`,
        headers: {
          Authorization: localStorage.SessionId
        },
        data: {
          company: userDetails.U_COMPANY_CODE
        }
      });
      const v = res.data.view;

      for (let i = 0; i < v.length; i++) {
        this.unit.push({
          text: v[i].UomName,
          value: { UomName: v[i].UomName, UomEntry: v[i].UomEntry }
        });
      }
      this.showLoading = false;

    },
    //  async getPriceList() {
    //   const res = await axios({
    //     method: "POST",
    //     url: `${this.$axios.defaults.baseURL}/api/items/selectPl`,
    //     headers: {
    //       Authorization: localStorage.SessionId
    //     }
    //   });
    //   const v = res.data.view;

    //  for (let i = 0; i < v.length; i++) {
    //     this.pricelist.push({
    //       text: v[i].ListName,
    //       value: v[i].ListNum
    //     });

    //   }
    // },
    async getLocationIP(){
      this.isBusy = true;
      const locationId = JSON.parse(localStorage.user_details).U_LOCATION_ID;

        await axios({
          method: "GET",
          url: `${this.$axios.defaults.baseURL}/api/printer/select`
        }).then( res => {
          const v = res.data.view;
          for(var i = 0; i < v.length; i++) {
            if(v[i].U_LOCATION_ID == locationId){
              this.printerIP = v[i].U_IP_ADD;
            }
          }
        })
      this.isBusy = false;
    },

    async getCommodity() {
      this.isBusy = true;
      const userDetails = JSON.parse(localStorage.user_details);
      this.commodity = [];
      const res = await axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/api/items/select`,
        headers: {
          Authorization: localStorage.SessionId
        },
        data: {
          company: userDetails.U_COMPANY_CODE
        }
      });
      const v = res.data.view;

      for(var i = 0; i < v.length; i++){
        this.commodity.push({
          text: v[i].ItemCode + ' : ' + v[i].ItemName,
          value: v[i].ItemCode
        })
      }

      if(this.companyCode == '4360') { 
        this.commodity = [];
        // filter only agri-ops items
        const startsWithFG = v.filter((itemCode) => itemCode.ItemCode.startsWith("FG"));

        for (let i = 0; i < startsWithFG.length; i++) {
          this.commodity.push({
            text: startsWithFG[i].ItemCode + ' : ' + startsWithFG[i].ItemName,
            value: startsWithFG[i].ItemCode
          });
        }
      }

      if(this.companyCode == '4354') {
        const riceBran = v.filter((itemCode) => itemCode.ItemCode.startsWith("RM16-00014"));
        this.commodity.push({
          text: riceBran[0].ItemCode + ' : ' + riceBran[0].ItemName,
          value: riceBran[0].ItemCode
        })
      }

      this.isBusy = false;


    },
    titleCase(str){
      // since getFarmer returns all UPPERCASE and getPlotCodes return Uppercase And Lowercase
      // can't directly compare; would return undefined
      // therefore, farmer name has to be Title Case
      return str.toLowerCase().split(' ').map(function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1)
      }).join(' ');
    },
    async getPlotCodes(){ // from booking service
      this.plotCodes = [];
      await axios({
        method: "POST",
        url: "https://sqa.revive-agritech.com/booking-microsvc/booking-microsvc/plot_codes",
      }).then(res => {
        if(res.data.posted.message == "Successful"){
          this.plotCodes = res.data.posted
        }
      })
    },
    async test() {
      this.showLoading = true;
      this.plotCode = [];
      this.U_FRMR_ADD = this.U_FRMR_NAME.value.address;
      let v = "";

      if(this.companyCode == '4354') {

      } else if(this.companyCode == '4360') {
        this.U_APP_ProjCode = "";
        this.U_FRMR_ADD = "";

        if(this.U_FRMR_NAME) {
          const res = await axios({
            method: "POST",
            url: `${this.$axios.defaults.baseURL}/api/transaction/projCode`,
            headers: {
              Authorization: localStorage.SessionId
            },
            data: {
              "PrjName": this.U_FRMR_NAME.text
            }
          });
          v = res.data.posted;
          if(v) {
            for(let i = 0; i < v.length; i++){
              this.plotCode.push({
                text: v[i].plotCodes,
                value: { address: v[i].address }
              });
              }
          }
        }
      
      }
      this.showLoading = false;
    },
    getPlotAddress(){
      this.U_FRMR_ADD = "";
      if(this.U_APP_ProjCode.value.address) {
        this.U_FRMR_ADD = this.U_APP_ProjCode.value.address;
      } else {
        this.showAlert1('Plot Code does not have an address', 'warning')
      }
    },
    async newDR(signature) {
      try {
        this.showLoading = true;
        let items = [];
        const userDetails = JSON.parse(localStorage.user_details); 

        let json = {};
        if(userDetails.U_COMPANY_CODE == '4354') {
          json = {
            company: userDetails.U_COMPANY_CODE,
            uom_id: this.U_UOM.UomEntry,
            transaction_type_id: this.U_TRANSACTION_TYPE,
            item_id: this.U_CMMDTY.value.value,
            farmer_id: this.U_FRMR_NAME.value.id,
            driver_name: this.U_DRVR_LNAME + ", " + this.U_DRVR_FNAME,
            helper_name: this.U_HLPR_LNAME + ", " + this.U_HLPR_FNAME,
            no_of_requested_bags: this.U_REQUESTED_SACKS,
            no_of_bags: this.U_SACKS,
            no_of_empty_bags: this.U_EMPTY_SACKS,
            employee_id: userDetails.Code,
            plate_number: this.U_PLATE_NUMBER,
            signature: this.signaturePath
          };
        } else if(userDetails.U_COMPANY_CODE == '4360') {
          json = {
            company: userDetails.U_COMPANY_CODE,
            uom_id: this.U_UOM.UomEntry,
            transaction_type_id: this.U_TRANSACTION_TYPE,
            item_id: this.U_CMMDTY.value.value,
            farmer_id: this.U_FRMR_NAME.value.id,
            farmer_name: this.U_FRMR_NAME.text,
            driver_name: this.U_DRVR_LNAME + ", " + this.U_DRVR_FNAME,
            helper_name: this.U_HLPR_LNAME + ", " + this.U_HLPR_FNAME,
            no_of_requested_bags: this.U_REQUESTED_SACKS,
            no_of_bags: this.U_SACKS,
            no_of_empty_bags: this.U_EMPTY_SACKS,
            employee_id: userDetails.Code,
            plate_number: this.U_PLATE_NUMBER,
            signature: this.signaturePath
          };
        }

        var fd = new FormData();
        fd.append("", signature, signature.name);
        fd.append("company", userDetails.U_COMPANY_CODE);
        fd.append("transaction_type_id", this.U_TRANSACTION_TYPE);
        fd.append("item_id", this.U_CMMDTY.value.value);
        fd.append("uom_id", this.U_UOM.UomEntry);
          fd.append("farmer_id", this.U_FRMR_NAME.value.id);

        
        fd.append("farmer_name", this.U_FRMR_NAME.text);
        if(this.U_APP_ProjCode){
          fd.append("plot_code", this.U_APP_ProjCode.text);
        }
        fd.append("farmer_add", this.U_FRMR_ADD);
        fd.append("driver_name", this.U_DRVR_LNAME + ", " + this.U_DRVR_FNAME);
        fd.append("helper_name", this.U_HLPR_LNAME + ", " + this.U_HLPR_FNAME);
        fd.append("no_of_requested_bags", this.U_REQUESTED_SACKS);
        fd.append("no_of_bags", this.U_SACKS);
        fd.append("no_of_empty_bags", this.U_EMPTY_SACKS);
        fd.append("employee_id", userDetails.Code);
        fd.append("plate_number", this.U_PLATE_NUMBER);
        fd.append("scheduled_date", this.U_SCHEDULED_DATE);
        fd.append("scheduled_time", this.U_SCHEDULED_TIME);
        
        const res = await axios.post(
          `${this.$axios.defaults.baseURL}/api/transaction/add`,
          fd,
          {
            headers: { Authorization: `B1SESSION=${localStorage.SessionId}` }
          }
        );
        this.$bvModal.hide("signature");
        this.showLoading = false;
        this.getTransactions();
        this.$bvModal.hide("add-transaction-modal");
        this.showAlert(res.data.posted.msg, "success");
        this.close();
      } catch (e) {
        console.log(e);
        this.showLoading = false;
        if (e.response && e.response.data.error) {
          this.showAlert(e.response.data.error, "danger");
        } else {
          this.showAlert("Please input all fields", "danger");
        }
      }
    },
    async updateDR(U_TRX_ID) {
      try {
        this.showLoading = true;
        let items = [];

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
          //  transaction_type_id: this.U_TRANSACTION_TYPE,
          //  item_id: this.U_CMMDTY ,
          //  farmer_id: this.U_FRMR_NAME,
          // pricelist: this,U_PRICELIST,
          comapany: this.TRANSACTION_COMPANY_ID,
          uom_id: this.U_UOM.UomEntry,
          driver_name: this.U_DRVR_LNAME + ", " + this.U_DRVR_FNAME,
          helper_name: this.U_HLPR_LNAME + ", " + this.U_HLPR_FNAME,
          no_of_requested_bags: this.U_REQUESTED_SACKS,
          no_of_bags: this.U_SACKS,
          no_of_empty_bags: this.U_EMPTY_SACKS,
          employee_id: userDetails.Code,
          plate_number: this.U_PLATE_NUMBER,
          scheduled_date: this.U_SCHEDULED_DATE,
          scheduled_time: intToTime(this.U_SCHEDULED_TIME)
        };

        await axios({
          method: "PUT",
          url: `${this.$axios.defaults.baseURL}/api/transaction/update/${U_TRX_ID}`,
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
              this.showLoading = false;
              this.getTransactions();
              this.$bvModal.hide("edit-transaction-modal");
              this.showAlert("Successfully Updated", "success");
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
    generatePdf() {
      var doc = new jsPDF("p", "pt", "A4");
      let margins = {
        top: 80,
        bottom: 60,
        left: 40,
        width: 522
      };

      doc.fromHTML(this.$refs.testHtml, margins.left, margins.top, {
        width: margins.width
      });

      doc.save("test.pdf");
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

      if(!this.filter) {
        this.totalRows = this.filterItems ? this.filterItems.length : 0
      }

      try {
        const userDetails = JSON.parse(localStorage.user_details);
        const roleDetails = JSON.parse(localStorage.user_role);

        const employee_id = userDetails.Code;
        const employee_role = roleDetails.Name;

          
        this.isBusy = true;
        this.items = [];
        const res = await axios({
          method: "POST",
          url: `${this.$axios.defaults.baseURL}/api/transaction/select`,
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
        for (let i = 0; i < v.length; i++) {
          const d = moment(v[i].CREATED_DATE).format("MMM DD, YYYY");
          // const t = this.intToTime(v[i].CREATED_TIME);
          // const date = moment(`${d}  ${t}`).format("MMM DD, YYYY | hh:mm A");

          const sd = moment(v[i].SCHEDULED_DATE).format("MMM DD, YYYY");
          const st = this.intToTime(v[i].SCHEDULED_TIME);
          const sdate = moment(`${sd}  ${st}`).format("MMM DD, YYYY hh:mm A");
          this.items.push({
            U_TRX_NO: v[i].U_TRX_NO,
            U_TRX_ID: v[i].TRANSACTION_ID,
            U_TRANSCTION_TYPE_ID: v[i].TRANSACTION_TYPE_ID,
            U_ITEM: v[i].ITEM_ID,
            U_SUPP: v[i].SUPPLIER_ID,
            U_TRX_NO: v[i].TRANSACTION_NUMBER,
            // U_PRICELIST: v[i].PRICELIST_NAME,
            U_TRANSACTION_TYPE: v[i].TRANSACTION_TYPE,
            U_CMMDTY: v[i].ITEM_NAME,
            U_UOM: v[i].UOM_NAME,
            U_UOM_ID: v[i].UOM_ID,
            U_FRMR_NAME: v[i].FARMER_NAME,
            U_FRMR_ADD: v[i].FARMER_ADDRESS,
            U_APP_ProjCode: v[i].U_PLOT_CODE,
            U_DTE_CRTD: d,
            U_CRTD_BY: v[i].CREATED_BY,
            U_STATUS: v[i].STATUS,
            U_PLATE_NUMBER: v[i].PLATE_NUMBER,
            U_HLPR_NAME: v[i].HELPER_NAME,
            U_DRVR_NAME: v[i].DRIVER_NAME,
            U_REQUESTED_SACKS: v[i].NUMBER_OF_REQUESTED_BAGS,
            U_EMPTY_SACKS: v[i].NUMBER_OF_EMPTY_BAGS,
            U_SACKS: v[i].NUMBER_OF_BAGS,
            U_SCHEDULED_DATE_AND_TIME: sdate,
            U_SCHEDULED_DATE: moment(v[i].SCHEDULED_DATE).format("YYYY-MM-DD"),
            U_SCHEDULED_TIME: v[i].SCHEDULED_TIME,
            // selectedcompany: v[i].USER_COMPANY,
            TRANSACTION_COMPANY_ID: v[i].TRANSACTION_COMPANY_ID,
            TRANSACTION_COMPANY: v[i].TRANSACTION_COMPANY,
            IFPASSRMRS: v[i].ifpassRMRS
          });
        }

         
        this.isBusy = false;
      } catch (e) {
        console.log(e);
         
        this.isBusy = false;
      }
    },
  },

  async beforeCreate() {
      const userDetails = JSON.parse(localStorage.user_details);
      this.farmer = [];
      let v; 
      if(userDetails.U_COMPANY_CODE == '4360') {
        // RCI

        const res1 = await axios({
        method: "POST",
          url: `${this.$axios.defaults.baseURL}/api/suppliers/select`,
          headers: {
            Authorization: localStorage.SessionId
          },
          data: {
            company: userDetails.U_COMPANY_CODE
          }
        });
        const v1 = res1.data.view; 
        for (let i = 0; i < v1.length; i++) {
          if(v1[i].CardType == "S"){
            this.bfi_farmer.push({
              text: v1[i].SUPPLIER_NAME,
              value: { id: v1[i].SUPPLIER_ID }
            });
          }
        }

        const res = await axios({
          method: "GET",
          url: `${this.$axios.defaults.baseURL}/api/transaction/projCode`,
          headers: {
            Authorization: localStorage.SessionId
          },
        });
        v = res.data.view;

        for(var i = 0; i < v.length; i++){
          let frmr = ((v[i].PrjName).toLowerCase()).split(", ");
          for(var j = 0; j < this.bfi_farmer.length; j++) {
            let frmr_name = (this.bfi_farmer[j].text).toLowerCase();
            if((frmr.length == 1) && (frmr_name == frmr[0])) {
              this.farmer.push({
                text: v[i].PrjName,
                value: { id: this.bfi_farmer[j].value.id }
              });
            } else if(frmr_name.includes(frmr[0])&& frmr_name.includes(frmr[1])){
              this.farmer.push({
                text: v[i].PrjName,
                value: { id: this.bfi_farmer[j].value.id }
              });
            }
          }
        }

      } else if(userDetails.U_COMPANY_CODE == '4354') {
        // BFI
        const res = await axios({
        method: "POST",
          url: `${this.$axios.defaults.baseURL}/api/suppliers/select`,
          headers: {
            Authorization: localStorage.SessionId
          },
          data: {
            company: userDetails.U_COMPANY_CODE
          }
        });
        v = res.data.view;

        for (let i = 0; i < v.length; i++) {
          if(v[i].CardType == "S"){
            this.farmer.push({
              text: v[i].SUPPLIER_NAME,
              value: { id: v[i].SUPPLIER_ID, address: v[i].SUPPLIER_ADDRESS }
            });
          }
        }
      }
  },

    
  reloadFunction() {
    this.values = [{ label: "2" }, { label: "3" }];
  },
  
};
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
.dateTimePickerWrapper .calendarTrigger .iconCalendar[data-v-9336155c] {
  top: -10px;
  color: #b7c2c9;
}
.dateTimePickerWrapper .calendarTrigger[data-v-9336155c] {
  position: relative;
  overflow: hidden;
  display: block;
  width: 100%;
  min-width: 300px;
  height: 30px;
  border-radius: 3px;

  background: #fff;
  border: 1px solid #d5dbde;
  transition-duration: 1s;
}
.dateTimePickerWrapper .calendarTrigger .calendarInput[data-v-9336155c] {
  background: #fff;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: #75361a;
  font-size: 12px;
  padding: 15px 20px 20px 50px;
  outline: none;
  z-index: 1;
  cursor: pointer;
}

</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

