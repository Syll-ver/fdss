<template>
<div class>
    <b-card no-body class="mt-5">
      <b-tabs
        card
        small
        active-nav-item-class="font-weight-bold text-uppercase text-biotech"
      >
        <b-tab title="Modules">
          <div>
            <ModulesTable/>
          </div>
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

