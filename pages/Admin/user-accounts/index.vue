<template>
  <div class>
    <b-card no-body class="mt-5">
      <b-tabs
        card
        small
        active-nav-item-class="font-weight-bold text-uppercase text-biotech"
      >
        <b-tab title="User Accounts">
        <div>
            <UserAccountsTable/>
        </div>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import UserAccountsTable from "~/components/Admin/UserAccounts/UserAccountsTable";

export default {
  layout: "Sidebar",
  components: {
    UserAccountsTable
  },
  data() {
    return {
      tabIndex: 0
    };
  },
  methods: {},
};
</script>

