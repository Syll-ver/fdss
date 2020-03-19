<template>
  <div class>
    <b-card no-body class="mt-5">
      <b-tabs
        card
        small
        active-nav-item-class="font-weight-bold text-uppercase text-biotech"
      >
        <b-tab title="Delivery Receipt">
          <div>
            <deliveryreceipt />
          </div>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import deliveryreceipt from "~/components/transaction/deliveryreceipt.vue";

export default {
  layout: "Sidebar",
  components: {
    deliveryreceipt
  },
  data() {
    return {};
  }
};
</script>

<style scoped></style>
