<template>
  <view>
    <u-rate
      :value="value"
      :count="count"
      :disabled="disabled"
      :allowHalf="allowHalf"
      activeColor="#F7BA2A"
      @change="(e) => $emit('input', __vModel__, e)"
    >
    </u-rate>
  </view>
</template>

<script>
export default {
  name: "kindow-rate",
  data() {
    return {
      value: this.val,
    };
  },
  props: {
    allowHalf:{},
    count: {},
    disabled: {},
    val: {},
    __vModel__: {},
    disabled: {},
  },
  methods: {},
};
</script>

<style>
</style>
