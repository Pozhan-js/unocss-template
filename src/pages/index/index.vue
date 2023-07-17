<template>
  <view class="main-size index-app">
    <!-- 轮播图 -->
    <image class="w-full h-2xl" :src="banner[0]"></image>
    <text class="text-40 font-40">123</text>
    <!-- 待办 -->
    <!-- <backlog-menu></backlog-menu> -->
    <!-- 常用应用 -->
    <!-- <common-menu ref="commonMenu"></common-menu> -->
  </view>
</template>

<script>
import backlogMenu from "@/components/workflow/components/backlog-menu/backlog-menu.vue";
import commonMenu from "@/components/common-menu";
import { getStorage } from "@/common/config";
import { userMixin } from "@/common/user-mixin";
export default {
  mixins: [userMixin],
  components: {
    backlogMenu,
    commonMenu,
  },
  data() {
    return {
      userInfo: {},
      banner: [
        "https://kindoucloud.com:8077/api/mongoFile/Image/systemicon/lkd/20230630_17b44e652f754ffd96cc66ba21fa38cc.png",
      ],
    };
  },
  onShow() {

    this.userInfo = getStorage("_UserProvider");
    if (this.userInfo && getStorage("_inviteObj")) {
      this.mixinGoInvitePage();
    }
  },
  methods: {
    async getBanner() {
      // const {data} = await uni.$u.http.post("/api/mongoVisualdev/online_dev/642bc8b68a5db71208e76653/list")
      // return data.list.slice(0, 5).map((item) => this.$baseUrl + item.uploadImgField106[0].url);
      return [
        "https://kindoucloud.com:8077/api/mongoFile/Image/systemicon/lkd/20230630_17b44e652f754ffd96cc66ba21fa38cc.png",
      ];
    },
  },
  // onReachBottom() {
  //     this.$refs.activeListRef.getMoreData();
  // },
  // methods: {
  //     goActiveList() {
  //         uni.navigateTo({
  //             url: '/subPages/user/active-list/active-list'
  //         });
  //     }
  // }
};
</script>

<style scoped lang="scss">
.active,
.notice {
  background-color: #fff;
  margin: 30rpx;
  padding: 16rpx 30rpx;
  border-radius: 16rpx;
}
</style>
