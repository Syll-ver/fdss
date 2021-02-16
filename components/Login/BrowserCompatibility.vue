<template>
  <div class="__nuxt-error-page">
    <div class="error">
      <div class="center mb-3">
        <center>
          <h1 style="font-size: 5rem"></h1>
          <h2
            style="font-size: 2.10rem; letter-spacing: 10.3PX; position: relative; bottom:20px"
            class="ml-2"
          >NOT COMPATIBLE
          </h2>
          <span class="text-center" style="font-size: 17.8px"
            >We have detected that you are using a browser version that will prevent you from accessing certain features. <br> Please make sure your browser is fully updated or try a different browser.</span
          > <br /> 
          <br />
          <br />
          <p>
          <span style="font-size: 17.8px" > Supported browsers: 
          </span>
              </p>
              <table >
                  <tbody>
                      <tr>
                          <th >
                            <a href="https://www.google.com/chrome/">
                              <img src="/chrome.png" alt="" style="height: 73px" class="ml-1">&nbsp;
                            </a>
                          </th>
                          <td style="font-size: 15px;">
                            <b-link @click="getLocation('https://www.google.com/chrome/')" 
                            :style="getSyle(browser.name, 'Chrome')" 
                            >Google Chrome Version 5 and later</b-link>
                          </td>
                      </tr>
                      <tr>
                          <th>
                              <a href="https://www.mozilla.org/en-US/firefox/new/">
                                &nbsp;<img src="/mozilla.png" alt="" style="height: 70px;" class="ml-2">
                              </a>
                          </th>
                          <td style="font-size: 15px">
                              <b-link @click="getLocation('https://www.mozilla.org/en-US/firefox/new/')"
                              :style="getSyle(browser.name, 'Firefox')"
                              >Mozilla Firefox Version 56 and later</b-link>
                          </td>
                      </tr>
                      <tr>
                          <th>
                              <a href="https://download-chromium.appspot.com/">
                              &nbsp;<img src="/chromium.png" alt="" style="height: 75px" class="ml-1">
                              </a>
                          </th>
                          <td style="font-size: 15px">
                              <b-link @click='getLocation("https://download-chromium.appspot.com/")'
                              :style="getSyle(browser.name, 'Chromium')"
                              >Chromium Version 5 and later</b-link>
                          </td>
                      </tr>
                  </tbody>
              </table>

              <!-- <p>
                <span>
                  To proceed, please update your browser here.
                </span>
              </p> -->
              
        </center>

      </div>
    </div>
  </div>
</template>

<script>
import Bowser from "bowser";

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

      meta: [
        {
          name: "viewport",
          content:
            "width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"
        }
      ],
    };
  },
  data(){
    return {
      browser: {
        name: null,
        version: null
      }
    }
  },
  computed: {

  },
  created(){
    const browser = Bowser.getParser(window.navigator.userAgent);
    this.browser.name = browser.getBrowserName();
    this.browser.version = parseInt(browser.getBrowserVersion());
    if(this.validVersion()){
      this.$router.push("/");
    }
  },
  methods: {
    getSyle(browser, name) {
      if (browser == name) {
        return 'color: LimeGreen !important'
      } 
      return
    },
    goback() {
      window.history.back();
    },
    getLocation(url) {
      var redirectWindow = window.open(url);
      redirectWindow.location;
    },
    validVersion(){
      return (
        (this.browser.name === "Chrome" && this.browser.version > 5 ) ||
        (this.browser.name === "Firefox" && this.browser.version > 56 ) ||
        (this.browser.name === "Chromium" && this.browser.version > 5)
      );
    },
  }
};
</script>

<style>
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

.chrome {
  /* background-color: red; */
  color: red;
}
</style>
