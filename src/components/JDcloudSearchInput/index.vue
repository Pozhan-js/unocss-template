<template>
  <view class="search-input" :class="border ? '' : 'search-input__no-border'">
    <view v-if="label" class="search-input__label" :style="labelStyle">
      <text>{{label}}</text>
    </view>
    <view class="search-input__input-box">
      <input class="search-input__input" type="text" :placeholder="placeholder"
             placeholder-class="search-input__input-plac" v-model="inputVal" :cursor-spacing="235"
             @input="onInput" @focus="onFocus" @blur="onBlur" />

			 <u-icon :name="showSelector?'arrow-up':'arrow-down'" 
			 @click="toggleSelector" size="14" color="#999"></u-icon>
      
    </view>
    <view class="search-input__selector" v-show="showSelector">
      <view class="uni-popper__arrow"></view>
      <scroll-view scroll-y="true" class="search-input__selector-scroll">
        <view class="search-input__selector-empty" v-if="filterCandidatesLength === 0">
          <text>{{emptyTips}}</text>
        </view>
        <view class="search-input__selector-item" v-for="(item,index) in filterCandidates"
              :key="index" @click="onSelectorClick(item)">
          <text
                :style="item[valueName] == selectValue?'font-weight: bold;background-color: '+selectedBackground+';color: '+selectedColor:''">{{item[keyName]}}</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
/**
 * search-input 组件
 * @description 组合输入框一般用于既可以输入也可以选择的场景
 * @property {String} label 左侧文字
 * @property {String} labelWidth 左侧内容宽度
 * @property {String} placeholder 输入框占位符
 * @property {Array} candidates 候选项列表
 * @property {String} emptyTips 筛选结果为空时显示的文字
 * @property {String} value 组合框的值
 * @property {String} selectedBackground 选中项背景颜色
 * @property {String} selectedColor 选中项文字颜色
 */
export default {
    name: 'search-input',
    emits: ['input', 'update:modelValue'],
    props: {
        keyName: {
            type: String
		},
		valueName: {
			type: String
		},
        selectedBackground: {
            type: String,
            default: '#f5f7fa'
        },
        selectedColor: {
            type: String,
            default: '#409eff'
        },
        border: {
            type: Boolean,
            default: true
        },
        label: {
            type: String,
            default: ''
        },
        labelWidth: {
            type: String,
            default: 'auto'
        },
        placeholder: {
            type: String,
            default: ''
        },
        candidates: {
            type: Array,
            default() {
                return [];
            }
        },
        emptyTips: {
            type: String,
            default: '无匹配项'
        },
        // #ifndef VUE3
        value: {
            type: [String, Number],
            default: ''
        },
        // #endif
        // #ifdef VUE3
        modelValue: {
            type: [String, Number],
            default: ''
        }
        // #endif
    },
    data() {
        return {
            isInput: false,
            showSelector: false,
            inputVal: '',
            isDeleteSeletor: true,
			timer: null,
			selectValue: ''
        };
    },
    computed: {
        labelStyle() {
            if (this.labelWidth === 'auto') {
                return '';
            }
            return `width: ${this.labelWidth}`;
        },
		filterCandidates() {
            if (this.inputVal) {
				return this.candidates.filter(item => {
                    return item[this.keyName].toString().indexOf(this.inputVal) > -1;
                });
			} else {
                return this.candidates
            }
        },
        filterCandidatesLength() {
            return this.filterCandidates.length;
        }
    },
    watch: {
        // #ifndef VUE3
        value: {
            handler(newVal) {
                this.inputVal = newVal;
				this.isInput = true;
				if(!newVal) this.selectValue = ''
				
            },
            immediate: true
        },
        // #endif
        // #ifdef VUE3
        modelValue: {
            handler(newVal) {
                this.inputVal = newVal;
                this.isInput = true;
            },
            immediate: true
        }
        // #endif
    },
    methods: {
        toggleSelector() {
            this.showSelector = !this.showSelector
            this.isInput = false;
        },
		onFocus() {
            // if (this.inputVal) {
            //     this.showSelector = true;
            // }
            this.showSelector = true
            this.isInput = false
        },
        hide() {
            this.showSelector = false;
        },
        onBlur() {
            setTimeout(() => {
                this.isInput = false;
            }, 153);
        },
        onSelectorClick(item) {
			this.inputVal = item[this.keyName];
			this.selectValue = item[this.valueName];
            this.showSelector = false;
            this.$emit('input', this.inputVal);
            this.$emit('update:modelValue', this.selectValue);
        },
        onInput() {
            if (this.inputVal) {
                this.showSelector = true;
			}
			if(!this.inputVal) this.selectValue = ''
            setTimeout(() => {
                this.$emit('input', this.inputVal);
                this.$emit('update:modelValue', this.inputVal);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.search-input {
    font-size: 14px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    position: relative;
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    // height: 40px;
    flex-direction: row;
    align-items: center;
    // border-bottom: solid 1px #DDDDDD;
}

.search-input__label {
    font-size: 16px;
    line-height: 22px;
    padding-right: 10px;
    color: #999999;
}

.search-input__input-box {
    position: relative;
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex: 1;
    flex-direction: row;
    align-items: center;
}

.search-input__input {
    flex: 1;
    font-size: 14px;
    height: 22px;
    line-height: 22px;
}

.search-input__input-plac {
    font-size: 14px;
    color: #999;
}

.search-input__selector {
	z-index: 999999;
    /* #ifndef APP-NVUE */
    box-sizing: border-box;
    /* #endif */
    position: absolute;
    top: calc(100% + 12px);
    left: 0;
    width: 100%;
    background-color: #ffffff;
    border: 1px solid #ebeef5;
    border-radius: 6px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 4px 0;
}

.search-input__selector-scroll {
    /* #ifndef APP-NVUE */
    max-height: 200px;
    box-sizing: border-box;
    /* #endif */
}

.search-input__selector-empty,
.search-input__selector-item {
    /* #ifndef APP-NVUE */
    display: flex;
    cursor: pointer;
    /* #endif */
    line-height: 36px;
    font-size: 14px;
    text-align: center;
	z-index: 99999999;
    // border-bottom: solid 1px #DDDDDD;
    padding: 0px 0px;
}

.search-input__selector-empty text,
.search-input__selector-item text {
    width: 100%;
}

.search-input__selector-item:hover {
    background-color: #f9f9f9;
}

.search-input__selector-empty:last-child,
.search-input__selector-item:last-child {
    /* #ifndef APP-NVUE */
    border-bottom: none;
    /* #endif */
}

// picker 弹出层通用的指示小三角
.uni-popper__arrow,
.uni-popper__arrow::after {
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    border-width: 6px;
}

.uni-popper__arrow {
    filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
    top: -6px;
    left: 10%;
    margin-right: 3px;
    border-top-width: 0;
    border-bottom-color: #ebeef5;
}

.uni-popper__arrow::after {
    content: ' ';
    top: 1px;
    margin-left: -6px;
    border-top-width: 0;
    border-bottom-color: #fff;
}

.search-input__no-border {
    border: none;
}
</style>
