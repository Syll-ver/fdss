<template>
  <div class="mainPages">
    <b-card no-body class="cardShadow mt-3">
      <b-tabs v-model="tabIndex" content-class="mt-1" card small>
        <b-tab id="tab-user-accounts" title="USER ACCOUNTS" class="tab" active-nav-item-class="font-weight-bold text-uppercase text-success">
          <b-card-text>
            <UserAccountsTable/>
          </b-card-text>
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

