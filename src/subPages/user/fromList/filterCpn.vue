<template>
  <view>
    <!-- 新增按钮S -->
    <view
      class="add-filter flex-center"
      :style="{ background: this.filter.length > 0 ? '#1197f7' : '#eee' }"
      @click="popupShow = true">
      <i
        class="iconfont JDCloud-24gf-funnel"
        style="font-size: 24px"
        :style="{ color: filter.length ? '#fff' : '#000' }"></i>
    </view>
    <!-- 新增按钮E -->

    <!-- 过滤面板S -->
    <u-popup
      :show="popupShow"
      mode="center"
      round="4"
      @close="popupShow = false"
      :closeOnClickOverlay="false"
      closeable>
      <view class="pop-app" @click="searchInputHide">
        <!-- 过滤标题S -->
        <view class="title flex-ai">
          <text>筛选出符合一下</text>
          <view class="enable-text flex-ai" @click="showConnect = true">
            <text>{{ connectLabel }}</text>
            <u-icon name="arrow-down" color="#1197f7" size="12"></u-icon>
          </view>
          <text>条件的数据</text>
        </view>
        <!-- 过滤标题E -->

        <!-- 按钮S -->
        <view class="append-filter flex-ai" @click="addFilter">
          <u-icon name="plus" color="#1197f7" size="12"></u-icon>
          <text>添加过滤条件</text>
        </view>
        <!-- 按钮E -->

        <!-- 过滤条件S -->
        <view class="filter-list">
          <view class="flex-ai" v-for="(item, index) in filter" :key="index">
            <view class="flex-1">
              <JDcloudSearchInput
                keyName="fullName"
                valueName="enCode"
                :candidates="formColumnList"
                placeholder="选择过滤字段"
                ref="searchInput"
                :modelValue.sync="item.key" />
            </view>
            <view
              class="method-app flex-ai"
              @click="
                showMethod = true;
                methodIndex = index;
              ">
              <text class="clamp-1">{{ methodLabel(item.method) }}</text>
              <u-icon name="arrow-down" color="#1197f7" size="12"></u-icon>
            </view>
            <view class="flex-1">
              <u-input placeholder="搜索的值" v-model="item.value[0]"></u-input>
            </view>
            <u-icon
              @click="removeFilter(index)"
              name="trash-fill"
              color="#1197f7"
              size="28"></u-icon>
          </view>
        </view>
        <!-- 过滤条件E -->

        <!-- 操作底部S -->
        <view class="foot flex-ai">
          <view>
            <u-button text="筛选" :hairline="false" type="primary" @click="confirm"></u-button>
          </view>

          <view class="trash">
            <u-button plain icon="trash" text="清空" :hairline="false" @click="clear"></u-button>
          </view>
        </view>
        <!-- 操作底部S -->
      </view>
    </u-popup>
    <!-- 过滤面板E -->

    <!-- 方法选择S -->
    <u-action-sheet
      closeOnClickOverlay
      :actions="methodList"
      :show="showMethod"
      @select="methodChange"
      @close="showMethod = false"></u-action-sheet>
    <!-- 方法选择E -->

    <!-- 连接符选择S -->
    <u-action-sheet
      closeOnClickOverlay
      :actions="connectList"
      :show="showConnect"
      @select="connectChange"
      @close="showConnect = false"></u-action-sheet>
    <!-- 连接符选择E -->
  </view>
</template>

<script>
import JDcloudSearchInput from "@/components/JDcloudSearchInput";
import { isTableField } from "@/utils";
export default {
  name: "filterCpn",
  props: {
    permissionColumn: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    JDcloudSearchInput,
  },
  data() {
    return {
      // 是否显示连接符
      showConnect: false,
      popupShow: false,
      connect: "and",
      showMethod: false,
      // 过滤项
      filter: [],
      methodIndex: -1,
    };
  },
  computed: {
    btnStyle() {
      console.log("this.filter.length", this.filter.length);
      return { "background-color": this.filter.length > 0 ? "#1197f7" : "#eee" };
    },
    // 方法列表
    methodList() {
      return this.$constants.FILTER_METHODS.map(({ label, value }) => ({ name: label, value }));
    },
    // 方法label
    methodLabel() {
      return method => {
        return this.$constants.FILTER_METHODS.find(({ value }) => value === method).label;
      };
    },
    // 获取表单字段，除了系统字段和子表组件
    formColumnList() {
      return this.permissionColumn.filter(
        ({ enCode }) => !this.$constants.SYSTEM_COMPONENTS.includes(enCode) && !isTableField(enCode)
      );
    },
    // 匹配connect的label
    connectLabel() {
      return this.connect === "and" ? "所有" : "任一";
    },
    // 连接符列表
    connectList() {
      return [
        { name: "所有", value: "and" },
        { name: "任一", value: "or" },
      ];
    },
  },
  //方法集合
  methods: {
    // 确认过滤
    confirm() {
      console.log("confirm", this.filter);
      this.filter.forEach(({ key, value }) => {
        if (!key || !value[0]) {
          this.$u.toast("请完善过滤条件");
          throw new Error("请完善过滤条件");
        }
      });
      this.$emit("confirm", this.filter, this.connect);
      this.popupShow = false;
    },
    // 清空过滤
    clear() {
      this.filter = [];
      this.$emit("clear");
      this.popupShow = false;
    },
    // 删除过滤项
    removeFilter(index) {
      this.filter.splice(index, 1);
    },
    // 添加过滤项
    addFilter() {
      let filter = { method: "eq", type: "custom", key: "", value: [""] };
      this.filter.push(filter);
    },
    // 隐藏搜索框
    searchInputHide() {
      if (!this.$refs.searchInput) return;
      this.$refs.searchInput.forEach(item => {
        item.hide();
      });
    },
    // 方法选择
    methodChange({ value }) {
      this.filter[this.methodIndex].method = value;
      console.log("methodChange", value);
    },
    // 连接符选择
    connectChange({ value }) {
      this.connect = value;
      this.showConnect = false;
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
.add-filter {
  position: fixed;
  bottom: 300rpx;
  right: 20rpx;
  padding: 10rpx 30rpx;
  z-index: 9999;
  border-radius: 50%;
  background: #1197f7;
  u-icon {
    font-size: 40rpx;
    color: #fff;
  }
  text {
    font-size: 28rpx;
    color: #999;
    margin-left: 10px;
  }
}
.pop-app {
  width: 80vw;
  padding: 20rpx;
  position: relative;
  .enable-text {
    color: #1197f7;
    margin: 0 10rpx;
  }
  .foot {
    position: absolute;
    bottom: 0;
    margin-top: 20rpx;
    padding-top: 20rpx;
    border-top: 1px solid #eee;
    justify-content: flex-end;
    .trash {
      padding-left: 20rpx;
    }
  }
  .append-filter {
    color: #1197f7;
    margin: 20rpx 0;
    text {
      margin-left: 15rpx;
    }
  }
  .filter-list {
    height: 500rpx;
    overflow: auto;
    margin: 20rpx 0;
    margin-bottom: 100rpx;
  }
  .method-app {
    margin: 0 10rpx;
    max-width: 80rpx;
    color: #1197f7;
  }
}
</style>
