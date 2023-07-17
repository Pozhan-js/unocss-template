<template>
  <view>
    <view class="loading-page-app" v-if="loading">
      <u-loading-page
        loading-text="全力加载中..."
        :loading="loading"></u-loading-page>
    </view>
    <view v-if="showParser">
      <kindowSignature
        @touchmove.prevent
        :__vModel__="signatureModel.__vModel__"
        @input="input"
        class="signCpn"
        v-if="signatureModel.show"
        @cancel="signatureModel.show = false"
        :defaultValue="
          parserModel[signatureModel.__vModel__]
        "></kindowSignature>
      <u--form
        :model="parserModel"
        ref="parserRef"
        class="parser-form"
        :labelPosition="labelPosition">
        <template v-for="(item, key) in fields">
          <!--  noShow如果组件不需要显示则不渲染 -->
          <!-- item.__config__.JDcloudKey!='divider' && item.__config__.JDcloudKey!='groupTitle' -->
          <u-form-item
            v-if="isShowFormItem(item)"
            :required="item.__config__.required"
            :key="key"
            :label="formItemLabel(item)"
            :labelWidth="labelWidth"
            :prop="item.__vModel__"
            :borderBottom="!unLabelCpn.includes(item.__config__.JDcloudKey)"
            class="parser-form-item">
            <!-- 单行输入 -->
            <comInput
              v-if="item.__config__.JDcloudKey === 'comInput'"
              class="parser-cpn"
              :__vModel__="item.__vModel__"
              :val="parserModel[item.__vModel__]"
              :readOnly="item.readonly"
              :disabled="item.disabled || !getOperates(item.__vModel__).write"
              :clearable="item.clearable"
              :maxlength="item.maxlength ? item.maxlength : -1"
              :stringSlot="item.__slot__"
              :suffixIcon="item['suffix-icon']"
              :prefixIcon="item['prefix-icon']"
              :placeholder="item.placeholder"
              @input="input">
            </comInput>

            <!-- 系统自动生成 -->
            <sysGenerate
              v-if="sysGenerateComponents.includes(item.__config__.JDcloudKey)"
              class="parser-cpn"
              :placeholder="item.placeholder"
              :val="parserModel[item.__vModel__]"
              :JDcloudKey="item.__config__.JDcloudKey">
            </sysGenerate>

            <!-- 多行输入框 -->
            <kindowTextarea
              v-if="item.__config__.JDcloudKey === 'textarea'"
              :__vModel__="item.__vModel__"
              :val="parserModel[item.__vModel__]"
              :disabled="item.disabled || !getOperates(item.__vModel__).write"
              :placeholder="item.placeholder"
              :maxlength="item.maxlength ? item.maxlength : -1"
              @input="input">
            </kindowTextarea>

            <!-- 关联相关 下拉框 -->
            <relationCpn
              class="over-width"
              :relationId="
                item.__config__.JDcloudKey == 'relationFlow'
                  ? item.flowId
                  : item.modelId
              "
              :dataMethod="item.__config__.JDcloudKey"
              v-if="
                item.__config__.JDcloudKey == 'relationFlow' ||
                item.__config__.JDcloudKey == 'relationFormAttrselect' ||
                item.__config__.JDcloudKey == 'relationForm'
              "
              @input="input"
              :filterString="parserModel[item.relationField]"
              :__vModel__="item.__vModel__"
              :params="item.showField"
              :disabled="item.disabled || !getOperates(item.__vModel__).write"
              :whereName="item.relationFieldcode"
              :saveId="item.saveId"></relationCpn>

            <!-- 自动获取值根据接口 -->
            <generateValue
              v-if="
                item.__config__.JDcloudKey == 'relationFlowAttr' ||
                item.__config__.JDcloudKey == 'relationFormAttrselectItem' ||
                item.__config__.JDcloudKey == 'relationFormAttr'
              "
              :relationId="item.relationField"
              :showField="item.showField">
            </generateValue>

            <!-- 数字输入框 -->
            <numberInput
              class="over-width"
              v-if="item.__config__.JDcloudKey === 'numInput'"
              @input="input"
              :__vModel__="item.__vModel__"
              :val="parserModel[item.__vModel__]"
              :min="item.min"
              :step="item.step"
              :disabled="item.disabled || !getOperates(item.__vModel__).write"
              :max="item.max"
              :precision="item.precision || 0"></numberInput>

            <!-- 计算组件 -->
            <calculate
              class="over-width"
              :__vModel__="item.__vModel__"
              :val="parserModel[item.__vModel__]"
              v-if="item.__config__.JDcloudKey === 'calculate'"
              @input="input"
              :expression="item.expression"
              :dataForm="parserModel"
              :decimalLength="item.precision || 0"></calculate>
            <!-- 开关 -->
            <kindowSwitch
              v-if="item.__config__.JDcloudKey === 'switch'"
              :disabled="item.disabled || !getOperates(item.__vModel__).write"
              :__vModel__="item.__vModel__"
              :val="parserModel[item.__vModel__]"
              @input="input">
            </kindowSwitch>
            <!-- 单选框组 -->
            <kindowRadio
              v-if="item.__config__.JDcloudKey == 'radio'"
              :options="item.__slot__.options"
              :props="item.__config__.props"
              :disabled="item.disabled || !getOperates(item.__vModel__).write"
              :defaultValue="
                parserModel[item.__vModel__] || item.__config__.defaultValue
              "
              @input="input"
              :__vModel__="item.__vModel__"
              :multiple="false">
            </kindowRadio>
            <!-- 评分 -->
            <kindowRate
              v-if="item.__config__.JDcloudKey === 'rate'"
              :disabled="item.disabled || !getOperates(item.__vModel__).write"
              :__vModel__="item.__vModel__"
              :val="parserModel[item.__vModel__]"
              :count="item.max"
              :allowHalf="item['allow-half']"
              @input="input">
            </kindowRate>

            <kindowImage
              v-if="item.__config__.JDcloudKey === 'image'"
              :src="item.src"
              :style="item.style">
            </kindowImage>
            <!-- 多选-->
            <kindowCheckbox
              v-if="item.__config__.JDcloudKey === 'checkbox'"
              :JDcloudKey="item.__config__.JDcloudKey"
              @input="input"
              :multiple="item.multiple"
              :defaultValue="parserModel[item.__vModel__]"
              :disabled="item.disabled || !getOperates(item.__vModel__).write"
              :min="item.min"
              :max="item.max"
              :__vModel__="item.__vModel__"
              :options="item.__slot__.options"></kindowCheckbox>
            <!-- 下拉-->
            <kindowSelect
              v-if="item.__config__.JDcloudKey === 'select'"
              :item="item"
              :JDcloudKey="item.__config__.JDcloudKey"
              :dataType="item.__config__.dataType"
              @input="input"
              :propsUrl="item.__config__.propsUrl || null"
              :selectList="item.__config__.selectList || null"
              :multiple="item.multiple"
              :props="item.__config__.props"
              :functionField="item.__config__.functionField"
              :functionId="item.__config__.functionId"
              :linkageQuery="item.__config__.linkageQuery"
              :parserModel="parserModel"
              :defaultValue="parserModel[item.__vModel__]"
              :disabled="item.disabled || !getOperates(item.__vModel__).write"
              :__vModel__="item.__vModel__"
              :options="item.__slot__.options">
            </kindowSelect>

            <!-- -->
            <kindowDatetime
              v-if="
                item.__config__.JDcloudKey === 'time' ||
                item.__config__.JDcloudKey === 'date'
              "
              :__vModel__="item.__vModel__"
              :selectableRange="
                item['picker-options']
                  ? item['picker-options'].selectableRange
                  : ''
              "
              @input="input"
              :readonly="item.readonly"
              :disabled="item.disabled || !getOperates(item.__vModel__).write"
              :clearable="item.clearable"
              :formatter="item.format"
              :type="item.type"
              :defaultValue="parserModel[item.__vModel__]"></kindowDatetime>

            <kindowLine
              v-if="item.__config__.JDcloudKey == 'divider'"
              class="over-width"
              :position="item['content-position']"
              :defaultValue="item.__slot__.default">
            </kindowLine>
            <!-- 富文本S -->
            <kindowEditor
              v-if="item.__config__.JDcloudKey == 'editor'"
              :__vModel__="item.__vModel__"
              :disabled="item.disabled || !getOperates(item.__vModel__).write"
              @input="input"
              :defaultValue="parserModel[item.__vModel__]"></kindowEditor>
            <!-- 富文本E -->
            <kindowGroupTitle
              v-if="item.__config__.JDcloudKey == 'groupTitle'"
              class="over-width"
              :position="item['content-position']"
              :defaultValue="item.content">
            </kindowGroupTitle>
            <kindowText
              v-if="item.__config__.JDcloudKey == 'JDcloudText'"
              class="over-width"
              :defaultValue="item.__config__.defaultValue"
              :textStyle="item.textStyle">
            </kindowText>

            <kindowFile
              v-if="item.__config__.JDcloudKey == 'uploadFz'"
              :__vModel__="item.__vModel__"
              :accept="item.accept"
              :fileSize="item.fileSize"
              :limit="item.limit"
              :label="item.buttonText"
              :defaultValue="parserModel[item.__vModel__]"
              @input="input"></kindowFile>
            <KindowAssociatedData
              @input="input"
              @reRender="reRender"
              :defaultValue="parserModel[item.__vModel__]"
              :parserModel="parserModel"
              v-if="item.__config__.JDcloudKey == 'AssociatedData'"
              :item="item">
            </KindowAssociatedData>
            <kindowUpload
              v-if="item.__config__.JDcloudKey == 'uploadImg'"
              :__vModel__="item.__vModel__"
              :fileSize="item.fileSize"
              :limit="item.limit"
              :disabled="item.disabled || !getOperates(item.__vModel__).write"
              :defaultValue="parserModel[item.__vModel__]"
              @input="input"
              accept="image">
            </kindowUpload>
            <view
              v-if="item.__config__.JDcloudKey == 'signature'"
              @tap="openSignature(item)">
              <view v-if="parserModel[item.__vModel__] != ''">
                <image
                  :src="parserModel[item.__vModel__]"
                  style="width: 300rpx; height: 300rpx">
                </image>
                <view> 点击重签</view>
              </view>
              <view v-else> 点击签字</view>
            </view>

            <!-- 设计子表 -->
            <template v-if="item.__config__.JDcloudKey === 'table'">
              <view style="" class="child-view">
                <view
                  class="child over-width"
                  v-for="(tableItem, tableIndex) in parserModel[
                    item.__vModel__
                  ]"
                  :key="tableIndex">
                  <view class="childtitle">
                    <label class="title-label">
                      {{ item.__config__.label }}-{{ tableIndex + 1 }}
                    </label>
                    <text
                      style="color: #ee3f1c"
                      @tap="removeChildren(item.__vModel__, tableIndex)"
                      v-if="
                        getOperates(item.__vModel__).write &&
                        parserModel[item.__vModel__].length > 1
                      "
                      >删除
                    </text>
                  </view>
                  <view>
                    <childTable
                      :tableIndex="tableIndex"
                      ref="childTable"
                      :item="item.__config__.children"
                      :label-position="labelPosition"
                      :label-width="labelWidth"
                      @addChildren="
                        cList =>
                          addChildrenAnyWhere(
                            item.__vModel__,
                            cList,
                            tableIndex
                          )
                      "
                      :__vModel__="item.__vModel__"
                      :formOperates="
                        formOperates.length &&
                        formOperates.find(o => o.id == item.__vModel__).children
                      "
                      :readonly="readonly"
                      :tableModel="parserModel[item.__vModel__][tableIndex]"
                      :tableRules="childRules"
                      @tableInput="tableInput"
                      :rootModel="parserModel">
                    </childTable>
                  </view>
                </view>
                <!-- 点击添加 -->
                <view
                  class="addbtn"
                  @tap="addChildren(item)"
                  v-if="getTableBtn(item.__vModel__)">
                  {{ item.actionText }}
                </view>
              </view>
            </template>

            <kindowOrganize
              v-if="treeCpn.includes(item.__config__.JDcloudKey)"
              :JDcloudKey="item.__config__.JDcloudKey"
              :disabled="item.disabled || !getOperates(item.__vModel__).write"
              :defaultValue="parserModel[item.__vModel__]"
              :multiple="item.multiple"
              @input="input"
              :__vModel__="item.__vModel__"></kindowOrganize>

            <kindowCumtomTree
              v-if="
                item.__config__.JDcloudKey === 'treeSelect' ||
                item.__config__.JDcloudKey === 'cascader'
              "
              :options="item.options"
              :parentid="item.props.children"
              :props="item.props.props"
              :disabled="item.disabled || !getOperates(item.__vModel__).write"
              :defaultValue="item.__config__.defaultValue"
              @input="input"
              :showAllLevels="item['show-all-levels']"
              :separator="item.separator"
              :__vModel__="item.__vModel__"
              :multiple="item.multiple">
            </kindowCumtomTree>
            <kindowTabs
              v-if="item.__config__.JDcloudKey === 'tabs'"
              :activeData="item"
              ref="kindowTabs"
              :tableModel.sync="parserModel"></kindowTabs>
            <view v-if="item.__vModel__ === 'commonComponent'">
              {{ item.value }}
            </view>
          </u-form-item>
        </template>
      </u--form>
    </view>
  </view>
</template>

<script>
import comInput from "./components/comInput/comInput.vue";
import sysGenerate from "./components/sysGenerate/sysGenerate.vue";
import kindowTextarea from "./components/kindow-textarea/kindow-textarea.vue";
import relationCpn from "./components/relationCpn/relationCpn.vue";
import generateValue from "./components/generateValue/generateValue.vue";
import numberInput from "./components/numberInput/numberInput.vue";
import calculate from "./components/calculate/calculate.vue";
import kindowSwitch from "./components/kindow-switch/kindow-switch.vue";
import kindowRadio from "./components/kindow-radio/kindow-radio.vue";
import kindowCheckbox from "./components/kindow-checkbox/kindow-checkbox.vue";
import kindowSelect from "./components/kindow-select/kindow-select.vue";
import kindowRate from "./components/kindow-rate/kindow-rate.vue";
import kindowSlider from "./components/kindow-slider/kindow-slider.vue";
import childTable from "./components/childTable/childTable.vue";
import kindowDatetime from "./components/kindow-datetime/kindow-datetime.vue";
import kindowLine from "./components/kindow-line/kindow-line.vue";
import kindowGroupTitle from "./components/kindow-groupTitle/kindow-groupTitle.vue";
import kindowText from "./components/kindow-text/kindow-text.vue";
import kindowUpload from "./components/kindow-upload/kindow-upload.vue";
import kindowSignature from "./components/kindow-signature/kindow-signature.vue";
import kindowOrganize from "./components/kindow-organize/kindow-organize.vue";
import kindowCumtomTree from "./components/kindow-cumtomTree/kindow-cumtomTree.vue";
import kindowFile from "./components/kindow-file/kindow-file.vue";
import kindowImage from "./components/kindow-image/kindow-image.vue";
import kindowTabs from "./components/kindow-tabs/kindow-tabs.vue";
import kindowEditor from "./components/kindow-editor/index.vue";
import KindowAssociatedData from "./components/kindow-associatedData/kindow-associatedData.vue";
import { getModelList } from "@/config/api";
import { getAssociationColumn } from "@/utils";
export default {
  components: {
    KindowAssociatedData,
    kindowEditor,
    kindowTabs,
    kindowFile,
    childTable,
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
    kindowImage,
  },
  name: "parser",
  props: {
    //  是否是只读 流程使用
    readonly: {
      type: Boolean,
      default: false,
    },
    //  是否是功能表单
    isFuncForm: {
      type: Boolean,
      default: false,
    },
    labelPosition: {
      default: "left",
    },
    initData: {},
    /* 获取fields数据 */
    fields: {},
    __vModel__: {},
    /* 设置默认大小 */
    labelWidth: {
      default: "160rpx",
    },
    // 权限
    formOperates: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      showParser: true,
      /* form数据 */
      treeCpn: ["comSelect", "depSelect", "userSelect", "posSelect"],
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
      // 不需要的label的
      unLabelCpn: ["divider", "groupTitle", "JDcloudText", "table", "tabs"],
      parserModel: {},
      parserRules: {},
      childRules: {},
      arrData: ["uploadImg", "uploadFz", "checkbox"],
      signatureModel: {
        show: false,
        __vModel__: "",
      },
    };
  },
  // 监听签字组件的显示
  watch: {
    "signatureModel.show": {
      handler(val) {
        this.$emit("changeSignature", val);
      },
    },
  },
  created() {
    this.setModelAndRules();
    if (this.initData && Object.keys(this.initData).length > 0) {
      this.parserModel = this.initData;
    }
  },
  mounted() {
    // 设置规则——>兼容微信小程序
    this.$refs.parserRef.setRules(this.parserRules);
    // this.associateReload();
  },
  methods: {
    formItemLabel(item) {
      const { label, JDcloudKey } = item.__config__;
      return this.unLabelCpn.includes(JDcloudKey) ? "" : label;
    },
    isShowFormItem(item) {
      return !item.__config__.noShow && this.getOperates(item.__vModel__).read;
    },
    // 子表associate组件的showFormField回显，多次请求合并成一次
    async associateReload(__vModel__) {
      const targetParentKey = "table";
      const targetKey = "AssociatedData";
      // 获取所有关联组件的vmodel
      const associatedConfig = this.fields.flatMap(item => {
        const {
          __config__: { JDcloudKey, children = [] },
          __vModel__,
        } = item;
        if (JDcloudKey !== targetParentKey || !children.length) return [];
        return children.flatMap(cpn => {
          const { __config__: cpnConfig, __vModel__: cpnVModel } = cpn;
          const { JDcloudKey: cpnKey } = cpnConfig;
          if (cpnKey !== targetKey) return [];
          const vModel =
            cpnVModel.indexOf(".") > 0
              ? cpnVModel
              : __vModel__ + "." + cpnVModel;
          return { ...cpn, __vModel__: vModel };
        });
      });
      // 如果没有关联组件则不需要回显
      if (!associatedConfig.length) return;

      // 获取关联组件的value值，如果为空则不需要回显，否则需要回显
      const associatedValue = associatedConfig.flatMap(item => {
        const parentVModel = item.__vModel__.split(".")[0];
        const associateVModel = item.__vModel__.split(".")[1];
        const tableDataList = this.parserModel[parentVModel];
        const associatedValue = tableDataList.map(
          item => item[associateVModel]
        );
        // 如果关联组件的值都为空则不需要回显
        if (associatedValue.every(o => !o)) return [];
        item.value = associatedValue;
        return item;
      });
      for (const associated of associatedValue) {
        const { value, __config__ } = associated;
        const { showFormField, functionId, showTableField } = __config__;
        const filter = [
          {
            key: "_id",
            method: "in",
            type: "custom",
            value: value,
          },
        ];
        const result = await getModelList(functionId, { filter });
        const list = result?.data?.list || [];
        const column = await getAssociationColumn(functionId, showTableField);
        const resultList = list.reduce((prev, cur) => {
          const obj = {};
          for (const key of showFormField) {
            obj[key.__vModel__] = cur[key.__vModel__];
          }
          prev.push(obj);
          return prev;
        }, []);
      }
    },
    openSignature(item) {
      if (!this.getOperates(item.__vModel__).write) return;
      this.signatureModel.show = true;
      this.signatureModel.__vModel__ = item.__vModel__;
    },
    //子表按钮权限
    getTableBtn(key) {
      if (!key) {
        return false;
      }
      if (this.readonly) {
        return false;
      }
      if (!this.formOperates || !this.formOperates.length) {
        return true;
      }
      for (var i = 0; i < this.formOperates.length; i++) {
        let item = this.formOperates[i];
        if (item.id === key) {
          var tabBtn = item.children[item.children.length - 1];
          if (tabBtn) {
            return tabBtn.write && tabBtn.read;
          }
        }
      }
    },
    // 获取规则
    getOperates(key) {
      let obj = {
        read: true,
        write: !this.readonly,
      };
      if (!key || !this.formOperates || !this.formOperates.length) return obj;

      for (var i = 0; i < this.formOperates.length; i++) {
        let item = this.formOperates[i];
        if (item.id === key) {
          if (this.readonly) item.write = false;
          return item;
        }
      }
      return obj;
    },
    //给父组件获取数据使用
    async getData(type) {
      // 如果有tabs组件
      if (this.$refs.kindowTabs && this.$refs.kindowTabs.length) {
        for (const item of this.$refs.kindowTabs) {
          const checkResult = await item.handelTriggerRule();
          if (!checkResult) throw new Error("校验失败");
          item.$refs.parserForm.getData();
        }
      }
      // 放入延时队列中
      setTimeout(() => {
        const data = Object.assign({}, this.parserModel);
        // 执行childTable所有的validate方法获取执行结果
        let promiseArr = [];
        if (!this.$refs.childTable || !this.$refs.childTable.length) {
          this.validate(data, type);
          return;
        }

        this.$refs.childTable.forEach(item => {
          promiseArr.push(item.validate());
        });
        Promise.all(promiseArr).then(res => {
          this.validate(data, type);
        });
      }, 0);
    },
    async validate(data, type) {
      try {
        const res = await this.$refs.parserRef.validate();
        this.$emit("getData", data, type);
        return res;
      } catch (e) {
        console.log("e", e);
        return false;
      }
    },
    // 获取输入框的值
    input(k, v) {
      /* 解决Vue无法监听对象属性变化问题 */
      let temp = Object.assign({}, this.parserModel);
      temp[k] = v;
      this.parserModel = temp;
      // let field = this.fields.find(item => item.__vModel__ === k);
      // console.log("input", k, v, this.parserModel, field);
    },
    reRender() {
      this.showParser = false;
      this.loading = true;
      this.$nextTick(() => {
        this.showParser = true;
        setTimeout(() => {
          this.loading = false;
          // this.associateReload();
        }, 500);
      });
    },
    updateParserModel(value) {
      this.parserModel = value;
    },
    // 获取table的值
    tableInput(k, index, v) {
      /* 解决Vue无法监听对象属性变化问题 */
      let temp = Object.assign({}, this.parserModel);
      temp[k][index] = v;
      this.parserModel = temp;
    },
    // 设置model与规则
    generatorRules(fields) {
      const rules = {};
      fields.forEach(item => {
        if (item.__vModel__) {
          /* 设置model与Rules */
          // 设置触发规则的方式
          const trigger = ["blur"];
          rules[item.__vModel__] = [];

          let type = "string";
          if (this.arrData.includes(item.__config__.JDcloudKey)) {
            type = "array";
          }
          if (item.__config__.JDcloudKey === "select" && item.multiple) {
            type = "array";
          }

          if (item.__config__.required) {
            rules[item.__vModel__][0] = {
              type: type,
              required: item.__config__.required,
              message: `请填写${item.__config__.label}`,
              trigger,
            };
          }
          // 如果用户自定义设置了规则
          if (item.__config__.regList && item.__config__.regList.length) {
            item.__config__.regList.map((regItem, index) => {
              if (typeof regItem.pattern == "string") {
                // 去分号
                regItem.pattern = new RegExp(
                  regItem.pattern
                    .substring(1)
                    .substring(0, regItem.pattern.length - 2)
                );
              }
              rules[item.__vModel__][index + 1] = {
                pattern: regItem.pattern,
                message: regItem.message,
                trigger,
              };
            });
          }
        }
      });
      return rules;
    },
    setModelAndRules() {
      this.fields.forEach(item => {
        if (item.__vModel__) {
          if (item.__config__.JDcloudKey === "table") {
            this.parserModel[item.__vModel__] = [];
            const childModel = {};
            item.__config__.children.forEach(child => {
              if (child.__vModel__) {
                childModel[child.__vModel__] = child.__config__.defaultValue
                  ? child.__config__.defaultValue + ""
                  : "";
              }
            });
            this.parserModel[item.__vModel__].push(childModel);
            this.childRules = this.generatorRules(item.__config__.children);
          } else {
            this.parserModel[item.__vModel__] = item.__config__.defaultValue
              ? item.__config__.defaultValue + ""
              : "";
            this.parserRules = this.generatorRules(this.fields);
          }
        }
      });
    },
    /**
     * 添加子表格
     * @param __vModel__ 当前行数据的key
     * @param clist 当前行数据的子级数据
     * @param tableIndex 当前行数据的索引
     */
    addChildrenAnyWhere(__vModel__, clist, tableIndex) {
      this.parserModel[__vModel__].splice(tableIndex, 1, ...clist);
      this.reRender();
      // console.log("addChildrenAnyWhere", arguments, childModel);
    },
    addChildren(fields) {
      const childModel = {};
      fields.__config__.children.forEach(item => {
        if (item.__vModel__) {
          childModel[item.__vModel__] = item.__config__.defaultValue
            ? item.__config__.defaultValue + ""
            : "";
        }
      });
      // 如果不存在则创建空数组
      if (!this.parserModel[fields.__vModel__]) {
        this.parserModel[fields.__vModel__] = [];
      }
      this.parserModel[fields.__vModel__].push(childModel);
      this.$forceUpdate();
    },

    removeChildren(k, index) {
      this.parserModel[k].splice(index, 1);
      this.$forceUpdate();
    },
  },
};
</script>

<style scoped lang="scss">
.parser-form {
  .parser-form-item {
    display: flex;
    background-color: rgb(248, 248, 248);

    .parser-cpn {
      flex: 1;
    }
  }

  .over-width {
    width: 100%;
  }
}

.child {
  width: 100%;
  flex-direction: column;
  display: flex;
}
.child-view {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.childtitle {
  display: flex;
  justify-content: space-between;
  // background-color: #f0f2f6;
}
.title-label {
  font-weight: bold;
  font-size: 30rpx;
}
.addbtn {
  color: #fff;
  background: #407dff;
  width: 80%;
  margin: 15rpx auto;
  font-size: 30rpx;
  padding: 15rpx;
  border-radius: 15rpx;
  text-align: center;
}

.signCpn {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 999;
}
</style>
