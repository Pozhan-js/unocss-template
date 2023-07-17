<template>
  <view>
    <view class='flex-ai'>
      <span class='title'>{{ columnsData.__config__.label }}：</span>

      <view v-if="columnsData.__config__.JDcloudKey ==='editor'" class="editor">
        <u-parse :content="columnsData.value"></u-parse>
      </view>
      <span v-else class='value'>{{ getFormatValue }}</span>
    </view>
  </view>
</template>

<script>
/**
 * formList 组件的列组件
 */

export default {
    name: 'index',
    props: {
        columnsData: {
            type: Object,
            default: () => {}
        },
        hashTable: {
            //父组件hash表
            type: Object,
            default: () => {
            }
        }
    },
    data() {
        return {
            // 用户组件
            userComponents: ['lastModifyUserId', 'creatorUserId', 'userSelect'],
            timeComponents: ['date', 'creatorTime', 'lastModifyTime'],
            // 图片组件
            imgComponents: ['uploadImg', 'seal']
        };
    },
    computed: {
        /**
         * 根据 treeName 返回对应的 fullName 函数
         * @returns {Function} - 返回一个函数，参数为 treeName，返回 fullName
         */
        // 返回一个函数，用于获取树节点的全名
        getFullName() {
            return (treeName) => {
                // 从 hashTable 中获取对应的树节点
                const tree = this.hashTable[treeName];
                // 将传入的列数据的 value 属性按照逗号分隔为数组
                const ids = this.columnsData.value.split(',');
                // 使用 reduce 方法遍历 ids 数组，获取每个 id 对应的树节点的全名，并将非空的全名保存在 fullNameArr 数组中
                const fullNameArr = ids.reduce((acc, id) => {
                    // 从树中获取对应的树节点数据
                    const data = tree[id];
                    // 如果树节点不存在，则不添加到 fullNameArr 数组中
                    if (!data) return acc;
                    // 获取fullName，若 fullName 为空，则不添加到 fullNameArr 数组中
                    const fullName = data.fullName || '';
                    if (fullName) acc.push(fullName);
                    return acc;
                }, []);
                // 将 fullNameArr 数组中的元素用逗号连接成一个字符串，并返回
                return fullNameArr.filter(Boolean).join(',');
            };
        },
        //  获取格式化后的值
        getFormatValue() {
            const { __config__, __vModel__, value, format = 'yyyy-mm-dd hh:MM' } = this.columnsData;
            const { JDcloudKey } = __config__;
            // 时间组件
            if (this.timeComponents.includes(JDcloudKey) && format) {
                if(isNaN(Number(value))) return value;
                return this.$u.timeFormat(value, format.replace(/mm|MM/, 'mm'));
            }
            if (this.userComponents.includes(JDcloudKey)) {
                return this.getFullName('userTree');
            }

            return value;
        }
    },

    mounted() {
        // console.log('columnsData', this.columnsData);
    },
};
</script>

<style scoped>
.title {
    font-size: 28rpx;
    font-weight: 600;
    color: #252b50;
    min-width: 200rpx;
}

.value {
    font-size: 28rpx;
    color: #9296af;
    margin-left: 40rpx;
}
.editor {
    margin-left: 40rpx;
    width: 150rpx;
    white-space: nowrap;
    overflow: hidden;
}
</style>
