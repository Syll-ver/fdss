<template>
  <div class>
    <b-card no-body class="mt-5">
      <b-tabs
        card
        small
        active-nav-item-class="font-weight-bold text-uppercase text-biotech"
      >
        <b-tab title="Activity Logs">
        <div>
            <ActivityLogsTable/>
        </div>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import ActivityLogsTable from "~/components/Admin/ActivityLogs/ActivityLogsTable";

export default {
  layout: "Sidebar",
  components: {
    ActivityLogsTable
  },
  data() {
    return {
      tabIndex: 0
    };
  },
  methods: {},
};
</script>

