<template>
  <view class='label'>
    <view @click='showPick'
          class='label flex-ai'>
      <view class='flex-1'>{{ data }}</view>
      
      <view @click.stop='clearData'
            v-if='data!=="请选择数据" && !disabled'>
        <u-icon name='close-circle-fill'
                color='#c6c7cb'
                size='18'></u-icon>
      </view>
    </view>
    <tki-tree ref="treePicker"
              :multiple="multiple?multiple:false"
              :range="options"
              rangeKey="fullName"
              idKey="id"
              :title="title"
              @confirm="selectChange"
              childrenKey="children"
              :selectParent="false" />
  </view>

</template>

<script>
import { getOrganizeTree, getTreeView, getTreeUserView } from '@/config/api.js';

import tkiTree from '../tki-tree/tki-tree.vue';
export default {
    components: {
        tkiTree
    },
    name: '',
    data() {
        return {
            data: '请选择数据',
            options: []
        };
    },
    props: {
        JDcloudKey: {},
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
        console.log('mounted',this.disabled);
        switch (this.JDcloudKey) {
            case 'comSelect':
                getOrganizeTree().then(res => {
                    this.options = res.data.list;
                    if (this.defaultValue) {
                        this.getDeaultData(this.options);
                    }
                });
                break;
            case 'depSelect':
                getTreeView().then(res => {
                    this.options = res.data.list;
                    if (this.defaultValue) {
                        this.getDeaultData(this.options);
                    }
                });
                break;
            case 'userSelect':
                getTreeUserView().then(res => {
                    this.options = res.data.list;
                    if (this.defaultValue) {
                        this.getDeaultData(this.options);
                    }
                });
                break;
        }
    },
    methods: {
        clearData() {
            if (this.disabled) return;
            this.data = '请选择数据';
            this.$emit('input', this.__vModel__, '');
            this.$refs.treePicker._reTreeList();
        },
        getDeaultData(options) {
            if (!this.defaultValue) return;
            let defaultArr = this.defaultValue.split(',');
            let arr = [];
            options.forEach(item => {
                defaultArr.forEach(defaultItem => {
                    if (item.id === defaultItem) {
                        arr.push(item.fullName);
                    }
                });
                if (item.hasChildren) {
                    this.getDeaultData(item.children);
                }
            });
            if (arr.length) {
                this.data = this.data == '请选择数据' ? arr.toString() : this.data + ',' + arr.toString();
            }
        },
        //监听选择
        selectChange(list) {
            let ids = [];
            let text = [];
            list.forEach(item => {
                text.push(item.fullName);
                ids.push(item.id);
            });

            this.data = text.toString();
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
.label {
    width: 100%;
}
</style>
