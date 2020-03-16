<template>
  <div class="mainPages">
    <b-card no-body class="cardShadow mt-3">
      <b-tabs v-model="tabIndex" content-class="mt-1" card small>
        <b-tab id="tab-modules" title="MODULES" class="tab" active-nav-item-class="font-weight-bold text-uppercase text-success">
          <b-card-text>
            <ModulesTable/>
          </b-card-text>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import ModulesTable from "~/components/Admin/Modules/ModulesTable";

export default {
  layout: "Sidebar",
  components: {
    ModulesTable
  },
  data() {
    return {
      tabIndex: 0
    };
  },
  methods: {},
};
</script>

