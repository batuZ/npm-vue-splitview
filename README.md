# vue-splitview
  A nestable split view component
```
<template>
  <div class="container">
    <SplitView 
      :view_items="items"
      :is_horizontal="true"
      :use_percen="true"
      >
      <template #left> </template>
      <template #right> </template>
    </SplitView>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
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
          size: "120px",
        },
      ],
    };
  },
};
</script>
```
[aaa](./dist/index.html)
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