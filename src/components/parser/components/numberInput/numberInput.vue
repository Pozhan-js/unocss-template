<template>
    <view id='box'>
        <u-number-box
            ref='box'
            :inputWidth='boxWidth'
            :min='minValue'
            :max='maxValue'
            :disabled='disabled'
            v-model='boxValue'
            @change='change'
            @blur='blur'
            :decimalLength='precision'
            :step='step'
            @focus='asyncChange=true'
            :asyncChange='asyncChange'>
        </u-number-box>
    </view>
</template>

<script>
export default {
    name: 'numberInput',
    data() {
        return {
            // 是否开启异步改变
            asyncChange: false,
            boxValue: Number(this.val) >= 0 ? Number(this.val) : 0,
            minValue: this.min,
            maxValue: this.max,
            boxWidth: 120
        };
    },
    props: {
        val: {
            default: Number.MIN_SAFE_INTEGER
        },
        __vModel__: {},
        max: {
            default: Number.MAX_SAFE_INTEGER
        },
        min: {
            default: Number.MIN_SAFE_INTEGER
        },
        precision: {
            default: 0
        },
        disabled: {
            type: Boolean,
            default: false
        },
        step: {
            default: 1
        }
    },
    methods: {
        blur(e) {
            if (!this.asyncChange) return;
            let value = e.value;
            // 保留小数位,如果小数点大于精度,则截取精度位
            if (value.indexOf('.') > -1) {
                let decimalLength = value.split('.')[1].length;
                if (decimalLength > this.precision) {
                    value = Number(value).toFixed(this.precision);
                }
            }
            // 关闭异步改变
            this.asyncChange = false;
            this.boxValue = value;
            this.change({ value });
        },
        change(e) {
            if (this.asyncChange) return;
            this.$emit('input', this.__vModel__, e.value);

        }
    },
    mounted() {
        this.$refs.box.setValue(this.boxValue);
        // 初始化
        if (this.min === null || this.min == undefined) {
            this.minValue = Number.MIN_SAFE_INTEGER;
        }
        if (this.max === null || this.max == undefined) {
            this.maxValue = Number.MAX_SAFE_INTEGER;
        }
        const query = uni.createSelectorQuery().in(this);
        query
            .select('#box')
            .boundingClientRect((data) => {
                this.boxWidth = data.width - 80;
            })
            .exec();
        this.$emit("input", this.__vModel__,this.boxValue);
    }
};
</script>
<style scoped>
</style>
