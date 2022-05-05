<template>
  <button @click="test">test</button>

  <div class="container">
    <SplitView>
      <template #default> </template>
      <template #item>
        <SplitView :is_horizontal="false" :view_items="item_names" />
      </template>
    </SplitView>
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
          name: "left",
          size: "60%",
          maximum: "80%",
          minimum: "1%",
          hiden: false,
          stable: false,
        },
        {
          name: "right",
          size: "40%",
        },
      ],
    };
  },
  methods: {
    test(e) {
      this.item_names[0]["hiden"] = !this.item_names[0]["hiden"];
      console.log(123);
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
