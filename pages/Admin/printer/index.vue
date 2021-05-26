<template>
  <div class="row m-0 p-0">
    <div class="container-fluid m-0 p-0">
      <sidebar />
    </div>
    <div class="mainPages">
      <b-card no-body class="mt-5">
        <b-tabs
          card
          small
          active-nav-item-class="font-weight-bold text-uppercase text-biotech"
        >
          <b-tab title="Printer">
          <div>
              <PrintTable/>
          </div>
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>

<script>
import sidebar from "~/layouts/sidebar";
import PrintTable from "~/components/Admin/Printer/PrinterTable.vue";

export default {
  // layout: "sidebar",
  components: {
    PrintTable,
    sidebar
  },
  data() {
    return {
      tabIndex: 0
    };
  },
  methods: {},
};
</script>