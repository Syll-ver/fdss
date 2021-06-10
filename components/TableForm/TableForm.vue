<template>
    <div>
      <span>
        <div class="accordion" role="tablist">
          <b-card no-body v-for="(item, U_TRX_NO) in tableForm" :key="U_TRX_NO" style="border-width:0px">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button block size="sm" 
                v-b-toggle="(item.U_TRX_NO)"
                variant="light"
                @click="show(item)"
                >
                <div class="m-0">
                  <b-row class="m-0 p-0" align="start">
                    <b-col class="m-0 p-0" cols="12">
                      {{ item.U_TRX_NO }}
                    </b-col>
                  </b-row>
                  <b-row class="m-0 p-0" style="font-size:11px;">
                    <b-col>
                      <div class="p-0">
                        <b-row>
                          Commodity: {{ item.U_CMMDTY }} - {{ item.U_SACKS + ' ' + item.U_UOM }}
                        </b-row>
                        <b-row>
                          Farmer: {{ item.U_FRMR_NAME }}
                        </b-row>
                        <div class="m-0 p-0">
                          <b-row>
                            <b-col cols="8" class="m-0 p-0" align="left">
                              Schedule Date: {{ (item.U_SCHEDULED_DATE_AND_TIME) }}
                            </b-col>
                            <b-col cols="4">
                              <b-row>
                                <b-col class="p-0 mb-0 ml-0 mr-0" cols="6" align="right">
                                  {{ item.U_TRANSACTION_TYPE == 'Delivery' ? 'Direct' : 'Pick-up' }} 
                                </b-col>
                                <b-col class="p-0 m-0" cols="6">
                                  <b-badge v-if="item.U_STATUS == 'Pending' " variant="pending" style="font-size:10px;">
                                    {{ item.U_STATUS }}
                                  </b-badge>
                                  <b-badge v-if="item.U_STATUS == 'Printed' " variant="edit" style="font-size:10px;">
                                    {{ item.U_STATUS }}
                                  </b-badge>
                                </b-col>
                              </b-row>
                            </b-col>
                          </b-row>
                        </div>
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </b-button>
            </b-card-header>
            <b-collapse :id="item.U_TRX_NO" role="tabpanel">
              <b-card-body scroll>
                <b-card-text>
                  <div>
                    <span>
                      <b-img :src="logo" class="receipt-logo" center />
                    </span>
                    <center>
                      <span>
                        DELIVERY SLIP | {{  U_TRANSACTION_TYPE == 'Delivery' ? 'Direct' : 'Pick-up' }}
                      </span>
                      <br />
                      <span>
                        <small>Date: {{ U_DTE_CRTD }}</small>
                      </span>
                    </center>
                    <br />
                    <span>Transaction Number : {{ U_TRX_NO }} </span>
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
                          <span> : {{ U_APP_ProjCode != null ? U_APP_ProjCode : "" ||
                            U_APP_ProjCode != undefined ? U_APP_ProjCode : "" }} </span>
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
                        U_TRANSACTION_TYPE === 'Pick-up' && U_UOM === 'BAG'
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
                            <span>: {{ U_SACKS }} {{ U_UOM }}</span>
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
                            <span>: {{ U_SACKS }} {{ U_UOM }}</span>
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

                    <b-row>
                      <b-col cols="4">
                        <span>Remarks</span>
                      </b-col>
                      <b-col cols="8">
                        <div class="dotted-border">
                          <span class="mt-1">: {{ U_REMARKS }}</span>
                        </div>
                      </b-col>
                    </b-row>

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
                      <div class="signature-name">
                        <img class="signature-sign" :src="U_SIGNATURE_PATH">
                        <br>
                        <br>
                        <div class="signature-print">
                          <span class="" style="font-size:9px;">
                            &nbsp;&nbsp;{{ U_CRTD_BY }}&nbsp;&nbsp;
                          </span>
                          <br />
                          <span style="border-top-style: solid; border-width:1px;font-size:9px;">
                            <b>
                              &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VERIFIED
                              BY &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </b>
                          </span>
                        </div>
                      </div>
                      
                    </center>
                    <b-row style="float:right" class="mr-1 mt-1"></b-row>
                    <br />
                  </div>
                </b-card-text>
              </b-card-body>
            </b-collapse>

          </b-card>
        </div>
      </span>
    </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
    name: 'TableForm',
    props: ['tableForm'],
    created() {

    },
    data() {
        return {
          U_TRX_NO: this.tableForm.U_TRX_NO,
          U_TRX_ID: this.tableForm.U_TRX_ID,
          U_TRANSCTION_TYPE_ID: this.tableForm.U_TRANSCTION_TYPE_ID,
          U_ITEM: this.tableForm.U_ITEM,
          U_SUPP: this.tableForm.U_SUPP,
          U_TRANSACTION_TYPE: this.tableForm.U_TRANSACTION_TYPE,
          U_CMMDTY: this.tableForm.U_CMMDTY,
          U_UOM: this.tableForm.U_UOM,
          U_UOM_ID: this.tableForm.U_UOM_ID,
          U_FRMR_NAME: this.tableForm.U_FRMR_NAME,
          U_FRMR_ADD: this.tableForm.U_FRMR_ADD,
          U_APP_ProjCode: this.tableForm.U_APP_ProjCode,
          U_DTE_CRTD: this.tableForm.U_DTE_CRTD,
          U_CRTD_BY: this.tableForm.U_CRTD_BY,
          U_STATUS: this.tableForm.U_STATUS,
          U_PLATE_NUMBER: this.tableForm.U_PLATE_NUMBER,
          U_HLPR_NAME: this.tableForm.U_HLPR_NAME,
          U_DRVR_NAME: this.tableForm.U_DRVR_NAME,
          U_REQUESTED_SACKS: this.tableForm.U_REQUESTED_SACKS,
          U_EMPTY_SACKS: this.tableForm.U_EMPTY_SACKS,
          U_SACKS: this.tableForm.U_SACKS,
          U_SCHEDULED_DATE_AND_TIME: this.tableForm.U_SCHEDULED_DATE_AND_TIME,
          U_SCHEDULED_DATE: this.tableForm.U_SCHEDULED_DATE,
          U_SCHEDULED_TIME: this.tableForm.U_SCHEDULED_TIME,
          TRANSACTION_COMPANY_ID: this.tableForm.TRANSACTION_COMPANY_ID,
          TRANSACTION_COMPANY: this.tableForm.TRANSACTION_COMPANY,
          IFPASSRMRS: this.tableForm.IFPASSRMRS,
          U_REMARKS: this.tableForm.U_REMARKS,
          logo: null,
          U_SIGNATURE_PATH: null,
          U_SIGNATURE: null,
        }
    },
    methods: {
        async show(data) {
            if(data.U_TRX_NO.charAt(0) == 'R') {
                this.logo = '/logo1.png'
            } else {
                this.logo = '/blogo.png'
            }
            this.U_SIGNATURE_PATH = await this.getSignature(data.U_TRX_NO);

            this.TRANSACTION_COMPANY = data.TRANSACTION_COMPANY;
            this.U_DTE_CRTD = data.U_DTE_CRTD;
            this.U_CRTD_BY = data.U_CRTD_BY;
            this.U_TRX_ID = data.U_TRX_ID;
            this.U_TRX_NO = data.U_TRX_NO;
            this.U_TRANSACTION_TYPE = data.U_TRANSACTION_TYPE;
            this.U_CMMDTY = data.U_CMMDTY;
            (this.U_UOM = data.U_UOM), (this.U_FRMR_NAME = data.U_FRMR_NAME);
            this.U_FRMR_ADD = data.U_FRMR_ADD;
            this.U_APP_ProjCode = data.U_APP_ProjCode;
            this.U_DRVR_NAME = data.U_DRVR_NAME;
            this.U_HLPR_NAME = data.U_HLPR_NAME;
            this.U_REQUESTED_SACKS = data.U_REQUESTED_SACKS;
            this.U_SACKS = data.U_SACKS;
            this.U_EMPTY_SACKS = data.U_EMPTY_SACKS;
            this.U_PLATE_NUMBER = data.U_PLATE_NUMBER;
            this.U_SCHEDULED_DATE_AND_TIME = data.U_SCHEDULED_DATE_AND_TIME;
            this.U_REMARKS = data.U_REMARKS;
            this.$bvModal.show("view-transaction-modal");
            },
            async getSignature(U_TRX_NO) {
            this.showLoading = true;
            const res = await axios({
                method: "GET",
                url: `${this.$axios.defaults.baseURL}/api/transaction/get-signature/${U_TRX_NO}`,
            })
            this.showLoading = false;
            return this.$axios.defaults.baseURL+res.data.view[0].U_SIGNATURE;
            },
    }
}
</script>