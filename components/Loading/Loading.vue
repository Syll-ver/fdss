<template>
  <div>
    <div id="loader" class="loader">
      <center>
        <div class="loading"></div>
        <div class="load"></div>
        <div class="logo_load"></div>
      </center>
    </div>
  </div>
</template>
<script>
export default {
  mounted() {
    var load = document.getElementById("loader");
    load.style.display = "block"; //use 'none' to hide
  }
};
</script>
<style scoped>
/* FOR LOADING OVERLAY */
.loader {
  position: fixed;
  z-index: 5000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #0000006c;
  -webkit-animation-name: fadeIn;
  -webkit-animation-duration: 0.4s;
  animation-name: fadeIn;
  animation-duration: 0.4s;
}
.loading {
  position: relative;
  top: 350px;
  border: 4px solid #ffffff00;
  border-radius: 50%;
  border-top: 4px solid #ffd400;
  width: 150px;
  height: 150px;
  animation: spin 1s linear infinite;
}
.load {
  position: relative;
  top: 171px;
  border: 4px solid #ffffff00;
  border-radius: 50%;
  border-top: 4px solid #75361a;
  width: 180px;
  height: 180px;
  animation: spin2 1s linear infinite;
}
.logo_load {
  position: relative;
  top: 13px;
  background-image: url("/REvives.png");
  background-size: cover;
  width: 120px;
  height: 120px;
  animation: vrotate 2.3s linear infinite;
}
@media only screen and (max-width: 1366px) {
  .loading {
    position: relative;
    top: 219px;
  }
  .load {
    position: relative;
    top: 54px;
  }
  .logo_load {
    position: relative;
    top: -95px;
  }
}
/* Safari */
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes spin2 {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(-360deg);
  }
}
@keyframes spin2 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}
@-webkit-keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-webkit-keyframes vrotate {
  0% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(-1);
  }
  100% {
    transform: scaleX(1);
  }
}
@keyframes vrotate {
  0% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(-1);
  }
  100% {
    transform: scaleX(1);
  }
}
/* UNTIL HERE LOADING OVERLAY */
</style>