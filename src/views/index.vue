<template>
  <Layout :main="true" :scene="true">
    <router-view></router-view>

    <template v-slot:scene>
      <div class="content-scene">
        <Scene></Scene>
      </div>
    </template>
  </Layout>
</template>

<script>
import Scene from "@/layout/scene.vue";
import Layout from "@/layout/index.vue";

export default {
  name: "FrontEndIndex",
  components: {
    Scene,
    Layout,
  },

  computed: {},
  methods: {},
};
</script>
