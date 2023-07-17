<template>
    <view>
        <view @click='showPick'>{{ data }}</view>
        <ba-tree-picker ref='treePicker' :multiple='multiple?multiple:false' :localdata='options' textKey='fullName'
                        valueKey='id'
                        :title='title' @select-change='selectChange' childrenKey='children' :selectParent='false' />
    </view>
</template>

<script>
import {
    getTreeView
} from '@/config/api.js';

import baTreePicker from '../ba-tree-picker/ba-tree-picker.vue';

export default {
    components: {
        baTreePicker
    },
    name: 'kindow-department',
    data() {
        return {
            data: '请选择数据',
            options: []
        };
    },
    props: {
        defaultValue: {},
        multiple: {},
        disabled: {},
        __vModel__: {
            type: String,
            required: true
        },
        title: {
            type: String,
            default: '请选择'
        }
    },
    mounted() {

        getTreeView().then(res => {

            this.options = res.data.list;
            this.$refs.treePicker._initTree();
            // this.changeTreeChildren(this.options)
        });
    },
    methods: {
        changeTreeChildren(options) {
            options.forEach(item => {
                if (item.type === 'company' && !item.children) {
                    item.children = [{}];
                }
                if (item.type === 'company' && item.children.length) {
                    this.changeTreeChildren(item.children);
                }
            });

        },
        //监听选择
        selectChange(ids, text) {

            if (ids.length == 0) return;
            this.data = text;
            this.$emit('input', this.__vModel__, ids.toString());
        },
        // 显示选择器
        showPick() {
            if (this.disabled) return;
            this.$refs.treePicker._show();
        }
    }
};
</script>
<style scoped>

</style>
