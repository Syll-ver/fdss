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

    <Receipt ref="Receipt" v-show="false" />
    <!-- Main table -->
    <!-- 
      <VueQrcode
                id="QRcode"
                type="String"
                value="asd"
                :options="{ width: 300 }"
    ></VueQrcode>-->
    <b-row>
      <b-col>
        <b-button
          variant="biotech"
          class="button-style"
          size="sm"
          @click="$bvModal.show('add-transaction-modal')"
        >
          <font-awesome-icon icon="plus" class="mr-1" />Create Delivery Slip
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
              id="search_delivery_receipt"
              placeholder="Search Delivery Slip"
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
      <b-col></b-col>

      <b-col cols="2" class="mt-3" align="right">
        <!-- <b-form-group class="mb-0">
          <b-form-select
            id="perPageSelect_action"
            size="sm"
            :options="pageOptions"
          ></b-form-select>
        </b-form-group>-->

        <b-dropdown right id="filter_actions" class="button-sq" size="sm" variant="dark">
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
            <b-form-checkbox id="Pick-up" value="Pick-up">Pick-up</b-form-checkbox>
            <b-form-checkbox id="delivery" value="Delivery">Delivery</b-form-checkbox>
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
    >
      <template v-slot:cell(U_STATUS)="row">
        <b-badge
          v-show="row.item.U_STATUS === 'Pending'"
          class="table-badge"
          pill
          variant="pending"
        >{{ row.item.U_STATUS }}</b-badge>

        <b-badge
          v-show="row.item.U_STATUS === 'Printed'"
          class="table-badge"
          pill
          variant="edit"
        >{{ row.item.U_STATUS }}</b-badge>

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
            @click="printed(row.item)"
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
            @click="printReceipt(row.item)"
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
      <b-col label-cols-sm class="mb-0 mt-1 text-left" cols="3" align-h="receipt">
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
      <div style="font-size: 13px">This will automatically 'Cancel' your created Delivery Slip.</div>
      <br><b-form-textarea
      id="remarks"
      v-model="remarks"
      placeholder="Please Input Remarks..."
      rows="3"
      max-rows="6"
    ></b-form-textarea>
      <template v-slot:modal-footer="{ }">
        <b-button
          id="btn_submit_request"
          size="sm"
          variant="biotech"
          @click="confirmCancel()"
          class="button-style"
        >Yes</b-button>
        <b-button
          id="btn_cancel_requestSupplier"
          size="sm"
          @click="close1()"
          class="button-style"
        >No</b-button>
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
      <div
        style="font-size: 13px"
      >You cannot UPDATE and CANCEL anymore the transaction after doing this.</div>
      <template v-slot:modal-footer="{ }">
        <b-button
          id="btn_submit_request"
          size="sm"
          variant="biotech"
          @click="printed()"
          class="button-style"
        >Yes</b-button>
        <b-button id="btn_cancel_requestSupplier" size="sm" @click="close()" class="button-style">No</b-button>
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
          v-model=" U_TRANSACTION_TYPE"
          class="form-text"
          :options="transaction_types"
          required
        ></b-form-select>
        <small class="text-left">Item</small>
        <multiselect 
          id="commodity"
          placeholder="Select Item" 
          v-model=" U_CMMDTY"
          class="form-text"
          :options="commodity"
          required
          label="text"
          track-by="text"
          ></multiselect>
        <!-- <b-form-select
          id="commodity"
          v-model=" U_CMMDTY"
          class="form-text"
          :options="commodity"
          required
        ></b-form-select> -->
         <small class="text-left">Price List</small>
        <b-form-select
          id="pricelist"
          v-model=" U_PRICELIST"
          class="form-text"
          :options="pricelist"
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
          required></multiselect>
        <!-- <b-form-select
          id="customer"
          class="form-text"
          v-model=" U_FRMR_NAME"
          :options="farmer"
          @change="test"
          required
        ></b-form-select> -->

        <small class="text-left">Address</small>
        <b-form-input disabled id="farmer_add" class="form-text" v-model=" U_FRMR_ADD" />
        <b-row>
          <b-col cols="6">
            <small class="text-left">Helper's Name</small>
            <b-form-input
              
              id="helper_name"
              placeholder="First Name"
              class="form-text"
              v-model=" U_HLPR_FNAME"
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
              v-model=" U_DRVR_FNAME"
              required
            />
          </b-col>
          <b-col cols="6">
            <small class="text-left">&nbsp;</small>
            <b-form-input
              id="tendered"
              placeholder="Last Name"
              v-model=" U_DRVR_LNAME"
              class="form-text"
              required
            ></b-form-input>
          </b-col>
        </b-row>

        <small class="text-left">Plate Number</small>
        <b-form-input id="tendered" v-model=" U_PLATE_NUMBER" class="form-text" required></b-form-input>

        <small class="text-left"># of Requested Sacks</small>
        <b-form-input id="requestedsacks" type="number" v-model=" U_REQUESTED_SACKS" class="form-text" required></b-form-input>

        <b-row v-if="U_TRANSACTION_TYPE === '2'">
          <b-col cols="6">
            <small class="text-left"># of Sacks</small>
            <b-form-input type="number" id="sacks" class="form-text" v-model="U_SACKS" />
          </b-col>
          <b-col cols="6">
            <small class="text-left"># of Returned Sacks</small>
            <b-form-input type="number" id="emptysacks" class="form-text" v-model="U_EMPTY_SACKS" />
          </b-col>
        </b-row>
        <b-row v-else></b-row>
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
          <b-spinner v-show="showLoading === true" small label="Spinning"></b-spinner>Create
        </b-button>
        <b-button
          id="cancel_add_action_modal"
          size="sm"
          class="button-style"
          @click="close()"
        >Cancel</b-button>
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
        <small>Schedule Date</small>
        <br />
        <date-time-picker v-bind="datetimeScheme2" @onChange="onChangeHandler" />

        <small class="text-left">Transaction Type</small>
        <b-form-select
          id="transact_type"
          v-model=" U_TRANSACTION_TYPE"
          class="form-text"
          :options="transaction_types"
          disabled
        ></b-form-select>
        <small class="text-left">Item</small>
        <b-form-select
          id="commodity"
          v-model=" U_CMMDTY"
          class="form-text"
          :options="commodity"
          disabled
        ></b-form-select>

        <small class="text-left">Farmer's Name</small>
        <b-form-input id="customer" class="form-text" v-model=" U_FRMR_NAME" disabled></b-form-input>

        <small class="text-left">Address</small>
        <b-form-input id="farmer_add" class="form-text" v-model=" U_FRMR_ADD" disabled />
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
            ></b-form-input>
          </b-col>
        </b-row>

        <small class="text-left">Plate Number</small>
        <b-form-input id="tendered" v-model=" U_PLATE_NUMBER" class="form-text"></b-form-input>
        <small class="text-left"># of Requested Sacks</small>
        <b-form-input id="requestedsacks" v-model=" U_REQUESTED_SACKS" class="form-text" required></b-form-input>

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
        <b-row v-else></b-row>
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
          <b-spinner v-show="showLoading === true" small label="Spinning"></b-spinner>Save
        </b-button>
        <b-button id="cancel_edit_action_modal" size="sm" class="button-style" @click="close">Cancel</b-button>
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
        <div id="receipt">
          <b-row>
            <div class="mr-4" style="width:31rem; height:40rem">
              <span>
                <b-img src="/revive.png" class="receipt-logo" center />
              </span>

              <center>
                <span>DELIVERY SLIP | {{ U_TRANSACTION_TYPE }}</span>
                <br />
                <span>
                  <small>Date: {{U_DTE_CRTD }}</small>
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

              <b-row>
                <b-col cols="4">
                  <span>Item</span>
                </b-col>

                <b-col cols="8">
                  <div class="dotted-border">
                    <span>: {{U_CMMDTY}}</span>
                  </div>
                </b-col>
              </b-row>

              <b-row>
                <b-col cols="4">
                  <span>Driver's Name</span>
                </b-col>

                <b-col cols="8">
                  <div class="dotted-border">
                    <span>: {{U_DRVR_NAME}}</span>
                  </div>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="4">
                  <span>Plate Number</span>
                </b-col>

                <b-col cols="8">
                  <div class="dotted-border">
                    <span>: {{U_PLATE_NUMBER}}</span>
                  </div>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="4">
                  <span>Requested Sacks</span>
                </b-col>

                <b-col cols="8">
                  <div class="dotted-border">
                    <span>: {{U_REQUESTED_SACKS}}</span>
                  </div>
                </b-col>
              </b-row>
              <div v-if="U_TRANSACTION_TYPE === 'Pick-up'">
                <b-row>
                  <b-col cols="4">
                    <span>Number of Sacks</span>
                  </b-col>

                  <b-col cols="8">
                    <div class="dotted-border">
                      <span>:</span>
                    </div>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col cols="4">
                    <span>Returned Sacks</span>
                  </b-col>

                  <b-col cols="8">
                    <div class="dotted-border">
                      <span>:</span>
                    </div>
                  </b-col>
                </b-row>
              </div>
              <div v-else>
                <b-row>
                  <b-col cols="4">
                    <span>Number of Sacks</span>
                  </b-col>

                  <b-col cols="8">
                    <div class="dotted-border">
                      <span>: {{U_SACKS}}</span>
                    </div>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col cols="4">
                    <span>Returned Sacks</span>
                  </b-col>

                  <b-col cols="8">
                    <div class="dotted-border">
                      <span>: {{U_EMPTY_SACKS}}</span>
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
                    <span style="font-size:9px">{{U_FRMR_NAME}}</span>
                    <br />
                    <span
                      style="font-size:9px;border-top-style: solid; border-width:1px;margin:0;padding:0"
                    >
                      <B>
                        &nbsp;&nbsp; FARMER'S NAME & SIGNATURE
                        &nbsp;&nbsp;
                      </B>
                    </span>
                  </center>
                </b-col>

                <b-col cols="6">
                  <center>
                    <span style="font-size:9px;margin:0;padding:0">{{U_HLPR_NAME}}</span>
                    <br />
                    <span
                      style="font-size:9px;border-top-style: solid; border-width:1px;margin:0;padding:0"
                    >
                      <B>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; REVIEWED BY
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </B>
                    </span>
                  </center>
                </b-col>
              </b-row>

              <center>
                <span style="font-size:9px">&nbsp;&nbsp;{{U_CRTD_BY}}&nbsp;&nbsp;</span>
                <br />
                <span style="border-top-style: solid; border-width:1px;font-size:9px;">
                  <b>
                    &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VERIFIED BY
                    &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
      </b-card>

      <template v-slot:modal-footer="{}">
        <b-button id="cancel_add_action_modal" size="sm" class="button-style" @click="close1">Close</b-button>
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
        <p class="pinError">{{pinError}}</p>
        <b-button
          id="save"
          size="sm"
          variant="biotech"
          @click="confirmpin()"
          style="font-size:13px"
        >Save</b-button>
        <b-button
          id="cancel"
          size="sm"
          @click="closePinModal()"
          style="font-size:13px;border: 0px;"
        >Cancel</b-button>
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
          <b-button variant="dark" style="font-size:13px;border: 0px;" @click="clearSignature">Undo</b-button>
        </div>
      </div>

      <template v-slot:modal-footer>
        <b-button
          id="rmaf-verify"
          size="sm"
          variant="biotech"
          @click="addSignature()"
          style="font-size:13px"
        >Save</b-button>
        <b-button
          id="rmaf-verify-cancel"
          size="sm"
          @click="closeSignatureModal()"
          style="font-size:13px;border: 0px;"
        >Cancel</b-button>
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
import VueSignaturePad from "vue-signature-pad";
import "@lazy-copilot/datetimepicker/dist/datetimepicker.css";
import { DateTimePicker } from "@lazy-copilot/datetimepicker";
import Multiselect from 'vue-multiselect'
export default {
  components: {
    Multiselect,
    DateTimePicker,
    Receipt,
    DateRangePicker,
    Loading,
    VueSignaturePad
  },
  async created() {
    await this.getPriceList();
    await this.getTransactions();
    await this.getTransactionType();
    await this.getFarmer();
    await this.getCommodity();
    this.totalRows = this.items.length;
  },
  data() {
    return {
      remarks:null,
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

      U_SCHEDULED_DATE: null,
      U_SCHEDULED_TIME: null,
      filterStatus: ["Pick-up", "Delivery"],
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
      U_PRICELIST:null,
      pricelist:[],
      U_TRANSACTION_TYPE: null,
      U_FRMR_NAME: null,
      U_FRMR_ADD: null,
      U_CMMDTY: null,
      U_DRVR_LNAME: null,
      U_DRVR_FNAME: null,
      U_HLPR_FNAME: null,
      U_HLPR_LNAME: null,
      U_PLATE_NUMBER: null,
      U_DTE_CRTD: null,
      U_CRTD_BY: null,
      U_TRX_NO: null,
      U_DRVR_NAME: null,
      U_SACKS: null,
      U_REQUESTED_SACKS: null,
      U_EMPTY_SACKS: null,
      U_HLPR_NAME: null,
      U_SCHEDULED_DATE_AND_TIME: null,
      transaction_types: [],
      farmer: [],
      farmerAdd: [],
      commodity: [],
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
          key: "U_SCHEDULED_DATE_AND_TIME",
          label: "Date Scheduled",
          sortable: true,
          sortDirection: "desc"
        },

        {
          key: "U_STATUS",
          label: "Status",
          sortable: true,
          sortDirection: "desc"
        },

        { key: "actions", label: "Actions", class: "text-center" }
      ],
      signaturePath: null,
      pincode: null,
      pinError: null,
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [5, 10, 15],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: [],
      receiptData: {}
    };
  },
  computed: {
    filterItems() {
      return this.items.filter(request => {
        if (this.filterStatus.includes(request.U_TRANSACTION_TYPE)) {
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
        console.log(data)
    },
    async saveDR() {
      console.log(this.U_FRMR_NAME.value.id)
      console.log(this.U_CMMDTY.value)
      this.$bvModal.show("pin");
      setTimeout(() => {
        this.$refs.pins.focus();
      }, 500);
      return;
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
        (this.U_CMMDTY = null),
        (this.U_DRVR_LNAME = null),
        (this.U_DRVR_FNAME = null),
        (this.U_HLPR_FNAME = null),
        (this.U_HLPR_LNAME = null),
        (this.U_PLATE_NUMBER = null),
        (this.U_DTE_CRTD = null),
        (this.U_CRTD_BY = null),
        (this.U_TRX_NO = null),
        (this.U_DRVR_NAME = null),
        (this.U_REQUESTED_SACKS = null),
        (this.U_SACKS = null),
        (this.U_EMPTY_SACKS = null),
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
        (this.U_CMMDTY = null),
        (this.U_DRVR_LNAME = null),
        (this.U_DRVR_FNAME = null),
        (this.U_HLPR_FNAME = null),
        (this.U_HLPR_LNAME = null),
        (this.U_PLATE_NUMBER = null),
        (this.U_DTE_CRTD = null),
        (this.U_CRTD_BY = null),
        (this.U_TRX_NO = null),
        (this.U_DRVR_NAME = null),
        (this.U_REQUESTED_SACKS = null),
        (this.U_SACKS = null),
        (this.U_EMPTY_SACKS = null),
        (this.U_HLPR_NAME = null);
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

    async printReceipt(data) {
      this.$refs.Receipt.print(data);
    },
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
    async printed(U_TRX_ID) {
      console.log(U_TRX_ID);
      try {
        this.showLoading = true;
        const userDetails = JSON.parse(localStorage.user_details);

        const employee_id = userDetails.Code;

        const res = await axios({
          method: "PUT",
          url: `${this.$axios.defaults.baseURL}/api/transaction/print/${U_TRX_ID.U_TRX_ID}`,
          headers: {
            Authorization: `B1SESSION=${localStorage.SessionId}`
          },
          data: {
            employee_id,
            U_TRX_ID: this.U_TRX_ID
          }
        });
        this.showLoading = false;
        this.$refs.Receipt.print(U_TRX_ID);
        // this.$bvModal.hide("bv-modal-confirmPrint");
        this.getTransactions();
      } catch (e) {
        console.log(e);
        this.showLoading = false;
        this.showAlert(res.message, "danger");
      }
    },
    async confirmCancel(U_TRX_ID) {
      //  console.log(this.U_TRX_ID);
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
        this.showAlert(res.message, "danger");
      }
    },

    cancel(data) {
      console.log(data);
      this.remarks = null
      this.U_CRTD_BY = data.U_CRTD_BY;
      this.U_TRX_ID = data.U_TRX_ID;
      this.U_TRX_NO = data.U_TRX_NO;
      this.U_TRANSACTION_TYPE = data.U_TRANSCTION_TYPE_ID;
      this.U_CMMDTY = data.U_ITEM;
      this.U_FRMR_NAME = data.U_FRMR_NAME;
      this.U_FRMR_ADD = data.U_FRMR_ADD;
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
      console.log(data);
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
      this.U_CRTD_BY = data.U_CRTD_BY;
      this.U_TRX_ID = data.U_TRX_ID;
      this.U_TRX_NO = data.U_TRX_NO;
      this.U_TRANSACTION_TYPE = data.U_TRANSCTION_TYPE_ID;
      this.U_CMMDTY = data.U_ITEM;
      this.U_FRMR_NAME = data.U_FRMR_NAME;
      this.U_FRMR_ADD = data.U_FRMR_ADD;
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
        new Date(moment(`${data.U_SCHEDULED_DATE} ${this.intToTime(data.U_SCHEDULED_TIME)}`).format(
          "YYYY-MM-DD HH:mm"
        ))
      );
      this.$bvModal.show("edit-transaction-modal");
    },
    show(data) {
      console.log(data);
      this.U_DTE_CRTD = data.U_DTE_CRTD;
      this.U_CRTD_BY = data.U_CRTD_BY;
      this.U_TRX_ID = data.U_TRX_ID;
      this.U_TRX_NO = data.U_TRX_NO;
      this.U_TRANSACTION_TYPE = data.U_TRANSACTION_TYPE;
      this.U_CMMDTY = data.U_CMMDTY;
      this.U_FRMR_NAME = data.U_FRMR_NAME;
      this.U_FRMR_ADD = data.U_FRMR_ADD;
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
     async getPriceList() {
      const res = await axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/api/items/selectPl
`,
        headers: {
          Authorization: localStorage.SessionId
        }
      });
      const v = res.data.view;

    ;  for (let i = 0; i < v.length; i++) {
        this.pricelist.push({
          text: v[i].ListName,
          value: v[i].ListNum
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
          text: v[i].ItemName,
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
          text: v[i].SUPPLIER_NAME,
          value: { id: v[i].SUPPLIER_ID, address: v[i].SUPPLIER_ADDRESS }
        });
      }
    },
    test() {
      console.log(this.U_FRMR_NAME)

      this.U_FRMR_ADD = this.U_FRMR_NAME.value.address;
    },
    async newDR(signature) {
      try {
        this.showLoading = true;
        //   this.U_TRANSACTION_TYPE= null;
        // this.U_FRMR_NAME=null;
        // this.U_FRMR_ADD=null;
        // this.U_CMMDTY=null;
        // this.U_DRVR_LNAME=null;
        // this.U_DRVR_FNAME=null;
        // this.U_HLPR_FNAME=null;
        // this.U_HLPR_LNAME=null;
        // this.U_PLATE_NUMBER=null;
        // this.U_DTE_CRTD=null;
        // this.U_CRTD_BY=null;
        // this.U_TRX_NO=null;
        // this.U_DRVR_NAME=null;
        // this.U_SACKS=null;
        // this.U_EMPTY_SACKS=null;
        // this.U_HLPR_NAME=null;

        let items = [];

        const userDetails = JSON.parse(localStorage.user_details);
      // console.log(this.U_FRMR_NAME.value.id)
      // console.log(this.U_CMMDTY.value)
        const json = {
          priceList: this.U_PRICELIST,
          transaction_type_id: this.U_TRANSACTION_TYPE,
          item_id: this.U_CMMDTY.value,
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

        // console.log("@here", json)

        var fd = new FormData();
        fd.append("", signature, signature.name);
        fd.append("priceList", this.U_PRICELIST);
        fd.append("transaction_type_id", this.U_TRANSACTION_TYPE);
        fd.append("item_id", this.U_CMMDTY.value);
        fd.append("farmer_id", this.U_FRMR_NAME.value.id);
        fd.append("driver_name", this.U_DRVR_LNAME + ", " + this.U_DRVR_FNAME);
        fd.append("helper_name", this.U_HLPR_LNAME + ", " + this.U_HLPR_FNAME);
        fd.append("no_of_requested_bags", this.U_REQUESTED_SACKS);

        if (this.U_SACKS && this.U_EMPTY_SACKS) {
          fd.append("no_of_bags", this.U_SACKS);
          fd.append("no_of_empty_bags", this.U_EMPTY_SACKS);
        }
        fd.append("employee_id", userDetails.Code);
        fd.append("plate_number", this.U_PLATE_NUMBER);
        fd.append("scheduled_date", this.U_SCHEDULED_DATE);
        fd.append("scheduled_time", this.U_SCHEDULED_TIME);

        // await json.each(data, function(key, value) {
        //   fd.append(key, value);
        // });

        const res = await axios.post(
          `${this.$axios.defaults.baseURL}/api/transaction/add`,
          fd,
          {
            headers: { Authorization: `B1SESSION=${localStorage.SessionId}` }
          }
        );

        // const res = await axios({
        //   method: "POST",
        //   url: `${this.$axios.defaults.baseURL}/api/transaction/add`,
        //   fd,
        //   headers: {
        //     Authorization: `B1SESSION=${localStorage.SessionId}`
        //   }
        // });

        this.$bvModal.hide("signature");
        this.showLoading = false;
        this.getTransactions();
        this.$bvModal.hide("add-transaction-modal");
        console.log(res)
        this.showAlert(res.data.posted.msg, "success");
        this.close();
        // this.$refs.Receipt.print(data);
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

        const json = {
          //  transaction_type_id: this.U_TRANSACTION_TYPE,
          //  item_id: this.U_CMMDTY ,
          //  farmer_id: this.U_FRMR_NAME,
          driver_name: this.U_DRVR_LNAME + ", " + this.U_DRVR_FNAME,
          helper_name: this.U_HLPR_LNAME + ", " + this.U_HLPR_FNAME,
          no_of_requested_bags: this.U_REQUESTED_SACKS,
          no_of_bags: this.U_SACKS,
          no_of_empty_bags: this.U_EMPTY_SACKS,
          employee_id: userDetails.Code,
          plate_number: this.U_PLATE_NUMBER,
          scheduled_date: this.U_SCHEDULED_DATE,
          scheduled_time: this.U_SCHEDULED_TIME
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
        this.showAlert("Successfully Updated", "success");
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
      try {
        const userDetails = JSON.parse(localStorage.user_details);
        const roleDetails = JSON.parse(localStorage.user_role);

        const employee_id = userDetails.Code;
        const employee_role = roleDetails.Name;

        this.showLoading = true;
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
            U_PRICELIST: v[i].priceList,
            U_TRANSACTION_TYPE: v[i].TRANSACTION_TYPE,
            U_CMMDTY: v[i].ITEM_NAME,
            U_FRMR_NAME: v[i].FARMER_NAME,
            U_FRMR_ADD: v[i].FARMER_ADDRESS,
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
            U_SCHEDULED_TIME: v[i].SCHEDULED_TIME
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
  }
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