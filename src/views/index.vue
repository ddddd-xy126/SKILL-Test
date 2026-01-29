<template>
  <Layout :header="true" :footer="true" :main="true" :scene="true">
    <template v-slot:header>
      <div class="content-header">
        <Header></Header> 
      </div>
    </template>

    <router-view></router-view>



    <Center v-if="isShowWindow.isShow" :config="isShowWindow.config" />

    <template v-slot:scene>
      <div class="content-scene">
        <Scene></Scene>
      </div>

    </template>

    <template v-slot:footer>
      <div class="content-footer">
        <Footer></Footer>


      </div>
    </template>
  </Layout>
</template>

<script>
import { mapState } from "vuex";
import Layout from "@/layout/index.vue";
import Header from "@/layout/header.vue";
import Footer from "@/layout/footer.vue";
import Scene from "@/layout/scene.vue";

import Center from "@/components/center.vue";

import { getCameraInfo } from "@/utils/wdpapi/camera";
export default {
  name: "FrontEndIndex",
  components: {
    Layout,
    Header,
    Scene,
    Footer,

    Center,
  },

  computed: {
    ...mapState(["isShowScene", "isShowWindow"]),
  },
  methods: {
      async getCaerma() {
      const res = await getCameraInfo();
      const location = res.result.location;
      // 自动复制到剪贴板
      if (location) {
        let text = "";
        if (Array.isArray(location)) {
          text = JSON.stringify(location);
        } else if (typeof location === "object") {
          text = JSON.stringify(location);
        } else {
          text = String(location);
        }
        try {
          await navigator.clipboard.writeText(text);
          this.$message && this.$message.success("已复制到剪贴板！");
          // 或者用 alert("已复制到剪贴板！");
        } catch (e) {
          this.$message && this.$message.error("复制失败，请手动复制！");
        }
      }
    },
  },
};
</script>
