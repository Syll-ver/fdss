<template>
  <div class="body">
    <main>
      <Login />
    </main>
  </div>
</template>

<script>
import Login from "@/components/Login/Login";
export default {
  name: "LoginUI",
  layout: "loginLayout",
  components: {
    Login
  },
  data() {
    return {
    };
  }
};
</script>
