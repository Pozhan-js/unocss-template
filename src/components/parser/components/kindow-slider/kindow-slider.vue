 <template>
   <view>  <u-slider v-model="value1"></u-slider>  </view> 
</template>

<script>

export default {
  name: "kindow-slider",
  data() {
    return {
      value1: 30,
    };
  },
  props: {
    allowHalf: {},
    count: {},
    disabled: {},
    val: {},
    __vModel__: {},
    disabled: {},
  },
};
</script>