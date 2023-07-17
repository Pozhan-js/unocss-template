<template>
  <view class="main-size form-app">
    <view class="loading-page-app" v-if="loadingPage">
      <u-loading-page
        loading-text="全力加载中..."
        :loading="loadingPage"></u-loading-page>
    </view>
    <parser
      :initData="getInitData()"
      :fields="parserData.fields"
      @getData="getData"
      v-if="parserData.fields.length && !this.loadingPage"
      ref="parserForm"
      labelPosition="top"
      labelWidth="500rpx"
      :formOperates="formOperates">
    </parser>
    <view style="height: 120rpx"></view>

    <view class="bottom-btn flex-ai flex-sb">
      <view class="save flex-center flex-1" @click="back">取消</view>
      <view class="submit flex-center flex-1" @click="save">提交</view>
    </view>
    <!-- 分享按钮Start 默认不显示 -->
    <view class="share-fixed" @click="openSharePop" v-if="showShareBtn">
      <image
        style="width: 100%; height: 100%"
        src="https://kindoucloud.com:8011/api/file/Image/systemicon/ycj/20221121_77c561f6f46f4cdca8fadf6be19a3116.png">
      </image>
    </view>
    <!-- 分享按钮END -->

    <u-safe-bottom></u-safe-bottom>
    <u-popup
      :show="shareObj.show"
      @close="shareObj.show = false"
      mode="center"
      round="10"
      closeable>
      <view style="width: 700rpx" class="flex-center flex-column">
        <view class="share-title">分享应用</view>
        <view v-if="showShareBtn">
          <uqrcode
            @complete="qrComplete"
            :hide="true"
            ref="uqrcode"
            type="2d"
            canvas-id="qrcode"
            :options="shareObj.options"
            :size="400"
            sizeUnit="rpx"
            :value="shareObj.value">
          </uqrcode>
        </view>
        <view class="">
          <image
            style="width: 400rpx; height: 400rpx; margin: 20rpx"
            :src="shareObj.qrData">
          </image>
        </view>
        <!-- #ifndef H5 -->
        <view class="save-qrcode" @click="saveQrCode">保存二维码</view>
        <!-- #endif -->
      </view>
    </u-popup>
  </view>
</template>

<script>
import parser from "@/components/parser/parser.vue";
import uqrcode from "@/components/u-qrcode/components/u-qrcode/u-qrcode.vue";
import {
  createModel,
  getFlowEngine,
  getModelList,
  updateModel,
} from "@/config/api.js";
// 导入globalName
import globName from "@/common/globalName.js";
import { getFormConfig } from "@/api/mongoApi/form";

import { getFullNameByIdAndTree, getPermission } from "@/utils";
import { flowStart } from "@/api/mongoApi/work";
export default {
  components: {
    parser,
    uqrcode,
  },
  data() {
    return {
      formOperates: [],
      loadingPage: true,
      showShareBtn: false,
      shareObj: {
        qrData: "",
        //是否等待打开中
        loadingShow: false,
        show: false,
        value: ``,
        options: {
          margin: "20",
          foregroundImageSrc: globName.APP_ICON,
        },
      },
      dialogText: "",
      messageId: "",
      dataForm: {
        id: "",
        data: "",
      },
      initData: {},
      hideInitdata: false,
      modelId: "",
      f_id: "",
      parserData: {
        fields: [],
      },
      // 默认功能,可选流程[func,engine]
      type: "func",
      requestLoading: false,
      rowId: "",
      reLoadParams: {},
    };
  },
  async onLoad(e) {
    if (e?.reLoadParams) {
      this.reLoadParams = JSON.parse(e.reLoadParams);
    }
    uni.setNavigationBarTitle({
      title: decodeURIComponent(e.fullName),
    });
    this.modelId = e.modelId;
    this.rowId = e.rowId;
    if (e.type === "engine") {
      this.type = e.type;
      await this.doGetFlowEngine();
    } else {
      await this.init();
    }
    await this.addSystemFiled();
    const shareObj = {
      modelId: e.modelId,
      endTime: 0,
      name: e.fullName,
      type: this.type,
    };

    // 二维码
    this.showShareBtn = true;
    this.shareObj.value = `https://kindoucloud.com:8018/${
      this.$config.Global.tenantId
    }?obj=${JSON.stringify(shareObj)}`;
    console.log(
      "this.shareObj.value",
      this.shareObj.value,
      this.$u.timeFormat(shareObj.endTime, "yyyy年mm月dd日 hh时MM分ss秒")
    );

    /*this.hasShareAuth().then(data => {
            const shareObj = {
                id: e.F_Id,
                endTime: data.f_effectivetime != 0 ? globName.SHARE_TIME(Number(data.f_effectivetime)) : 0,
                name: e.F_FullName,
                type: e.type
            };

            // 二维码
            this.showShareBtn = e.showShareBtn;
            this.shareObj.value = `https://kindoucloud.com:8018/${this.$config.Global.tenantId}?obj=${JSON.stringify(shareObj)}`;
            console.log('this.shareObj.value', this.shareObj.value, this.$u.timeFormat(shareObj.endTime, 'yyyy年mm月dd日 hh时MM分ss秒'));
        });*/
  },
  methods: {
    getInitData() {
      // initData || reLoadParams
      if (Object.keys(this.initData).length) {
        return this.initData;
      }
      console.log("this.reLoadParams", this.reLoadParams, this.initData);
      if (Object.keys(this.reLoadParams).length) {
        return this.reLoadParams;
      }
      return {};
    },
    // 添加系统字段
    async addSystemFiled() {
      const USER_TREE = "userTree";
      const USER_TYPE = "UserId";

      if (!Object.keys(this.initData).length) return;

      const { SYSTEM_COMPONENTS_CONFIG } = this.$constants;

      const hasField = (
        await Promise.all(
          SYSTEM_COMPONENTS_CONFIG.map(async item => {
            const { __config__ } = item;
            const { JDcloudKey } = __config__;
            let value = this.initData[JDcloudKey];

            if (!value) return null;

            if (JDcloudKey.indexOf(USER_TYPE) !== -1 && value) {
              value = await getFullNameByIdAndTree(USER_TREE, value);
            } else if (value) {
              value = this.$u.timeFormat(value, "yyyy-mm-dd hh:MM");
            }

            return { ...item, value };
          })
        )
      ).filter(item => item !== null);
      this.parserData.fields = [...this.parserData.fields, ...hasField];
    },
    /**
     * 是否有分享权限
     * @returns {Promise<unknown>}
     */
    /*hasShareAuth() {
            return new Promise((resolve, reject) => {
                // 后台请求地址
                const funcUrl = '7ff90d37a82c4085960568d1017e19dd';

                getPublicModelList(funcUrl, {
                    json: { f_functionid: this.f_id }
                }).then(res => {
                    if (!res.data.list.length) return reject('暂无分享权限');
                    const data = res.data.list[0];
                    const roleList = uni.getStorageSync(config.Global.cache + '_RoleList');
                    const userRoleName = uni.getStorageSync(config.Global.cache + '_UserProvider').roleName.split(',');
                    roleList.forEach(item => {
                        if (userRoleName.indexOf(item.fullName) >-1 && data.f_inviteadmin.indexOf(item.id) > -1) {
                            this.showShareBtn = true;
                        }
                    });
                    resolve(data);
                });
            });

        },*/
    openSharePop() {
      // 如果正在等待打开中
      if (this.shareObj.loadingShow) return;

      // 如果已经绘制完成
      if (this.shareObj.qrData) {
        this.shareObj.show = true;
        return;
      }
      uni.showLoading({
        title: "二维码加载中",
      });
      this.shareObj.loadingShow = true;
    },
    // 绘制完成
    qrComplete(e) {
      console.log("qrComplete", e);
      this.$refs.uqrcode.toTempFilePath({
        success: res => {
          this.shareObj.qrData = res.tempFilePath;

          if (this.shareObj.loadingShow) {
            uni.hideLoading();
            this.shareObj.loadingShow = false;
            this.shareObj.show = true;
          }
        },
      });
    },
    saveQrCode() {
      uni.saveImageToPhotosAlbum({
        filePath: this.shareObj.qrData,
        success: res => {
          uni.showToast({
            title: "保存成功",
            icon: "success",
          });
          console.log(res);
        },
        fail: err => {
          if (err.errMsg == "saveImageToPhotosAlbum:fail auth deny") {
            uni.$u.toast("请您允许保存图片权限");
          }
          console.log(err);
        },
      });
    },
    back(time = 0) {
      if (time) {
        setTimeout(() => {
          uni.navigateBack({
            delta: 1,
          });
        }, time);
        return;
      }
      uni.navigateBack({
        delta: 1,
      });
    },
    save() {
      if (this.hideInitdata && Object.keys(this.initData).length) {
        uni.showToast({
          title: "您已经投过了，结果将在截止后公示",
          icon: "error",
        });
        return;
      }
      this.$refs.parserForm.getData();
    },
    async getData(data, type) {
      console.log("getData", data, type);
      // 如果已经在请求中
      if (this.requestLoading) return;
      this.requestLoading = true;
      const list = [
        "creatorTime",
        "creatorUserId",
        "lastModifyTime",
        "lastModifyUserId",
      ];

      list.forEach(item => delete data[item]);
      const requestMap = {
        func: {
          create: () => createModel(this.modelId, data, data._id),
          update: () =>
            updateModel(this.modelId, { data: JSON.stringify(data) }, data._id),
        },
        engine: {
          create: () => flowStart(this.modelId, data),
          update: () =>
            updateModel(this.modelId, { data: JSON.stringify(data) }, data._id),
        },
      };
      const requestType = Object.keys(this.initData).length
        ? "update"
        : "create";

      const { code, msg } = await requestMap[this.type][requestType]();
      if (code !== 200) {
        this.requestLoading = false;
        uni.showToast({
          title: msg || "提交失败",
          icon: "error",
        });
        return;
      }
      this.$u.toast(msg || "提交成功");
      this.back(800);
      console.log("code", code);
    },

    async doGetFlowEngine() {
      console.log("doGetFlowEngine", this.modelId);
      const { data } = await getFormConfig(this.modelId);
      this.parserData = this.filterField(JSON.parse(data.formData));
      this.$nextTick(() => (this.loadingPage = false));
    },
    filterField(formData) {
      // 过滤掉没有权限的字段，保留一些特殊的组件
      const allowShowCpn = this.$constants.ALLOW_SHOW_COMPONENTS;
      const { column } = getPermission(this.modelId, "module");
      formData.fields = formData.fields.filter(({ __vModel__, __config__ }) => {
        const { JDcloudKey } = __config__;
        return column.some(
          ({ enCode }) =>
            enCode === __vModel__ || allowShowCpn.includes(JDcloudKey)
        );
      });
      return formData;
    },
    async init() {
      const { data } = await getFormConfig(this.modelId);
      // 过滤掉没有权限的字段
      this.parserData = this.filterField(JSON.parse(data.formData));
      // 如果是编辑，则获取数据
      if (this.rowId) {
        const { data } = await getModelList(this.modelId, {
          filter: [
            {
              key: "_id",
              method: "eq",
              type: "custom",
              value: [this.rowId],
            },
          ],
        });
        this.initData = data.list[0];
      }
      this.$nextTick(() => (this.loadingPage = false));
    },
  },
};
</script>

<style scoped lang="scss">
.bottom-btn {
  z-index: 10;
  background-color: #fff;
  width: 100%;
  position: fixed;
  bottom: 0;
  border-top: 1rpx solid #eee;
  height: 100rpx;
  padding: 0;
  padding-bottom: 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.save {
  background-color: #fff;
  height: 100rpx;
  font-size: 39rpx;
}

.submit {
  height: 100rpx;
  background: #4b8af8;
  color: #fff;
  font-size: 39rpx;
}

.share-fixed {
  position: fixed;
  bottom: 30%;
  right: 0;
  width: 90rpx;
  height: 90rpx;
  background-color: #80a7f5;
  padding: 10rpx;
  border-radius: 50%;
  z-index: 10;
}

.share-title {
  font-weight: bold;
  margin-top: 50rpx;
  font-size: 32rpx;
  text-align: center;
}

.save-qrcode {
  background-color: #4b8af8;
  width: 70%;
  margin: 20rpx auto;
  padding: 20rpx;
  border-radius: 50rpx;
  text-align: center;
  color: #fff;
  font-size: 30rpx;
}
</style>
