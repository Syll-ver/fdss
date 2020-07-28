<template>
  <div class>
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
</template>

<script>
import PrintLogsTable from "~/components/Admin/PrintLogs/PrintLogs";

export default {
  layout: "sidebar",
  components: {
    PrintLogsTable
  },
  data() {
    return {
      tabIndex: 0
    };
  },
  methods: {},
};
</script>

