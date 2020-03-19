<template>
  <div id="receipt">
    <b-row>
      <b-card class="check-card mr-4" style="width:31rem; height:40rem">
        <!-- <b-row>
          <b-col cols="6"> -->
            <span>
             
                 <b-img src="/revive.png" class="receipt-logo" center/>
       
           
            </span>
          <!-- </b-col>
          <b-col cols="6">
            <span>
              Group: Payment Center
            </span>
          </b-col>
        </b-row> -->

  <center>
 
            <span>
              DELIVERY RECEIPT | {{ U_TRANSACTION_TYPE }}
            </span>
            <br>
            <span><small>
              Date: {{U_DTE_CRTD  }}
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



        <b-row>
          <b-col cols="4">
            <span>
              Item
            </span>
          </b-col>

          <b-col cols="8">
            <div class="dotted-border">
              <span>
                :{{U_CMMDTY}} 
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
        <div v-if="U_TRANSACTION_TYPE === 'Pick-up'">
                        <b-row >
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
        </div>
<div v-else>
               <b-row >
          <b-col cols="4">
            <span>
              Number of Sacks
            </span>
          </b-col>

          <b-col cols="8">
            <div class="dotted-border">
              <span>
                : {{U_SACKS}}
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
                : {{U_EMPTY_SACKS}}
              </span>
            </div>
          </b-col>
        </b-row>
</div>
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


        <b-row class="mt-4">
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
        </b-row>
      </b-card>
<!-- 
      <b-card class="check-card" style="width:31rem; height:40rem">
        <b-row>
          <b-col cols="6">
            <span>
              <b>
                BIOTECH FARMS INC.
              </b>
            </span>
          </b-col>
          <b-col cols="6">
            <span>
              Group: Payment Center
            </span>
          </b-col>
        </b-row>

        <b-row>
          <b-col cols="6">
            <span>
              ACKNOWLEDGEMENT SLIP
            </span>
          </b-col>
          <b-col cols="6">
            <span>
              Date: 27-Jan-2020
            </span>
          </b-col>
        </b-row>

        <br />

        <b-row>
          <b-col cols="4">
            <span>
              Customer's Name
            </span>
          </b-col>
          <b-col cols="8">
            <div class="dotted-border">
              <span>
                : LOST AND FOUND
              </span>
            </div>
          </b-col>
        </b-row>
        <br />

        <b-row>
          <b-col cols="4">
            <span>
              Amount
            </span>
          </b-col>

          <b-col cols="8">
            <div class="dotted-border">
              <span>
                : TWO HUNDRED TWENTY PESOS ONLY
              </span>
            </div>
            <div class="dotted-border">
              <span class="mt-1">
                : Php 220.00
              </span>
            </div>
          </b-col>
        </b-row>

        <br />

        <b-row>
          <b-col cols="4">
            <span>
              In Payment for
            </span>
          </b-col>

          <b-col cols="8">
            <div class="dotted-border">
              <span>
                : Payment for Lost And Found
              </span>
            </div>
          </b-col>
        </b-row>

        <br />

        <b-row>
          <b-col cols="4">
            <span>
              Reference
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

        <b-row>
          <b-col cols="4">
            <span>
              TYPE OF COLLECTION
            </span>
            <b-form-checkbox>Cash</b-form-checkbox>
            <b-form-checkbox>Check</b-form-checkbox>
          </b-col>

          <b-col cols="8">
            <b-card class="check-card">
              <b-row>
                <b-col cols="5">
                  <span>
                    Check Date
                  </span>
                </b-col>
                <b-col cols="7">
                  <div class="dotted-border">
                    <span>
                      :
                    </span>
                  </div>
                </b-col>
              </b-row>

              <b-row>
                <b-col cols="5">
                  <span>
                    Check No.
                  </span>
                </b-col>
                <b-col cols="7">
                  <div class="dotted-border">
                    <span>
                      :
                    </span>
                  </div>
                </b-col>
              </b-row>

              <b-row>
                <b-col cols="5">
                  <span>
                    Bank Name
                  </span>
                </b-col>
                <b-col cols="7">
                  <div class="dotted-border">
                    <span>
                      :
                    </span>
                  </div>
                </b-col>
              </b-row>
            </b-card>
          </b-col>
        </b-row>
        <br />
        <b-row>
          <b-col>
            <b-card class="check-card">
              <b-form inline>
                <span>
                  Remarks:
                </span>

                <span class="ml-2">
                  #45678912
                </span>
              </b-form>
            </b-card>
          </b-col>
        </b-row>

        <br />

        <b-row>
          <b-col>
            <b-form inline>
              <span>
                Farmer's Signature:
              </span>
              &nbsp;

              <span style="border-bottom-style: solid; border-width:1px">
                JUDY DELFIN
              </span>
            </b-form>
          </b-col>

          <b-col cols="auto" class="mr-3">
            <b-row>
              <span>
                Checked By:
              </span>
              &nbsp;
              <span style="border-bottom-style: solid; border-width:1px">
                JUDY DELFIN
              </span>
            </b-row>
          </b-col>
        </b-row>

        <b-row style="float:right" class="mr-1 mt-1">
          <span>
            <b>
             
            </b>
          </span>
        </b-row>

        <b-row class="mt-4">
          <b-col>
            <span style="font-size:10px" class="mr-2">
              <i>
                This does not serve as an Official Receipt
              </i>
            </span>

            <span style="font-size:12px; float:right" class="mr-1">
              <b>
                2nd Copy
              </b>
            </span>
          </b-col>
        </b-row>
      </b-card> -->
    </b-row>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return{
      receiptData:{}
    }
  },
 
  computed: {},

  methods: {
   
    
    async print(data) {
      this.receiptData = {...data}
      console.log(this.receiptData)
      await setTimeout({}, 1000);
      // Get HTML to print from element
      const prtHtml = document.getElementById("receipt").innerHTML;

      // Get all stylesheets HTML
      let stylesHtml = "";
      for (const node of [
        ...document.querySelectorAll('link[rel="stylesheet"], style')
      ]) {
        stylesHtml += node.outerHTML;
      }

      // Open the print window
      const WinPrint = window.open(
        "",
        "",
        "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0"
      );

      WinPrint.document.write(`<!DOCTYPE html>
              <html>
              <head>
                  ${stylesHtml}
              <style>
                  body {margin-left: 1rem;}

              </style>
              </head>
              <body>
                  ${prtHtml}
              </body>
      </html>`);

      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();

      // WinPrint.close();
    }
  },

  beforeCreate() {},

  created() {
    //   this.print();
  }
};
</script>
<style scoped>
@media print {
  #print-button {
    display: none;
  }
  #receipt {
    height: 50%;
    width: 20%;
    position: relative;
    left: 14px;
  }
}
span {
  font-size: 13px;
  font-weight: 500;
}
</style>
