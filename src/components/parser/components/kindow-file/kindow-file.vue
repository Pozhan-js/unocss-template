<template>
  <view>
    <lsj-upload
      ref="lsjUpload"
      childId="upload1"
      :width="width"
      :height="height"
      :option="option"
	  :disabled="disabled"
      :size="fileSize"
      :count="limit"
      :formats="formats"
      :instantly="instantly"
      @uploadEnd="onuploadEnd"
      @change="onChange"
    >
      <view class="btn" :style="{ width: width, height: height }">{{
        label
      }}</view>
    </lsj-upload>

    <view class="padding">
      <!-- #ifndef MP-WEIXIN -->
      <view v-for="(item, index) in files.values()" :key="index">
        <text style="font-size: 20rpx">{{ item.name }}</text>
        <text
          @click="clear(item.name)"
          style="
            margin-left: 10rpx;
            padding: 0 10rpx;
            border: 1rpx solid #007aff;
            width: 20rpx;
            height: 20rpx;
            font-size: 20rpx;
          "
          >删除</text
        >
      </view>
      <!-- #endif -->

      <!-- #ifdef MP-WEIXIN -->
      <view v-for="(item, index) in wxFiles" :key="index">
        <text>{{ item.name }}</text>
        <text style="margin-left: 10rpx">大小：{{ item.size }}</text>
        <text style="margin-left: 10rpx">状态：{{ item.type }}</text>
        <text style="margin-left: 10rpx">进度：{{ item.progress }}</text>
        <view>
          <button>删除</button>
        </view>
      </view>
      <!-- #endif -->
    </view>
  </view>
</template>

<script>
import lsjUpload from "./lsj-upload/lsj-upload.vue";
import helper from "@/common/helper.js";
import config from "@/common/config.js";
export default {
  components: {
    lsjUpload,
  },
  props: {
	 disabled: {},
    defaultValue: {
      default() {
        return [];
      },
    },
    accept: {},
    limit: {
      type: Number,
      default() {
        return 9;
      },
    },
    fileSize: {
      type: Number,
      default() {
        return 2;
      },
    },
    label: {
      type: String,
      default() {
        return "图片上传";
      },
    },
    __vModel__: {
      type: String,
    },
    required: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      // 上传接口参数
      option: {
        // 上传服务器地址，此地址需要替换为你的接口地址
        url: config.Global.baseUrl.apiUrl + "/api/file/Uploader/annex",
        // 上传附件的key
        name: "file",
        header: {
            Authorization: uni.getStorageSync( config.Global.cache + '_Token'),
          },
        formData: {
          // 'orderId': 1000
        },
      },
      // 选择文件后是否立即自动上传，true=选择后立即上传
      instantly: true,
      // 必传宽高且宽高应与slot宽高保持一致
      width: "120rpx",
      height: "60rpx",
      // 限制允许选择的格式，空串=不限制，默认为空
      formats: "",

      // 文件回显列表
      files: new Map(),
      // 微信小程序Map对象for循环不显示，所以转成普通数组，不要问为什么，我也不知道
      wxFiles: [],

      resultList: [],
    };
  },
  mounted() {
	  this.accept.split('.').map(item=>this.formats+=item)
    setTimeout(() => {
      // 设置初始files
      if (this.defaultValue.length > 0) {
        this.$refs.lsjUpload.setFiles(this.defaultValue);
        this.resultList = this.defaultValue;
      }
    }, 200);
  },
  methods: {
    onuploadEnd(item) {
      if (item.type == "success") {
        // 更新当前状态变化的文件
        if (item["responseText"]) {
          this.files.get(item.name).responseText = JSON.parse(
            item.responseText
          );
        }
        item.responseText.data.name=item.name
        this.resultList.push(item.responseText.data);
        this.files.set(item.name, item);
        // 微信小程序Map对象for循环不显示，所以转成普通数组，不要问为什么，我也不知道
        // #ifdef MP-WEIXIN
        this.wxFiles = [...this.files.values()];
        // #endif
        // 强制更新视图
        this.$forceUpdate();
        this.$emit("input", this.__vModel__, this.resultList);
      } else {
        helper.msg(item.name + "上传失败");
        this.$refs.lsjUpload.clear(item.name);
      }
    },
    // 文件选择回调
    onChange(files) {
        // if (this.disabled) return;
      // 更新选择的文件
      this.files = files;
      // 强制更新视图
      this.$forceUpdate();
      // 微信小程序Map对象for循环不显示，所以转成普通数组，不要问为什么，我也不知道
      // #ifdef MP-WEIXIN
      this.wxFiles = [...this.files.values()];
      // #endif
    },
    // 移除某个文件
    clear(name) {
        // if (this.disabled) return;
      // name=指定文件名，不传name默认移除所有文件
      this.$refs.lsjUpload.clear(name);
    },
  },
};
</script>
<style scoped>
.btn {
  height: 80rpx;
  background-color: #007aff;
  color: #fff;
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
}
.ts {
  line-height: 2em;
}
.nbtn {
  margin: 100rpx 50rpx;
}
/* 溢出 */
.overflow-text {
  width: 151rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.lsj-file {
	width:auto !important;
}
</style>