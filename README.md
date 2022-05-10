# vue-splitview
  A nestable split view component
  
example:
```
<template>
  <div style="width: 600px; height: 400px">
    <split-view>
      <template #default></template>
      <template #item>
        <split-view :is_horizontal="false" :view_items="items" />
      </template>
    </split-view>
  </div>
</template>

<script >
import SplitView from "vue-splitviews";
export default {
  components: { SplitView },
};
</script>
```

### props

* view_items: view item init params, default `[{name: default}, {name: item}]`
    * name: use to slot name
    * size: current view size, use `%` or `px` only
    * maximum: current view max size, default 95%, use `%` or `px` only
    * minimum: current view min size, default 5%, use `%` or `px` only
    * hiden: current view show status, you can controle it in parent, default false
    * stable: current view unresizeble, default false
* is_horizontal: view direction, default true
* use_percen: move resoult use `%` or `px`, it will change the movement effect, default true


example:
```
<script >
import SplitView from "vue-splitviews";
export default {
  components: { SplitView },
  ...
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
  ...
};
</script>
```