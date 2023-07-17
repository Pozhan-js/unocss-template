<template>
  <view class="main-size login-app flex-column">
    <image
      class="login-img"
      src="https://kindoucloud.com:8011/api/file/Image/systemicon/test/20221107_7ef67bb0a178480aaaf3b4e8a0104c86.png">
    </image>
    <!-- #ifdef H5 -->
    <view class="phone-login" @click="goPhoneLogin"> 手机号安全登录 </view>
    <!-- #endif -->

    <!-- #ifdef MP-WEIXIN -->
    <view class="wx-login">
      手机号快捷登录
      <button
        class="loginBtn"
        open-type="getPhoneNumber"
        @getphonenumber="wxGetPhone">
        点击登录
      </button>
    </view>
    <!-- #endif -->

    <view class="flex-1 flex-column flex-fe check-bottom">
      <view class="flex-ai">
        <u-checkbox-group placement="column" v-model="agreement">
          <u-checkbox
            name="agreement"
            shape="circle"
            label="已阅读并同意"
            labelSize="24rpx">
          </u-checkbox>
        </u-checkbox-group>
        <u--text type="primary" text="《服务协议》、" size="24rpx"></u--text>
        <u--text type="primary" text="《隐私协议》、" size="24rpx"></u--text>
        <u--text type="primary" text="《支付协议》" size="24rpx"></u--text>
      </view>
    </view>
  </view>
</template>

<script>
import { userMixin } from "@/common/user-mixin.js";
import config from "@/common/config.js";

import { previewDataInterface } from "@/config/api.js";
export default {
  mixins: [userMixin],
  data() {
    return {
      agreement: [],
    };
  },
  methods: {
    goPhoneLogin() {
      if (!this.agreement.length) {
        uni.showToast({
          title: "请阅读并同意下方协议",
          icon: "error",
        });
        return;
      }
      uni.navigateTo({
        url: "/subPages/user/phone-login/phone-login",
      });
    },
    wxGetPhone(e) {
      console.log('wxGetPhone',e);
      if (!this.agreement.length) {
        uni.showToast({
          title: "请阅读并同意下方协议",
          icon: "error",
        });
        return;
      }
      this.mixinGetPhone(e).then(async res => {
        this.$u.toast("登录成功");
        setTimeout(() => uni.reLaunch({ url: "/pages/index/index" }), 2000);
      });
    },
  },
};
</script>

<style scoped lang="scss">
.login-app {
  background: #f5f7fb;

  .login-img {
    margin-top: 15%;
    width: 100%;
    height: 500rpx;
  }

  .phone-login {
    margin: 0 auto;
    padding: 20rpx;
    text-align: center;
    background: #1959f6;
    color: #ffffff;
    width: 80%;
    border-radius: 50rpx;
    font-weight: 400;
    font-size: 30rpx;
  }

  .wx-login {
    margin: 50rpx auto;
    padding: 20rpx;
    text-align: center;
    font-weight: 550;
    font-size: 30rpx;
    background: #5dba70;
    color: #ffffff;
    width: 80%;
    border-radius: 50rpx;
    position: relative;

    .loginBtn {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }

  .check-bottom {
    padding-left: 50rpx;
    padding-bottom: 100rpx;
  }
}
</style>
