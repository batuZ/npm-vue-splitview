<template>
  <div class="s-box" ref="s-box">
    <div
      v-for="(item, index) in view_items"
      :key="index"
      :class="item_class(item, is_horizontal)"
      :ref="item.name"
      :maximum="item.maximum"
      :minimum="item.minimum"
    >
      <slot :name="item.name">
        &lt;template #{{ item.name }}&gt;&lt;/template&gt;
      </slot>

      <label
        v-if="view_items.length > index + 1"
        :class="handle_class(item)"
        ref="handle"
      />
    </div>
  </div>
</template>

<script>
// split 方向
var is_h = true;
// move时的启始值
var start = 0;
// 被移动的item的handle
var handle = null;
// 默认最大最小值
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

  mounted() {
    // 绑定事件
    let box = this.$refs["s-box"];
    box.onmousemove = this.m_mousemove;
    box.onmouseup = this.m_mouseup;
    for (let vitem of this.view_items) {
      let item = this.$refs[vitem.name]?.[0];
      if (!item) continue;
      vitem.hide = () => this.hide_item(vitem);
      vitem.show = () => this.show_item(vitem);
      vitem._hiden = false;
      if (this.is_horizontal) {
        item.style.width = vitem.size || 100.0 / this.view_items.length + "%";
      } else {
        item.style.height = vitem.size || 100.0 / this.view_items.length + "%";
      }
    }
    for (let vitem of this.view_items) {
      if (vitem.hiden) {
        this.hide_item(vitem);
      }
    }
    for (let handle of this.$refs["handle"] || []) {
      handle.onmousedown = this.m_mousedown;
    }
  },

  computed: {
    item_class() {
      return function (item, h) {
        let res = h ? "h-item" : "v-item";
        res += item._hiden ? " is-hiden" : "";
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

  methods: {
    m_mousedown(e) {
      if (
        e.target.className.indexOf("handle") != -1 &&
        e.target.className.indexOf("stable") == -1
      ) {
        handle = e.target;
        handle.style.background = "#888";
        is_h = e.target.parentNode.className.indexOf("h-item") != -1;
        start = this.is_horizontal ? e.pageX : e.pageY;
      }
    },

    m_mousemove(e) {
      if (handle) {
        let distance, item_dis, nitem_dis;
        let item = handle.parentNode;
        let nitem = handle.parentNode.nextElementSibling;
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

        function is_in_range(dis, item) {
          let min = str_to_num(item.getAttribute("minimum") || G_MIN, item);
          let max = str_to_num(item.getAttribute("maximum") || G_MAX, item);
          return min < dis && dis < max;
        }

        function str_to_num(str, it) {
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

    m_mouseup(e) {
      if (handle) {
        // 转为百分比
        if (this.use_percen) {
          let box_w = handle.parentNode.parentNode.clientWidth;
          let box_h = handle.parentNode.parentNode.clientHeight;

          let this_item_w = handle.parentNode.clientWidth;
          let this_item_h = handle.parentNode.clientHeight;
          handle.parentNode.style.width = (this_item_w * 100.0) / box_w + "%";
          handle.parentNode.style.height = (this_item_h * 100.0) / box_h + "%";

          let next_item_w = handle.parentNode.nextElementSibling.clientWidth;
          let next_item_h = handle.parentNode.nextElementSibling.clientHeight;
          handle.parentNode.nextElementSibling.style.width =
            (next_item_w * 100.0) / box_w + "%";
          handle.parentNode.nextElementSibling.style.height =
            (next_item_h * 100.0) / box_h + "%";
        }
        handle.style.background = "#fff";
        handle = null;
      }
      start = 0;
      e.cancelBubble = true;
    },

    hide_item(item) {
      if (item._hiden) return;
      let item_view = this.$refs[item.name]?.[0];
      if (!item_view) return;
      let neighbo_view =
        this.view_items.length - 1 == this.view_items.indexOf(item)
          ? item_view.previousElementSibling
          : item_view.nextElementSibling;
      if (this.is_horizontal) {
        item.size = item_view.clientWidth; // 记录一下隐藏前是多大，恢复时要用到
        neighbo_view.style.width = neighbo_view.clientWidth + item.size + "px"; // 用下一个view填满这个空间
      } else {
        item.size = item_view.clientHeight;
        neighbo_view.style.height =
          neighbo_view.clientHeight + item.size + "px";
      }
      item._hiden = true;
    },
    show_item(item) {
      // 排除重复操作
      if (!item._hiden) return;
      let item_view = this.$refs[item.name]?.[0];
      // 排除空对象
      if (!item_view) return;
      //判断是否最后一个item，如果是用上一个neighbo_view填充空间，如果不是用后一个neighbo_view填充空间
      let is_last_item =
        this.view_items.length - 1 === this.view_items.indexOf(item);
      let neighbo_view = is_last_item
        ? item_view.previousElementSibling
        : item_view.nextElementSibling;
      // 判断neighbo_view是否将小于最小值，如果是，则平均分配当前空间
      let back_size =
        neighbo_view.clientWidth - item.size < 20
          ? neighbo_view.clientWidth / 2
          : item.size;
      // 判断方向，确定操作哪个属性
      if (this.is_horizontal) {
        item_view.style.width = back_size + "px";
        neighbo_view.style.width = neighbo_view.clientWidth - back_size + "px";
      } else {
        item_view.style.height = back_size + "px";
        neighbo_view.style.height =
          neighbo_view.clientHeight - back_size + "px";
      }
      item._hiden = false;
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
  overflow: hidden;
  background-color: #589;
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
  background-color: #eee;
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
  background-color: #eee;
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