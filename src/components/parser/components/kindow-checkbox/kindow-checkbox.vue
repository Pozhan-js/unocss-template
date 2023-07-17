<template>
    <view>
        <view @click='showPick'>{{ data }}</view>
        <ba-tree-picker ref='treePicker' :multiple='true' :localdata='options' textKey='fullName' valueKey='id'
                        :title='title' @select-change='selectChange' />
    </view>
</template>

<script>
import baTreePicker from '../ba-tree-picker/ba-tree-picker.vue';

export default {
    components: {
        baTreePicker
    },
    name: 'kindow-checkbox',
    props: {
        defaultValue: {},
        disabled: {},
        max: {},
        min: {},
        __vModel__: {
            type: String,
            required: true
        },
        options: {
            type: Array,
            required: true
        },
        title: {
            type: String,
            default: '请选择'
        },
        JDcloudKey: {}
    },
    data() {
        return {
            data: '请选择数据'
        };
    },
    mounted() {
        // 处理默认值
        if (this.defaultValue && this.defaultValue.length) {
            let arr = [];
            this.defaultValue.forEach(id => {
                this.options.forEach(item => {
                    if (item.id === id) {
                        arr.push(item);
                    }
                });
            });
            this.data = '';
            for (var i = 0; i < arr.length; i++) {
                this.data += (i + 1 == arr.length ? arr[i].fullName : arr[i].fullName + ' / ');
            }
        }
    },
    methods: {
        //监听选择
        selectChange(ids, text) {


            if (this.min && ids.length < this.min) {
                this.$u.toast(`至少选${this.min}个`);
                this.$refs.treePicker._initTree();
                return;
            }
            if (this.max && ids.length > this.max) {
                this.$u.toast(`最多可选${this.max}个`);
                this.$refs.treePicker._initTree();
                return;
            }

            if (ids.length == 0) return;
            this.data = text;
            // 如果是单选的话

            if (!this.multiple && this.JDcloudKey != 'checkbox') {
                ids = ids.toString();
            }
            this.$emit('input', this.__vModel__, ids);
        },
        // 显示选择器
        showPick() {
            if (this.disabled) return;
            this.$refs.treePicker._show();
        }
    }
};
</script>

<style>
</style>
