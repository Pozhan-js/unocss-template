<template>
  <view>
    <image :src="computeSrc" :style="{height:style.height,width:style.width}"></image>
  </view>
</template>

<script>

export default {
  props: {
    src: {
      required: true
    },
    style: {
      required: true,
    }
  },
  computed: {
    computeSrc() {
      if (this.src.startsWith("http") || this.src.startsWith("www"))
        return this.src
    },
  },
  data() {
    return {
    }
  },
  methods: {}
}
</script>

<style>

</style>
