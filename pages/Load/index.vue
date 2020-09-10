<template>
  <div class="body">
    <main>
      <LoadTest/>

      <!-- <div class="my-3 ml-2" id="requests-view">
        <Loading v-if="showLoading" />
        <center>
          <b-card style="width:700px">
            <div>
              <b-img src="/biotechfarms.jpg" style="width:200px;height:75px" center />
            </div>
            <h4 class="color1 ml-4">
              <b>FSQR QUEUEING DASHBOARD</b>
            </h4>
          </b-card>
        </center>
        <div class="my-4 ml-4">
          <b-row>
            <b-col cols="4">
              <b-card class="my-4 mr-2 ml-2" style="height:90%">
                <center>
                  <div class="h7">
                    <h4>CORN DRYING FACILITY</h4>
                    <p>
                      <b>NOW SERVING</b>
                    </p>
                    <hr />
                  </div>
                  <div>
                    <tbody>
                      <tr v-for="CDF in CDFs.slice(0,10)" :key="CDF" :value="CDF">
                        <b-card class="mt-2 button-style" style="background-color:	#00a651">
                          <div
                            v-if="
                              CDF.business_unit === 'CDF' &&
                                CDF.U_name === 'Analysis-Approved'
                            "
                          >
                            <h2 style="color:white">
                              <b style="text-transform: uppercase">{{CDF.U_trckpltno}}</b>
                            </h2>
                            <div>
                              <p style="color:white">
                                Driver: {{ CDF.U_driver }} |
                                {{ CDF.U_suppl_code }}
                              </p>
                            </div>
                          </div>
                        </b-card>
                      </tr>
                    </tbody>
                  </div>
                  <br />
                </center>
              </b-card>
            </b-col>
            <b-col cols="4">
              <b-card class="my-4 mr-4 ml-2" style="height:90%">
                <center>
                  <div class="h7">
                    <h4>PADDY DRYING FACILITY</h4>
                    <p>
                      <b>NOW SERVING</b>
                    </p>
                    <hr />
                  </div>
                  <div>
                    <tbody>
                      <tr v-for="PDF in PDFs.slice(0,10)" :key="PDF" :value="PDF">
                        <b-card class="mt-2 button-style" style="background-color:	#00a651">
                          <div
                            v-if="
                            PDF.business_unit === 'PDF' &&
                              PDF.U_name === 'Sampling'
                          "
                          >
                            <h2 style="color:white">
                              <b style="text-transform: uppercase">{{ PDF.U_trckpltno }}</b>
                            </h2>
                            <div>
                              <p style="color:white">
                                Driver: {{ PDF.U_driver }} |
                                {{ PDF.U_suppl_code }}
                              </p>
                            </div>
                          </div>
                        </b-card>
                      </tr>
                    </tbody>
                  </div>
                  <br />
                </center>
              </b-card>
            </b-col>
            <b-col cols="4">
              <b-card class="my-4 mr-4 ml-2" style="height:90%">
                <center>
                  <div class="h7">
                    <h4>FEEDMILL PLANT WAREHOUSE</h4>
                    <p>
                      <b>NOW SERVING</b>
                    </p>
                    <hr />
                  </div>
                  <div>
                    <tbody>
                      <tr v-for="FMP in FMPs.slice(0,10)" :key="FMP" :value="FMP">
                        <b-card class="mt-2 button-style" style="background-color:	#00a651">
                          <div
                            v-if="
                            FMP.business_unit === 'FMP' &&
                              FMP.U_name === 'Sampling'
                          "
                          >
                            <h2 style="color:white">
                              <b style="text-transform: uppercase">{{ FMP.U_trckpltno }}</b>
                            </h2>
                            <div>
                              <p style="color:white">
                                Driver: {{ FMP.U_driver }} |
                                {{ FMP.U_suppl_code }}
                              </p>
                            </div>
                          </div>
                        </b-card>
                      </tr>
                    </tbody>
                  </div>
                  <br />
                </center>
              </b-card>
            </b-col>
          </b-row> -->
          <!-- <b-row>
        <b-col cols="6">
          <b-card class="my-2 mr-2 ml-2" style="height:90%">
            <center>
              <div class="h7">
                <h4>FEEDMILL PLANT WAREHOUSE</h4>
                    <p><b>Now Serving </b></p>
              </div>
                <h1><b>FMP-1212832</b></h1>
                <br>
            </center>
          </b-card>
        </b-col>
        <b-col cols="6">
          <b-card class="my-2 mr-4 ml-2" style="height:90%">
            <center>
              <div class="h7">
                <h4>EXIT PASS</h4>
                    <br>
              </div>
                <h1><b>PDF-1212832</b></h1>
                <br>
            </center>
          </b-card>
        </b-col>
          </b-row>-->
        <!-- </div>
      </div> -->
    </main>
  </div>
</template>

<script>
import axios from "axios";
import LoadTest from "@/components/LoadTest/dr";
export default {
  name: "Dashboard",
  layout: "loginLayout",
    components: {
      LoadTest
    },
  data() {
    return {
      SuppliersCode: [],
      PDFs: [],
      CDFs: [],
      FMPs: []
    };
  },
  mounted() {
    axios
      .post(
        `${this.$axios.defaults.baseURL}/transactions/transactions/get_entry`
      )
      .then(response => {
        console.log(response);
        this.SuppliersCode = response.data;
        for (let index = 0; index < this.SuppliersCode.length; index++) {
          const element = this.SuppliersCode[index];

          if (
            element.business_unit === "PDF" &&
            element.U_name === "Sampling"
          ) {
            this.PDFs.push(element);
          }
          if (
            element.business_unit === "CDF" &&
            element.U_name === "Analysis-Approved"
          ) {
            this.CDFs.push(element);
          }
          if (
            element.business_unit === "FMP" &&
            element.U_name === "Sampling"
          ) {
            this.FMPs.push(element);
          }
        }
      })
      .catch(error => {
        console.log(error);
        this.errored = true;
      });
  }
};
</script>

<style>
body {
  overflow: hidden;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 50%;
}
.button-style {
  font-size: 15px;
  box-shadow: 0px 10px 20px -10px #000000;
}
</style>
