<template>
    <view id='box'>
        <u-number-box class='box' disabled color='#ff0000' ref='box' :inputWidth='boxWidth' :min='minValue'
                      v-model='value' @change="(e) => $emit('input', __vModel__, e.value)"
                      :decimalLength='decimalLength'>
        </u-number-box>
    </view>
</template>

<script>
export default {
    name: 'calculate',
    data() {
        return {
            value: this.val >= 0 ? this.val : 0,
            boxWidth: 120,
            minValue: Number.MIN_SAFE_INTEGER
        };
    },
    props: {
        // 子表
        tableIndex: {},
        val: {},
        __vModel__: {},
        // 精度
        decimalLength: {},
        // 表单数据
        dataForm: {
            type: Object,
            required: true
        },
        // 表达式
        expression: {
            type: Array,
            required: true
        }
    },
    methods: {
        mergeNumberOfExps() {
            let expressions = this.expression;
            const res = [];
            const isNumChar = (n) => /^[\d|\.]$/.test(n);
            for (let i = 0; i < expressions.length; i++) {
                if (
                    i > 0 &&
                    isNumChar(expressions[i - 1]) &&
                    isNumChar(expressions[i])
                ) {
                    res[res.length - 1] += expressions[i];
                    continue;
                }
                res.push(expressions[i]);
            }
            return res;
        },
        toRPN(exps) {
            const s1 = []; // 符号栈
            const s2 = []; // 输出栈
            const getTopVal = (stack) =>
                stack.length > 0 ? stack[stack.length - 1] : null;
            const levelCompare = (c1, c2) => {
                const getIndex = (c) => ['+-', '×÷', '()'].findIndex((t) => t.includes(c));
                return getIndex(c1) - getIndex(c2);
            };
            exps.forEach((t) => {
                if (typeof t === 'string' && Number.isNaN(Number(t))) {
                    // 是符号
                    if (t === '(') {
                        s1.push(t);
                    } else if (t === ')') {
                        let popVal;
                        do {
                            popVal = s1.pop();
                            popVal !== '(' && s2.push(popVal);
                        } while (s1.length && popVal !== '(');
                    } else {
                        let topVal = getTopVal(s1);
                        if (!topVal) {
                            // s1 为空 直接push
                            s1.push(t);
                        } else {
                            while (topVal && topVal !== '(' && levelCompare(topVal, t) >= 0) {
                                // 优先级 >= t 弹出到s2
                                s2.push(s1.pop());
                                topVal = getTopVal(s1);
                            }
                            s1.push(t);
                        }
                    }
                    return;
                }
                s2.push(t); // 数字直接入栈
            });
            while (s1.length) {
                s2.push(s1.pop());
            }
            return s2;
        },
        calcRPN(rpnExps) {
            rpnExps = rpnExps.concat([]);
            const calc = (x, y, type) => {
                let a1 = Number(x);
                let a2 = Number(y);
                switch (type) {
                    case '+':
                        return a1 + a2;
                    case '-':
                        return a1 - a2;
                    case '×':
                        return a1 * a2;
                    case '÷':
                        return a1 / a2;
                }
            };
            for (let i = 2; i < rpnExps.length; i++) {
                if ('+-×÷'.includes(rpnExps[i])) {
                    let val = calc(rpnExps[i - 2], rpnExps[i - 1], rpnExps[i]);
                    rpnExps.splice(i - 2, 3, val);
                    i = i - 2;
                }
            }
            return rpnExps[0];
        },
        getVModel(__vModel__) {
            if (!__vModel__) return __vModel__;
            let vModel = __vModel__.split('.');
            vModel = vModel[vModel.length - 1];
            return this.dataForm.hasOwnProperty(vModel) ? vModel : __vModel__;
        },
        calcVal() {

            const temp = this.toRPN(this.mergeNumberOfExps()).map((t) => {
                let vModel = this.getVModel(t.__vModel__);

                // if(t.constructor === String) return t.constructor === String
                return t.constructor === String ?
                    t :
                    this.dataForm[vModel] ?
                        this.dataForm[vModel] :
                        0;
            });

            this.value = this.calcRPN(temp);

            this.$emit('input', this.getVModel(this.__vModel__), this.value);
        }
    },
    watch: {
        dataForm: {
            handler(val, oldVal) {
                let toCalcVal = false;
                let vModel = this.getVModel(this.__vModel__);
                for (let prop in val) {
                    if (val[prop].constructor !== Array && val[prop] != oldVal[prop] && prop != vModel) {
                        toCalcVal = true;
                    }
                    /* if(val[prop].constructor == Array) {

                    } */
                }

                if (val[vModel] != oldVal[vModel]) {
                    return;
                }
                if (toCalcVal) {

                    console.log(this.dataForm, val, oldVal, vModel, this.__vModel__, vModel.indexOf('.') == -1, val[vModel],
                        oldVal[vModel], val[vModel] != oldVal[vModel]);

                    this.calcVal();
                } else {
                    // console.log(this.dataForm,vModel,this.expression)
                    // 是否是监听数组里面的
                    this.expression.forEach(item => {
                        if (item.constructor == Object && this.tableIndex == undefined) {
                            let arr = item.__vModel__.split('.');
                            if (val[arr[0]].constructor == Array) {

                                let vModel = this.getVModel(this.__vModel__);


                                // this.calcVal();
                            }
                        }
                    });
                }


            },
            deep: true,
            immediate: false
        }
    },
    mounted() {
        const query = uni.createSelectorQuery().in(this);


        query
            .select('#box')
            .boundingClientRect((data) => {
                this.boxWidth = data.width - 80;
            })
            .exec();
        // 初始化
        this.$emit('input', this.__vModel__, this.val ? this.val : 0);
    }
};
</script>
<style scoped>
</style>
