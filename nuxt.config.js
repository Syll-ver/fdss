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
    baseURL: "http://172.16.4.168:8000/fdss-api" 
    // baseURL: "http://94.237.66.240:8000" (MASTER)
    // baseURL: "https://fdss-dev.biotechfarms.net/fdss-api" 
    // baseURL: "hhtp://94.237.66.240:8200" (UAT)
    // baseURL: "https://fdss-sqa.biotechfarms.net/fdss-api"
  },

  server: { port: 7000}
  // host:'172.16.4.114'}
};
