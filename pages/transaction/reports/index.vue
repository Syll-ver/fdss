<template>
  <div class>
    <b-card no-body class="mt-5">
      <b-tabs
        card
        small
        active-nav-item-class="font-weight-bold text-uppercase text-biotech"
      >


         <b-tab title="Reports">
          <div>
           <reports />
          </div>
        </b-tab>

      </b-tabs>
    </b-card>
  </div>
</template>

<script>

import reports from "~/components/transaction/reports.vue";


export default {
  layout: "sidebar",
  components: {
    reports
  },
  data() {
    return {};
  }
};
</script>

<style scoped></style>
