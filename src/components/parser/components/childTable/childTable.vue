<template>
  <view style="box-sizing: border-box">
    <u--form
      :model="childModel"
      ref="childRef"
      :labelPosition="labelPosition"
      :labelWidth="labelWidth"
      class="parser-form">
      <template v-for="(childItem, childindex) in item">
        <!-- 单行输入 -->
        <u-form-item
          v-if="!childItem.__config__.noShow && getOperates(childItem.__vModel__).read"
          :required="childItem.__config__.required"
          :key="childindex"
          :label="childItem.__config__.label"
          :labelWidth="labelWidth"
          :prop="childItem.__vModel__"
          borderBottom
          class="parser-form-item">
          <!-- 单行输入 -->
          <comInput
            v-if="childItem.__config__.JDcloudKey === 'comInput'"
            class="parser-cpn"
            :__vModel__="childItem.__vModel__"
            :val="tableModel[childItem.__vModel__]"
            :readOnly="childItem.readonly"
            :disabled="childItem.disabled || !getOperates(childItem.__vModel__).write"
            :clearable="childItem.clearable"
            :maxlength="childItem.maxlength ? childItem.maxlength : -1"
            :stringSlot="childItem.__slot__"
            :suffixIcon="childItem['suffix-icon']"
            :prefixIcon="childItem['prefix-icon']"
            :placeholder="childItem.placeholder"
            @input="input">
          </comInput>

          <!-- 系统自动生成 -->
          <sysGenerate
            v-if="sysGenerateComponents.includes(childItem.__config__.JDcloudKey)"
            class="parser-cpn"
            :placeholder="childItem.placeholder"
            :val="tableModel[childItem.__vModel__]"
            :JDcloudKey="childItem.__config__.JDcloudKey">
          </sysGenerate>

          <!-- 多行输入框 -->
          <kindowTextarea
            v-if="childItem.__config__.JDcloudKey === 'textarea'"
            :__vModel__="childItem.__vModel__"
            :val="tableModel[childItem.__vModel__]"
            :disabled="childItem.disabled || !getOperates(childItem.__vModel__).write"
            :placeholder="childItem.placeholder"
            :maxlength="childItem.maxlength ? childItem.maxlength : -1"
            @input="input">
          </kindowTextarea>

          <!-- 关联相关 下拉框 -->
          <relationCpn
            class="over-width"
            :relationId="
              childItem.__config__.JDcloudKey == 'relationFlow'
                ? childItem.flowId
                : childItem.modelId
            "
            :dataMethod="childItem.__config__.JDcloudKey"
            v-if="
              childItem.__config__.JDcloudKey == 'relationFlow' ||
              childItem.__config__.JDcloudKey == 'relationFormAttrselect' ||
              childItem.__config__.JDcloudKey == 'relationForm'
            "
            @input="input"
            :filterString="tableModel[childItem.relationField]"
            :__vModel__="childItem.__vModel__"
            :params="childItem.showField"
            :disabled="childItem.disabled || !getOperates(childItem.__vModel__).write"
            :whereName="childItem.relationFieldcode"
            :saveId="childItem.saveId"></relationCpn>

          <!-- 自动获取值根据接口 -->
          <generateValue
            v-if="
              childItem.__config__.JDcloudKey == 'relationFlowAttr' ||
              childItem.__config__.JDcloudKey == 'relationFormAttrselectItem' ||
              childItem.__config__.JDcloudKey == 'relationFormAttr'
            "
            :relationId="childItem.relationField"
            :showField="childItem.showField">
          </generateValue>

          <!-- 数字输入框 -->
          <numberInput
            class="over-width"
            v-if="childItem.__config__.JDcloudKey === 'numInput'"
            @input="input"
            :__vModel__="childItem.__vModel__"
            :val="tableModel[childItem.__vModel__]"
            :min="childItem.min"
            :step="childItem.step"
            :disabled="childItem.disabled || !getOperates(childItem.__vModel__).write"
            :max="childItem.max"
            :precision="childItem.precision || 0"></numberInput>

          <!-- 计算组件 -->
          <calculate
            class="over-width"
            :__vModel__="childItem.__vModel__"
            :val="tableModel[childItem.__vModel__]"
            v-if="childItem.__config__.JDcloudKey === 'calculate'"
            @input="input"
            :expression="childItem.expression"
            :dataForm="tableModel"
            :decimalLength="childItem.precision || 0"></calculate>
          <!-- 开关 -->
          <kindowSwitch
            v-if="childItem.__config__.JDcloudKey === 'switch'"
            :disabled="childItem.disabled || !getOperates(childItem.__vModel__).write"
            :__vModel__="childItem.__vModel__"
            :val="tableModel[childItem.__vModel__]"
            @input="input">
          </kindowSwitch>
          <!-- 单选框组 -->
          <kindowRadio
            v-if="childItem.__config__.JDcloudKey == 'radio'"
            :options="childItem.__slot__.options"
            :props="childItem.__config__.props"
            :disabled="childItem.disabled || !getOperates(childItem.__vModel__).write"
            :defaultValue="tableModel[childItem.__vModel__] || childItem.__config__.defaultValue"
            @input="input"
            :__vModel__="childItem.__vModel__"
            :multiple="false">
          </kindowRadio>
          <!-- 评分 -->
          <kindowRate
            v-if="childItem.__config__.JDcloudKey === 'rate'"
            :disabled="childItem.disabled || !getOperates(childItem.__vModel__).write"
            :__vModel__="childItem.__vModel__"
            :val="tableModel[childItem.__vModel__]"
            :count="childItem.max"
            :allowHalf="childItem['allow-half']"
            @input="input">
          </kindowRate>
          <KindowAssociatedData
            @input="input"
            :defaultValue="tableModel[childItem.__vModel__]"
            :parserModel="rootModel"
            @addChildren="addChildren"
            v-if="childItem.__config__.JDcloudKey === 'AssociatedData'"
            :item="childItem">
          </KindowAssociatedData>
          <!-- 多选-->
          <kindowCheckbox
            v-if="childItem.__config__.JDcloudKey === 'checkbox'"
            :JDcloudKey="childItem.__config__.JDcloudKey"
            @input="input"
            :multiple="childItem.multiple"
            :defaultValue="tableModel[childItem.__vModel__]"
            :disabled="childItem.disabled || !getOperates(childItem.__vModel__).write"
            :min="childItem.min"
            :max="childItem.max"
            :__vModel__="childItem.__vModel__"
            :options="childItem.__slot__.options"></kindowCheckbox>
          <!-- 下拉-->
          <kindowSelect
            v-if="childItem.__config__.JDcloudKey === 'select'"
            :JDcloudKey="childItem.__config__.JDcloudKey"
            @input="input"
            :propsUrl="childItem.__config__.propsUrl || null"
            :selectList="childItem.__config__.selectList || null"
            :multiple="childItem.multiple"
            :props="childItem.__config__.props"
            :parserModel="rootModel"
            :tableIndex="tableIndex"
            :defaultValue="tableModel[childItem.__vModel__]"
            :disabled="childItem.disabled || !getOperates(childItem.__vModel__).write"
            :__vModel__="childItem.__vModel__"
            :options="childItem.__slot__.options"></kindowSelect>

          <!-- -->
          <kindowDatetime
            v-if="
              childItem.__config__.JDcloudKey === 'time' ||
              childItem.__config__.JDcloudKey === 'date'
            "
            :__vModel__="childItem.__vModel__"
            :selectableRange="
              childItem['picker-options'] ? childItem['picker-options'].selectableRange : ''
            "
            @input="input"
            :readonly="childItem.readonly"
            :disabled="childItem.disabled || !getOperates(childItem.__vModel__).write"
            :clearable="childItem.clearable"
            :formatter="childItem.format"
            :type="childItem.type"
            :defaultValue="tableModel[childItem.__vModel__]"></kindowDatetime>

          <kindowLine
            v-if="childItem.__config__.JDcloudKey == 'divider'"
            class="over-width"
            :position="childItem['content-position']"
            :defaultValue="childItem.__slot__.default">
          </kindowLine>
          <kindowGroupTitle
            v-if="childItem.__config__.JDcloudKey == 'groupTitle'"
            class="over-width"
            :position="childItem['content-position']"
            :defaultValue="childItem.content">
          </kindowGroupTitle>
          <kindowText
            v-if="childItem.__config__.JDcloudKey == 'JDcloudText'"
            class="over-width"
            :defaultValue="childItem.__config__.defaultValue"
            :textStyle="childItem.textStyle"></kindowText>

          <kindowFile
            v-if="childItem.__config__.JDcloudKey == 'uploadFz'"
            :__vModel__="childItem.__vModel__"
            :accept="childItem.accept"
            :fileSize="childItem.fileSize"
            :limit="childItem.limit"
            :label="childItem.buttonText"
            :defaultValue="tableModel[childItem.__vModel__]"
            @input="input"></kindowFile>
          <kindowUpload
            v-if="childItem.__config__.JDcloudKey == 'uploadImg'"
            :__vModel__="childItem.__vModel__"
            :fileSize="childItem.fileSize"
            :limit="childItem.limit"
            :disabled="childItem.disabled || !getOperates(childItem.__vModel__).write"
            :defaultValue="tableModel[childItem.__vModel__]"
            @input="input"
            accept="image"></kindowUpload>
        </u-form-item>
      </template>
    </u--form>
  </view>
</template>

<script>
import KindowAssociatedData from "../kindow-associatedData/kindow-associatedData.vue";
import comInput from "../comInput/comInput.vue";
import sysGenerate from "../sysGenerate/sysGenerate.vue";
import kindowTextarea from "../kindow-textarea/kindow-textarea.vue";
import relationCpn from "../relationCpn/relationCpn.vue";
import generateValue from "../generateValue/generateValue.vue";
import numberInput from "../numberInput/numberInput.vue";
import calculate from "../calculate/calculate.vue";
import kindowSwitch from "../kindow-switch/kindow-switch.vue";
import kindowRadio from "../kindow-radio/kindow-radio.vue";
import kindowCheckbox from "../kindow-checkbox/kindow-checkbox.vue";
import kindowSelect from "../kindow-select/kindow-select.vue";
import kindowRate from "../kindow-rate/kindow-rate.vue";
import kindowSlider from "../kindow-slider/kindow-slider.vue";
import kindowDatetime from "../kindow-datetime/kindow-datetime.vue";
import kindowLine from "../kindow-line/kindow-line.vue";
import kindowGroupTitle from "../kindow-groupTitle/kindow-groupTitle.vue";
import kindowText from "../kindow-text/kindow-text.vue";
import kindowUpload from "../kindow-upload/kindow-upload.vue";
import kindowOrganize from "../kindow-organize/kindow-organize.vue";
import kindowCumtomTree from "../kindow-cumtomTree/kindow-cumtomTree.vue";
import kindowFile from "../kindow-file/kindow-file.vue";
import kindowSignature from "../kindow-signature/kindow-signature.vue";

export default {
  components: {
    kindowFile,
    KindowAssociatedData,
    comInput,
    sysGenerate,
    kindowTextarea,
    relationCpn,
    generateValue,
    numberInput,
    calculate,
    kindowSwitch,
    kindowRadio,
    kindowCheckbox,
    kindowRate,
    kindowSlider,
    kindowDatetime,
    kindowLine,
    kindowGroupTitle,
    kindowText,
    kindowUpload,
    kindowSignature,
    kindowOrganize,
    kindowCumtomTree,
    kindowSelect,
  },
  name: "childTable",
  props: {
    //  是否是只读 流程使用
    readonly: {
      type: Boolean,
      default: false,
    },
    rootModel: {},
    /* 获取fields数据 */
    item: {},
    __vModel__: {},
    tableModel: {
      default: [],
    },
    tableIndex: {},
    tableRules: {},
    formOperates: {},
    /* 设置默认大小 */
    labelWidth: {
      default: "160rpx",
    },
    labelPosition: {
      default: "left",
    },
  },
  data() {
    return {
      treeCpn: ["comSelect", "depSelect", "userSelect"],
      // 属于系统自动生成的组件
      sysGenerateComponents: [
        "billRule",
        "createUser",
        "createTime",
        "modifyUser",
        "modifyTime",
        "currOrganize",
        "currDept",
        "currPosition",
      ],
      childModel: {},
      childRules: {},
    };
  },
  created() {
    // console.log("tableModel",this.tableModel);
    this.childModel = this.tableModel;
    this.childRules = this.tableRules;
  },
  mounted() {
    // 设置规则——>兼容微信小程序
    this.$refs.childRef.setRules(this.childRules);
  },
  methods: {
    addChildren(fieldValues) {
      this.$emit("addChildren", fieldValues, this.tableIndex);
    },
    // 校验
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.childRef
          .validate()
          .then(valid => {
            resolve(valid);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 获取规则
    getOperates(key) {
      //所有表单只读
      if (this.readonly) {
        return {
          read: true,
          write: false,
        };
      }
      let obj = {
        read: true,
        write: true,
      };
      if (!key) {
        return obj;
      }
      if (!this.formOperates || !this.formOperates.length) {
        return obj;
      }
      for (var i = 0; i < this.formOperates.length; i++) {
        let item = this.formOperates[i];
        if (item.id === key) {
          return item;
        }
      }
    },
    // 获取输入框的值
    input(k, v) {
      /* 解决Vue无法监听对象属性变化问题 */
      let temp = Object.assign({}, this.childModel);
      temp[k] = v;
      this.childModel = temp;
      this.$emit("tableInput", this.__vModel__, this.tableIndex, this.childModel);
    },
  },
};
</script>

<style scoped lang="scss">
.parser-form {
  .parser-form-item {
    display: flex;

    .parser-cpn {
      flex: 1;
    }
  }

  .over-width {
    width: 100%;
  }
}

::v-deep.u-form-item__body {
  display: flex;
}
</style>
