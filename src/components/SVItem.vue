<template>
  <div
    :class="item_class"
    :style="item_style"
    :minimum="minimum"
    :maximum="maximum"
    ref="item"
  >
    <slot></slot>
    <label :class="stable ? 'handle stable' : 'handle'" v-if="!is_last" />
  </div>
</template>

<script>
export default {
  props: {
    size: Number,
    minimum: Number,
    maximum: Number,
    hiden: Boolean,
    stable: Boolean,
  },

  data() {
    return {
      is_h: true,
      is_last: false,
      brother_count: 1,
      item_size: this.size,
    };
  },

  mounted() {
    let item = this.$refs.item;
    this.is_h = item.parentNode.getAttribute("is_h") === "true";
    this.is_last = item.nextElementSibling === null;
    this.brother_count = item.parentNode.childElementCount;
    if (this.hiden) {
      this.hide();
    }
  },

  methods: {
    hide() {
      let item_view = this.$refs.item;
      if (item_view.clientWidth === 0 || item_view.clientHeight === 0) return;
      let neighbor_view = this.is_last
        ? item_view.previousElementSibling
        : item_view.nextElementSibling;

      if (this.is_h) {
        this.item_size = item_view.clientWidth;
        neighbor_view.style.width =
          neighbor_view.clientWidth + item_view.clientWidth + "px";
      } else {
        this.item_size = item_view.clientHeight;
        neighbor_view.style.height =
          neighbor_view.clientHeight + item_view.clientHeight + "px";
      }
      if (this.is_last) {
        neighbor_view.lastChild.style.display = "none";
      }
      item_view.style.display = "none";
    },

    show() {
      let item_view = this.$refs.item;
      if (item_view.clientWidth === 0 || item_view.clientHeight === 0) {
        let neighbor_view = this.is_last
          ? item_view.previousElementSibling
          : item_view.nextElementSibling;
        // 判断neighbo_view是否将小于最小值，如果是，则平均分配当前空间
        let back_size =
          neighbor_view.clientWidth - this.item_size < 20
            ? neighbor_view.clientWidth / 2
            : this.item_size;
        if (this.is_h) {
          item_view.style.width = back_size + "px";
          neighbor_view.style.width =
            neighbor_view.clientWidth - back_size + "px";
        } else {
          item_view.style.height = back_size + "px";
          neighbor_view.style.height =
            neighbor_view.clientHeight - back_size + "px";
        }
        if (this.is_last) {
          neighbor_view.lastChild.style.display = "inline";
        }
        item_view.style.display = "inline";
      }
    },
  },
  computed: {
    item_class() {
      return this.is_h ? "h-item" : "v-item";
    },
    item_style() {
      let _size = "";
      if (this.size && this.size > 0) {
        _size = this.size > 1 ? this.size + "px" : this.size * 100 + "%";
      } else {
        _size = 100.0 / this.brother_count + "%";
      }
      return this.is_h ? { width: _size } : { height: _size };
    },
  },
};
</script>

<style scoped>
.h-item {
  position: relative;
  float: left;
  height: 100%;
  overflow: hidden;
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
  background-color: #eee;
  z-index: 9;
}

.h-item > .stable {
  width: 2px;
  cursor: auto;
}

.v-item {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: #589;
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
</style>