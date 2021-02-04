module.exports = {
  mode: "spa",
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    script: [
      {
        src: `/epos-2.14.0.js`,
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.png" }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#00a651" },
  /*
   ** Global CSS
   */
  css: [
    "@fortawesome/fontawesome-svg-core/styles.css",
    "@/assets/scss/main.scss"
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ["~/plugins/fontawesome.js","~/plugins/htmltopaper.js","~/plugins/papa-parse"],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    "bootstrap-vue/nuxt",
    "@nuxtjs/axios"
  ],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },
  axios: {
    // baseURL: "http://172.16.4.168:8000/fdss-api" 
    // baseURL: "http://94.237.66.240:8000" (MASTER)
    // baseURL: "http://94.237.66.240:8100" (SQA)
    // baseURL: "https://fdss-uat.biotechfarms.net/fdss-api" 
    baseURL: "https://fdss-eut.biotechfarms.net/fdss-api" 
    // baseURL: "http://172.16.4.201:8000/fdss-api"
    // baseURL: "hhtp://94.237.66.240:8200" (UAT)
    // baseURL: "https://fdss-sqa.biotechfarms.net/fdss-api"

  },
  env:{
    serverPrintUrl: "http://localhost:3001",
<<<<<<< HEAD
    networkPrinterIp: `172.16.4.26`,
=======
    networkPrinterIp: `172.16.4.85`,
>>>>>>> cdf16f7ca7cdf3ecda4ee5e82f236edb78e87c5a
    // networkPrinterIp: `172.16.4.13`,
    networkPrinterPort: `8008`,
  },

<<<<<<< HEAD
  server: { port: 7000}
=======
  server: { port: 9000 }
>>>>>>> cdf16f7ca7cdf3ecda4ee5e82f236edb78e87c5a
  // host:'172.16.4.114'}
};
