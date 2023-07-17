<template>
  <view class='label'>
    <view @click='showPick'
          class='label flex-ai'>
      <view class='flex-1'>{{ data }}</view>
      
      <view @click.stop='clearData'
            v-if='data!=="请选择数据" && !this.disabled'>
        <u-icon name='close-circle-fill'
                color='#c6c7cb'
                size='18'></u-icon>
      </view>
    </view>
    <tki-tree ref='treePicker'
              :multiple='multiple?multiple:false'
              :range='options'
              :rangeKey='props.label'
              :idKey='props.value'
              :title='title'
              @confirm='selectChange'
              :childrenKey="props.children ||''"
              :selectParent='false' />
  </view>
</template>

<script>
import tkiTree from '../tki-tree/tki-tree.vue';

export default {
    name: 'kindow-cumtomTree',
    components: {
        tkiTree
    },
    data() {
        return {
            data: '请选择数据'
        };
    },
    props: {
        // 回显
        val: '',
        separator: {},
        showAllLevels: {},
        options: {},
        parentid: {},
        props: {},
        disabled: {},
        // 默认值
        defaultValue: {},
        __vModel__: {},
        multiple: {},

        title: {
            type: String,
            default: '请选择'
        }
    },
    mounted() {
        this.getDeaultData(this.options);
    },
    methods: {
        clearData() {
            this.data = '请选择数据';
            this.$emit('input', this.__vModel__, '');
            this.$refs.treePicker._reTreeList();
        },
        getDeaultData(options) {
            if (!this.val && !this.defaultValue) return;

            let value = this.val || this.defaultValue;
            let defaultArr = value.split(',');
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
                let label = '';
                if (this.showAllLevels && this.separator && item.parents && item.parents.length) {
                    item.parents.map(parentItem => {
                        label += parentItem[this.props.label] + this.separator;
                    });
                }
                label += item[this.props.label];
                text.push(label);
                ids.push(item[this.props.value]);
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
