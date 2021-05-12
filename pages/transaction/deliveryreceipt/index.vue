<template>
  <div class="row m-0 p-0" style="height: 100%">
    <div class="m-0 p-0">
      <sidebar />
    </div>
    <div class="mainPages">
      <b-card no-body class="mt-5 card-content">
        <b-tabs
          card
          small
          active-nav-item-class="font-weight-bold text-uppercase text-biotech"
        >
          <b-tab title="Delivery Slip">
            <div>
              <deliveryreceipt />
            </div>
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>

<script>
import sidebar from "~/layouts/sidebar";
import deliveryreceipt from "~/components/transaction/deliveryreceipt.vue";

export default {
  // layout: "sidebar",
  components: {
    deliveryreceipt,
    sidebar
  },
  data() {
    return {};
  }
};
</script>
