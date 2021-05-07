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
  plugins: ["~/plugins/fontawesome.js","~/plugins/htmltopaper.js","~/plugins/papa-parse","~/plugins/elastic.js"],
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
    // baseURL: "http://172.16.4.168:8000/fdss-api" 
    // baseURL: "http://94.237.66.240:8000" (MASTER)
    // baseURL: "http://94.237.66.240:8100" (SQA)
    // baseURL: "https://fdss-uat.biotechfarms.net/fdss-api" 
    // baseURL: "https://fdss-eut.biotechfarms.net/fdss-api" 
    // baseURL: "http://172.16.4.201:8000/fdss-api" // butch 
    baseURL: "hhtp://94.237.66.240:8200" // (UAT)
    // baseURL: "https://fdss-sqa.biotechfarms.net/fdss-api" 

  },
  env:{
    serverPrintUrl: "http://172.16.4.182:887", 
    // serverPrintUrl: "http://localhost:3002",
    // networkPrinterIp: `172.16.4.173`, // gensan network printer ip
    uuid: `8204064d-1029-4398-98c4-075fe28643b4`,
    bfi: `145969`, // dev
    rci: `146034` // dev
    // bfi: '4400', // prod
    // rci: '4381' // prod
    // bfi: `139483`, // eut
    // rci: `139492` // eut
    
  },

  server: { port: 9000 }

  // host:'172.16.4.114'}
};
