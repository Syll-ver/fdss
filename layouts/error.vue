<template>
  <div class="__nuxt-error-page">
    <div class="error">
      <div v-if="statusCode === 404" class="center mb-3">
        <center>
          <font-awesome-icon
            style="font-size:7rem;"
            icon="exclamation-circle"
            class="text-center"
          />
          <h1 style="font-size: 5rem">ERROR 404</h1>
          <h2
            style="font-size: 2.10rem; letter-spacing: 10.3PX; position: relative; bottom:20px"
            class="ml-2"
          >
            PAGE NOT FOUND
          </h2>
          <span class="text-center" style="font-size: 17.8px"
            >Looks like the page you are looking for is not available</span
          >
        </center>
        <font-awesome-icon
          style="font-size:25px; position: relative; right:60px; color: #70A9CC "
          icon="long-arrow-alt-left"
          class="mt-1 ml-3 text-center"
        />
        <span
          @click="goback()"
          class="mt-3 centerV"
          style="font-size: 17px; color: #70A9CC; font-weight:bold"
          >Go back</span
        >
      </div>

      <div v-else class="center mb-3">
        <center>
          <font-awesome-icon
            style="font-size:7rem; "
            icon="exclamation-circle"
            class="text-center"
          />

          <h1 style="font-size: 5rem;">ERROR 401</h1>
          <h2
            style="font-size: 2.28rem; letter-spacing: 13PX; position: relative; bottom:20px"
            class="ml-2"
          >
            UNAUTHORIZED
          </h2>

          <span class="text-center ml-2" style="font-size: 16.3px;"
            >Sorry, your request cannot be processed</span
          >
        </center>
        <font-awesome-icon
          style="font-size:25px; position: relative; right:60px; color: #70A9CC "
          icon="long-arrow-alt-left"
          class="mt-1 ml-2 text-center"
        />
        <span
          @click="goback()"
          class="mt-3 centerV"
          style="font-size: 17px; color: #70A9CC; font-weight:bold"
          >Go back</span
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NuxtError",
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  head() {
    return {
      title: this.message,
      meta: [
        {
          name: "viewport",
          content:
            "width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"
        }
      ]
    };
  },
  computed: {
    statusCode() {

console.log(this.error)


      return (this.error && this.error.statusCode) || 500;
      
    },
    
    message() {
      return this.error.message || `Error`;
    }
    
  },
  methods: {
    goback() {
      window.history.back();
    }
    
  }
};
</script>

<style scoped>
.__nuxt-error-page {
    z-index: 1000;
  padding: 1rem;
  background: #f7f8fb;
  color: #47494e;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: sans-serif;
  font-weight: 100 !important;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.__nuxt-error-page .error {
  max-width: 450px;
}
.__nuxt-error-page .title {
  font-size: 1.5rem;
  margin-top: 15px;
  color: #47494e;
  margin-bottom: 8px;
}
.__nuxt-error-page .description {
  color: #7f828b;
  line-height: 21px;
  margin-bottom: 10px;
}
.__nuxt-error-page a {
  color: #7f828b !important;
  text-decoration: none;
}
.__nuxt-error-page .logo {
  position: fixed;
  left: 12px;
  bottom: 12px;
}

.center {
z-index: 1000;
  position: absolute;
  top: 45%;
  left: 50%;
  -moz-transform: translateX(-50%) translateY(-50%);
  -webkit-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
  color: gray;
}

.centerV {
  position: absolute;
  left: 50%;
  -moz-transform: translateX(-50%) translateY(-50%);
  -webkit-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
  color: gray;
}
</style>
