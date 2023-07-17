<template>
  <u--textarea
    v-model="inputVal"
    :placeholder="placeholder"
    :disabled="disabled"
    :readOnly="readOnly"
    :confirmType="confirmType"
    :count="parseInt(maxlength) > 0"
    :maxlength="parseInt(maxlength)"
    @input="(e) => $emit('input',__vModel__,e)"
  ></u--textarea>
</template>

<script>
export default {
  name: "kindow-textarea",
  props: {
    val: {},
    __vModel__: {},
    confirmType: {
      type: String,
      default: "done",
    },
    maxlength: {
      type: [String, Number],
      default: -1,
    },
    placeholder: {
      type: String,
      default: "",
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inputVal: this.val,
    };
  },
};
</script>

<style>
</style>
