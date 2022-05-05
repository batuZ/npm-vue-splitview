import SplitView from "./SplitView.vue";
SplitView.install = function (Vue) {
    Vue.component(SplitView.name, SplitView)
}
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.component('split-view', SplitView);
}
export default SplitView