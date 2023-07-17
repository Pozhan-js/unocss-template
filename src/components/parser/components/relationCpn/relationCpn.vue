<template>
  <view class="flex-column">
    <view @click="showPick">{{ pickObj.value }}</view>
    <ba-tree-picker
      ref="treePicker"
      :multiple="multiple"
      :localdata="filterString ? filterFormList : formList"
      :default-checked-keys="defaultCheckedKeys"
      :textKey="textKeyData"
      :valueKey="valueKeyData"
      :title="title"
      @select-change="selectChange"
    />
  </view>
</template>

<script>
import {
  engineFieldDataSelect,
  engineFieldDataSelectValue,
  baseFieldDataSelect,
  baseFieldDataSelectValue,
  getModelList,
} from "@/config/api";
import baTreePicker from "../ba-tree-picker/ba-tree-picker.vue";
export default {
  components: {
    baTreePicker,
  },
  name: "relationCpn",
  data() {
    return {
      textKeyData: this.textKey,
      valueKeyData: this.valueKey,
      // 未过滤的数据
      formList: [],
      /* 过滤后的数据 */
      filterFormList: [],
      pickObj: {
        value: "请选择",
      },
      defaultCheckedKeys: [],
    };
  },
  props: {
    index:{},
    defaultValue: "",
    whereName: {},
    saveId: {},
    /* 过滤的条件 */
    filterString: {},
    params: {},
    __vModel__: {
      type: String,
      required: true,
    },
    title: {
      default: "请选择",
    },
    valueKey: {
      type: String,
      default: "id",
    },
    textKey: {
      type: String,
      default: "fullName",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    dataMethod: {
      type: String,
      required: true,
    },
    relationId: {
      type: String,
      required: true,
    },
  },
  async mounted() {
    await this.doGetFormData();
    if (this.defaultValue) {
      this.defaultCheckedKeys = [this.defaultValue];
    }
  },
  methods: {
    // 获取数据
    async doGetFormData() {
      if (this.dataMethod == "relationFlow") {
        engineFieldDataSelect(this.relationId).then((res) => {
          this.formList = res.data.list;
        });
      } else if (this.dataMethod == "relationForm") {
        baseFieldDataSelect(this.relationId, {
          field: this.params,
        }).then((res) => {
          console.log(res);
          this.formList = res.data.list;
        });
      } else if (this.dataMethod == "relationFormAttrselect") {
        let jsondata = {
          currentPage: 1,
          pageSize: 1000,
        };
        await getModelList(this.relationId, jsondata).then(({ data }) => {
          this.formList = data?.list;
          this.textKeyData = this.params;
          this.valueKeyData = this.saveId;
        });
      }
    },
    // 显示选择器
    showPick() {
      if (this.disabled) return;
      this.$refs.treePicker._show();
    },
    //监听选择
    selectChange(ids, text, index) {
      this.pickObj.value = text;
      this.$emit("input", this.__vModel__, ids + "");
      if (this.dataMethod == "relationFlow") {
        engineFieldDataSelectValue(this.relationId, ids[0]).then((res) => {
          this.$store.commit("storeFloEngineObj", {
            key: this.__vModel__,
            value: res.data,
          });
        });
      } else if (this.dataMethod == "relationForm") {
        baseFieldDataSelectValue(this.relationId, ids[0]).then((res) => {
          this.$store.commit("storeFloEngineObj", {
            key: this.__vModel__,
            value: res.data.data,
          });
        });
      } else if (this.dataMethod == "relationFormAttrselect") {

        this.$store.commit("storeFloEngineObj", {
          key: "relationFormAttrselect"+this.index,
          value: this.filterString
            ? this.filterFormList[[index]]
            : this.formList[index],
        });
      }
    },
  },
  watch: {
    filterString(newVal) {
      let jsondata = {
        json: {
          [this.whereName]: newVal,
        },
        currentPage: 1,
        pageSize: 1000,
      };
      getModelList(this.relationId, jsondata).then((res) => {
        this.filterFormList = res.data.list;
        this.textKeyData = this.params;
        if (this.dataMethod === "relationFormAttrselect") {
          this.valueKeyData = this.saveId;
        }
      });
    },
  },
};
</script>
<style scoped>
</style>
