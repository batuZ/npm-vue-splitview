<template>
  <div class="s-box" ref="sbox" :is_h="is_horizontal">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    is_horizontal: {
      type: Boolean,
      default: true,
    },
    default_min: {
      type: Number,
      default: 0.05,
    },
    default_max: {
      type: Number,
      default: 0.95,
    },
    use_percen: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      start: 0,
      handle: null,
    };
  },
  mounted() {
    // 绑定事件
    let box = this.$refs.sbox;
    box.onmousemove = this.m_mousemove;
    box.onmouseup = this.m_mouseup;
    box.onmouseleave = this.m_mouseup;
    for (let child of box.children) {
      child.lastChild.onmousedown = this.m_mousedown;
    }
  },

  methods: {
    m_mousedown(e) {
      if (
        e.target.className.indexOf("handle") != -1 &&
        e.target.className.indexOf("stable") == -1
      ) {
        this.handle = e.target;
        this.handle.style.background = "#888";
        this.start = this.is_horizontal ? e.pageX : e.pageY;
      }
    },

    m_mousemove(e) {
      if (this.handle) {
        let distance, item_dis, nitem_dis;
        let item = this.handle.parentNode;
        let nitem = this.handle.parentNode.nextElementSibling;

        let str_to_num = (str) => {
          let res = Number(str);
          if (res > 0 && res <= 1) {
            let box = this.$refs.sbox;
            let box_value = this.is_horizontal
              ? box.clientWidth
              : box.clientHeight;
            res = box_value * res;
          }
          return Math.floor(res);
        };
        let is_in_range = (dis) => {
          let min = str_to_num(
            item.getAttribute("minimum") || this.default_min
          );
          let max = str_to_num(
            item.getAttribute("maximum") || this.default_max
          );
          return min < dis && dis < max;
        };
        if (this.is_horizontal) {
          distance = e.pageX - this.start;
          this.start = e.pageX;
          item_dis = item.clientWidth + distance;
          nitem_dis = nitem.clientWidth - distance;
          if (is_in_range(item_dis)) {
            item.style.width = item_dis + "px";
            nitem.style.width = nitem_dis + "px";
          }
        } else {
          distance = e.pageY - this.start;
          this.start = e.pageY;
          item_dis = item.clientHeight + distance;
          nitem_dis = nitem.clientHeight - distance;
          if (is_in_range(item_dis)) {
            item.style.height = item_dis + "px";
            nitem.style.height = nitem_dis + "px";
          }
        }
      }
    },

    m_mouseup(e) {
      if (this.handle) {
        // 转为百分比
        if (this.use_percen) {
          let box_w = this.handle.parentNode.parentNode.clientWidth;
          let box_h = this.handle.parentNode.parentNode.clientHeight;

          let this_item_w = this.handle.parentNode.clientWidth;
          let this_item_h = this.handle.parentNode.clientHeight;
          this.handle.parentNode.style.width =
            (this_item_w * 100.0) / box_w + "%";
          this.handle.parentNode.style.height =
            (this_item_h * 100.0) / box_h + "%";

          let next_item_w =
            this.handle.parentNode.nextElementSibling.clientWidth;
          let next_item_h =
            this.handle.parentNode.nextElementSibling.clientHeight;
          this.handle.parentNode.nextElementSibling.style.width =
            (next_item_w * 100.0) / box_w + "%";
          this.handle.parentNode.nextElementSibling.style.height =
            (next_item_h * 100.0) / box_h + "%";
        }
        this.handle.style.background = "#fff";
        this.handle = null;
      }
      this.start = 0;
      e.cancelBubble = true;
    },
  },
};
</script>

<style scoped>
.s-box {
  position: relative;
  width: 100%;
  height: 100%;
  clear: both;

  background-color: aquamarine;
  overflow: hidden;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>