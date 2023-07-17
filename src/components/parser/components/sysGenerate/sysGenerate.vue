<template>
  <view>
    <u-input
      :readonly="readOnly"
      :placeholder="placeholder"
      border="none"
      v-model="inputVal"
    >
    </u-input>
  </view>
</template>

<script>
import helper from "@/common/helper.js";
import {
  getOrganizeTree,
  getTreeView,
  getTreeUserView,
} from "@/config/api.js";
export default {
  name: "billRule",
  props: {
    val: {},
    JDcloudKey: {},
    readOnly: {
      type: Boolean,
      default: true,
    },
    value: {},
    placeholder: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      inputVal: this.val,
    };
  },
  mounted() {
    switch (this.JDcloudKey) {
      case "currOrganize":
        getOrganizeTree().then((res) => {
          
          this.options = res.data.list;
          if (this.val) {
            this.getDeaultData(this.options);
          }
        });
        break;
      case "currDept":
        getTreeView().then((res) => {
          
          this.options = res.data.list;
          if (this.val) {
            this.getDeaultData(this.options);
          }
        });
        break;
      case "createUser":
      case "modifyUser":
        getTreeUserView().then((res) => {
          
          this.options = res.data.list;
          if (this.val) {
            this.getDeaultData(this.options);
          }
        });
        break;
      case "createTime":
      case "modifyTime":
        this.inputVal = helper.toDate(this.val, "yyyy-MM-dd hh:mm");
        break;
    }
  },
  methods: {
    getDeaultData(options) {
      if (!this.val) return;
      let defaultArr = this.val.split(",");
      let arr = [];
      options.forEach((item) => {
        defaultArr.forEach((defaultItem) => {
          
          if (item.id === defaultItem) {
            arr.push(item.fullName);
          }
        });
        if (item.hasChildren) {
          this.getDeaultData(item.children);
        }
      });
      if (arr.length) {
        this.inputVal = arr.toString();
      }
    },
  },
};
</script>

<style>
</style>
