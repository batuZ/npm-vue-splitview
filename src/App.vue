<template>
  <button @click="hide">hide</button>
  <button @click="show">show</button>

  <div class="container">
    <split-view :is_horizontal="true">
      <SplitView :is_horizontal="false" :view_items="item_names" />
    </split-view>
  </div>
</template>
<script>
import SplitView from "./components/SplitView.vue";
export default {
  components: { SplitView },
  data() {
    return {
      item_names: [
        {
          name: "up",
          size: "60%",
          maximum: "80%",
          minimum: "1%",
          hiden: true,
          stable: false,
        },
        {
          name: "down",
          size: "40%",
        },
      ],
    };
  },
  methods: {
    hide(e) {
      this.item_names[0].hide();
    },
    show(e) {
      this.item_names[0].show();
    },
  },
};
</script>
<style scoped>
.container {
  width: 600px;
  height: 400px;
  margin: 20px;
  background-color: yellow;
}
</style>
