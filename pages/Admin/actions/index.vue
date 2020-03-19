<template>
  <div class>
    <b-card no-body class="mt-5">
      <b-tabs
        card
        small
        active-nav-item-class="font-weight-bold text-uppercase text-biotech"
      >
        <b-tab title="Actions">
        <div>
            <ActionsTable/>
        </div>
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

