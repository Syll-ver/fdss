<template>
  <div class="wrapper">
    <Loading v-if="showLoading" />
    <nav id="sidebarBFI">
      <div class="sidebar-header">
        <div>
          <!-- <b-img src="/bc.png" class="sidebar-image" center></b-img> -->
        </div>
        <hr class="hr-style" />

        <ul class="list-unstyled">
          <li>
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
          </li>

          <li
            v-for="(route, i) in routes"
            :key="i"
            
            @click="setActive(i), collapseRoute(i,route)"
            class="mt-2"
          >
            <router-link :id="route.id" :to="route.link">
              <font-awesome-icon :icon="route.icon" :class="route.class"/>
              {{ route.name }}
            </router-link>

            <ul class="list-unstyled" v-if="openedRoutes[i]">
              <li v-for="(child, index) in route.children" :key="index"  @click="setActive(i)">
                <router-link :id="child.id" :to="child.link" @click.stop>
                  <font-awesome-icon :icon="child.icon" :class="child.class" />
                  {{ child.name }}
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>

    <div>
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
      openedRoutes: {},
      role: null,
      user: null,
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

      routes: [
        {
          link: "/transaction",
          id: "transaction",
          name: "Transactions",
          icon: "file-signature",
          class: "ml-2",
          children: [
            {
              id: "report",
              link: "",
              name: "Payment Center",
              icon: "chart-line",
              class: "ml-2 mr-1",
            },

             {
              id: "report",
              link: "",
              name: "Payment Center",
              icon: "chart-line",
              class: "ml-2 mr-1",
            }
          ]
        },
        {
          id: "report",
          link: "/report",
          name: "Reports",
          icon: "chart-line",
          class: "ml-2 mr-1",
          active: false
        }
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
    collapseRoute(i, route) {
      if (route.children != null) {
        this.openedRoutes[i] = !this.openedRoutes[i];
        this.$forceUpdate();
      }
      console.log(this.openedRoutes);
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
  }
};
</script>
