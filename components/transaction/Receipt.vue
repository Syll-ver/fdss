<template>
  <div id="receipt">

    <b-row>
      <b-card class="check-card mr-4" style="width:31rem; height:70rem">
        <!-- <b-row>
          <b-col cols="6"> -->
                  
  
            <span>
                 <b-img src="/logo1.jpg" class="receipt-logo" center/>
              
            
           
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
              DELIVERY RECEIPT | {{ receiptData.U_TRANSACTION_TYPE }}
            </span>
            <br>
            <span><small>
              Date: {{receiptData.U_DTE_CRTD  }}
            </small></span>
    </center>

        <br />

 <span>
Transaction Number : {{ receiptData.U_TRX_NO }}
</span>
<br/>
<span>Schedule : {{ receiptData.U_SCHEDULED_DATE_AND_TIME }}</span>
              <br /><br>

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
                : {{ receiptData.U_FRMR_NAME }}
              </span>
            </div>
             <div class="dotted-border">
              <span class="mt-1">
                : {{ receiptData.U_FRMR_ADD }}
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
                :{{receiptData.U_CMMDTY}} 
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
                : {{receiptData.U_DRVR_NAME}}
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
                : {{receiptData.U_PLATE_NUMBER}}
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
                : {{receiptData.U_REQUESTED_SACKS}}
              </span>
            </div>
          </b-col>
        </b-row>
       <div v-if="receiptData.U_TRANSACTION_TYPE == 'Pick-up' && receiptData.U_UOM.UomEntry == 'BAG'">
                        <b-row >
          <b-col cols="4">
            <span>
             Quantity
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
               Empty Bags
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
          <div v-else-if="receiptData.U_TRANSACTION_TYPE == 'Pick-up' && receiptData.U_UOM.UomName == 'TRUCK LOAD'">
                  <b-row>
                    <b-col cols="4">
                      <span>Quantity</span>
                    </b-col>
              
                     <b-col cols="8">
                      <div class="dotted-border">
                        <span>: {{ receiptData.U_SACKS }} &nbsp; {{ receiptData.U_UOM.UomEntry }}</span>
                      </div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="4">
                      <span>Empty Bags</span>
                    </b-col>

                    <b-col cols="8">
                      <div class="dotted-border">
                        <span>: {{ receiptData.U_EMPTY_SACKS }} &nbsp;{{ receiptData.U_UOM.UomEntry }}</span>
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
                : {{receiptData.U_SACKS}}{{ receiptData.U_UOM }}
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
                : {{receiptData.U_EMPTY_SACKS}}
              </span>
            </div>
          </b-col>
        </b-row>
</div>
  <br>
        <b-row class="my-4">
          <b-col cols="6">

              <center>
              <span style="font-size:18px;border-bottom-style: solid; border-width:1px;margin:0;padding:0">
                {{receiptData.U_FRMR_NAME}}
              </span>
              <br>
              <span style="font-size:14px;"><B>
               &nbsp;&nbsp; FARMER'S NAME AND SIGNATURE
               &nbsp;&nbsp; </B>
              </span>
              </center>

          </b-col >

          <b-col cols="6" >
              
              <center>
              <span style="font-size:18px;border-bottom-style: solid; border-width:1px;margin:0;padding:0">
                {{receiptData.U_HLPR_NAME}}
              </span>
              <br>
              <span style="font-size:14px;"><B>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; REVIEWED BY
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </B>
              </span>
              </center> 
                
          </b-col>
        </b-row>
 

        <center>
          
        <span style="font-size:18px;border-bottom-style: solid; border-width:1px;">
            &nbsp;&nbsp;{{receiptData.U_CRTD_BY}}&nbsp;&nbsp;
        </span>
      <br>
        <span style="font-size:14px;">
            <b>&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;VERIFIED BY
              &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>
        </span>

        </center>
       

<br>
 
               
 <b-img :src="data2"  style="width:200px;height:200px;margin-top:13px" center/>
 <b-row class="mt-1">
          <b-col>
            <span style="font-size:14px" class="mr-2">
              <i>
                This does not serve as an Official Receipt
              </i>
            </span>

            <span style="font-size:14px; float:right" class="mr-1">
              <!-- <b>
                Farmer's Copy
              </b> -->
            </span>
          </b-col>
        </b-row>
        
      
         
      </b-card>

      <VueQrcode
        id="QRcode"
        type="String"
        :value="receiptData1"
      ></VueQrcode>
    </b-row>
  </div>
</template>
<script>
import VueQrcode from "@chenfengyuan/vue-qrcode";
export default {
  components: {
    VueQrcode
  },
  data() {
    return{
      receiptData:{},
      receiptData1:{},
      data2: null
    }
  },

  props:{
    
  },
 
  computed: {},

  methods: {
   async generateQr(){
     let tempLink = document.getElementById("QRcode");
     this.data2 = tempLink.toDataURL("image/png");
   },
    
    async print(data) {
        this.receiptData = {...data}
        // console.log(data.U_TRX_NO)
        // let datas = data.U_TRX_NO;
        // let qr = datas.split(" ")
        this.receiptData1 = data.U_TRX_NO


        // console.log(this.receiptData)
        await setTimeout({}, 3000);
        // Get HTML to print from element
        await this.generateQr();
        const prtHtml = await document.getElementById("receipt").innerHTML;

      
        // Get all stylesheets HTML

        let stylesHtml = "";
        for (const node of [
          ...document.querySelectorAll('link[rel="stylesheet"], style')
        ]) {
          stylesHtml += node.outerHTML;
        }

        // Open the print window
        const WinPrint = await window.open(
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
        
  // WinPrint.document.addEventListener(
  //         "load",
  //         function() {
              WinPrint.focus(); 
      
        WinPrint.document.close();
    WinPrint.print( )
      
      TRUE
        

  

      WinPrint.close();
    }
  },

  beforeCreate() {},

  created() {
      // this.print();
  }
};
</script>
<style scoped>
@media print {
  #print-button {
    display: none;
  }
  #receipt {
    height:100%;
    width: 50%;
    position: relative;
    left: 14px;
  }
}
span {
  font-size: 18px;
  font-weight: 600;
}
</style>
