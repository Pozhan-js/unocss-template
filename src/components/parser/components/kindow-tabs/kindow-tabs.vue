<template>
  <view class='tabs-app'>
    <u-subsection :list='activeData.__slot__.editableTabs' keyName='title' :current='currentIndex'
                  @change='sectionChange'>
    </u-subsection>

    <parser :initData='initData' :fields='fields' ref='parserForm' @getData='getData'
            labelPosition='top' labelWidth='500rpx'>
    </parser>

  </view>
</template>

<script>
import Parser from '../../parser.vue';

export default {
    name: 'kindow-tabs',
    components: { Parser },
    props: {
        activeData: {
            type: Object,
            default: () => {}
        },
        tableModel: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            currentIndex: 0,
            initData: JSON.parse(JSON.stringify(this.tableModel))
        };
    },
    computed: {
        fields() {
            const { activeData, currentIndex } = this;
            const {
                __slot__: { editableTabs, tabsData }
            } = activeData;
            const { value } = editableTabs[currentIndex];
            return tabsData[value];
        }
    },
    mounted() {
        console.log('kindow-tabs mounted', this.activeData);
    },
    methods: {
        getData(data) {
            if (!data || !Object.keys(data).length) return;

            const { activeData } = this;
            const {
                __slot__: { tabsData }
            } = activeData;

            const tabsVModelList = Object.keys(tabsData).reduce((prev, next) => {
                prev.push(...tabsData[next].map(item => item.__vModel__));
                return prev;
            }, []);

            // 只修改在tabs中的字段
            const newData = this.tableModel;
            for (const key of tabsVModelList) {
                if (data.hasOwnProperty(key)) {
                    newData[key] = data[key];
                }
            }
            this.$emit('update:tableModel', newData);
        },

        // 手动校验
         handelTriggerRule() {
            return new Promise((resolve, reject) => {
                this.$refs.parserForm.getData();
                setTimeout(() => {
                    const { activeData, tableModel } = this;
                    const { __slot__ } = activeData;
                    const { tabsData, editableTabs } = __slot__;
                    console.log('tableModel', tableModel);
                    // 标签
                    outerLoop: for (const keyName of Object.keys(tabsData)) {
                        const tabArray = tabsData[keyName];

                        for (const item of tabArray) {
                            const { __vModel__, __config__ } = item;
                            const { regList = [], required, label, JDcloudKey, children = [] } = __config__;
                            const tabName = editableTabs.find(item => item.value === keyName).title;
                            const index = editableTabs.findIndex(item => item.value === keyName);
                            // 如果是设计字表的话，需要遍历子表
                            for (const child of children) {
                                const { __vModel__: vModel, __config__: config } = child;
                                // 如果是必填项，且有一个子表中的字段没有填写，则提示
                                // 获取子表的数据的长度，如果有一个子表中的数据长度不等于子表的长度，则提示
                                const childrenTable = this.$refs.parserForm.$refs.childTable;
                                console.log("childrenTable", childrenTable);
                                if(!childrenTable) continue;
                                const hasEvery = !tableModel[__vModel__] || tableModel[__vModel__].flatMap(item => item[vModel] || []).length != childrenTable.length;
                                if (config.required && hasEvery) {
                                    uni.$u.toast(`请填写${tabName}中的${config.label}`);
                                    this.currentIndex = index;
                                    reject(false);
                                    break outerLoop;
                                }
                                // 如果有正则校验，则校验
                                const configRegList = config.regList || [];
                                for (const { pattern, message } of configRegList) {
                                    if(!tableModel[__vModel__]) continue;
                                    const regex = new RegExp(pattern.slice(1, -1)); // 去掉字符串开始和结束的斜杠
                                    const regexList = tableModel[__vModel__].flatMap(item => item[vModel] || []);
                                    for (const item of regexList) {
                                        if (!regex.test(item)) {
                                            uni.$u.toast(`${tabName}中,${message}`);
                                            this.currentIndex = index;
                                            reject(false);
                                            break outerLoop;
                                        }
                                    }
                                }
                            }
                            // 主表的校验
                            if (required && !tableModel[__vModel__] && tableModel[__vModel__] !== 0) {
                                uni.$u.toast(`请填写${tabName}中的${label}`);
                                this.currentIndex = index;
                                reject(false);
                                break outerLoop;
                            }
                            // 如果有正则校验，则校验
                            for (const { pattern, message } of regList) {
                                const regex = new RegExp(pattern.slice(1, -1)); // 去掉字符串开始和结束的斜杠
                                if (!regex.test(tableModel[__vModel__])) {
                                    uni.$u.toast(`${tabName}中,${message}`);
                                    this.currentIndex = index;
                                    reject(false);
                                    break outerLoop;
                                }
                            }
                        }
                    }
                    resolve(true);
                });
            });
        },
        sectionChange(index) {
            if (index === this.currentIndex) return;
            this.currentIndex = index;
        }
    }
};
</script>

<style scoped lang='scss'>
.tabs-app {
    background: #fff;
    border: 1rpx solid #dcdfe6;
    box-shadow: 0 4rpx 8rpx 0 rgba(0, 0, 0, 0.12), 0 0 12rpx 0 rgba(0, 0, 0, 0.04);
}
</style>
