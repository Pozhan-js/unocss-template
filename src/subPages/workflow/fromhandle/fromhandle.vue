<template>
 <view>
		<view class="search-input "><label class="iconfont icon-sousuo" /><input type="text" v-model="listQuery.keyword" confirm-type="search"
			 class="font-size30" placeholder="搜索" /></view>
		<scroll-view class="content" scroll-y @scrolltolower="scrollButtonClick" id="height" :style="'height:' + height + 'px ;'">
			<view class="list" v-if="list.length">
				<view class="item" hover-class="uni-list-cell-hover" v-for="(item,index) in list" :key="index" @tap="click(item)">
					<view class="item-head item-part">
						<view class="uni-item-left-name font-size30 color-3A3A3A">{{item.title}}<!-- <text class="marks" :class="item.FlowUrgent.statecs"> --></text></view>
						<view class="font-size24 color-9A9A9A">截至时间：{{item.bodyText.fomattime}}</view>
					</view>
					<view class="item-foot item-part">
						<view class="font-size24 color-9A9A9A">{{item.creatorUser}}</view>
            	<view class="font-size24 color-9A9A9A">{{item.isRead==0?'未读':item.isRead==1?"已读未提交":"已提交"}}</view>
					</view>
				</view>
			</view>
			<view class="noContent" v-else>
				
				<view class="">
					暂无数据
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { getHandleListPage } from "@/api/message.js";
import helper from "@/common/helper.js";
import config from "@/common/config.js";
export default {
  data() {
    return {
      rows: 15,
      list: [],
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        sort: "desc",
        sidx: "",
        keyword: "",
      },
      height: 0,
      searchkey: "",
      nodata: config.Resources.message.nodata,
      isNoData: false,
    };
  },
  mounted() {
     this.initData();
    let _this = this;
    // 获取设备宽度
    uni.getSystemInfo({
      success: function (res) {
        _this.height = res.windowHeight;
      },
    });
    if (this.list.length > 0) {
      let search = uni.createSelectorQuery().select(".search-input");
      search
        .boundingClientRect((data) => {
          _this.rows = Math.ceil((_this.height - data.height) / 58);
        })
        .exec();
    }
  },
  methods: {
    click(item) {
      
      if (Date.parse(new Date()) > item.bodyText.stopTime) {
        helper.msg("已经超过截至时间");
        return;
      }
	  uni.navigateTo({
        url: `/subPages/user/dynamic-form/dynamic-form?F_FullName=${item.title}&F_Id=${item.bodyText.moduleId}&messageId=${item.id}`,
      });
    },
    search() {
      this.initData();
    },
    initData() {
      this.list = [];
      getHandleListPage(this.listQuery).then((res) => {
        this.list = res.data.list;
        this.list = this.list.map((o) => {
          o.bodyText = JSON.parse(o.bodyText);
          o.bodyText.fomattime = helper.toDate(
            o.bodyText.stopTime,
            "MM-dd HH:mm"
          );
          return o;
        });
        
      });
    },
  },
  onLoad() {
   
  },
  watch: {
    "listQuery.keyword"(val) {
      //   
      //   this.initData();
    },
  },
};
</script>

<style lang="scss">
page {
  background-color: #f0f2f6;
}

.uni-item-left-name {
  position: relative;
  /* float: left; */
  width: fit-content;
}

.search-input {
  background-color: #ffffff;
}

.cell-navigate::after {
  left: 0;
}

.list {
  padding: 0 20upx;

  .item {
    margin-bottom: 20upx;
    box-shadow: 0px 3px 25px 2px rgba(159, 159, 159, 0.1);
    border-radius: 10upx;
    padding: 0 20upx;
    background-color: #fff;

    .item-part {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .item-head {
      border-bottom: 1upx solid #e5e5e5;
      height: 90upx;
    }

    .item-foot {
      height: 68upx;
    }
  }
}
</style>