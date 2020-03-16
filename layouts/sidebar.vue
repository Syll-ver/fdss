<template>
  <div class="wrapper">
    <Loading v-if="showLoading" />
    <nav id="sidebarBFI">
      <div class="sidebar-header">
        <div>
          <b-img src="/rlogo.png" class="sidebar-image" center>
          </b-img><center>
          <p class="h9" >AUTOMATED DR SYSTEM</p>
          </center>
        </div>
        <hr class="hr-style" />

        <ul class="list-unstyled">
          <!-- <li>
            <a
              id="admin_toggle"
              v-b-toggle.collapse-1
              data-toggle="collapse"
              aria-expanded="false"
              class="dropdown-toggle mb-2"
            >
              <font-awesome-icon icon="user-cog" class="ml-2 mr-2" />Admin
            </a>

            <b-collapse id="collapse-1" class="mt-1">
              <li
                v-for="(adminroute, i) in adminroutes"
                class="ml-3 mt-1"
                :key="i"
                :style="
                  adminroute.active
                    ? 'background: #00803e; border-radius:3px'
                    : ''
                "
                @click="setAdminActive(i)"
              >
                <router-link :id="adminroute.id" :to="adminroute.link">
                  <font-awesome-icon
                    :icon="adminroute.icon"
                    :class="adminroute.class"
                  />
                  <span :style="adminroute.style">{{ adminroute.name }}</span>
                </router-link>
              </li>
            </b-collapse>
          </li> -->

          <!-- <li>
            <a
              id="transaction_toggle"
              v-b-toggle.collapse-transaction
              data-toggle="collapse"
              aria-expanded="false"
              class="dropdown-toggle mb-2"
            >
              <font-awesome-icon
                icon="file-signature"
                class="ml-2 mr-2"
              />Transaction
            </a>

            <b-collapse id="collapse-transaction" class="mt-1">
              <li
                v-for="(transaction_route, i) in transaction_routes"
                class="ml-3 mt-1"
                :key="i"
                :style="
                  transaction_route.active
                    ? 'background: #00803e; border-radius:3px'
                    : ''
                "
              >
                <router-link
                  :id="transaction_route.id"
                  :to="transaction_route.link"
                >
                  <font-awesome-icon
                    :icon="transaction_route.icon"
                    :class="transaction_route.class"
                  />
                  <span :style="transaction_route.style">{{
                    transaction_route.name
                  }}</span>
                </router-link>
              </li>
            </b-collapse>
          </li> -->

          <li
            v-for="(route, i) in routes"
            :key="i"
            :style="
              route.active ? 'background: #fff; border-radius:3px' : ''
            "
             @click="setActive(i)"
            class="mt-2 pending"
          >
            <router-link :id="route.id" :to="route.link">
              <font-awesome-icon :icon="route.icon" :class="route.class"  />
              {{ route.name }}
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
<div class="content">
      <div class="right">
        <b-row class="ml-3">
          <b-col cols="4" style="margin-top:10px;position:relative;right:6px">
            <font-awesome-icon
              style="color:black;height:25px;width:25px;"
              icon="user"
              class="icon1"
            />
          </b-col>
          <b-col cols="4" class="mt-1" style="position:relative;right:22px">
            <b-row>
              <b style="font-size:12px">{{ user }}&nbsp;</b>
            </b-row>
            <b-row>
              <b-badge variant="success" style="font-size:9px; width:4rem">
                {{role}}
              </b-badge>
            </b-row>
          </b-col>
          <b-col cols="4" style="margin-top:5px; position:relative; right:6px ">
            <b-button class="table-button" style="width:30px; height:30px">
              <font-awesome-icon
                id="logout"
                style="font-size:15px; position:relative; right:5px;"
                icon="power-off"
                @click="$bvModal.show('logout-modal')"
              />
            </b-button>
          </b-col>
        </b-row>
        <!-- Logout Modal -->
        <b-modal
          size="sm"
          header-bg-variant="success"
          header-text-variant="light"
          id="logout-modal"
          class="modal"
        >
          <template v-slot:modal-title>
            <h6>Confirm Log-out</h6>
          </template>
          <H6>Are you sure you want to log-out?</H6>
          <template v-slot:modal-footer="{}">
            <b-button
              id="btn-save-logout"
              size="sm"
              class="button"
              variant="success"
              href="/"
              style="font-size:13px"
              >Yes</b-button
            >
            <b-button
              id="btn-cancel-logout"
              size="sm"
              @click="$bvModal.hide('logout-modal')"
              variant="secondary"
              style="font-size:13px;border: 0px;"
              >No</b-button
            >
          </template>
        </b-modal>
        <!-- Logout Modal -->
      </div>
    </div>
    

    <!-- <div>
      <b-alert
        :show="alert.showAlert"
        dismissible
        :variant="alert.variant"
        @dismissed="alert.showAlert = null"
      >
        <font-awesome-icon
          :icon="alert.variant == 'success' ? 'check-circle' : 'exclamation'"
          class="mr-1"
          style="font-size:20px"
        />
        {{ alert.message }}
      </b-alert>
    </div> -->

    <div class="nuxt-table ml-3">
      <nuxt :key="reload" />
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
import Loading from "~/components/Loading.vue";
import axios from "axios";

export default {
  components: {
    Loading
  },

  data() {
    return {
      reload: 0,
      user_password: null,
      showLoading: false,

      role: "Admin Staff",
      user: "Zaina",
      activelinks: [],
      isAdmin: false,
      database: {
        name: localStorage.Company
      },

      adminroutes: [
        {
          link: "/admin/modules",
          id: "modules",
          name: "Modules",
          icon: "th-large",
          style: "position:relative;left:6px",
          class: "ml-2",
          active: false
        },

        {
          link: "/admin/action",
          id: "actions",

          name: "Actions",
          icon: "tasks",
          style: "position:relative;left:7px",
          class: "ml-2",
          active: false
        },

        {
          link: "/admin/roles_and_access",
          id: "roles_and_access",
          name: "Roles and Access",
          style: "position:relative;left:5px",
          icon: "id-card",
          class: "ml-2",
          active: false
        },

        {
          id: "users",
          link: "/admin",
          name: "Users",
          icon: "users",
          class: "ml-2 mr-1",
          active: false
        },

        {
          link: "/admin/series",
          name: "Receipt Series",
          icon: "file-alt",
          style: "position:relative;left:11px",
          class: "ml-2",
          active: false
        },

        {
          link: "/admin/activity_log",
          id: "act_log",
          name: "Activity Logs",
          icon: "book-open",
          style: "position:relative;left:6px",
          class: "ml-2",
          active: false
        }
      ],

      transaction_routes: [],

      routes: [
        {
          id: "deliveryreceipt",
          link: "/transaction/deliveryreceipt",
          name: "Delivery Receipt",
          icon: "home",
          style: "position:relative;left:6px",
          class: "ml-2",
          active: false
        },

        // {
        //   id: "completed_receipts",
        //   link: "/transaction/completed_receipts",
        //   name: "Completed Receipts",
        //   icon: "clipboard-check",
        //   class: "ml-2 mr-1",
        //   active: false
        // },

        // {
        //   id: "validated_receipts",
        //   link: "/transaction/validated_receipts",
        //   name: "Validated Receipts",
        //   icon: "check",
        //   class: "ml-2 mr-1",
        //   active: false
        // },


        // {
        //   id: "accounting_pick_list",
        //   link: "/transaction/accounting_pick_list",
        //   name: "Accounting Pick List",
        //   icon: "clipboard-list",
        //   class: "ml-2 mr-1",
        //   active: false
        // },

        // {
        //   id: "picked_receipts",
        //   link: "/transaction/picked_receipts",
        //   name: "Picked Receipts",
        //   icon: "hand-point-right",
        //   class: "ml-2 mr-1",
        //   active: false
        // },

         {
          id: "reports",
          link: "/transaction/reports",
          name: "Reports",
          icon: "file",
          class: "ml-2 mr-1",
          active: false
        },





        //  {
        //   id: "standard_receipts",
        //   link: "/transaction/standard_receipts",
        //   name: "Standard Receipts",
        //   icon: "clipboard-list",
        //   class: "ml-2 mr-1",
        //   active: false
        // },

        //  {
        //   id: "misc_receipts",
        //   link: "/transaction/miscellaneous_receipts",
        //   name: "Miscellaneous Receipts",
        //   icon: "clipboard-list",
        //   class: "ml-2 mr-1",
        //   active: false
        // }

      ],

      alert: {
        showAlert: 0,
        dismissSecs: 0,
        variant: "success",
        message: ""
      },
      tempCompany: null
    };
  },
  methods: {

     async setActive(i) {

      this.routes.map((route, index) => {
        if (index === i) {
          route.active = true;
        } else {
          route.active = false;
        }
      });
    },
  }
};
</script>

<style>




</style>


