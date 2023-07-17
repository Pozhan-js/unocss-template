<template>
  <view class="backlog-app flex-sb">
    <view class="card flex-center" v-for="(card ,index) in cardList" :key="index" @click="goDetail(card.url)">
      <text class="text">{{ card.text }}</text>
      <image class="icon" :src="baseUrl + card.icon"></image>
    </view>
 </view>
</template>

<script>
export default {
  name: "backlog-menu",
  data() {
    return {
      baseUrl: 'https://kindoucloud.com:8066/api/mongoFile/Image/systemicon/dtghc/',
      cardList: [{
        text: "我的发起",
        icon: "20230629_78796e7c010943c38d84b224eab80593.png",
        url: "/subPages/workflow/started/started",
      },{
        text: "我的代办",
        icon: "20230629_edf4c0f95ba44cd2a911cb9309ba3736.png",
        url: "/subPages/workflow/backlog/backlog",
      },{
        text: "我的已办",
        icon: "20230629_0cd8382e96cc46c5b5e17eb5157ae93e.png",
        url: "/subPages/workflow/alreadybacklog/alreadybacklog",
      },],
    };
  },
  methods: {
    goDetail(url) {
      uni.navigateTo({url});
    }
  },
};
</script>

<style lang="scss">
.backlog-app {
  margin: 30rpx 20rpx;
  .card {
    padding: 20rpx;
    background: #FFFFFF;
    box-shadow: 0rpx 9rpx 20rpx 1rpx rgba(49,83,116,0.1);
    border-radius: 23rpx 23rpx 23rpx 23rpx;
    .text {
      font-size: 26rpx;
      font-family: PingFang SC-Bold, PingFang SC;
      font-weight: bold;
      color: #333333;
      margin-right: 15rpx;
    }
    .icon {
      height: 75rpx;
      width: 65rpx;
    }
  }
}

</style>
