<template>
  <view>{{ infoString ? infoString : defaultValue }}</view>
</template>

<script>
export default {
  name: "generateValue",
  data() {
    return {};
  },
  props: {
    index: {},
    __vModel__: {},
    relationId: {
      required: true,
      type: String,
    },
    showField: {
      required: true,
      type: String,
    },
    defaultValue: {},
  },
  created() {},
  computed: {
    infoString() {
      if (this.__vModel__) {
        return this.$store.state.relationFlowEngine[
          "relationFormAttrselect" + this.index
        ]
          ? this.$store.state.relationFlowEngine[
              "relationFormAttrselect" + this.index
            ][this.__vModel__]
          : "";
      } else {
        return this.$store.state.relationFlowEngine[this.relationId]
          ? this.$store.state.relationFlowEngine[this.relationId][
              this.showField
            ]
          : "";
      }
    },
  },
  watch: {
    infoString(newVal) {
      if (this.__vModel__) {
        this.$emit("input", this.__vModel__, newVal + "");
      }
    },
  },
  methods: {},
};
</script>
<style scoped>
</style>
