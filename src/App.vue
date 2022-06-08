<template>
  <button @click="hide">hide</button>
  <button @click="show">show</button>
  <button @click="hide_r" style="margin-left: 25px">hide_right</button>
  <button @click="show_r">show_right</button>
  <div class="container">
    <SVBox :is_horizontal="true">
      <SVItem :size="0.2" :stable="true" ref="aItem"> left </SVItem>
      <SVItem :size="0.4">
        <SVBox :is_horizontal="false">
          <SVItem>up</SVItem>
          <SVItem>down</SVItem>
        </SVBox>
      </SVItem>
      <SVItem :size="0.4" ref="bItem">right</SVItem>
    </SVBox>
  </div>
</template>
<script>
import SplitView from "./components/SplitView.vue";
import SVBox from "./components/SVBox.vue";
import SVItem from "./components/SVItem.vue";
export default {
  components: { SplitView, SVBox, SVItem },
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
      this.$refs.aItem.hide();
    },
    show(e) {
      this.$refs.aItem.show();
    },
    hide_r(e) {
      this.$refs.bItem.hide();
    },
    show_r(e) {
      this.$refs.bItem.show();
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
