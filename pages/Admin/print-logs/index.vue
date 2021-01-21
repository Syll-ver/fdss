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
          <b-tab title="Print Logs">
          <div>
              <PrintLogsTable/>
          </div>
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>

<script>
import sidebar from "~/layouts/sidebar";
import PrintLogsTable from "~/components/Admin/PrintLogs/PrintLogs";

export default {
  // layout: "sidebar",
  components: {
    PrintLogsTable,
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

<style scoped>
  @media (max-width: 768px){
    .mainPages {
      margin-left: 20px;
    }
  }  
</style>