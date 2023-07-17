<template>
  <view>
    <u-radio-group
      v-model="value"
      placement="column"
      @change="(e) => $emit('input', __vModel__, e)"
      :disabled='disabled'
    >
      <u-radio
        :customStyle="{ marginBottom: '8px' }"
        v-for="(item, index) in options"
        :key="index"
        :label="item.fullName"
        :name="item.id"
      >
      </u-radio>
    </u-radio-group>
  </view>
</template>

<script>
export default {
  name: "kindow-radio",
  props: {
    defaultValue: {},
    __vModel__: {},
    disabled: {},
    options: {},
  },
  data() {
    return {
      value: this.defaultValue,
    };
  },
  mounted() {
  },
  methods: {},
};
</script>

<style lang="scss">
</style>


