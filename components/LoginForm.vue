<template>
  <div>
    <div class="body_loading">
      <Loading v-if="showLoading" />
      <div class="container">
        <div>
          <b-card class="bcard mt-3">
            <b-form>
              <img class="sidebar_header" src="/REvives.png" />

              <h6 class="title">
                AUTOMATED <br>  DELIVERY RECEIPT 
              </h6>

              <h2 class="subtitle">Version 1.0.0</h2>
              <b-form-group>
                <b-input-group-prepend class="mb-1">
                  <input
                    id="login_username"
                    class="username"
                    type="number"
                    v-model="$v.user.name.$model"
                    :state="$v.user.name.$dirty ? !$v.user.name.$error : null"
                    placeholder="Employee ID"
                    v-on:keyup.enter="focusPassword()"
                  />
                </b-input-group-prepend>

                <b-input-group-prepend class="mb-1">
                  <input
                    id="login_password"
                    class="password"
                    v-model="$v.user.password.$model"
                    :state="
                      $v.user.password.$dirty ? !$v.user.password.$error : null
                    "
                    placeholder="Password"
                    type="password"
                    ref="password"
                    v-on:keyup.enter="login()"
                  />
                </b-input-group-prepend>

              
              </b-form-group>
              <b-button
                id="login_button"
                class="login"
                @click="login()"
                variant="biotech"
                block
                >LOGIN</b-button
              >
              <h2 class="subtitle" >
                &copy;&nbsp;2020 BIOTECH FARMS INCORPORATED
              </h2>
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
          class="alert-icon mr-1"
        />
        {{ alert.message }}
      </b-alert>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { required, minLength } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import Loading from "~/components/Loading.vue";

export default {
  components: {
    Loading
  },

  mixins: [validationMixin],
  auth: false,

  name: "LoginForm",
  layout: "loginLayout",
  data() {
    return {
      showLoading: false,

      alert: {
        showAlert: 0,
        dismissSecs: 0,
        variant: "success",
        message: ""
      },
      user: {
        name: null,
        password: null
      }
    };
  },

  validations: {
    user: {
      name: {
        required
      },
      password: {
        required
      }
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
      this.$router.push('/transaction/deliveryreceipt')
    }
  }
};
</script>
