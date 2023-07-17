<template>
  <view>
    <view @click="show = !disabled && !readonly">

      <u-input v-model="data"
               :disabled="disabled"
               :readonly="true"
               :clearable="clearable"></u-input>
    </view>
    <u-datetime-picker ref="datetimePicker"
                       v-model="datetimeVal"
                       :show="show"
                       :mode="type?type:'time'"
                       @cancel="show = false"
                       @confirm="confirm">
    </u-datetime-picker>
  </view>
</template>

<script>
export default {
    name: '',
    data() {
        return {
            show: false,
            datetimeVal: '',
            data: ''
        };
    },
    props: {
        __vModel__: {},
        formatter: {},
        type: {},
        defaultValue: {},
        disabled: {},
        readonly: {},
        selectableRange: {},
        clearable: {}
    },
    created() {
        console.log(this.defaultValue);
        if(typeof this.defaultValue === 'number') {
            this.$emit('input',this.__vModel__, this.defaultValue + '');
        }
        if (this.defaultValue && this.type) {
            // 判断defaultValue是否是时间戳
            if (isNaN(Number(this.defaultValue))) {
                this.data = this.defaultValue;
            } else {
                this.datetimeVal = this.setDateMatter(new Date(this.defaultValue * 1));
                this.data = this.datetimeVal;
            }

            return;
        }
        // type为空则为时间选择器
        if (this.defaultValue && !this.type) {
            this.data = this.defaultValue;
        }

        // 无默认值情况
        if (!this.defaultValue) {
            this.datetimeVal = this.setDateMatter(new Date());
        }
    },
    methods: {
        confirm(e) {
            console.log('confirm', e);
            if (this.type) {
                this.datetimeVal = this.setDateMatter(new Date(e.value));
                this.data = this.datetimeVal;
            } else {
                if (this.selectableRange) {
                    let selectableRangeArr = this.selectableRange.split('-');

                    if (e.value + ':00' < selectableRangeArr[0] || e.value + ':00' > selectableRangeArr[1]) {
                        uni.$u.toast(`时间范围限制在${this.selectableRange}之间`);
                        return;
                    }
                }

                this.data = this.formatTime(e.value);

                this.$emit('input', this.__vModel__, e.value + '');
                this.show = false;
                return
            }
            // 如果不是时间戳则转换为时间戳
            if (isNaN(Number(e.value)) && this.type) {
                e.value = new Date(e.value).getTime();
            }
            this.$emit('input', this.__vModel__, e.value + '');
            this.show = false;
        },
        formatTime(time, formatter = this.formatter) {
            switch (formatter) {
                case 'HH:mm:ss':
                    return time + ':00';
                case 'HH:mm':
                    return time;
                case 'HH':
                    return time.substring(0, 2);
                case 'mm':
                    return time.substring(3);
                case 'ss':
                    return '00';
                case 'mm:ss':
                    return time.substring(3) + ':00';
            }
        },
        setDateMatter(date, format = this.formatter) {
            var o = {
                'M+': date.getMonth() + 1, //month

                'd+': date.getDate(), //day

                'H+': date.getHours(), //hour

                'm+': date.getMinutes(), //minute

                's+': date.getSeconds(), //second

                'q+': Math.floor((date.getMonth() + 3) / 3), //quarter

                S: date.getMilliseconds() //millisecond
            };

            if (/(y+)/.test(format))
                format = format.replace(
                    RegExp.$1,

                    (date.getFullYear() + '').substr(4 - RegExp.$1.length)
                );

            for (var k in o)
                if (new RegExp('(' + k + ')').test(format))
                    format = format.replace(
                        RegExp.$1,

                        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
                    );
            return format;
        }
    }
};
</script>
<style scoped>
</style>
