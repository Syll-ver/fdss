<template>
<div class="row m-0 p-0">
  <div class="m-0 p-0">
    <sidebar />
  </div>
  <div class="mainPages">
    <b-card no-body class="mt-5 card-content">
      <b-tabs
        card
        small
        active-nav-item-class="font-weight-bold text-uppercase text-print"
      >
        <b-tab title="Modules">
          <div>
            <ModulesTable/>
          </div>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</div>
</template>

<script>
import sidebar from "~/layouts/sidebar";
import ModulesTable from "~/components/Admin/Modules/ModulesTable";

export default {
  // layout: "sidebar",
  components: {
    ModulesTable,
    sidebar,
    // header,
  },
  head() {
    return {
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1, shrink-to-fit=no" }
      ]
    }
  },
  data() {
    return {
      tabIndex: 0
    };
  },
  methods: {},
};
</script>