<template>
  <div class="mainPages">
    <b-card no-body class="cardShadow mt-3">
      <b-tabs v-model="tabIndex" content-class="mt-1" card small>
        <b-tab id="tab-activity-logs" title="ACTIVITY LOGS" class="tab" active-nav-item-class="font-weight-bold text-uppercase text-success">
          <b-card-text>
            <ActivityLogsTable/>
          </b-card-text>
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

