<template>
  <view>
    <!-- <view class="search-input"><label class="iconfont icon-sousuo" /><input type="text" v-model="search"
				confirm-type="search" class="font-size30" placeholder="搜索" /></view> -->

    <view class="list" v-if="backflows.length">
      <view
        class="item"
        hover-class="uni-list-cell-hover"
        v-for="(item, index) in backflows"
        :key="index"
        @tap="backflow(item)">
        <view class="item-head item-part">
          <view class="uni-item-left-name font-size30 color-3A3A3A">
            {{ item.fullName }}
          </view>
          <view class="font-size24 color-9A9A9A">
            {{ $u.timeFormat(item.creatorTime, "yyyy-mm-dd hh:MM") }}
          </view>
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
  </view>
</template>

<script>
import helper from "@/common/helper.js";
import { getFlowAuditList } from "@/api/mongoApi/work";

export default {
  data() {
    return {
      rows: 10,
      page: 1,
      total: 1,
      height: 0,
      search: "",
      backflows: [],
      status: "loadmore",
      isFirst: true,
    };
  },
  onReachBottom() {
    if (this.status === "loading" || this.status === "nomore") return;
    this.status = "loading";
    this.init();
  },
  onShow() {
    if (this.isFirst) {
      this.init().then(() => (this.isFirst = false));
    } else {
      this.page = 1;
      this.backflows = [];
      this.status = "loadmore";
      this.init();
    }
  },
  methods: {
    getStatusObj(status) {
      return helper.flowStatus(status);
    },
    init() {
      return new Promise(resolve => {
        getFlowAuditList({
          pageSize: this.rows, //每页行数
          currentPage: this.page, //当前页
        }).then(res => {
          let flows = res.data.list;
          if (this.backflows.length < res.data.pagination.total) {
            this.backflows = this.backflows.concat(flows);
            this.page++;
          }
          this.status = this.backflows.length === res.data.pagination.total ? "nomore" : "loadmore";
          resolve();
        });
      });
    },

    backflow(e) {
      const { id, fullName, operatorRecordId } = e;
      console.log(id, fullName, operatorRecordId, e);
      uni.$u.route("/subPages/workflow/flowchart/form", {
        id,
        fullName,
        operatorRecordId,
        type: "audit",
      });
      // uni.setStorageSync("type", e.type);
      // /* 保存状态类型 */
      // uni.setStorageSync("F_Status", e.F_Status);
      // // console.log(e)
      // uni.setStorage({
      //   key: "F_FullName",
      //   data: e.F_FullName,
      // });
      // uni.setStorageSync("transferId", e.F_Id);
      // const _flowname = e.F_FlowCode.toLowerCase();
      // let flowInfo = {
      //   disabled: true,
      //   operstate: "info",
      //   id: e.F_ProcessId,
      //   status: e.F_Status,
      //   transferId: e.F_Id,
      // };
      // let _url;
      //
      // if (e.F_FlowCode.indexOf("crmOrder") >= 0) {
      //   this.$store.state.workflow.flowfromId = e.F_Id;
      //   _url =
      //     "/pages/apply/apply/ordermanagelist/formNew?id=" + flowInfo.id + "&status=" + e.F_Status;
      // } else {
      //   this.$store.state.workflow.flowfromId = e.F_Id;
      //   if (e.F_FormType === 2) {
      //     flowInfo.initId = e.F_FlowId;
      //     _url = "/subPages/workflow/flowchart/form?flowInfo=" + JSON.stringify(flowInfo);
      //   } else {
      //     flowInfo.flowId = e.F_FlowId;
      //     flowInfo.id = e.F_ProcessId;
      //     _url =
      //       "/subPages/workflow/flowchart/" +
      //       _flowname +
      //       "/" +
      //       "form?flowInfo=" +
      //       JSON.stringify(flowInfo);
      //   }
      // }
      // this.$store.state.workflow.flowfromId = e.F_Id;
      // uni.navigateTo({
      //   url: _url
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

.cell-navigate::after {
  left: 0;
}

.search-input {
  background-color: #fff;
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
