<template>
    <view>
        <!--   常用应用S   -->
        <!--      <view class='common-app' v-if='!isFuncAll'>
                  <view class='title margin-bottom-20'>
                      常用应用
                  </view>
                  <u-grid :border='false' col='4'>
                      <u-grid-item class='grid'>
                          <u-icon
                              :customStyle="{paddingTop:20+'rpx'}"
                              name='star'
                              :size='22'></u-icon>
                          <text class='normal-text clamp-1'>测试</text>
                          <view class='checkbox'>
                              <u-checkbox-group>
                                  <u-checkbox size='12' shape='circle'></u-checkbox>
                              </u-checkbox-group>
                          </view>
                      </u-grid-item>
                  </u-grid>
              </view>-->
        <!--   常用应用E   -->

        <!--   应用列表S   -->
        <view class='app-list' v-for='(app, index) in appList' :key='index'>
            <view class='flex-sb margin-bottom-20'>
                <view class='title'>
                    {{ app.fullName }}
                </view>
                <view class='num'>({{ app.children.length || 0 }})</view>
            </view>
            <u-grid :border='false' col='4' class='grid'>
                <u-grid-item @click='handleAppClick(children, listIndex)' v-for='(children, listIndex) in app.children'
                    :key='listIndex'>
                    <view class='flex-center' :style="{ background: item.background || '#008cff' }"
                        style='width: 100rpx; height: 100rpx; border-radius: 50%;'>
                        <i :class='children.icon' style='font-size:60rpx; color: #ffffff'></i>
                    </view>
                    <text class='normal-text clamp-1 margin-top-10'>{{ children.fullName }}</text>
                </u-grid-item>
            </u-grid>
        </view>
        <!--   应用列表E   -->
    </view>
</template>

<script>
import config from '@/common/config.js';
import { getStorage } from '@/common/config';
import Mixin from '../../utils/mixin';
import helper from '@/common/helper';

export default {
    mixins: [Mixin],
    data() {
        return {
            isFuncAll: false,
            baseUrl: config.Global.baseUrl.apiUrl,
            appList: [],
            applyMenu: [],
            isData: false
        };
    },
    watch: {
        appList: {
            handler: function (val, oldVal) {
                this.$emit('change', val, oldVal);
            },
            deep: true
        }
    },
    async mounted() {
        const pages = getCurrentPages();
        const e = pages[pages.length - 1].options || {};
        this.isFuncAll = e.type === 'all';
        let title = this.isFuncAll ? '全部应用' : '编辑常用应用';
        // 设置标题
        uni.setNavigationBarTitle({ title });
        // 刷新菜单列表
        await helper.setStoreCurrentDataInfo();
        // 获取菜单列表
        this.appList = getStorage('_MenuList')

    },
    methods: {
        /* 添加应用 */
        handleAppClick(e, index) {
            console.log('e', e);
            if (this.isFuncAll) return this.mixinFlowForm(e);

        },

        /* 删除应用 */
        removeflow(e, index) {

        }
    },
};
</script>

<style scoped lang='scss'>
page {
    background-color: #f0f2f6;
}

.title {
    font-size: 32rpx;
    color: #333333;
    margin-left: 15rpx;
    position: relative;
    font-weight: bold;

    &:before {
        width: 6rpx;
        height: 32rpx;
        position: absolute;
        left: -15rpx;
        top: 15rpx;
        content: '';
        display: inline-block;
        background-color: #3a8ee6;
    }
}

.normal-text {
    font-size: 24rpx;
}

.common-app {
    padding: 20rpx;
}

.grid {
    position: relative;
}

.checkbox {
    position: absolute;
    top: 0;
    right: 0;
}

.app-list {
    padding: 0 20rpx;
    padding-bottom: 0;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);


}
</style>
