<template>
  <view class="cell-list">
    <u-list
      v-if="listData.length"
      :width="width"
      :height="height"
      @scrolltolower="scrolltolower"
    >
      <slot :keyName="keyName" :listData="listData" :pagination="pagination">
        <!-- 默认 -->
        <u-list-item v-for="item in listData" :key="item[keyName]">
          <u-cell isLink :border="false" @click="() => cellClickHandler(item)">
            <view slot="title" class="u-slot-title">
              <text class="text-ellipsis">
                {{ item.title }}
              </text>
            </view>
          </u-cell>
        </u-list-item>
        <!-- 默认 -->
      </slot>
      <u-loadmore v-if="loading" status="loading" marginTop="12" />
    </u-list>
    <u-empty margin-top="50%" v-else :text="emptyText"> </u-empty>
  </view>
</template>

<script>
import { message, lockFunction, isFunction } from "@/common";
import { getModelList } from "@/config/api";
const loadLock = lockFunction();
function pagesLoadState({ total, currentPage, pageSize } = {}) {
  return currentPage * pageSize - total <= pageSize;
}
export default {
  props: {
    modelId: {
      //模块id
      type: String,
      require: true,
    },
    emptyText: {
      //空数据提示文字
      type: String,
      default: "暂无数据",
    },
    params: {
      //发请求时需要携带的参数
      type: Object,
      default: () => ({}),
    },
    keyName: {
      //循环键名
      type: String,
      default: "id",
    },
    initLoad: {
      //是否初始化加载
      type: Boolean,
      default: true,
    },
    width: String, //loadlist宽度
    height: String, //loadlist高度
    loadDataFn: Function, //数据加载函数
    filterFn: Function, //数据过滤函数
  },
  data() {
    return {
      listData: [],
      loading: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
      },
    };
  },
  async mounted() {
    //组件mounted前都无法拿到props(且create优先onload)
    try {
      if (this.initLoad) this.$emit("load", await this.loadData());
    } catch (error) {
      message("数据获取失败", false);
    }
  },
  methods: {
    scrolltolower() {
      //上拉加载
      loadLock(async (unlock) => {
        this.pagination.currentPage++;
        if (pagesLoadState(this.pagination)) {
          unlock(await this.loadData(true));
          this.loading = false;
        }
      });
    },
    async loadData(isPush = false) {
      try {
        uni.showLoading({ title: "数据加载中" });
        let resolve = null;
        var { params, pagination, modelId } = this;
        if (isFunction(this.loadDataFn)) {
          resolve = await this.loadDataFn({ pagination, modelId });
        } else {
          if (!modelId) return message("缺少modelId", false);
          const res = await getModelList(modelId, {
            ...params,
            ...pagination,
          });
          resolve = res?.data || {};
        }
        if (resolve == null) throw 0;
        var { list = [], pagination = {} } = resolve;
        // 如果传入了过滤方法则会执行,如果函数没有返回值则返回默认值false
        // 这样就能不是函数时或者无返回值时还是原值
        list = isFunction(this.filterFn, true, {
          params: list,
          defaultVal: list,
        });
        if (isPush) list = [...this.listData, ...list];
        Object.assign(this, { pagination, listData: list });
      } catch (error) {
        console.log(error);
        message("加载数据失败", false);
      } finally {
        uni.hideLoading();
      }
      return this.listData;
    },
    cellClickHandler(item) {
      this.$emit("click", item);
    },
  },
  destroyed() {
    loadLock("close");
  },
};
</script>
