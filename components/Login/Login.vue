<template>

    <div class="body_loading">
      <Loading v-if="showLoading" />
      <div class="container">
        <div>
          <b-card class="bcard mt-3">
       
              <img class="sidebar_header" src="/REvives.png" />

              <h6 class="title">
                FARMER'S DELIVERY<br>SLIP SYSTEM
              </h6>
              <h2 class="subtitle">
            Version 1.0.0
          </h2>

          <b-form @submit.prevent="login" id="login_form">
            <input
              id="emp_id"
              class="username"
              v-model="user.name"
              :state="inputValidation"
              v-on:keyup.enter="focusPassword()"
              placeholder="Employee ID"
              required
            />
            <input
              id="password"
              class="password"
              v-model="user.password"
              :state="inputValidation"
              placeholder="Password"
              type="password"
              ref="password"
              style="margin-top: 20px"
              v-on:keyup.enter="login()"
              required
            />
            <!-- <span v-show="hasCapsLock">
              <b-popover
              :show.sync="hasCapsLock"
                target="password"
                placement="right"
                variant="warning"
                content="Capslock is on"
              >
              </b-popover>
            </span> -->
             </b-form>
            <b-btn
              pill
              id="btn_login"
              class="login"
              @click="login()"
        
              block
              variant="biotech"
            >
              LOGIN
            </b-btn>
         
       
          
          <h2 class="subtitle" style="margin-top:30px">
            &copy;2020 BIOTECH FARMS INCORPORATED
          </h2>
        </b-card>
    
        </div>
      </div>
             <div>
            <b-alert
              :show="alert.showAlert"
              dismissible
              fade
              :variant="alert.variant"
              @dismissed="alert.showAlert = null"
            >
              <font-awesome-icon
                :icon="
                  alert.variant == 'success'
                    ? 'check-circle'
                    : 'exclamation-triangle'
                "
                class="mr-1"
                style="font-size:20px"
              />
              {{ alert.message }}
            </b-alert>
          </div>
  </div>

</template>
<script>
import axios from "axios";
import Loading from "~/components/Loading/Loading.vue";
import Bowser from "bowser";

export default {
  name: "Login",
  components: { Loading },
  data() {
    return {
      showLoading: false,
      user: {
        name: "",
        password: ""
      },
      alert: {
        showAlert: 0,
        dismissSecs: 0,
        variant: "success",
        message: ""
      },
      browser: [],
      hasCapsLock: false,
    };
  },
  created() {
    const browser = Bowser.getParser(window.navigator.userAgent);
    this.browser.name = browser.getBrowserName();
    this.browser.version = parseInt(browser.getBrowserVersion());

    if(!this.validVersion()){
      this.$router.push("/browser-error");
    }
  },
  computed: {
    inputValidation() {
      if (this.user.name.length > 0 && this.user.name.length <= 20) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    checkKey(e) {
      this.hasCapsLock = false;
      console.log(e);
      if (e.Key && (e.key == "CapsLock")) {
        if (e.getModifierState("CapsLock")) {
          this.hasCapsLock = true;
        } else {
          this.hasCapsLock = false;
        }
      } else {
        this.hasCapsLock = false;
      }
    },
    validVersion(){
      return (
        (this.browser.name === "Chrome" && this.browser.version > 5 ) ||
        (this.browser.name === "Firefox" && this.browser.version > 56 ) ||
        (this.browser.name === "Chromium" && this.browser.version > 5)
      );
    },
    focusPassword() {
      this.$refs["password"].focus();
    },
    showAlert(message, variant) {
      this.alert = {
        showAlert: 3,
        dismissSecs: 2,
        variant,
        message
      };
    },
    async login() {
      this.showLoading = true;
      await axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/login`,
        data: { username: this.user.name, password: this.user.password }
      })
        .then(result => {
          localStorage.username = this.user.name;
          localStorage.user_details = JSON.stringify(result.data.user_details);
          localStorage.user_role = JSON.stringify(result.data.user_role);
          localStorage.user_actions = JSON.stringify(result.data.user_actions);
          localStorage.SessionId = result.data.SessionId;
          if (this.user.name == this.user.password) {
            this.$router.push("/change-password");
          } else {
            if 
              (result.data.user_role.Name.search("Admin Staff") >= 0) 
             {
              this.$router.push("/transaction/deliveryreceipt");
            } else if (result.data.user_role.Name.search("Administrator") >= 0) {
              this.$router.push("/admin/modules");
            } else {
              // this.$router.push("/transaction/deliveryreceipt");
               this.showAlert(err.message, "danger");
            }
            this.showLoading = false;
          }
        })
        .catch(err => {
          this.showLoading = false;
                  if(this.user.name === "" && this.user.password === "") {
            this.showAlert("Please Input all Fields", "danger");
                 }
          else if (err.response && err.response.data.errorMsg) {
            this.showAlert(err.response.data.errorMsg, "danger");
          
     
          } else {
            this.showAlert(err.message, "danger");
          }
        });
      // if(this.user.name == this.user.password) {
      //     this.$router.push("/change-password");
      // } else {
      //     if(this.user.name == "123" && this.user.password == "test") {
      //         this.$router.push("/suppliers");
      //     }
      //     if(this.user.name == "1234" && this.user.password == "test") {
      //         this.$router.push("/customers");
      //     }
      //     if(this.user.name == "admin" && this.user.password == "test") {
      //         this.$router.push("/admin/modules");
      //     }
      // }
    }
  }
};
</script>