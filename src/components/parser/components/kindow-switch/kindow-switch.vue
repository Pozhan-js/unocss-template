<template>
  <view>
    <u-switch
      v-model.number="switchVal"
      :disabled="disabled"
      :activeValue="1"
      :inactiveValue="0"
      @change="(e) => $emit('input',__vModel__, e)"
    ></u-switch>
  </view>
</template>

<script>
export default {
  name: "kindow-switch",
  data() {
    return {
      switchVal: this.val,
    };
  },
  props: {
    val: {},
    __vModel__: {},
    disabled: {},
  },
  methods: {},
};
</script>
<style scoped>
</style>
