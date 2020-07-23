<template>
  <div class>
    <b-card no-body class="mt-5">
      <b-tabs
        card
        small
        active-nav-item-class="font-weight-bold text-uppercase text-biotech"
      >
        <b-tab title="Roles And Access Rights">
        <div>
            <RolesTable/>
        </div>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import RolesTable from "~/components/Admin/Roles/RolesTable";

export default {
  layout: "sidebar",
  components: {
    RolesTable
  },
  data() {
    return {
      tabIndex: 0
    };
  },
  methods: {},
};
</script>

