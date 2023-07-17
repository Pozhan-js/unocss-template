<template xlang="wxml">
	<view class="tki-tree">
		<view class="tki-tree-mask" :class="{'show':showTree}" @tap="_cancel"></view>
		<view class="tki-tree-cnt" :class="{'show':showTree}">
			<view class="tki-tree-bar">
				<view class="tki-tree-bar-cancel" :style="{'color':cancelColor}" hover-class="hover-c" @tap="_cancel">取消</view>
				<!-- <view class="filterBox" style="border: 1px solid #999999; padding: 10rpx 30rpx 10rpx 50rpx; border-radius: 50rpx;">
					<input type="text" placeholder="筛选输入" v-model="filterText">
				</view> -->
				<view class="tki-tree-bar-confirm" :style="{'color':confirmColor}" hover-class="hover-c" @tap="_confirm">确定</view>
			</view>
			<view class="tki-tree-view">
				<scroll-view class="tki-tree-view-sc" :scroll-y="true">
					<block v-for="(item, index) in treeList" :key="index">
						<view class="tki-tree-item" :style="[{
							paddingLeft: item.rank*15 + 'px',
							zIndex: item.rank*-1 +50
						}]"
						 :class="{
							border: border === true,
							show: item.show,
							last: item.lastRank,
							showchild: item.showChild,
							open: item.open,
						}">
							<view class="tki-tree-label" @tap.stop="_treeItemTap(item, index)">
								<image class="tki-tree-icon" :src="item.lastRank ? lastIcon : item.showChild ? currentIcon : defaultIcon"></image>
								{{item.name}}
							</view>
							<view class="tki-tree-check" @tap.stop="_treeItemSelect(item, index)" v-if="selectParent?true:item.lastRank">
								<view class="tki-tree-check-yes" v-if="item.checked" :class="{'radio':!multiple}" :style="{'border-color':confirmColor}">
									<view class="tki-tree-check-yes-b" :style="{'background-color':confirmColor}"></view>
								</view>
								<view class="tki-tree-check-no" v-else :class="{'radio':!multiple}" :style="{'border-color':confirmColor}"></view>
							</view>
						</view>
					</block>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import config from '@/common/config.js'
	export default {
		name: "tki-tree",
		props: {
			defValue:{
				type:String,
				default:''
			},
			range: {
				type: Array,
				default: function() {
					return []
				}
			},
			idKey: {
				type: String,
				default: 'id'
			},
			rangeKey: {
				type: String,
				default: ''
			},
			title: {
				type: String,
				default: ''
			},
			multiple: { // 是否可以多选
				type: Boolean,
				default: false
				// default: true
			},
			selectParent: { //是否可以选父级
				type: Boolean,
				default: false
			},
			foldAll: { //折叠时关闭所有已经打开的子集，再次打开时需要一级一级打开
				type: Boolean,
				default: false
			},
			confirmColor: { // 确定按钮颜色
				type: String,
				default: '' // #07bb07
			},
			cancelColor: { // 取消按钮颜色
				type: String,
				default: '' // #757575
			},
			titleColor: { // 标题颜色
				type: String,
				default: '' // #757575
			},
			currentIcon: { // 展开时候的ic
				type: String,
				default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAABRCAYAAACqj0o2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MEQ0QTM0MzQ1Q0RBMTFFOUE0MjY4NzI1Njc1RjI1ODIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MEQ0QTM0MzU1Q0RBMTFFOUE0MjY4NzI1Njc1RjI1ODIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowRDRBMzQzMjVDREExMUU5QTQyNjg3MjU2NzVGMjU4MiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowRDRBMzQzMzVDREExMUU5QTQyNjg3MjU2NzVGMjU4MiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PidwepsAAAK0SURBVHja7JxbTsJAFIYHww7ciStgCeoGvGxAiOsgURegoL5720AXYLiIr0aJviq3Zx3PhIEnKG3ndtr+f3KixrSUj/ZjzjClIqUUiFm2gAAQAREQEUAEREAERAQQAREQAREBREAEREBEEqa67h9RFDWllDv0awWYlqlQHmu1WjMRRMoV1QFttA12y3xRtdNczq8EsE4/f8FumX2q77ROvNXk8UGMEKdUz6tYJHljaZAbuyUH+UR1to5BEohTuqwPCeS4pAA/qY6o/kyHOAMCeRK3owJnj+rH1jjxhqpVsstaebCz6TmnHWyXyY+xHjSBWBY/bvSgadtXBj9u9KCN3rnIfkzkQVsTEEX0Y2IP2oKo/HhMICcFAThUcwVZNGU6FdbX/XURzkbVF4+ybGhjPrFdgP66QdXNurGtSdk6Xdb9nAJ8oDo3OQlsQZzkdPw41ONBo6vI5scDefRjZg+6gpg3Pxp50CXEvPjR2IOuIXL3oxUPuobI3Y9WPOgDIlc/WvOgL4iL/vqFCcD7LH0xB4hj7cfQ/fWH9qCT+FhG0tN+DBk1PzjOM0SVllixcsBT1AvYc/kAPhc0hRg/3uvxoCgKRN9+dOrBUBB9+9GpB0NC9OVH5x4MDdG1H714kANEV3705kEOEBf9dcPi/lQnsuvLg1wgSu3Ha0v7Uh4MMgUXeuG71H407a+VBy9CPQkOdw+MtB+nGbd/D+FBbhBNxo9SjwcngJjNj0E9yBFiFj8G9SBXiGn8GNyDnCEm8SMLD3KHGOdHNh7kDjHOj2w8mAeIi/5arX+c6b/fxHz9oADEdGdjR/fXCw/OOB5oVfCOgnepz8IB14PMw03jCmTE+QBx5z0gAmKSqK9OUF+hcAeIhu/QYr4Qie8rjW83hhMBERARQAREQAREBBABERCLnH8BBgA+TQI7U4t53AAAAABJRU5ErkJggg=='
			},
			defaultIcon: { // 折叠时候的ic
				type: String,
				default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAABRCAYAAACqj0o2AAACE0lEQVR4Xu3c200DMRCF4XEltJAOkEugA+ggpUAHoQMqiFMCdEAJUMEiS4mEELlIO7bPOeN9i6K1rG/952myyea1WiCtXmEuYBPR4RBMxInoIOCwhOtJLKVszWyXc/5y2BvNEq6I+/3+kFK6M7OHnPM7jcLKjbZAvD/uaZtzflm5P4rbWyJWgDcze1LPuzVihfxUz7sH4ilJ2bx7Isrm3RtRMu8RiHJ5j0SUyXs0okTeCIj0eSMh0uaNhkiZNyIiXd7IiDR5oyNS5M2ACJ83EyJs3myIkHkzIsLlzYwIkzc7IkTeCojD81ZCHJa3GuKQvBURu+etjNgtb3XELnlHQGyedyTEZnlHQ2ySd0RE97wjI7rlHR3RJe+JeIrbLOecD6ePpZQ6W1kn2epo4MUrPOKyLN8ppYq1+y1VStncOjIdGnFZlo+U0uOtWOeOY2TE12Ouq//pEA7xXL7XfvcufR8K0Svfv6CREN3yDYfYIt9QiK3yjYTYLF95xB75SiP2ylcZsVu+cogj8pVCHJWvEuKwfOkREfKlRkTJlxkRJl86RMR8qRBR82VChM0XHpEhX2hElnyREWnyhUNkzBcKkTVfJETafIcjKuQ7FFEl35GIMvl2R1TMtyuiar49EWXzbY5oZpv/hibXTF2h3+s60FRKeT6+3TjMS3nrA3ZFRD8xrfY3ER1kJ+JEdBBwWGKeRAfEH1wS5WFZSDB/AAAAAElFTkSuQmCC'
			},
			lastIcon: { // 没有子集的ic
				type: String,
				default: ''
			},
			border: { // 是否有分割线
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				showTree: false,
				treeList: [],
				selectIndex: -1,
				filterText:""
			}
		},
		
		methods: {
			// filterList () {
			// 	var arr = []
			// 	this.treeList.forEach((item,index) => arr.push(item));
			
			// 	// if (this.filterText) {
			// 	// 	arr = this.list.filter(item => item.taskNumber.includes(this.filterText))
			// 	// }
			// 	// return arr
			// },
			
			
			_show() {
				this.showTree = true
			},
			_hide() {
				this.showTree = false
			},
			_cancel() {
				this._hide()
				this.$emit("cancel", '');
			},
			
			_confirm() {
				// this.filterList()
				// 处理所选数据
				let rt = [],
					obj = {};
				this.treeList.forEach((v, i) => {
					if (this.treeList[i].checked) {
						obj = {}
						obj.parents = this.treeList[i].parents
						obj = Object.assign(obj, this.treeList[i].source)
						// 移除子元素
						delete obj.ChildNodes
						rt.push(obj)
					}
				})
				this._hide()
				
				if (rt.length > 0) {
					this.$emit("confirm", rt,this.treeList);
				} else {
					this.$emit("confirm",rt,this.treeList);
					uni.$u.toast('未选择!');
				}
			},
			
			//扁平化树结构
			_renderTreeList(list = [], rank = 0, parentId = [], parents = []) {
				if(list != ''){
					list.forEach(item => {
						this.treeList.push({
							id: item[this.idKey],
							name: item[this.rangeKey],
							source: item,
							parentId, // 父级id数组
							parents, // 父级id数组
							rank, // 层级
							showChild: false, //子级是否显示
							open: false, //是否打开
							show: rank === 0, // 自身是否显示
							hideArr: [],
							orChecked: item.checked ? item.checked : false,
							checked: item.checked ? item.checked : false,
						})
						if (Array.isArray(item.children) && item.children.length > 0) {
							
							let parentid = [...parentId],
								parentArr = [...parents],
								childrenid = [...childrenid];
							delete parentArr.children
							parentid.push(item[this.idKey]);
							parentArr.push({
								[this.idKey]: item[this.idKey],
								[this.rangeKey]: item[this.rangeKey]
							})
							this._renderTreeList(item.children, rank + 1, parentid, parentArr);
						} else {
							this.treeList[this.treeList.length - 1].lastRank = true;
						}
					})
				}
				
				
			},
			// 处理默认选择
			_defaultSelect() {
				this.treeList.forEach((v, i) => {
					if (v.checked) {
						this.treeList.forEach((v2, i2) => {
							if (v.parentId.toString().indexOf(v2.parentId.toString()) >= 0) {
								v2.show = true
								if (v.parentId.includes(v2.id)) {
									v2.showChild = true;
									v2.open = true;
								}
							}
						})
					}
				})
			},
			// 点击
			_treeItemTap(item, index) {
				if (item.lastRank === true) {
					//点击最后一级时触发事件
					this.treeList[index].checked = !this.treeList[index].checked
					this._fixMultiple(index)
					return;
				}
				let list = this.treeList;
				let id = item.id;
				item.showChild = !item.showChild;
				list.forEach((childItem, i) => {
					if (item.showChild === false) {
						//隐藏所有子级
						if (!childItem.parentId.includes(id)) {
							return;
						}
						if (childItem.lastRank !== true) {
							childItem.showChild = false;
						}
						childItem.show = false;
					} else {
						if (childItem.parentId[childItem.parentId.length - 1] === id) {
							childItem.show = true;
						}
					}
				})
				
			},
			/* 选中 */
			_treeItemSelect(item, index) {
				
				this.treeList[index].checked = !this.treeList[index].checked
				this._fixMultiple(index)
			},
			// 处理单选多选
			_fixMultiple(index) {
				if (!this.multiple) {
					// 如果是单选
					this.treeList.forEach((v, i) => {
						if (i != index) {
							this.treeList[i].checked = false
						} 
					})
				}
			},
			
			// 重置数据
			_reTreeList() {
				this.treeList.forEach((v, i) => {
					this.treeList[i].checked = v.orChecked
				})
			},
			_initTree(range = this.range){
				this.treeList = [];
				this._renderTreeList(range);
				this.$nextTick(() => {
					this._defaultSelect(range)
				})
			}
		},
		watch: {
			range(list) {
				this._initTree(list);
			},
			multiple() {
				if (this.range.length) {
					this._reTreeList();
				}
			},
			selectParent() {
				if (this.range.length) {
					this._reTreeList();
				}
			},
		},
		
		mounted() {
			this._initTree();
			
		},
	}
</script>

<style scoped>
	/* @import "./style.css"; */
	.tki-tree-mask {
		position: fixed;
		top: 0upx;
		left: 0upx;
		right: 0upx;
		bottom: 0upx;
		z-index: 9998;
		background-color: rgba(0, 0, 0, 0.6);
		opacity: 0;
		transition: all 0.3s ease;
		visibility: hidden;
	}
	
	.tki-tree-mask.show {
		visibility: visible;
		opacity: 1;
	}
	
	.tki-tree-cnt {
		position: fixed;
		top: 0upx;
		left: 0upx;
		right: 0upx;
		bottom: 0upx;
		z-index: 9999;
		top: 652upx;
		transition: all 0.3s ease;
		transform: translateY(100%);
	}
	
	.tki-tree-cnt.show {
		transform: translateY(0);
	}
	
	.tki-tree-bar {
		background-color: #fff;
		height: 88upx;
		padding-left: 20upx;
		padding-right: 20upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		border-bottom-width: 1upx !important;
		border-bottom-style: solid;
		border-bottom-color: #c8c7cc;
		font-size: 32upx;
		color: #757575;
		line-height: 1;
	}
	
	.tki-tree-bar-confirm {
		color: #4869EE;
	}
	
	.tki-tree-bar-cancel {
		color: #9A9A9A;
	}
	
	.tki-tree-view {
		position: absolute;
		top: 0upx;
		left: 0upx;
		right: 0upx;
		bottom: 0upx;
		top: 88upx;
		background-color: #fff;
		padding-top: 20upx;
		padding-right: 20upx;
		padding-bottom: 20upx;
		padding-left: 20upx;
	}
	
	.tki-tree-view-sc {
		height: 100%;
		overflow: hidden;
	}
	
	.tki-tree-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 26upx;
		color: #757575;
		line-height: 1;
		height: 0;
		opacity: 0;
		transition: 0.2s;
		position: relative;
		overflow: hidden;
	}
	
	.tki-tree-item.show {
		height: 80upx;
		opacity: 1;
	}
	
	.tki-tree-item.showchild:before {
		transform: rotate(90deg);
	}
	
	.tki-tree-item.last:before {
		opacity: 0;
	}
	
	.tki-tree-icon {
		width: 26upx;
		height: 26upx;
		margin-right: 8upx;
	}
	
	.tki-tree-label {
		flex: 1;
		display: flex;
		align-items: center;
		height: 100%;
		line-height: 1.2;
	}
	
	.tki-tree-check {
		width: 40px;
		height: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.tki-tree-check-yes,
	.tki-tree-check-no {
		width: 20px;
		height: 20px;
		border-top-left-radius: 20%;
		border-top-right-radius: 20%;
		border-bottom-right-radius: 20%;
		border-bottom-left-radius: 20%;
		border-top-width: 1upx;
		border-left-width: 1upx;
		border-bottom-width: 1upx;
		border-right-width: 1upx;
		border-style: solid;
		border-color: #07bb07;
		display: flex;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
	}
	
	.tki-tree-check-yes-b {
		width: 12px;
		height: 12px;
		border-top-left-radius: 20%;
		border-top-right-radius: 20%;
		border-bottom-right-radius: 20%;
		border-bottom-left-radius: 20%;
		background-color: #07bb07;
	}
	
	.tki-tree-check .radio {
		border-top-left-radius: 50%;
		border-top-right-radius: 50%;
		border-bottom-right-radius: 50%;
		border-bottom-left-radius: 50%;
	}
	
	.tki-tree-check .radio .tki-tree-check-yes-b {
		border-top-left-radius: 50%;
		border-top-right-radius: 50%;
		border-bottom-right-radius: 50%;
		border-bottom-left-radius: 50%;
	}
	
	.hover-c {
		opacity: .6;
	}
</style>
