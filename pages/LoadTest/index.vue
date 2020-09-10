<template>
  <div class>
    <b-card no-body class="mt-5">
      <b-tabs
        card
        small
        active-nav-item-class="font-weight-bold text-uppercase text-biotech"
      >
        <b-tab title="Roles And Access Rights">
        <div>
            <LoadTest/>
        </div>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import axios from "axios";
import LoadTest from "@/components/LoadTest/dr";
export default {
  name: "Dashboard",
  layout: "sidebar",
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
