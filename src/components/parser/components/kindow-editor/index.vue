<template>
  <view class="editor-app">
    <view class="content">
      <u-parse :content="defaultValue"></u-parse>
    </view>
    <view v-if="!disabled" class="btn" @tap="toEdit"> 编 辑 </view>
    <view v-if="showEditor" class="editor">
      <robin-editor
        class="editor"
        @cancel="hideEditor"
        @save="saveEditor"
        :value="defaultValue"
        :imageUploader="uploadImg"
        :muiltImage="true"></robin-editor>
    </view>
  </view>
</template>

<script>
import robinEditor from "./components/robin-editor/robin-editor/robin-editor.vue";
export default {
  components: { robinEditor },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    __vModel__: {
      type: String,
    },
    defaultValue: {
      type: String,
    },
  },
  data() {
    return {
      showEditor: false,
    };
  },
  mounted() {
    console.log("mounted", this.__vModel__, this.defaultValue);
  },
  methods: {
    toEdit() {
      if (this.disabled) return;
      this.showEditor = true;
    },
    openEditor() {
      this.showEditor = true;
    },
    hideEditor() {
      this.showEditor = false;
    },
    saveEditor(e) {
      console.log("save", e);

      this.$emit("input", this.__vModel__, e.html);
      this.hideEditor();
    },
    uploadImg(img, callback) {
      console.log("uploadImg", img, callback);
      //上传图片逻辑,将图片链接传给回调函数
      callback(img);
    },
    changeHtml(i) {
      //从远程获取数据赋值
      this.html = i == 1 ? this.html : this.html2;
    },
  },
};
</script>

<style scoped lang="scss">
.btn {
  color: #fff;
  background: #407dff;
  width: 80%;
  margin: 15rpx auto;
  font-size: 30rpx;
  padding: 15rpx;
  border-radius: 15rpx;
  text-align: center;
}
.content {
  padding: 20rpx;
  box-sizing: border-box;
  overflow: hidden;
}
.editor {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 999999;
  background: #fff;
  overflow: hidden;
}
</style>
