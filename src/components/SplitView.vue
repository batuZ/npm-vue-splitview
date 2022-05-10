<template>
  <div class="s-box" ref="s-box">
    <template v-for="(item, index) in view_items" :key="index">
      <div
        :class="item_class(item)"
        :ref="item.name"
        :maximum="item.maximum"
        :minimum="item.minimum"
      >
        <slot :name="item.name"
          >&lt;template #{{ item.name }}&gt;&lt;/template&gt;</slot
        >
        <label
          :class="handle_class(item)"
          ref="handle"
          v-if="view_items.length > index + 1"
        />
      </div>
    </template>
  </div>
</template>

<script>
var is_h = true;
var start = 0;
var handle = null;
const G_MAX = "95%";
const G_MIN = "5%";
export default {
  name: "SplitView",
  props: {
    view_items: {
      type: Array,
      default: [
        {
          name: "default",
          size: "50%",
          maximum: G_MAX,
          minimum: G_MIN,
          hiden: false,
          stable: false,
        },
        {
          name: "item",
          size: "50%",
        },
      ],
    },
    is_horizontal: {
      type: Boolean,
      default: true,
    },
    use_percen: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    item_class() {
      return function (item) {
        let res = this.is_horizontal ? "h-item" : "v-item";
        res += item.hiden ? " is-hiden" : "";
        return res;
      };
    },
    handle_class() {
      return function (item) {
        let res = "handle";
        res += item.stable ? " stable" : "";
        return res;
      };
    },
  },
  mounted() {
    let box = this.$refs["s-box"];
    box.onmousemove = this.m_mousemove;
    box.onmouseup = this.m_mouseup;
    for (let vitem of this.view_items) {
      let item = this.$refs[vitem.name]?.[0];
      if (!item) continue;
      if (this.is_horizontal) {
        item.style.width = vitem.size || 100.0 / this.view_items.length + "%";
      } else {
        item.style.height = vitem.size || 100.0 / this.view_items.length + "%";
      }
    }
    for (let handle of this.$refs["handle"] || []) {
      handle.onmousedown = this.m_mousedown;
    }
  },
  methods: {
    m_mouseup(e) {
      if (handle) {
        if (this.use_percen) {
          let box_w = handle.parentNode.parentNode.clientWidth;
          let box_h = handle.parentNode.parentNode.clientHeight;

          let this_item_w = handle.parentNode.clientWidth;
          let this_item_h = handle.parentNode.clientHeight;
          handle.parentNode.style.width = (this_item_w * 100.0) / box_w + "%";
          handle.parentNode.style.height = (this_item_h * 100.0) / box_h + "%";

          let next_item_w = handle.parentNode.nextSibling.clientWidth;
          let next_item_h = handle.parentNode.nextSibling.clientHeight;
          handle.parentNode.nextSibling.style.width =
            (next_item_w * 100.0) / box_w + "%";
          handle.parentNode.nextSibling.style.height =
            (next_item_h * 100.0) / box_h + "%";
        }
        handle.style.background = "#fff";
        handle = null;
      }
      start = 0;
      e.cancelBubble = true;
    },
    m_mousedown(e) {
      if (
        e.target.className.indexOf("handle") != -1 &&
        e.target.className.indexOf("stable") == -1
      ) {
        handle = e.target;
        handle.style.background = "#888";
        is_h = e.target.parentNode.className.indexOf("h-item") != -1;
        start = is_h ? e.pageX : e.pageY;
      }
    },
    m_mousemove(e) {
      if (handle) {
        let distance, item_dis, nitem_dis;
        let item = handle.parentNode;
        let nitem = handle.parentNode.nextSibling;
        if (is_h) {
          distance = e.pageX - start;
          start = e.pageX;
          item_dis = item.clientWidth + distance;
          nitem_dis = nitem.clientWidth - distance;
          if (is_in_range(item_dis, item)) {
            item.style.width = item_dis + "px";
            nitem.style.width = nitem_dis + "px";
          }
        } else {
          distance = e.pageY - start;
          start = e.pageY;
          item_dis = item.clientHeight + distance;
          nitem_dis = nitem.clientHeight - distance;
          if (is_in_range(item_dis, item)) {
            item.style.height = item_dis + "px";
            nitem.style.height = nitem_dis + "px";
          }
        }
        function is_in_range(dis, it) {
          let min = to_px(it.getAttribute("minimum") || G_MIN, it);
          let max = to_px(it.getAttribute("maximum") || G_MAX, it);
          return min < dis && dis < max;
        }
        function to_px(str, it) {
          let res = NaN;
          try {
            if (str.indexOf("%") != -1) {
              res = Number(str.replace("%", ""));
              let box_value = is_h
                ? it.parentNode.clientWidth
                : it.parentNode.clientHeight;
              res = box_value * 0.01 * res;
            } else {
              res = Number(str.replace("px", ""));
            }
          } catch (e) {}
          return Math.floor(res);
        }
      }
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

  overflow: hidden;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.h-item {
  position: relative;
  float: left;
  height: 100%;
  overflow: hidden;
  background-color: gray;
}

.v-item {
  position: relative;
  width: 100%;
  background-color: gray;
}

.h-item > .handle {
  position: absolute;
  right: 0;
  top: 0;
  float: left;
  width: 4px;
  height: 100%;
  display: block;
  cursor: ew-resize;
  background-color: #fff;
  z-index: 9;
}
.h-item > .stable {
  width: 2px;
  cursor: auto;
}
.v-item > .handle {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  display: block;
  cursor: ns-resize;
  background-color: #fff;
  z-index: 9;
}
.v-item > .stable {
  cursor: auto;
  height: 2px;
}
.is-hiden {
  display: none;
}
</style>