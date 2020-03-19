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
          <li v-if="isAdmin">
            <a
              @click="visible = !visible"
              data-toggle="collapse"
              aria-expanded="false"
              class="dropdown-toggle mb-2"
            >
              <font-awesome-icon icon="user-cog" class="ml-2 mr-2" />Admin
            </a>

            <b-collapse id="collapse" class="mt-1" v-model="visible">
              <li
                v-for="(adminroute, i) in adminroutes"
                class="ml-3 mt-1"
                :key="i"
                :style="
                  adminroute.active
                    ? 'background: #fff; border-radius:3px'
                    : ''
                "
                @click="setAdminActive(i)"
              >
                <router-link :to="adminroute.link" :id="adminroute.id"
                  ><font-awesome-icon
                    :icon="adminroute.icon"
                    :class="adminroute.class"
                  />
                  <span :style="adminroute.style">{{ adminroute.name }}</span>
                </router-link>
              </li>
            </b-collapse>
          </li>

          <li
            v-if-else="isAdmin"
            v-for="(route, i) in routes"
            :key="i"
            :style="
              route.active ? 'background: #fff; border-radius:3px' : ''
            "
            @click="setActive(i)"
            class="mt-2"
          >
            <router-link :to="route.link" :id="route.id"
              ><font-awesome-icon :icon="route.icon" :class="route.class" />
              {{ route.name }}</router-link
            >
          </li>
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

          <!-- <li>
            <a
              @click="visiblePrice = !visiblePrice"
              data-toggle="collapsePrice"
              aria-expanded="false"
              class="dropdown-toggle mb-2"
            >
              <font-awesome-icon icon="coins" class="ml-2 mr-2" />Price Approval
            </a>

            <b-collapse id="collapsePrice" class="mt-1" v-model="visiblePrice">
              <li
                v-for="(priceroute, i) in priceroutes"
                class="ml-3 mt-1"
                :key="i"
                :style="
                  priceroute.active
                    ? 'background: #00803e; border-radius:3px'
                    : ''
                "
                @click="setPriceApprovalActive(i)"
              >
                <router-link :to="priceroute.link" :id="priceroute.id"
                  ><font-awesome-icon
                    :icon="priceroute.icon"
                    :class="priceroute.class"
                  />
                  <span :style="priceroute.style">{{ priceroute.name }}</span>
                </router-link>
              </li>
            </b-collapse>
          </li> -->
        </ul>
      </div>
    </nav>
<br>
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
                style="font-size:12.5px; margin-bottom: 2px;"
                icon="power-off"
              />
            </b-button>
          </b-col>
        </b-row>
      </div>
    </div>

    <b-modal
      size="md"
      header-bg-variant="dark"
      header-text-variant="light"
      id="bv-modal-confirmLogout"
      class="modal"
      hide-header-close
      no-close-on-backdrop
    >
      <template v-slot:modal-title>
        <h6>
          Confirm Log-out
        </h6>
      </template>

      <div style="font-size: 13px">
        Are you sure you want to 'Log-out'?
      </div>

      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button
          id="btn-cancel-logout"
          size="sm"
          @click="cancel()"
          style="font-size:13px;border: 0px;"
          >No
        </b-button>

        <b-button
          id="btn-save-logout"
          size="sm"
          variant="dark"
          @click="logout()"
          style="font-size:13px"
          >Yes
        </b-button>
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
          variant="dark"
          @click="$router.push('/')"
          style="font-size:13px"
          class="button px-4"
          >Ok</b-button
        >
      </template>
    </b-modal>
<div class="nuxt-table ml-3">
      <nuxt :key="reload" />
    </div>

  </div>
</template>

<script>
export default {
  created() {
    const user_details = JSON.parse(localStorage.user_details);
    const user_role = JSON.parse(localStorage.user_role);
    const user_actions = JSON.parse(localStorage.user_actions);
    this.user = `${user_details.FirstName} ${user_details.LastName}`;
    this.role = user_role.Name;

    if (user_actions["Admin Module"]) {
      this.isAdmin = true;

      const module_actions = user_actions["Admin Module"];
      if (
        !module_actions.find(action => action.U_ACTION_NAME == "View modules")
      ) {
        const index = this.adminroutes.findIndex(
          route => (route.name = "Modules")
        );
        this.adminroutes.splice(index, 1);
      }
      if (
        !module_actions.find(action => action.U_ACTION_NAME == "View actions")
      ) {
        const index = this.adminroutes.findIndex(
          route => (route.name = "Actions")
        );
        this.adminroutes.splice(index, 1);
      }
      if (
        !module_actions.find(action => action.U_ACTION_NAME == "View users")
      ) {
        const index = this.adminroutes.findIndex(
          route => (route.name = "User Accounts")
        );
        this.adminroutes.splice(index, 1);
      }
      if (
        !module_actions.find(action => action.U_ACTION_NAME == "View modules")
      ) {
        const index = this.adminroutes.findIndex(
          route => (route.name = "Modules")
        );
        this.adminroutes.splice(index, 1);
      }
      if (
        !module_actions.find(
          action => action.U_ACTION_NAME == "View activity logs"
        )
      ) {
        const index = this.adminroutes.findIndex(
          route => (route.name = "Activity Logs")
        );
        this.adminroutes.splice(index, 1);
      }
    }

    if (!user_actions["Suppliers Module"]) {
      const index = this.routes.findIndex(route => (route.name = "Suppliers"));
      this.routes.splice(index, 1);
    }

    if (!user_actions["Customers Module"]) {
      const index = this.routes.findIndex(route => (route.name = "Customers"));
      this.routes.splice(index, 1);
    }

    // const reports_module = JSON.parse(localStorage.accessRights)[
    //   "reportsModule"
    // ];
    // const transaction_module = JSON.parse(localStorage.accessRights)[
    //   "transactionModule"
    // ];
    // const admin_module = JSON.parse(localStorage.accessRights)["adminModule"];

    // const routeIndex = this.routes.findIndex(
    //   route => route.link === this.$route.fullPath
    // );

    // if (reports_module.length !== 0) {
    //   this.userActions.reportsTab = true;
    //   this.routes[1].show = true;
    // }

    // if (transaction_module.length !== 0) {
    //   this.userActions.transactionTab = true;
    //   this.routes[0].show = true;
    // }

    // if (admin_module.length !== 0) {
    //   this.userActions.adminTab = true;
    // }
  },

  data() {
    return {
      // userActions: {
      //   adminTab: false,
      //   transactionTab: false,
      //   reportsTab: false
      // },
      role: "",
      user: "",
      activelinks: [],
      isAdmin: false,
      visible: false,
      visiblePrice: false,
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
         {
          id: "reports",
          link: "/transaction/reports",
          name: "Reports",
          icon: "file",
          class: "ml-2 mr-1",
          active: false
        },

      ],


      adminroutes: [
        {
          link: "/admin/modules",
          name: "Modules",
          icon: "th-large",
          style: "position:relative;left:6px",
          id: "sb-modules",
          class: "ml-2",
          active: false
        },

        {
          link: "/admin/actions",
          name: "Actions",
          icon: "tasks",
          style: "position:relative;left:7px",
          id: "sb-actions",
          class: "ml-2",
          active: false
        },

        {
          link: "/admin/roles",
          name: "Roles and Access",
          style: "position:relative;left:5px",
          id: "sb-roles-and-access",
          icon: "id-card",
          class: "ml-2",
          active: false
        },

        {
          link: "/admin/user-accounts",
          name: "User Accounts",
          style: "position:relative;left:11px",
          id: "sb-user-accounts",
          icon: "user",
          class: "ml-2",
          active: false
        },


        {
          link: "/admin/activity-logs",
          name: "Activity Logs",
          style: "position:relative;left:12px",
          id: "sb-activity-logs",
          icon: "clipboard-list",
          class: "ml-2",
          active: false
        }
      ],

      routes: [
        {
          link: "/suppliers",
          name: "Suppliers",
          icon: "users",
          id: "sb_suppliers",
          style: "position:relative;left:5px",
          class: "ml-2",
          active: false
        },
        {
          link: "/customers",
          name: "Customers",
          icon: "user-tie",
          style: "position:relative;left:5px",
          id: "sb_customers",
          class: "ml-2 mr-1",
          active: false
        }
        // {
        //   link: "/",
        //   name: "Items",
        //   icon: "list-ul",
        //   style: "position:relative;left:5px",
        //   id: "sb_items",
        //   class: "ml-2 mr-1",
        //   active: false
        // }
      ],

      priceroutes: [
        {
          link: "/price-approval/listForApproval",
          name: "List For Approval",
          icon: "tasks",
          style: "position:relative;left:6px",
          id: "sb_listForApproval",
          class: "ml-2",
          active: false
        },

        // {
        //   link: "/price-approval/listForApproval",
        //   name: "List of Approval",
        //   icon: "tasks",
        //   style: "position:relative;left:6px",
        //   id: "sb-listOfApproval",
        //   class: "ml-2",
        //   active: false
        // },

        // {
        //   link: "/price-approval/items",
        //   name: "Item Master Data",
        //   icon: "list",
        //   style: "position:relative;left:7px",
        //   id: "sb-itemMasterData",
        //   class: "ml-2",
        //   active: false
        // },

        // {
        //   link: "/price-approval/reports",
        //   name: "Reports",
        //   style: "position:relative;left:5px",
        //   id: "sb-reports",
        //   icon: "copy",
        //   class: "ml-2",
        //   active: false
        // }
      ]
    };
  },

  methods: {
    async setActive(i) {
      this.visible = false;
      this.adminroutes.map(route => (route.active = false));

      this.routes.map((route, index) => {
        if (index === i) {
          route.active = true;
        } else {
          route.active = false;
        }
      });
    },

    async setAdminActive(i) {
      this.routes.map(route => (route.active = false));
      this.adminroutes.map((adminroute, index) => {
        if (index === i) {
          adminroute.active = true;
        } else {
          adminroute.active = false;
        }
      });
    },

     async setActive(i) {

      this.routes.map((route, index) => {
        if (index === i) {
          route.active = true;
        } else {
          route.active = false;
        }
      });
    },

    async setPriceApprovalActive(i) {
      this.routes.map(route => (route.active = false));
      this.priceroutes.map((priceroute, index) => {
        if (index === i) {
          priceroute.active = true;
        } else {
          priceroute.active = false;
        }
      });
    },

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
