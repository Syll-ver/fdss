<template>
<div class="row m-0 p-0">
  <div class="container-fluid m-0 p-0">
    <sidebar />
  </div>
  <div class="mainPages col-md-10">
    <b-card class="mt-5 ">
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
  data() {
    return {
      tabIndex: 0
    };
  },
  methods: {},
};
</script>

<style scoped>
  .module {
    margin-left: 20px;
  }

  @media (max-width: 768px){
    .mainPages {
      margin-left: 20px;
    }
  }  
</style>