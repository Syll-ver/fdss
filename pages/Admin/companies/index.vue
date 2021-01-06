<template>
  <div class>
    <b-card no-body class="mt-5">
      <b-tabs
        card
        small
        active-nav-item-class="font-weight-bold text-uppercase text-biotech"
      >
        <b-tab title="Company">
        <div>
            <CompaniesTable/>
        </div>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import CompaniesTable from "~/components/Admin/Companies/CompaniesTable";

export default {
  layout: "sidebar",
  components: {
    CompaniesTable
  },
  data() {
    return {
      tabIndex: 0
    };
  },
  methods: {},
};
</script>

