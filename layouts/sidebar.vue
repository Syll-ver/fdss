<template>
  <div class="wrapper" id="wrapper">
    <nav :id="company == rci ? 'sidebarRCI' : 'sidebarBFI'">
      <div class="sidebar-header">
        <div>
          <b-img :src="company == rci ? '/rlogo.png' : '/blogo.png'" class="sidebar-image" style="padding:8px 8px 0px 8px" center>
          </b-img>
          <div class="image-box">
            <b-img :src="company == rci ? '/rci-org.png' : '/bfi-org.png'" class="sidebar-image-mini" center></b-img>
          </div>
          <center>
          <p class="h9 sidebar-image" >FARMER'S DELIVERY SLIP SYSTEM</p>
          </center>
        </div>
        <hr class="hr-style" />

        <ul class="list-unstyled">
          <!-- Admin module -->
          <li v-if="isAdmin" 
            :align="(windowWidth >= 1450 ? 'left' : 'center')">
            <a id="admin_toggle"
              @click="selctAdmin()"
              data-toggle="collapse"
              aria-expanded="false"
              >
              <font-awesome-icon icon="user-cog" />
              <span class="route-admin">Admin</span>
              <font-awesome-icon :icon="visible == false 
                ? 'caret-right' : 'caret-down'"
                class="mt-1"
                style="float:right;" />
            </a>
            <b-tooltip v-if="windowWidth < 1450 " 
              target="admin_toggle" 
              triggers="hover" 
              placement="left"
              boundary-padding="-110"
            >
              Admin
            </b-tooltip>
            
            <b-collapse id="collapse-1" v-model="visible">
              <li
                v-for="(adminroute, i) in adminroutes"
                :key="i"
                :id="adminroute.link"
                :style="adminroute.active
                    ? 'background: #ffffff42; border-radius:3px'
                    : '' " @click="setAdminActive(i)"
              >
                <router-link :to="adminroute.link" :id="adminroute.id">
                  <font-awesome-icon
                    :icon="adminroute.icon"
                    :class="adminroute.class"
                  />
                  <span class="route-name" :style="adminroute.style">{{ 
                    adminroute.name 
                  }}</span>
                </router-link>
            <b-tooltip v-if="windowWidth < 1450 " 
              :target="adminroute.link" 
              triggers="hover" 
              placement="left"
              boundary-padding="-110"
            >
              {{ adminroute.name }}
            </b-tooltip>
              </li>
            </b-collapse>
          </li>

          <!-- SUPPLIER, CUSTOMER, ITEM TABS -->
          <li v-for="(route, i) in routes"
            :key="i"
            :align="(windowWidth >= 1450 ? 'left' : 'center')"
            :style="route.active 
            ? 'background: #00803e; border-radius:3px' : '' "
            :class="`mt-2 mb-2 `+(chosenRoute == route.link ? 'actvBR':'')"
            @click="selct(route.link)"
            :id="route.link"
            >
            <router-link :to="route.link" :id="route.id" >
              <font-awesome-icon :icon="route.icon" :class="route.class"  />
              <span class="route-name">
                {{ route.name }}
              </span>
            </router-link>
            <b-tooltip v-if="windowWidth < 1450 " 
              :target="route.link" 
              triggers="hover" 
              placement="left"
              boundary-padding="-110"
            >
              {{ route.name }}
            </b-tooltip>
          </li>
        </ul>
        
      </div>
    </nav>

    <!-- HEADER NAVIGATION BAR-->
    <div class="content">
      <div class="right">
        <b-row>
          <b-col cols="4" style="margin-top:10px;position:relative;right:8px">
            <font-awesome-icon
              style="color:black;height:25px;width:25px;"
              icon="user"
            />
          </b-col>
          <b-col cols="4" class="mt-1" style="position:relative;right:22px">
            <b-row>
              <b style="font-size:12px">{{ user }}&nbsp;</b>
            </b-row>
            <b-row>
              <b-badge :variant="company == rci ? 'revive' : 'biotech'" style="font-size:9px;">{{
                &nbsp; role &nbsp;
              }}</b-badge>
            </b-row>
          </b-col>
          <b-col cols="4" class="mt-2">
            <b-button
              @click="confirmLogout()"
              class="table-button"
              style="width:30px; height:30px"
            >
              <font-awesome-icon
                style="font-size:15px; position:relative; right:5px;"
                icon="power-off"
              />
            </b-button>
          </b-col>
        </b-row>
      </div>
    </div>

    <b-modal
      size="md"
      :header-bg-variant="company == rci ? 'revive' : 'biotech'"
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
          :variant="company == rci ? 'revive' : 'biotech'"
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
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  
  created() {


    this.adminSelct = localStorage.adminSelct;

    this.chosenRoute = localStorage.chosenRoute;

    const user_details = JSON.parse(localStorage.user_details);
    const user_role = JSON.parse(localStorage.user_role);
    const user_actions = JSON.parse(localStorage.user_actions);
    this.user = `${user_details.LastName}`;
    
    this.role = "";
    this.roleCode = JSON.parse(localStorage.user_role).Code;
    this.roleCode == 9 ? this.role = 'Admin Staff' : this.role = user_role.Name;

    this.company = user_details.U_COMPANY_CODE;
    this.rci = JSON.parse(localStorage.companyCode).rci;
    this.bfi = JSON.parse(localStorage.companyCode).bfi;

    if (user_actions["Admin Module"]) {
      this.isAdmin = true;

      const module_actions = user_actions["Admin Module"];
      // if (
      //   !module_actions.find(action => action.U_ACTION_NAME == "View modules")
      // ) {
      //   const index = this.adminroutes.findIndex(
      //     route => (route.name = "Modules")
      //   );
      //   this.adminroutes.splice(index, 1);
      // }
      if (!module_actions.find(action => action.U_ACTION_NAME == "View actions")) {
        const index = this.adminroutes.findIndex(
          route => (route.name = "Actions"));
        this.adminroutes.splice(index, 1);
      }
      if(!module_actions.find(action => action.U_ACTION_NAME == "View users")) {
        const index = this.adminroutes.findIndex(
          route => (route.name = "User Accounts"));
        this.adminroutes.splice(index, 1);
      }
      if(!module_actions.find(action => action.U_ACTION_NAME == "View roles and access rights")) {
        const index = this.adminroutes.findIndex(
          route => (route.name = "Roles and Access"));
        this.adminroutes.splice(index, 1);
      }
       if(!module_actions.find(action => action.U_ACTION_NAME == "View print logs")) {
        const index = this.adminroutes.findIndex(
          route => (route.name = "Print Logs"));
        this.adminroutes.splice(index, 1);
      }
      if(!module_actions.find(action => action.U_ACTION_NAME == "View activity logs")) {
        const index = this.adminroutes.findIndex(
          route => (route.name = "Activity Logs"));
        this.adminroutes.splice(index, 1);
      }
      if(!module_actions.find(action => action.U_ACTION_NAME == "View location")) {
        const index = this.adminroutes.findIndex(
          route => (route.name = "Location"));
        this.adminroutes.splice(index, 1);
      }
      if(!module_actions.find(action => action.U_ACTION_NAME == "View printer")) {
        const index = this.adminroutes.findIndex(
          route => (route.name = "Printer"));
        this.adminroutes.splice(index, 1);
      }
    }

    if (!user_actions["Delivery Receipt Module"]) {
      const index = this.routes.findIndex(route => (route.name == "Delivery Receipt"));
      this.routes.splice(index, 1);
    }

    if (!user_actions["Reports Module"]) {
      const index = this.routes.findIndex(route => (route.name == "Reports"));
      this.routes.splice(index, 1);
    }
},

  data() {
    return {
      windowWidth: window.innerWidth,
      rci: null,
      bfi: null,
      company: null,
      roleCode: "",
      role: "",
      user: "",
      activelinks: [],
      isAdmin: false,
      visible: false,
      visiblePrice: false,
      toggleBtnActive: true,

      chosenRoute: "",
      adminSelct: "",

      adminroutes: [
    {},
        {
          link: "/admin/modules",
          name: "Modules",
          icon: "th-large",
          style: "position:relative;left:7px",
          id: "sb-modules",
          class: "ml-3",
          active: false
        },
        {
          link: "/admin/modules",
          name: "Modules",
          icon: "th-large",
          style: "position:relative;left:7px",
          id: "sb-modules",
          class: "ml-3",
          active: false
        },

        {
          link: "/admin/actions",
          name: "Actions",
          icon: "tasks",
          style: "position:relative;left:7px",
          id: "sb-actions",
          class: "ml-3",
          active: false
        },

        {
          link: "/admin/roles",
          name: "Roles",
          style: "position:relative;left:5px",
          id: "sb-roles-and-access",
          icon: "id-card",
          class: "ml-3",
          active: false
        },

        {
          link: "/admin/user-accounts",
          name: "User Accounts",
          style: "position:relative;left:11px",
          id: "sb-user-accounts",
          icon: "user",
          class: "ml-3",
          active: false
        },
        
           {
          link: "/admin/companies",
          name: "Companies",
          icon: "building",
          style: "position:relative;left:6px",
          id: "sb-companies",
          class: "ml-3",
          active: false
        },

        {
          link: "/admin/print-logs",
          name: "Print Logs",
          style: "position:relative;left:11px",
          id: "sb-print-logs",
          icon: "file-signature",
          class: "ml-3",
          active: false
        },

        {
          link: "/admin/activity-logs",
          name: "Activity Logs",
          style: "position:relative;left:12px",
          id: "sb-activity-logs",
          icon: "clipboard-list",
          class: "ml-3",
          active: false
        },
        {
          link: "/admin/location",
          name: "Location",
          style: "position:relative;left:12px",
          id: "sb-location",
          icon: "location-arrow",
          class: "ml-3",
          active: false
        },
        {
          link: "/admin/printer",
          name: "Printer",
          style: "position:relative;left:12px",
          id: "sb-printer",
          icon: "print",
          class: "ml-3",
          active: false
        },
      ],

      routes: [
        {

          link: "/transaction/deliveryreceipt",
          name: "Delivery Slip",
          icon: "file-signature",
          active: false
        },
        {

          link: "/transaction/reports",
          name: "Reports", 
          icon: "file",
          active: false
        },
        {},
      ],
    };
  },

  methods: {
    selctAdmin() {
      this.visible = !this.visible;
      localStorage.adminSelct = true
      console.log(" this.visible 2", this.visible );
      this.adminSelct = localStorage.adminSelct;
      if(localStorage.chosenRoute) {
        localStorage.chosenRoute = "";
        this.chosenRoute = "";
      }
    },
    selct(routeLink) {
      this.active = routeLink;
      localStorage.chosenRoute = routeLink;
      localStorage.adminSelct = false;
      localStorage.adminActiveIndx = -1;
      // this.visible = false;

      this.adminSelct = true;
      this.chosenRoute = localStorage.chosenRoute;
    },

    // async setActive(i) {
      
    //   this.routes.map((route, index) => {
    //     if (index === i) {
    //       route.active = true;
    //     } else {
    //       route.active = false;
    //     }
    //   });
    //   this.visible = false;
    //   this.adminroutes.map(route => (route.active = false));
    // },

    setAdminActive(i) {
      this.visible = true;
      this.routes.map(route => (route.active = false));
      localStorage.adminActiveIndx = i;

      for(let c=0; c < this.adminroutes.length; c++) {
        if(i == c) {
          this.adminroutes[c].active = true;
        }
        else {
          this.adminroutes[c].active = false;
        }
        console.log("index " + c + ": "+this.adminroutes[c].active);
      }

      // this.adminroutes.map((adminroute, index) => {
      //   // console.log(adminroute);
      //   if (index === i) {
      //     adminroute.active = true;
      //   } else {
      //     adminroute.active = false;
      //   }
      // });
    },

    confirmLogout() {
      this.$bvModal.show("bv-modal-confirmLogout");
    },

    logout() {
      localStorage.clear();
      this.$router.push("/");
    }
  },

  async mounted(){

    window.addEventListener("resize", () => {
      this.windowWidth = window.innerWidth
    })
    
    let ind = localStorage.adminActiveIndx;
    if(String(ind) != "-1") {
      
      for(let c=0; c < this.adminroutes.length; c++) {
        if(ind == c) {
          this.visible = !this.visible;
          this.adminroutes[c].active = true;
        }
        else {
          this.adminroutes[c].active = false;
        }
        console.log("index " + c + ": "+this.adminroutes[c].active);
      }
    }
    
    
  },
  async beforeCreate(){
    let userDetails = JSON.parse(localStorage.user_details);

    if(!localStorage.companyCode.includes(userDetails.U_COMPANY_CODE)) {
      if(userDetails.U_COMPANY_NAME.toLowerCase().includes('biotech') 
        || userDetails.U_COMPANY_NAME.toLowerCase().includes('bfi')) {
          userDetails['U_COMPANY_CODE'] = JSON.parse(localStorage.companyCode).bfi
      } else if(userDetails.U_COMPANY_NAME.toLowerCase().includes('revive')
        || userDetails.U_COMPANY_NAME.toLowerCase().includes('rci')) {
          userDetails['U_COMPANY_CODE'] = JSON.parse(localStorage.companyCode).rci
      }
      localStorage['user_details'] = JSON.stringify(userDetails);
    
    }
  },
};
</script>

<style scoped>
 a {
  color: #fff;
  text-decoration: none;
  background-color: transparent;
} 

</style>
