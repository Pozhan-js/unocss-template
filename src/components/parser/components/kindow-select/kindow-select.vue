<template>
  <view class="label">
    <view @click="showPick" class="label flex-ai">
      <view class="flex-1">{{ data }}</view>
      <view @click.stop="clearData" v-if="showIcon">
        <u-icon name="close-circle-fill" color="#c6c7cb" size="18"></u-icon>
      </view>
    </view>
    <ba-tree-picker
      ref="treePicker"
      :multiple="multiple"
      :localdata="requestOptions"
      :default-checked-keys="defaultCheckedKeys"
      :textKey="props.label"
      :valueKey="props.value"
      :title="title"
      @select-change="selectChange" />
  </view>
</template>

<script>
import { getModelList, previewDataInterfacePublic } from "@/config/api.js";
import baTreePicker from "../ba-tree-picker/ba-tree-picker.vue";
import { getFunctionOption, getLinkOptions, value2DateFormat } from "@/utils";

export default {
  components: {
    baTreePicker,
  },
  name: "kindow-select",
  props: {
    linkageQuery: {},
    item: {},
    functionField: {},
    functionId: {},
    dataType: {},
    defaultValue: {},
    disabled: {},
    __vModel__: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      default: "请选择",
    },
    parserModel: {},
    props: {},
    // 请求地址
    propsUrl: {},
    tableIndex: {},
    // 从其他地方获取数据
    selectList: {},
    JDcloudKey: {},
    multiple: {
      // 是否可以多选
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      data: "请选择数据",
      defaultCheckedKeys: [],
      // 请求的数据
      requestOptions: this.options,
    };
  },
  computed: {
    showIcon() {
      return !this.disabled && this.data !== '请选择数据';
    },
  },
  mounted() {
    // 如果是数据联动,则不需要请求数据
    if (this.dataType === "linkage") {
      this.data = this.parserModel[this.__vModel__] || "请选择数据";
      this.requestOptions = [];
      return;
    }
    // 如果有默认值
    if (this.defaultValue) {
      this.handleDefaultVal().then(res => {
        this.defaultCheckedKeys = res;
        this.data = res.join(" / ");
      });
    }
  },
  methods: {
    // 显示选择器
    showPick() {
      if (this.disabled) return;
      if (this.dataType === "function") {
        this.handleFunctionData();
      }
      // 如果是数据联动
      if (this.dataType === "linkage") {
        this.handleLinkageData();
      }
      if (this.propsUrl) {
        this.getDynamicData().then(res => {
          this.requestOptions = res;
          this.$refs.treePicker._show();
        });
        return;
      }
      this.$refs.treePicker._show();
    },
    // 处理关联表单数据
    async handleFunctionData() {
      const { functionField, functionId, props } = this;
      this.$refs.treePicker._initTree()
      this.requestOptions = await getFunctionOption({ functionField, functionId, props });
    },
    // 处理联动数据
    async handleLinkageData() {
      this.requestOptions = [];
      this.$refs.treePicker._initTree()
      const { props, linkageQuery } = this;
      this.requestOptions = await getLinkOptions({
        linkageQuery,
        props,
        formData: this.parserModel,
      });
    },

    clearData() {
      this.data = "请选择数据";
      this.$emit("input", this.__vModel__, "");
      this.$refs.treePicker._reTreeList();
    },
    handleDefaultVal() {
      return new Promise(resolve => {
        let { multiple, options, defaultValue: dfVal } = this;
        let defaultArr = [];
        if (!multiple) {
          //单选
          // 如果是远端数据
          if (this.propsUrl) {
            this.getDynamicData().then(res => {
              let item = res.find(({ id }) => id === dfVal) || {};
              defaultArr = [item[this.props.value]];
              resolve(defaultArr);
            });
          } else {
            let { fullName } = options.find(({ id }) => id === dfVal) || {};
            defaultArr = [fullName];
            resolve(defaultArr);
          }
          return;
        }

        //多选
        if (this.propsUrl) {
          this.getDynamicData().then(res => {
            res.forEach(item => {
              if (dfVal.indexOf(item[this.props.value]) >= 0) {
                defaultArr.push(item[this.props.label]);
              }
            });
            resolve(defaultArr);
          });
        } else {
          dfVal.forEach(id => {
            let item = options.find(res => res.id === id) || null;
            if (item) defaultArr.push(item);
          });

          resolve(defaultArr);
        }
      });
    },
    // 获取动态数据
    getDynamicData() {
      return new Promise(resolve => {
        previewDataInterfacePublic(this.propsUrl, {
          datajson: JSON.stringify(this.getQueryData()),
        }).then(res => {
          resolve(res.data.list);
        });
      });
    },
    //监听选择
    selectChange(ids, text) {
      if (ids.length == 0) return;
      this.data = text;
      // 如果是单选的话
      if (!this.multiple) {
        ids = ids.toString();
      }
      this.$emit("input", this.__vModel__, ids);
    },
    // 获取查询数据
    getQueryData() {
      let datajson = [];
      this.selectList.forEach(item => {
        if (item.type === "dynamic") {
          let value = "";
          const attrArr = item.value.split(".");

          if (attrArr.length > 1 && this.tableIndex >= 0) {
            value = this.parserModel[attrArr[0]][this.tableIndex][attrArr[1]];
          } else {
            value = this.parserModel[attrArr[0]];
          }
          datajson.push({
            name: item.name,
            type: "dynamic",
            value,
          });
        } else {
          datajson.push(item);
        }
      });
      return datajson;
    },
  },
};
</script>

<style scoped>
.label {
  width: 100%;
}
</style>
