<template>
    <div class="wrapper">
         <!-- HEADER NAVIGATION BAR-->
    <div class="content" fluid>
      <div class="right">
        <b-row>
          <b-col cols="3" style="margin-top:10px">
            <font-awesome-icon
              style="color: #2F3028; height: 28px; width:28px"
              icon="user"
            />
          </b-col>
          <b-col cols="6" style="margin-top:5px">
            <b-row>
              <b style="font-size:12px">{{ user }}&nbsp;</b>
            </b-row>
            <b-row>
              <b-badge variant="biotech" style="font-size:9px; width:4rem">{{
                &nbsp; role  &nbsp;
              }}</b-badge>
            </b-row>
          </b-col>
          <b-col id="btn-logout" cols="3" style="margin-top:10px;">
            <b-button
              id="btn-logout"
              size="sm"
              @click="confirmLogout()"
              class="button-circle"
              variant="secondary"
            >
              <font-awesome-icon
                style="font-size:12.5px; margin-right: 2px"
                icon="power-off"
              />
            </b-button>
          </b-col>
        </b-row>
      </div>
      <div class="nuxt-table ml-3">
        <nuxt />
      </div>
    </div>

    <b-modal
      size="md"
      header-bg-variant="biotech"
      header-text-variant="light"
      id="bv-modal-confirmLogout"
      class="modal"
      hide-header-close
      no-close-on-backdrop
    >
      <template v-slot:modal-title>
        <h6>Confirm Log-out</h6>
      </template>

      <div style="font-size: 13px">Are you sure you want to 'Log-out'?</div>

      <template v-slot:modal-footer="{  cancel }">
        

        <b-button
          id="btn-save-logout"
          size="sm"
          variant="biotech"
          @click="logout()"
          style="font-size:13px"
          >Yes</b-button
        >
        <b-button
          id="btn-cancel-logout"
          size="sm"
          @click="cancel()"
          style="font-size:13px;border: 0px;"
          >No</b-button
        >
      </template>
    </b-modal>

    <!-- Session Modal -->
    <b-modal
      size="md"
      id="session_modal"
      header-text-variant="dark"
      no-close-on-backdrop
      hide-header-close
    >
      <template v-slot:modal-title>
        <h6>Session Timeout</h6>
      </template>

      <b-row class="m-1">
        <b-col cols="3" class="mb-2">
          <font-awesome-icon
            icon="exclamation-triangle"
            style="color:gray;font-size:2.8rem"
            class="mr-1"
          />
        </b-col>
        <b-col cols="9">
          <div style="position:relative; top:9px">
            <h6 style="font-size:15px; color: #545454;">
              Your session has timed out. Please login again.
            </h6>
          </div>
        </b-col>
      </b-row>
      <template v-slot:modal-footer>
        <b-button
          id="saveprocess_md"
          size="sm"
          variant="success"
          @click="$router.push('/')"
          style="font-size:13px"
          class="button px-4"
          >Ok</b-button
        >
      </template>
    </b-modal>
    </div>
</template>

<script>
export default {
 
  data() {
    return {
      role: "",
      user: "",
      activelinks: [],
      isAdmin: false,
      //PAaccess: false,
      visible: false,
      visiblePrice: false,
    };
  },

  methods: {
    confirmLogout() {
      this.$bvModal.show("bv-modal-confirmLogout");
    },

    logout() {
      localStorage.clear();
      this.$router.push("/");
    }
  }
};
</script>

<style scoped>
a {
  color: #fff;
  text-decoration: none;
  background-color: transparent;
}
</style>