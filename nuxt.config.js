module.exports = {
  mode: "spa",
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, shrink-to-fit=no" },
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
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
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
  // plugins: ["~/plugins/fontawesome.js","~/plugins/htmltopaper.js","~/plugins/papa-parse","~/plugins/elastic.js"],
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
      },
  axios: {
    // baseURL: "https://fdss.biotechfarms.net/fdss-api" // prod
    // baseURL: "https://fdss-eut.biotechfarms.net/fdss-api"  // eut
    // baseURL: "http://172.16.4.168:8000/fdss-api" // coach 
    baseURL: "http://94.237.65.245:8223/fdss-api"// (DEV)
    // baseURL: "http://172.16.28.8:8000/fdss-api"// Carl

  },
  env:{
    serverPrintUrl: "http://172.16.4.182:887", 
    // serverPrintUrl: "http://172.17.122.199:3002", 
    // serverPrintUrl: "http://172.16.28.8:8000/fdss-api", 
    // serverPrintUrl: "http://localhost:3002",
    uuid: `8204064d-1029-4398-98c4-075fe28643b4`,
    // bfi: 158871, // dev
    // rci: 158883, // dev
    // bfi: '4400', // prod
    // rci: '4381', // prod
    // bfi: `139483`, // eut
    // rci: `139492`, // eut
  },

  server: { port: 9000 }

  // host:'172.16.4.114'}
};
