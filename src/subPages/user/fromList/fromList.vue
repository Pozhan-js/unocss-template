<template>
  <view class="main-size from-app">
    <!-- 加载S -->
    <view class="loading-page-app" v-if="loadingPage">
      <u-loading-page loading-text="全力加载中..." :loading="loadingPage"></u-loading-page>
    </view>
    <!-- 加载E -->

    <!-- 列表S -->
    <view class="list-app">
      <u-swipe-action>
        <u-swipe-action-item
          :options="actionOptions"
          v-for="(item, index) in list"
          :disabled="!hasRemoveAuth"
          ref="swipeActionItem"
          @click="deleteItem(item, index)"
          :key="item._id">
          <view class="list-item">
            <template v-for="(column, cindex) in Object.keys(item)">
              <view @click="handleEdit(item)" :key="cindex" v-if="getColumnData(column, item)">
                <JDcloudColumn :hashTable="hashTable" :columnsData="getColumnData(column, item)">
                </JDcloudColumn>
              </view>
            </template>
          </view>
        </u-swipe-action-item>
      </u-swipe-action>
    </view>
    <u-loadmore v-if="list.length" :status="loadStatus" @loadmore="getList" />

    <u-empty v-else margin-top="50%" text="暂无数据"></u-empty>
    <!-- 列表E -->

    <!-- 过滤查询S -->
    <filter-cpn :permissionColumn="permissionColumn" @clear="reloadList" @confirm="filterList" />
    <!-- 过滤查询E -->

    <!-- 新增S -->
    <view class="plus-data" v-if="hasAddAuth" @click="handleAdd">
      <u-icon name="plus" color="#FFF" size="24"></u-icon>
    </view>
    <!-- 新增E -->
  </view>
</template>

<script>
import { getModelList } from "@/config/api.js";
import { deteleAllModel, getFormConfig } from "@/api/mongoApi/form";
import { getMenuByModuleId, getPermission, getHashTable } from "@/utils";
import JDcloudColumn from "@/components/JDcloudColumn";
import { extractTree, goToPath, message, showModal } from "@/common";
import FilterCpn from "./filterCpn.vue";

export default {
  components: {
    JDcloudColumn,
    FilterCpn,
  },
  data() {
    return {
      fullName: "",
      hashTable: {},
      permission: {},
      // 功能Id
      modelId: "",
      formData: {},
      columnData: {},
      loadingPage: true,
      params: {
        currentPage: 1,
        pageSize: 20,
      },
      list: [],
      loadStatus: "loadmore",
    };
  },
  computed: {
    actionOptions() {
      return [{ text: "删除", style: { backgroundColor: "#FF4949" } }];
    },
    // 是否有新增权限
    hasAddAuth() {
      return this.hasAuth("add");
    },
    // 是否有删除权限
    hasRemoveAuth() {
      return this.hasAuth("remove");
    },
    hasEditAuth() {
      return this.hasAuth("edit");
    },
    // 当前模块的菜单数据
    currentMenu() {
      return getMenuByModuleId(this.modelId);
    },
    // 当前模块的按钮权限
    permissionButton() {
      if (!this.permission) return [];
      return this.permission.button;
    },
    // 当前模块的列表权限
    permissionColumn() {
      if (!this.permission) return [];
      return this.permission.column;
    },
  },
  async onLoad(e) {
    this.hashTable = await getHashTable();
    this.modelId = e.formId;
    this.fullName = decodeURIComponent(e.fullName);
    this.permission = getPermission(this.modelId, "module");
    // 设置标题
    uni.setNavigationBarTitle({
      title: this.fullName,
    });
    // 获取配置信息
    await this.getFormConfig();
    // 获取列表数据
    await this.getList();
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.reloadList();
  },
  onReachBottom() {
    this.getList();
  },
  methods: {
    hasAuth(key) {
      if (!this.permissionButton) return false;
      return this.permissionButton.some(({ enCode }) => enCode === key);
    },
    // 过滤查询
    filterList(filter, connect) {
      this.params.filter = filter;
      this.params.connect = connect;
      this.params.currentPage = 1;
      this.loadStatus = "loadmore";
      this.getList(true);
    },
    // 重新获取数据
    reloadList() {
      this.params = {
        currentPage: 1,
        pageSize: 20,
      };
      this.loadStatus = "loadmore";
      this.getList(true);
    },
    // 去新增
    handleAdd() {
      goToPath("/subPages/user/dynamic-form/dynamic-form", {
        query: {
          fullName: this.fullName,
          modelId: this.modelId,
        },
      });
    },
    // 去编辑
    handleEdit(row) {
      // 如果没有编辑按钮权限，不允许编辑
      if (!this.hasEditAuth) return;

      goToPath("/subPages/user/dynamic-form/dynamic-form", {
        query: {
          fullName: this.fullName,
          modelId: this.modelId,
          rowId: row._id,
        },
      });
    },
    // 删除
    async deleteItem({ _id }, index) {
      // 关闭滑动
      this.$refs.swipeActionItem[index].status = "close";
      showModal({
        title: "提示",
        content: "确定删除吗？",
      }).then(() => {
        deteleAllModel(this.modelId, { ids: [_id] }).then(({ code }) => {
          if (code !== 200) return;
          message("删除成功");
          this.list.splice(index, 1);
        });
      });
    },
    /**
     * 获取树形数据
     */
    initTreeData() {
      const treeList = [
        { treeName: "organizeTree", childField: "children" },
        { treeName: "userTree", childField: "children" },
        { treeName: "roleTree", childField: "roleList" },
      ];
      for (let i = 0; i < treeList.length; i++) {
        const { treeName, childField } = treeList[i];
        this.$store
          .dispatch("base/get" + treeName.slice(0, 1).toUpperCase() + treeName.slice(1))
          .then(data => {
            this.hashTable[treeName] = extractTree(data, {
              defaultValue: {},
              childField,
              filterFn: (item, { get }) => (get()[item.id] = item),
            });
          });
      }
    },
    // 组装配置信息
    getColumnData(enCode, data) {
      // 如果没有权限，直接返回
      if (!this.permissionColumn.some(item => item.enCode === enCode)) return false;
      if (!data[enCode]) return false;
      // 获取配置信息
      let columnConfig = this.formData.fields.find(item => item.__vModel__ === enCode);
      if (columnConfig && columnConfig.__config__.JDcloudKey === "table") return false;

      if (!columnConfig && !this.$constants.SYSTEM_COMPONENTS.includes(enCode)) return false;
      // 如果是系统组件，则在常量中查找
      if (this.$constants.SYSTEM_COMPONENTS.includes(enCode)) {
        columnConfig = this.$constants.SYSTEM_COMPONENTS_CONFIG.find(
          item => item.__config__.JDcloudKey === enCode
        );
      }

      return { ...columnConfig, value: data[enCode] };
    },
    // 获取配置信息
    async getFormConfig() {
      const { data } = await getFormConfig(this.modelId);
      console.log("data", data);
      this.formData = JSON.parse(data.formData);
      this.columnData = JSON.parse(data.columnData);
    },
    // 获取列表数据
    async getList(reload = false) {
      if (this.loadStatus === "nomore" || this.loadStatus === "loading") return;
      this.loadStatus = "loading";
      const { data } = await getModelList(this.modelId, this.params);
      const { pagination, list } = data;
      if (reload) this.list = [];
      this.list = this.list.concat(list);

      if (this.list.length === pagination.total) this.loadStatus = "nomore";
      else this.loadStatus = "loadmore";

      this.params.currentPage++;
      uni.stopPullDownRefresh();
      this.$nextTick(() => (this.loadingPage = false));
    },
  },
};
</script>

<style lang="scss" scoped>
.from-app {
  background-color: #f5f7fb;
  //安全区域
  padding-bottom: 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.list-app {
  margin: 20rpx;

  .list-item {
    margin-bottom: 20rpx;
    padding: 20rpx;
    background-color: #fff;
    border-radius: 10rpx;
    box-shadow: 0rpx 10rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
  }
}

.plus-data {
  position: fixed;
  bottom: 100rpx;
  right: 20rpx;
  padding: 30rpx;
  z-index: 9999;
  border-radius: 50%;
  background: #1197f7;
}
</style>
