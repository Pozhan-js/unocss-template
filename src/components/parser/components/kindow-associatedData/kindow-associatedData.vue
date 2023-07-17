<template>
  <view>
    <u-button type="primary" text="选择数据" icon="list-dot" @click="handleClick"></u-button>
    <parser
      :initData="initData"
      :fields="showFormField"
      ref="parserForm"
      v-if="showParser"
      labelPosition="top"
      labelWidth="500rpx">
    </parser>
    <u-popup
      closeable
      :show="chooseTable"
      mode="center"
      round="4"
      :closeOnClickOverlay="false"
      @open="resetList"
      @close="chooseTable = false">
      <view class="table-app">
        <view class="table">
          <ZbTable
            :columns="columnList"
            stripe
            ref="zbTable"
            @toggleRowSelection="handleToggleRowSelection"
            :data="list"
            @toggleAllSelection="handleToggleAllSelection"
            @rowClick="handleRowClick"
            isShowLoadMore
            @pullUpLoading="loadMore"
            :showHeaderCheckbox="isTable">
          </ZbTable>
        </view>
        <view class="foot flex-ai" v-if="isTable">
          <u-button type="default" text="取消" @click="chooseTable = false"></u-button>
          <u-button type="primary" text="确定" @click="handleConfirm"></u-button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import Parser from "../../parser.vue";
import ZbTable from "@/components/zb-table/zb-table.vue";
import { getModelList } from "@/config/api";
import { getAssociationColumn } from "@/utils";
export default {
  name: "KindowAssociatedData",
  components: { Parser, ZbTable },
  props: {
    defaultValue: {},
    item: {
      type: Object,
      default: () => {},
    },
    parserModel: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      showParser: false,
      chooseTable: false,
      columnList: [],
      list: [],
      initData: {},
      queryParams: {
        currentPage: 1,
        pageSize: 20,
      },
      selectArray: [],
    };
  },
  computed: {
    showFormField() {
      return this.item.__config__.showFormField;
    },
    isTable() {
      return this.item.__config__.isTable;
    },
  },
  mounted() {
    console.log("KindowAssociatedData", this.item);
    this.init();
  },
  watch: {
    defaultValue: {
      handler(val) {
        if (!val) return;
        this.showParser = false;
        this.initData = val.data;
        this.columnList = val.column;
        this.$nextTick(() => (this.showParser = true));
      },
    },
  },
  methods: {
    async handleClick() {
      if (!this.columnList.length) await this.getColumn();
      // 如果没有选择数据权限，直接返回
      if (!this.columnList.length) {
        this.$u.toast("您暂无权限选择数据");
        return;
      }

      this.chooseTable = true;
    },
    handleToggleAllSelection(selected, array) {
      this.selectArray = array;
    },
    // 子表确认
    handleConfirm() {
      const { __vModel__ } = this.item;
      const { fillList } = this.item.__config__;
      const fieldValues = this.selectArray.map(o => {
        // 组件内部的值
        const associateObj = this.setParserInitData(o);
        // 填充的值
        const modelObj = fillList.reduce((pre, cur) => {
          pre[cur.fillField] = o[cur.enCode];
          return pre;
        }, {});
        return {
          ...associateObj,
          ...modelObj,
          [__vModel__]: o._id,
        };
      });
      this.$emit("addChildren", fieldValues);
    },
    handleToggleRowSelection(selected, array) {
      // 如果不是在子表
      if (!this.isTable) {
        this.chooseTable = false;
        this.showParser = false;
        this.setParserInitData(array[0]);
        this.fillData(array[0]);
        return;
      }
      this.selectArray = array;
    },
    async init() {
      console.log("init", this.defaultValue, this.isTable);
      if (!this.defaultValue) {
        this.showParser = true;
        return;
      }
      const { functionId } = this.item.__config__;
      const filter = [
        {
          key: "_id",
          method: "eq",
          value: [this.defaultValue],
          type: "custom",
        },
      ];
      const result = await getModelList(functionId, { filter });
      const row = result.data.list[0];
      this.initData = this.setParserInitData(row);
      this.$nextTick(() => (this.showParser = true));
      // console.log("result", result);
    },
    // 获取关联数据组件的初始值
    setParserInitData(row) {
      const { showFormField = [] } = this.item.__config__;
      return showFormField.reduce((prev, { __vModel__ }) => {
        prev[__vModel__] = row[__vModel__];
        return prev;
      }, {});
    },
    getParams() {
      const { parserModel, item } = this;
      const { filterList } = item.__config__;
      this.queryParams.filter = filterList.map(item => {
        item.key = item.enCode;
        const value = item.type === "field" ? [parserModel[item.value[0]]] : item.value;
        return {
          ...item,
          value,
          type: "custom",
        };
      });
      // console.log("filter", this.queryParams.filter);
    },
    loadMore() {
      this.queryParams.currentPage++;
      this.getList();
    },
    handleRowClick(row) {
      const { isTable } = this;
      // 如果不在子表中
      if (!isTable) {
        this.chooseTable = false;
        this.showParser = false;
        this.initData = this.setParserInitData(row);
        this.$nextTick(() => (this.showParser = true));
        this.fillData(row);
        return;
      }
      // 如果在子表中
    },
    // 数据填充
    fillData(row) {
      const { item } = this;
      const { __config__, __vModel__ } = item;
      const { fillList } = __config__;
      for (let fillListElement of fillList) {
        const { fillField, enCode } = fillListElement;
        this.$emit("input", fillField, row[enCode]);
      }
      this.$emit("input", __vModel__, row._id);
      if (fillList.length) this.$emit("reRender");
    },
    async getColumn() {
      const { functionId, showTableField = [] } = this.item.__config__;
      this.columnList = await getAssociationColumn(functionId, showTableField);
    },
    resetList() {
      this.queryParams.currentPage = 1;
      this.list = [];
      this.getList();
    },
    async getList() {
      const { functionId, connect } = this.item.__config__;
      this.getParams();
      const result = await getModelList(functionId, {
        connect,
        ...this.queryParams,
      });
      const { list = [], pagination } = result.data;
      if (!list.length) return this.$refs.zbTable.pullUpCompleteLoading("ok");
      this.list = this.list.concat(list);
      if (pagination.total <= this.list.length) {
        this.$refs.zbTable.pullUpCompleteLoading("ok");
      } else {
        this.$refs.zbTable.pullUpCompleteLoading();
      }
    },
  },
};
</script>
<style scoped lang="scss">
.table-app {
  width: 85vw;
  margin-top: 80rpx;
  height: 800rpx;
  overflow: auto;
  .table {
    height: 90%;
  }
  .foot {
    box-shadow: 0px -1px 1px 0px rgba(0, 0, 0, 0.1);
  }
}
</style>
