<template>
  <view
    style="position: absolute; width: 100%; height: 100%; background: #f5f7fb">
    <view class="user-header">
      <view class="avatar flex-sb" v-if="isLogin">
        <view class="flex-1 flex-ai">
          <u-avatar
            @click="replaceAvatar"
            size="120rpx"
            :src="baseUrl + user.headIcon"></u-avatar>
          <view class="flex-column margin-left-15">
            <view class="name">{{ user.userName }}</view>
          </view>
        </view>
        <!-- <view class="raking-app">
                  <image style="width: 144rpx; height: 104rpx;" src="https://kindoucloud.com:8011/api/file/Image/systemicon/ycj/20221207_5789e473e10f494f9d65ea5bb3d6793f.png">
                  </image>
                  <view class="raking">1000+</view>
                </view> -->
      </view>
      <view class="avatar flex" v-if="!isLogin">
        <view class="flex-1 flex-ai">
          <u-avatar
            @click="replaceAvatar"
            size="120rpx"
            :src="baseUrl + user.headIcon"></u-avatar>
          <view class="flex-column" style="margin-left: 30rpx">
            <view class="name" style="text-align: center">请先登录</view>
            <view class="loginBtn" @click="goLogin"> 点击登录 </view>
          </view>
        </view>
      </view>
    </view>

    <view class="common-func">
      <view class="title">常用功能</view>
      <view class="flex func">
        <view class="flex-column flex-center common-item">
          <image
            class="func-img"
            src="https://kindoucloud.com:8011/api/file/Image/systemicon/ycj/20221214_78288e1ff7ee4506822f97cdc495f25f.png">
          </image>
          <view
            style="position: absolute; width: 100%; height: 100%; opacity: 0">
            <u-button type="primary" open-type="contact">联系客服</u-button>
          </view>
          <view class="func-label">在线客服</view>
        </view>

        <view
          class="flex-column flex-center common-item"
          @click="quit"
          v-if="isLogin">
          <image
            class="func-img"
            src="https://kindoucloud.com:8011/api/file/Image/systemicon/ycj/20221207_f89641e7ae6545868481366cf72c7d36.png">
          </image>
          <view class="func-label">退出登录</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { updateAvatar } from "@/api/user.js";
import { getGlobal, getStorage, setStorage } from "@/common/config";
import { goToPath, message } from "@/common";
import { userMixin } from "@/common/user-mixin.js";

export default {
  mixins: [userMixin],
  data() {
    return {
      baseUrl: getGlobal("baseUrl").apiUrl,
      buidingInfo: null,
      user: {},
      dataform: {
        id: "",
        data: {
          user_id: "",
          f_creatortime: "",
          course_id: "",
          exam_id: "",
          exam_name: "",
        },
      },
    };
  },
  computed: {
    isLogin() {
      return Boolean(this.user.userId);
    },
  },
  onLoad(query) {
    const q = decodeURIComponent(query.q); // 获取到二维码原始链接内容
    console.log("query", q);
    if (q !== "undefined") {
      let inviteArr = q.split(`obj=`);
      if (inviteArr.length > 1) {
        const inviteObj = JSON.parse(inviteArr[1]);
        setStorage("_inviteObj", inviteObj);
        getStorage("_UserProvider") && this.mixinGoInvitePage();
      }
    }
    this.init();
  },
  methods: {
    init() {
      this.user = getStorage("_UserProvider") || {};
      const badge = getStorage("_Badge");
      this.$helper.setBadge(badge);
      if (this.user && getStorage("_inviteObj")) this.mixinGoInvitePage();
      if (!this.user) goToPath("/subPages/user/login/login");
    },
    goFeedBackList() {
      goToPath("/subPages/user/feedback-list/feedback-list");
    },
    quit() {
      if (!this.user) return;
      uni.showModal({
        title: "提示",
        content: "是否确认退出？",
        success: e => {
          if (e.confirm) {
            uni.clearStorageSync();
            this.user = {};
          }
        },
      });
    },
    replaceAvatar() {
      return console.log("关闭|replaceAvatar");
      if (!this.isLogin) return;
      uni.chooseImage({
        count: 1,
        success: res => {
          const token = getStorage("_Token");
          if (token) {
            uni.uploadFile({
              url: this.baseUrl + "/api/file/Uploader/userAvatar",
              filePath: res.tempFilePaths[0],
              name: "file",
              formData: {
                Authorize: token,
              },
              success: res => {
                if (res.statusCode == 200) {
                  let imgData = JSON.parse(res.data);
                  this.user.imgName = imgData.data.name;
                  this.user.headIcon = imgData.data.url;
                  let userCateInfo = getStorage("_UserProvider");
                  userCateInfo.headIcon = imgData.data.url;
                  setStorage("_UserProvider", userCateInfo);
                  this.uploadImg(this.user.imgName);
                } else {
                  message("头像更新失败", false);
                }
              },
              fail() {
                message("上传失败", false);
              },
            });
          }
        },
      });
    },
    async uploadImg(url) {
      let state = false;
      try {
        const data = await updateAvatar(url);
        state = data.code === 200;
      } finally {
        message("头像更新", state, { auto: true });
      }
    },
    goLogin() {
      goToPath("/subPages/user/login/login");
    },
  },
};
</script>

<style lang="scss" scoped>
.user-header {
  padding: 30rpx;
  background-color: #fff;

  .name {
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
  }

  .value {
    font-size: 36rpx;
    color: #252b50;
  }

  .label {
    color: #252b50;
  }

  .nomal-fonts {
    color: #636676;
    font-size: 24rpx;
  }

  .raking-app {
    position: relative;

    .raking {
      font-size: 24rpx;
      position: absolute;
      top: 22rpx;
      color: #fff;
      left: 40rpx;
    }
  }
}

.common-func {
  margin-top: 32rpx;
  background-color: #fff;
  padding: 25rpx;

  .title {
    font-size: 32rpx;
    margin-left: 15rpx;
    font-weight: bold;
    color: #000000;
  }

  .func {
    flex-wrap: wrap;

    .common-item:nth-child(n + 5) {
      margin-top: 30rpx;
    }

    .common-item {
      width: 25%;
      position: relative;

      .func-img {
        width: 72rpx;
        height: 72rpx;
      }

      .func-label {
        text-align: center;
        color: #636676;
      }
    }
  }
}

.loginBtn {
  background: #537eef;
  color: #fff;
  padding: 10rpx 50rpx;
  font-size: 26rpx;
  text-align: center;
  border-radius: 40rpx;
}

.top {
  display: flex;
  align-items: center;
  margin-left: 20rpx;

  .name {
    font-size: 20px;
    color: #333333;
  }

  .name2 {
    font-size: 14px;
    color: #969dab;
  }
}

.nomal-fonts {
  font-size: 24rpx;
  color: #969dab;
}

.list {
  width: 690rpx;
  margin-left: 30rpx;
  background: #ffffff;
  border-radius: 10px 10px 10px 10px;
  opacity: 1;

  .cell {
    height: 150px;
  }
}
</style>
