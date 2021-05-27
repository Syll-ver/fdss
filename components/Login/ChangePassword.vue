<template>

  <b-container>
    <Loading v-if="showLoading" />
    <div class="body">
      <div class="container">
        <div>
          <b-card class="bcard">
            <b-form>
              <div class="newpass">
                <div style="letter-spacing: 4.1px"></div>Enter New Password
              </div>
              <b-form-group>
                <b-input-group-prepend>
                  <input
                    id="change_password_1"
                    class="password"
                    v-model="user.password1"
                    placeholder="Password"
                    type="password"
                    style="margin-top: 20px"
                    autofocus
                    v-on:keyup.enter="focusPassword2()"
                  />
                </b-input-group-prepend>

                <b-input-group-prepend>
                  <input
                    id="change_password_2"
                    class="password"
                    v-model="user.password2"
                    placeholder="Confirm Password"
                    type="password"
                    style="margin-top: 20px"
                    ref="password2"
                    v-on:keyup.enter="Confirm()"
                  />
                </b-input-group-prepend>
                <div class="container1">
                 <h5>Create Your Pincode</h5>
                <div class="pinBox">
                  <input
                    id="input-pincode"
                    class="pinEntry"
                    v-model="user.U_PIN"
                    type="password"
                    maxlength="4"
                    name="pin"
                    pattern="[0-9]{4}"
                  />
                </div>
                </div>

                <b-alert :show="alert.showAlert" dismissible variant="danger">{{ alert.message }}</b-alert>

                <!-- <div class="mt-1 " v-if="errorMessage != null" style="color:red">
                {{ errorMessage }}
                </div>-->
              </b-form-group>
              <b-button id="change_password_login" class="login" @click="Confirm()" block :variant="company == rci ? 'revive' : 'biotech'">Confirm</b-button>
            </b-form>
          </b-card>
        </div>
      </div>
    </div>

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
  </b-container>
</template>

<script>
import Loading from "~/components/Loading/Loading.vue";
import axios from "axios";
// import { required, minLength } from "vuelidate/lib/validators";
// import { validationMixin } from "vuelidate";

export default {
  // mixins: [validationMixin],
components: {
    Loading
  },
  name: "LoginForm",
  layout: "loginLayout",
  data() {
    return {
      alert: {
        showAlert: 0,
        dismissSecs: 0,
        variant: "success",
        message: ""
      },
      user: {
        name: null,
        password: null,
        U_PIN:null
      }
    };
  },

  // validations: {
  //   user: {
  //     name: {
  //       required
  //     },
  //     password: {
  //       required
  //     }
  //   }
  // },
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
    focusPassword2() {
      this.$refs["password2"].focus();
    },
    showAlert(message, variant) {
      this.alert = {
        showAlert: 3,
        dismissSecs: 2,

        variant,
        message
      };
    },
    async Confirm() {
  this.showLoading = true;
      if (this.user.password1 == this.user.password2) {
        const password = (this.user.password1, this.user.password2);

        await axios({
          method: "PUT",
          url: `${this.$axios.defaults.baseURL}/api/admin/users/edit_password/`,
          data: {
            U_USERNAME: localStorage.username,
            U_PASSWORD: password,
             U_PIN: this.user.U_PIN,
            SessionId: localStorage.SessionId
          }
        })
          .then(result => {
            this.showAlert("Successfully Changed Password", "success");
            setTimeout(() => {
              this.$router.push("/");
            }, 1000);
          })
          .catch(err => {
            if (err.name == "Error") {
              if (err.response && err.response.data.errorMsg) {
                if (err.response.data.errorMsg === "Invalid session.") {
                  this.$router.push("/");
                }
                this.showAlert(err.response.data.errorMsg, "danger");
                this.showLoading = false;
              } else {
                this.showAlert(err.message, "danger");
                this.showLoading = false;
              }
            }
          });
      } else {
        this.showAlert("Input Same Password", "danger");
        this.showLoading = false;
      }
    }
  }
};
</script>
