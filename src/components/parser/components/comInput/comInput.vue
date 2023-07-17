<template>
  <view>
    <u-input
      :clearable="clearable"
      :disabled="disabled"
      :maxlength="parseInt(maxlength)"
      :placeholder="placeholder"
      border="none"
      v-model="inputVal"
      @input="(e) => $emit('input', __vModel__, e)"
      :readOnly="readOnly"
    >
      <!-- 前置插槽 -->
      <template v-slot:prefix>
        <view class="flex-sb flex-ai">
          <!-- 文字 -->
          <view class="input-fix" v-if="stringSlot.prepend">{{
            stringSlot.prepend
          }}</view>
          <!-- 前置图片 -->
          <view v-if="prefixIcon">
            <span :class="prefixIcon"></span>
          </view>
        </view>
      </template>

      <!-- 后置插槽 -->
      <template v-slot:suffix>
        <view class="flex-sb flex-ai">
          <!-- 后置图标 -->
          <view v-if="suffixIcon">
            <span :class="suffixIcon"></span>
          </view>
          <!-- 后置文字 -->
          <view class="input-fix" v-if="stringSlot.append">{{
            stringSlot.append
          }}</view>
        </view>
      </template>
    </u-input>
  </view>
</template>

<script>
/**
 *
 * **/
export default {
  props: {
    val: {},
    __vModel__: {},
    readOnly: {
      type: Boolean,
      default: false,
    },
    // 后置图标
    suffixIcon: {
      type: String,
    },
    // 前置图标
    prefixIcon: {
      type: String,
    },
    // 插槽文字
    stringSlot: {},
    clearable: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    maxlength: {
      type: [String, Number],
      default: -1,
    },
    placeholder: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      inputVal: this.val,
    };
  },
};
</script>

<style scoped lang="scss">
.input-fix {
  background-color: #f5f7fa;
  padding: 10rpx 30rpx;
  color: #909399;
  border-radius: 5rpx;
}
</style>
