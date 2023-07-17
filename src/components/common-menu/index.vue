<template>
  <view class="menu-app">
    <view class="container" v-for="(panel, index) in panelList" :key="index">
      <template v-if="panel.list.length">
        <view class="title">{{ panel.title }}</view>
        <view class="list flex-ai">
          <view
            class="item flex-column flex-center"
            v-for="item in panel.list"
            :key="item.id"  @click="mixinFlowForm(item)">
            <image class="icon" :src="baseUrl + item.icon"></image>
            <text>{{ item.fullName }}</text>
          </view>
        </view>
      </template>
    </view>
  </view>
</template>
F

<script>
import Mixin from "./utils/mixin";
import { panel } from "./panel";
import { previewDataInterface } from "@/config/api";
export default {
  name: "common-menu",
  mixins: [Mixin],
  data() {
    return {
      panelList: panel,
      baseUrl:
        "https://kindoucloud.com:8066/api/mongoFile/Image/systemicon/dtghc/",
      moreIcon:
        "https://kindoucloud.com:8011/api/file/Image/systemicon/ycj/20221214_fbe1508bf41a4a8aa3b6b5dd2fcd28bd.png",
    };
  },
  mounted() {
    console.log("panel", panel);
    // 学生发展
    const menuList = uni.getStorageSync("Kindow_MenuList");
    if (!menuList) return;
    // 学生管理
    const data = menuList.flatMap(o => o.children);
    for (const panel of this.panelList) {
      const { appIdList } = panel;
      const ids = appIdList.map(o => o.id);
      panel.list = data.flatMap(o => {
        // 设置图片
        if (!ids.includes(o.id)) return [];
        const { imageUrl } = appIdList.find(p => p.id === o.id);
        o.icon = imageUrl;
        return o;
      });
      console.log("panel.list", panel.list);
    }
    console.log("mounted", data, this.panelList);
  },
  methods: {
    login() {
      uni.navigateTo({ url: "/subPages/user/login/login" });
    },
    appsoftware(type = "") {
      uni.navigateTo({
        url: "/subPages/user/appsoftware/appsoftware?type=" + type
      });
    },
  },
};
</script>

<style scoped lang="scss">
.menu-app {
  padding: 10rpx 30rpx;

  .container {
    margin-bottom: 40rpx;

    .title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333333;
    }

    .list {
      margin-top: 10rpx;
      background-color: #ffffff;
      box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
      border-radius: 5rpx;
      flex-wrap: wrap;
      padding: 25rpx 10rpx;

      .item {
        width: 25%;

        .icon {
          font-size: 40rpx;
          width: 80rpx;
          height: 80rpx;
        }

        text {
          font-size: 24rpx;
          color: #333333;
        }
      }
    }
  }

}
</style>
