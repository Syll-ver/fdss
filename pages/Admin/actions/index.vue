<template>
  <div class="mainPages">
    <b-card no-body class="cardShadow mt-3">
      <b-tabs v-model="tabIndex" content-class="mt-1" card small>
        <b-tab id="tab-actions" title="ACTIONS" class="tab" active-nav-item-class="font-weight-bold text-uppercase text-success">
          <b-card-text>
            <ActionsTable/>
          </b-card-text>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import ActionsTable from "~/components/Admin/Actions/ActionsTable";

export default {
  layout: "Sidebar",
  components: {
    ActionsTable
  },
  data() {
    return {
      tabIndex: 0
    };
  },
  methods: {},
};
</script>

