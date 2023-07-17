<template>
  <view>
    <!-- <view class="search-input "><label class="iconfont icon-sousuo" /><input type="text" v-model="search" confirm-type="search"
			 class="font-size30" placeholder="搜索" /></view> -->
    <view class="list" v-if="alreadyflows.length">
      <view
        class="item"
        hover-class="uni-list-cell-hover"
        v-for="(item, index) in alreadyflows"
        :key="index"
        @tap="alreadyflow(item)">
        <view class="item-head item-part">
          <view class="uni-item-left-name font-size30 color-3A3A3A">{{ item.fullName }}</view>
          <view class="font-size24 color-9A9A9A">{{
            $u.timeFormat(item.creatorTime, "yyyy-mm-dd hh:MM")
          }}</view>
        </view>
        <view class="item-foot item-part">
          <view class="font-size24 color-9A9A9A">{{ item.thisStep }}</view>
          <view class="font-size24" :class="getStatusObj(item.status).statecss">
            {{ getStatusObj(item.status).text || "" }}
          </view>
        </view>
      </view>
    </view>
    <view class="noContent" v-else>
      <view class=""> 暂无数据 </view>
    </view>
    <!-- <scroll-view class="content" scroll-y @scrolltolower="scrollButtonClick" id="height" :style="'height:' + height + 'px ;'">

		</scroll-view> -->
  </view>
</template>

<script>
import helper from "@/common/helper.js";
import config from "@/common/config.js";
import { getFlowBefore } from "@/api/work.js";
import { getFlowHandleList } from "@/api/mongoApi/work";

function flowStatus(value) {
  let state;
  switch (value) {
    case 1:
      state = {
        text: "同意",
        statecss: "text-success",
      };
      break;
    default:
      state = {
        text: "拒绝",
        statecss: "text-danger",
      };
      break;
  }
  return state;
}

function flowUrgentlook(value) {
  let state;
  switch (value) {
    case 1:
      state = {
        urgstate: "普通",
        statecs: "background-21B185",
      };
      break;
    case 2:
      state = {
        urgstate: "重要",
        statecs: "background-FFAC05",
      };
      break;
    case 3:
      state = {
        urgstate: "紧急",
        statecs: "background-FE5146",
      };
      break;
    default:
      state = {
        urgstate: "普通",
        statecs: "background-21B185",
      };
      break;
  }
  return state;
}
export default {
  data() {
    return {
      status: "loadmore",
      rows: 10,
      page: 1,
      total: 1,
      height: 0,
      search: "",
      alreadyflows: [],
      allData: [],
      isFirstShow: true,
    };
  },
  watch: {
    search: function (val) {
      let search = val;
      if (search) {
        this.alreadyflows = this.allData.filter(function (product) {
          return Object.keys(product).some(function (key) {
            return String(product[key]).toLowerCase().indexOf(search) > -1;
          });
        });
      }
      return this.alreadyflows;
    },
  },
  /* 点击返回按钮清除缓存 */
  onBackPress(e) {
    // this.$helper.removeStorage();
  },
  // #ifdef MP
  onUnload(e) {
    // this.$helper.removeStorage();
  },
  // #endif
  onShow() {
    if (this.isFirstShow) {
      this.init().then(() => {
        this.isFirstShow = false;
      });
    } else {
      this.page = 1;
      this.starflows = [];
      this.allData = [];
      this.status = "loadmore";
      this.init();
    }
  },
  onReachBottom() {
    if (this.status == "loading" || this.status == "nomore") return;
    this.status = "loading";
    this.init();
  },
  onLoad() {
    uni.removeStorageSync("type");
    uni.setStorageSync("type", "alreadybacklog");
  },
  methods: {
    getStatusObj(status) {
      return helper.flowStatus(status);
    },
    init() {
      return new Promise(resolve => {
        let _this = this;
        getFlowHandleList({
          pageSize: this.rows, //每页行数
          currentPage: this.page, //当前页
        }).then(res => {
          let alreadyflows = res.data.list;
          // let alreadyflows = []
          /*for (let i = 0; i < _flows.length; i++) {
							alreadyflows.push({
								F_Id: _flows[i].id,
								F_FlowId: _flows[i].flowId,
								F_FullName: _flows[i].fullName,
								F_CreatorTime: helper.toDate(_flows[i].creatorTime, "MM-dd"),
								F_EnCode: _flows[i].enCode,
								F_FlowForm: _flows[i].flowForm,
								F_FlowCode: _flows[i].flowCode,
								F_Status: _flows[i].status,
								Status: flowStatus(_flows[i].status),
								F_FormType: _flows[i].formType,
								F_ProcessId: _flows[i].processId,
								F_FlowUrgent: flowUrgentlook(_flows[i].flowUrgent),
								FlowUrgent: flowUrgentlook(_flows[i].flowUrgent),
								type: "alreadybacklog",
							});
						}*/
          if (this.alreadyflows.length < res.data.pagination.total) {
            this.alreadyflows = this.alreadyflows.concat(alreadyflows);
            this.allData = this.alreadyflows;
            this.page++;
          }
          this.status =
            this.alreadyflows.length == res.data.pagination.total ? "nomore" : "loadmore";
          resolve();
        });
      });
    },

    alreadyflow(e) {
      console.log(e);
      const { id, fullName, operatorRecordId } = e;
      console.log(id, fullName, operatorRecordId, e);
      uni.$u.route("/subPages/workflow/flowchart/form", {
        id,
        fullName,
        operatorRecordId,
        type: "alreadybacklog",
      });
      // uni.setStorageSync("type", e.type);
      // /* 保存状态类型 */
      // uni.setStorageSync("F_Status", e.F_Status);
      // uni.setStorageSync("F_FullName", e.F_FullName);
      // const _flowname = e.F_FlowCode.toLowerCase();
      // let _url;
      // let flowInfo = {
      //   disabled: true,
      //   operstate: "info",
      //   id: e.F_ProcessId,
      //   status: e.F_Status,
      //   type: "alreadybacklog",
      // };
      // if (e.F_FlowCode.indexOf("crmOrder") >= 0) {
      //   _url =
      //     "/pages/apply/apply/ordermanagelist/formNew?id=" +
      //     e.F_ProcessId +
      //     "&status=" +
      //     e.F_Status;
      // } else {
      //   if (e.F_FormType == 2) {
      //     (flowInfo.flowId = e.F_FlowId),
      //       (flowInfo.initId = e.F_FlowId),
      //       (_url = "/subPages/workflow/flowchart/form?flowInfo=" + JSON.stringify(flowInfo));
      //   } else {
      //     (flowInfo.flowId = e.F_FlowId),
      //       (_url =
      //         "/subPages/workflow/flowchart/" +
      //         _flowname +
      //         "/" +
      //         "form?flowInfo=" +
      //         JSON.stringify(flowInfo));
      //   }
      // }
      // this.$store.state.workflow.flowfromId = e.F_ProcessId;
      // uni.navigateTo({
      //   url: _url,
      // });
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
