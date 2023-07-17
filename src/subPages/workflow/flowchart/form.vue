<template>
  <view>
    <u-subsection
      v-if="!isHideFlow"
      :list="subsectionObj.list"
      :current="subsectionObj.current"
      :customStyle="{ height: '40px' }"
      @change="sectionChange"></u-subsection>

    <view v-if="subsectionObj.current === 0">
      <view class="approval_status" v-if="status !== 0">
        <image :src="approvalStatusSrc" mode="widthFix"></image>
      </view>
    </view>
    <!--    动态表单S    -->
    <view
      v-if="parserObj.filedList.length"
      :class="subsectionObj.current === 0 ? 'show' : 'no-show'">
      <parser
        @changeSignature="changeSignature"
        :initData="parserObj.initData"
        :fields="parserObj.filedList"
        @getData="getData"
        :readonly="readOnly"
        ref="parserForm"
        :formOperates="parserObj.formOperates"
        labelWidth="200rpx">
      </parser>
    </view>

    <!--    动态表单E   -->
    <!-- 流程信息S   -->
    <view v-if="subsectionObj.current === 1" class="example-body">
      <u-steps :current="active" activeColor="#339AFF" direction="column">
        <u-steps-item
          v-for="(item, index) in nodeList"
          :title="item.title"
          :key="index"
          iconSize="27"
          :desc="item.content"></u-steps-item>
      </u-steps>
    </view>

    <!-- 流转信息 -->
    <view v-if="subsectionObj.current === 2 && beflows.operstate !== 'add'">
      <view class="uni-timeline">
        <view v-for="(item, index) in record" :key="index">
          <view
            class="uni-timeline-item"
            :class="index == 0 ? 'uni-timeline-first-item' : ''"
            v-if="item.type === 'start'">
            <view class="uni-timeline-item-divider"></view>
            <view class="uni-timeline-item-content">
              <view class="color-3A3A3A">发起人员：{{ getRecordUserName(item) }}</view>
              <view class="datetime">
                发起时间：{{ $u.timeFormat(item.createTime, "yyyy-mm-dd hh:MM") }}
              </view>
            </view>
          </view>
          <view class="uni-timeline-item" v-else-if="item.handleStatus == 3">
            <view class="uni-timeline-item-divider"></view>
            <view class="uni-timeline-item-content">
              <view class="color-3A3A3A">撤回人员：{{ item.F_HandleId }}</view>
              <view class="datetime">撤回时间：{{ item.F_HandleTime }}</view>
              <view class="color-9A9A9A">撤回节点：{{ item.F_NodeName }}</view>
              <view class="color-9A9A9A timeline-handleOpinion">
                撤回原因：{{ item.F_HandleOpinion != null ? item.F_HandleOpinion : "" }}
              </view>
            </view>
          </view>
          <view class="uni-timeline-item" v-else-if="item.handleStatus == 4">
            <view class="uni-timeline-item-divider"></view>
            <view class="uni-timeline-item-content">
              <view class="color-3A3A3A">终止人员：{{ item.F_HandleId }}</view>
              <view class="datetime">终止时间：{{ item.F_HandleTime }}</view>
              <view class="color-9A9A9A timeline-handleOpinion">
                终止原因：{{ item.F_HandleOpinion != null ? item.F_HandleOpinion : "" }}
              </view>
            </view>
          </view>
          <view
            class="uni-timeline-item"
            v-else-if="item.handleStatus == 0 || item.handleStatus == 1">
            <view class="uni-timeline-item-divider"></view>
            <view class="uni-timeline-item-content">
              <view class="color-3A3A3A">审核人员：{{ getRecordUserName(item) }}</view>
              <view class="datetime">
                审核时间：{{ $u.timeFormat(item.createTime, "yyyy-mm-dd hh:MM") }}
              </view>
              <view class="color-9A9A9A">审核节点：{{ item.nodeId }}</view>
              <view class="color-9A9A9A">
                审核状态：
                <text :class="item.handleStatus ? 'text-success' : 'text-danger'">
                  {{ item.handleStatus ? "同意" : "拒绝" }}
                </text>
              </view>
              <view class="color-9A9A9A timeline-handleOpinion"> 审核意见： </view>
              <view
                class="flex-column"
                v-for="(opinion, oindex) in getHandleOpinion(item.handleMap)"
                :key="oindex">
                <view class="color-9A9A9A margin-right-20 timeline-handleOpinion">
                  【{{ opinion.userName }}】：{{ opinion.handleOpinion }}
                </view>
                <view class="margin-left-15 color-9A9A9A timeline-handleOpinion handleOpinion-time">
                  {{ $u.timeFormat(item.createTime, "yyyy-mm-dd hh:MM") }}
                </view>
              </view>
            </view>
          </view>
          <view v-else class="uni-timeline-item">
            <view class="uni-timeline-item-divider"></view>
            <view class="uni-timeline-item-content">
              <view class="color-3A3A3A">审核人员：{{ getRecordUserName(item) }}</view>
              <view class="color-9A9A9A"> 审核状态：处理中 </view>
            </view>
          </view>
        </view>
        <view
          class="uni-timeline-item uni-timeline-last-item"
          v-if="flowTaskInfo.F_Completion == 100">
          <view class="uni-timeline-item-divider"></view>
          <view class="uni-timeline-item-content">
            <view class="color-3A3A3A">节点名称：{{ flowTaskInfo.F_ThisStep }}</view>
            <view class="datetime">结束时间：{{ flowTaskInfo.F_EndTime }}</view>
          </view>
        </view>
      </view>
    </view>
    <!-- 流程信息E  -->
    <!-- 底部按钮S-->
    <view v-if="isStatus && !isHideFlow" class="buttom-box">
      <view
        v-if="status === 0 || status === 'add' || status === 3 || status === 4"
        class="flow-button">
        <!--                <button class='btn-same btn-keep' @tap='save'>
                                    保存
                                </button>-->
        <button class="btn-same btn-keep" @tap="back">返回</button>
        <!--        <button class="btn-same btn-submit" @tap="submit" hover-class="com-hover-btn">
          重新提交
        </button>-->
      </view>

      <view v-else-if="status === 1 && type !== 'audit'" class="flow-button">
        <button class="btn-same btn-keep" @tap="back">返回</button>
        <!--        <button class="btn-danger btn-same reAlready" @tap="$u.throttle(withdraw, 500)">-->
        <!--          撤回-->
        <!--        </button>-->
        <!--        <button class="btn-urging btn-same reAlready" @tap="$u.throttle(urging, 500)">催办</button>-->
      </view>

      <view v-else-if="type === 'audit' && status === 1" class="flow-button">
        <button
          class="btn-keep btn-same"
          @tap="
            $refs.parserForm.getData();
            refuseObj.show = true;
          ">
          拒绝
        </button>
        <button
          class="btn-submit btn-same"
          @tap="
            $refs.parserForm.getData();
            agreeObj.show = true;
          ">
          通过
        </button>
        <!--        <button class="btn-transfer btn-same" @tap="transfer">转办</button>-->
      </view>
      <view v-else class="flow-button">
        <button class="btn-same btn-keep" @tap="back">返回</button>
      </view>
    </view>
    <!-- 底部按钮E-->
    <!-- 撤回输入框S-->
    <u-modal
      :show="withdrawObj.show"
      title="提示"
      showCancelButton
      @cancel="withdrawObj.show = false"
      @confirm="withdraw">
      <u--textarea
        v-model="withdrawObj.params.handleOpinion"
        maxlength="200"
        count
        placeholder="输入原因"></u--textarea>
    </u-modal>
    <!-- 撤回输入框E-->

    <!-- 拒绝输入框S-->
    <u-modal
      :show="refuseObj.show"
      title="提示"
      showCancelButton
      @cancel="refuseObj.show = false"
      @confirm="refuse">
      <u--textarea
        v-model="refuseObj.params.handleOpinion"
        maxlength="200"
        count
        placeholder="输入原因"></u--textarea>
    </u-modal>
    <!-- 拒绝输入框E-->

    <!-- 同意输入框S-->
    <u-modal
      :show="agreeObj.show"
      title="提示"
      showCancelButton
      @cancel="agreeObj.show = false"
      @confirm="agree">
      <u--textarea
        v-model="agreeObj.params.handleOpinion"
        maxlength="200"
        count
        placeholder="输入原因(选填)"></u--textarea>
    </u-modal>
    <!-- 拒绝输入框E-->
    <tki-tree
      ref="tree"
      :range="userTreelist"
      :multiple="false"
      :selectParent="false"
      rangeKey="fullName"
      @confirm="transferConfirm"></tki-tree>
  </view>
</template>

<script>
import parser from "@/components/parser/parser.vue";

import tkiTree from "@/components/parser/components/tki-tree/tki-tree.vue";
import {
  getFlowBeforeInfo,
  postFlowLaunch,
  postFlowLaunches,
  postFlowRecall,
  postFlowReject,
  updateFlowTask,
  getFlowEngine,
  getFlowTask,
  postFlowTask,
  postAgree,
  postFlowTransfer,
} from "../api/work";
import helper from "@/common/helper";
import { getFlowFormRecode, userAuditAgree, userAuditReject } from "@/api/mongoApi/work";
import { getHashTable } from "@/utils";

export default {
  components: {
    parser,
    tkiTree,
  },
  data() {
    return {
      // 同意输入框
      agreeObj: {
        show: false,
        params: {
          handleOpinion: "",
        },
      },
      // 拒绝输入框
      refuseObj: {
        show: false,
        params: {
          handleOpinion: "",
        },
      },
      withdrawObj: {
        show: false,
        params: {
          handleOpinion: "",
        },
      },
      flowId: "",
      // 标题
      title: "",
      formData: {},
      // 流转信息
      record: [],
      flowTaskInfo: {
        F_Completion: 0,
        F_EndTime: "",
        F_ThisStep: "",
      },
      freeApprover: 0,
      // 流程节点信息
      nodeList: [],
      // 当前流程节点
      // 是否隐藏tab
      isHideFlow: false,
      // 状态图片 等待审核、审核通过、审核驳回、审核撤回、审核终止
      approvalStatusMap: [
        "https://kindoucloud.com:8011/api/file/Image/systemicon/traffic/20221214_c80ee37c4d3040edb248d0f882aa7b07.png",
        "https://kindoucloud.com:8011/api/file/Image/systemicon/traffic/20221214_edb5e41ee80641fa9bc71faacdaf7376.png",
        "https://kindoucloud.com:8011/api/file/Image/systemicon/traffic/20221214_5d5ea428054d44b18ba6fff756398343.png",
        "https://kindoucloud.com:8011/api/file/Image/systemicon/traffic/20221214_2e74bd3185e74b4480f7c78f1e0e2d2a.png",
        "https://kindoucloud.com:8011/api/file/Image/systemicon/traffic/20221214_b25df3ea5f944cf383e51ef74ba734f1.png",
      ],
      statusType: "",
      status: "",
      flowTaskId: "",
      beflows: {
        operstate: "",
        processId: "",
      },
      parserObj: {
        initData: {},
        formOperates: [],
        filedList: [], //主表list
      },
      subsectionObj: {
        current: 0,
        list: ["表单信息", "流程信息", "流转记录"],
      },
      flowCode: "",
      transferId: "",
      flowTaskOperatorList: [],
      userTreelist: [],
      submitLoading: false,
      operatorRecordId: "",
      thisStepId: "",
      // 存放用户信息、部门信息、角色信息等
      hashTable: {},
      type: "",
    };
  },
  computed: {
    active() {
      if (this.thisStepId === "end") return this.nodeList.length;
      return this.nodeList.findIndex(({ nodeId }) => nodeId === this.thisStepId) || 0;
    },
    approvalStatusSrc() {
      return this.approvalStatusMap[this.status - 1];
    },
    readOnly() {
      return this.type === "start" || this.type === "alreadybacklog"
    },

    /*flowfromId: function () {
      return this.$store.state.workflow.flowfromId;
    },*/
    isStatus() {
      return this.statusType !== "alreadybacklog" && this.statusType !== "copyme";
    },
  },
  async onLoad({ id, fullName, operatorRecordId, type }) {
    this.type = type;
    this.hashTable = await getHashTable();
    console.log(arguments);
    this.flowId = id;
    this.operatorRecordId = operatorRecordId;
    uni.setNavigationBarTitle({
      title: fullName,
    });
    this.getFlowTaskInfo();
  },
  methods: {
    getHandleOpinion(handleMap) {
      let opinion = [];
      for (const item of handleMap) {
        const { creatorUser } = item;
        opinion.push({ ...item[creatorUser.id], userName: creatorUser.fullName });
      }
      console.log("opinion", opinion);
      return opinion;
    },
    getRecordUserName(item) {
      console.log("item", item);
      return item.type === "start"
        ? item.creatorUser.fullName
        : item.handleMap.map(({ creatorUser }) => creatorUser?.fullName || "").join("、");
    },
    async getFlowTaskInfo() {
      const params = {
        flowId: this.flowId,
        operatorRecordId: this.operatorRecordId,
        type: this.type,
      };
      const result = await getFlowFormRecode(params);
      const { formData, formOperates, task, flowNodes } = result.data;
      const { taskData, thisStepId, taskOperatorRecord, creatorUserId } = task;
      this.parserObj.filedList = JSON.parse(formData).fields;
      this.parserObj.formOperates = formOperates;
      this.parserObj.initData = JSON.parse(taskData);
      this.nodeList = flowNodes;
      this.thisStepId = thisStepId;
      // 流转记录
      this.record = taskOperatorRecord.map((item, index) => {
        if (item.type === "start") {
          item.creatorUser = this.hashTable.userTree[creatorUserId];
          return item;
        }
        item.handleMap.forEach(o => {
          const userId = Object.keys(o)[0];
          o.creatorUser = this.hashTable.userTree[userId];
        });
        return item;
      });
      // 审核状态
      this.status = task.status;
      console.log("getFlowTaskInfo", result, this.record);
    },
    transferConfirm(e) {
      console.log(e);
      postFlowTransfer(this.flowTaskOperatorList[0].id, {
        freeApproverUserId: e[0].id,
      }).then(res => {
        uni.showToast({
          title: "转办成功",
          icon: "none",
        });
        setTimeout(() => {
          this.removeStorage();
          uni.navigateBack();
        }, 1000);
      });
    },
    transfer() {
      this.$refs.tree._show();
    },
    async agree() {
      const { code, msg } = await userAuditAgree(
        {
          operatorRecordId: this.operatorRecordId,
          flowId: this.flowId,
        },
        {
          handleOpinion: this.agreeObj.params.handleOpinion,
          formData: JSON.stringify(this.formData),
        }
      );

      this.$u.toast(msg);
      if (code === 200) setTimeout(() => uni.navigateBack(), 800);
    },
    async refuse() {
      const { operatorRecordId, flowId } = this;
      const { handleOpinion } = this.refuseObj.params;
      if (!handleOpinion) return this.$u.toast("请填写审核意见");
      const { code, msg } = await userAuditReject(
        {
          operatorRecordId,
          flowId,
        },
        {
          handleOpinion: handleOpinion,
          formData: JSON.stringify(this.formData),
        }
      );

      this.$u.toast(msg);
      if (code === 200) setTimeout(() => uni.navigateBack(), 800);
    },
    save() {
      let datas = {
        status: 1,
        flowId: this.flowId,
        data: JSON.stringify(this.formData),
      };

      if (this.flowTaskId !== "") {
        datas = {
          status: 1,
          flowId: this.flowId,
          data: JSON.stringify(this.formData),
          id: this.flowTaskId,
        };
      }
      // console.log(this.formData)
      for (let key in this.requiredList) {
        if (this.formData[key] === undefined) {
          this.$u.toast(this.requiredList[key] + "为必填");
          return;
        }
      }
      postFlowTask(datas).then(res => {
        console.log(res);
        this.$u.toast(res.msg);
        if (this.beflows.operstate === "add") {
          this.removeStorage();
          uni.redirectTo({
            url: "/subPages/work/started/started",
          });
        } else {
          this.removeStorage();
          uni.navigateBack();
        }
      });
    },
    submit() {
      /*let params = {
                status: 0,
                flowId: this.flowId,
                id: this.flowTaskId,
                data: JSON.stringify(this.formData)
            };
            updateFlowTask(params).then(res => {
                console.log(res);
                this.$u.toast(res.msg);
                this.removeStorage();
                uni.navigateBack();
            });*/
      if (!this.submitLoading) {
        this.$refs.parserForm.getData("submit");
        this.submitLoading = true;
        return;
      }
      let formData = Object.assign({}, this.formData);
      // 如果是 formData 中包含 data:image/png;base64,开头的字符串，那么就是图片，清空
      for (let key in formData) {
        if (formData[key].startsWith("data:image/png;base64,")) {
          formData[key] = "";
        }
      }
      let flowFormList = uni.getStorageSync(this.$cache + "_flowFormList");
      // 查找id 为flowId的数据
      const item = flowFormList.find(item => item.F_Id === this.flowId);
      let url = `/subPages/user/dynamic-form/dynamic-form?F_FullName=${item.F_FullName}&F_Id=${
        this.flowId
      }&type=engine&initData=${JSON.stringify(formData)}`;
      uni.redirectTo({
        url: url,
      });
    },
    /* 清除缓存 */
    removeStorage() {
      /* 删除缓存 */
      uni.removeStorageSync("item");
      uni.removeStorageSync("index");
      uni.removeStorageSync("rangData");
      uni.removeStorageSync("rangeIndex");
      uni.removeStorageSync("startedTitle");
      uni.removeStorageSync("F_FullName");
      uni.removeStorageSync("F_Category");
      uni.removeStorageSync("type");
      uni.removeStorageSync("F_Status");
      uni.removeStorageSync("obj");
      uni.removeStorageSync("_filedList");
    },
    // 撤回
    async withdraw() {
      // if (this.status === "reAlready") {
      //   //审核撤回
      //   postFlowRecall(this.flowfromId).then(res => {
      //     this.$u.toast(res.data.msg);
      //     uni.redirectTo({
      //       url: "/subPages/work/backlog/backlog",
      //     });
      //   });
      //   uni.navigateTo({
      //     url: "/subPages/work/operate/auditopinion/auditopinion?opinion=撤回",
      //   });
      // } else {
      //   //发起撤回
      //   if (this.withdrawObj.show) {
      //     postFlowLaunches(this.flowfromId, this.withdrawObj.params).then(res => {
      //       this.$u.toast(res.msg);
      //       uni.navigateBack();
      //     });
      //     return;
      //   }
      //   this.withdrawObj.show = true;
      // }
    },
    // 催办
    urging() {
      //     是否确认催办
      uni.showModal({
        title: "提示",
        content: "是否确认催办",
        success: res => {
          if (res.confirm) {
            postFlowLaunch(this.flowfromId).then(({ msg }) =>
              uni.showToast({
                title: msg,
                icon: "none",
              })
            );
          }
        },
      });
    },
    changeSignature(val) {
      //   如果签字组件显示，则隐藏tab与底部按钮
      this.isHideFlow = val;
    },
    back() {
      uni.navigateBack();
    },
    async init(id) {
      if (this.beflows.operstate === "info") {
        let taskRes = await getFlowTask(this.flowTaskId);

        this.parserObj.initData = JSON.parse(taskRes.data.data);
        console.log("init", JSON.parse(taskRes.data.data));
        this.formData = JSON.parse(taskRes.data.data);
        this.flowId = taskRes.data.flowId;
        if (this.statusType === "alreadybacklog" || this.status !== 0) {
          let flowBeforeInfo = await getFlowBeforeInfo(this.beflows.processId);
          console.log("flowBeforeInfo", flowBeforeInfo);
          this.parserObj.filedList = JSON.parse(flowBeforeInfo.data.flowFormInfo);
          this.parserObj.formOperates = JSON.parse(flowBeforeInfo.data.formOperates);
          const flowTaskInfo = flowBeforeInfo.data.flowTaskInfo;
          this.flowTaskOperatorList = flowBeforeInfo.data.flowTaskOperatorList;
          this.flowCode = flowTaskInfo.flowCode;
          this.flowTaskInfo.F_Completion = flowTaskInfo.completion;
          this.flowTaskInfo.F_EndTime = helper.toDate(flowTaskInfo.endTime, "yyyy-MM-dd hh:mm");
          this.flowTaskInfo.F_ThisStep = flowTaskInfo.thisStep;
          this.freeApprover = flowBeforeInfo.data.freeApprover;
          // 审核图片
          this.approvalStatusSrc = this.approvalStatusMap[flowTaskInfo.status - 1];
          // 流程节点信息S
          let flowTaskNodeList = flowBeforeInfo.data.flowTaskNodeList;

          if (flowTaskInfo.completion === 100) {
            flowTaskNodeList[flowTaskNodeList.length - 1].completion = 1;
          }
          for (let i = 0; i < flowTaskNodeList.length; i++) {
            if (flowTaskNodeList[i].type !== "-1") {
              this.nodeList.push({
                title: flowTaskNodeList[i].nodeName,
                userName: flowTaskNodeList[i].userName,
              });
            }
            if (flowTaskNodeList[i].completion === 1) {
              this.active++;
            }
          }
          // 流程节点信息E

          // 流转记录S
          const _data = flowBeforeInfo.data.flowTaskOperatorRecordList;
          for (var i = 0; i < _data.length; i++) {
            if (_data[i].F_HandleStatus == 2) {
              this.record.push({
                F_HandleTime: helper.toDate(_data[i].handleTime, "yyyy-MM-dd hh:mm"), //审核时间
                F_HandleId: _data[i].userName, //审核人员
                F_HandleStatus: _data[i].handleStatus,
              });
            } else if (_data[i].F_HandleStatus == 3) {
              this.record.push({
                F_NodeName: _data[i].nodeName, //撤回节点
                F_HandleTime: helper.toDate(_data[i].handleTime, "yyyy-MM-dd hh:mm"), //撤回时间
                F_HandleId: _data[i].userName, //撤回人员
                F_HandleOpinion: _data[i].handleOpinion, //撤回原因
                F_HandleStatus: _data[i].handleStatus,
              });
            } else if (_data[i].F_HandleStatus == 4) {
              this.record.push({
                F_HandleTime: helper.toDate(_data[i].handleTime, "yyyy-MM-dd hh:mm"), //终止时间
                F_HandleId: _data[i].userName, //终止人员
                F_HandleOpinion: _data[i].handleOpinion, //终止原因
                F_HandleStatus: _data[i].handleStatus,
              });
            } else {
              this.record.push({
                F_NodeName: _data[i].nodeName, //审核节点
                F_HandleTime: helper.toDate(_data[i].handleTime, "yyyy-MM-dd hh:mm"), //审核时间
                F_HandleId: _data[i].userName, //审核人员
                F_HandleOpinion: _data[i].handleOpinion, //审核意见
                HandleStatus: this.flowStatus(_data[i].handleStatus), //审核状态
                F_HandleStatus: _data[i].handleStatus,
              });
            }
          }
          // 流转记录E
        }
      } else {
        await getFlowEngine(id).then(res => {
          let initData = res.data.formData;
          let flowTemplateJson = JSON.parse(res.data.flowTemplateJson);
          //表单权限字段formOperates
          this.parserObj.formOperates = flowTemplateJson.properties.formOperates;
          initData = JSON.parse(initData);
          this.parserObj.filedList = initData;
        });
      }
    },
    getData(data, func) {
      console.log(data);
      this.formData = data;
      if (func) {
        //  执行 方法名为func的方法
        this[func](data);
      }
    },
    flowStatus(value) {
      let state;
      switch (value) {
        case 1:
          state = {
            text: "同意",
            statecss: "text-success",
          };
          break;
        default:
          state = {
            text: "拒绝",
            statecss: "text-danger",
          };
          break;
      }
      return state;
    },
    sectionChange(index) {
      this.subsectionObj.current = index;
    },
  },
};
</script>

<style scoped>
.approval_status {
  position: absolute;
  top: 0;
  right: 0;
  border: 0;
  margin: 100rpx 30rpx;
  opacity: 0.7;
  z-index: 9;
}

.approval_status image {
  width: 200rpx;
  height: 200rpx;
}

.btn-same {
  width: 50%;
  height: 100%;
  font-size: 34rpx;
  border-radius: 0;
  /* font-weight: 550; */
}

.btn-same::after {
  content: none;
}
.handleOpinion-time {
  font-size: 24rpx;
}
.example-body {
  padding: 25rpx;
}

.reAlready {
  width: 100% !important;
}
.no-show {
  position: absolute;
  opacity: 0;
}

.show {
  position: static !important;
  opacity: 1 !important;
}
</style>
