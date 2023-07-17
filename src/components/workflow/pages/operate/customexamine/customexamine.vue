<template>
	<view>
		<form class="flowform" @submit="confirmagree">
			<view class="formlist inputtext ">
				<view class="formgroup border-bottom-E3E3E5">
					<view class="labletitle"><label>审核结束</label></view>
					<view class="controlvalue">
						<switch name="openswitch" checked style="transform: scale(0.7)" @change="changeexamine" />
					</view>
				</view>
			</view>
			<view class="formlist inputtext" @tap="userId">
				<view class="formgroup border-bottom-E3E3E5">
					<view class="labletitle"><label>下一审批人</label></view>
					<view class="controlvalue">
						<input type="text" v-model="flowTaskOperatorRecord.fullName" name="F_UserId" placeholder="选择下一审批人" disabled="true" />
					</view>
					<view class="advanceicon iconfont icon-xiangyou"></view>
				</view>
			</view>
			<view class="formlist">
				<view class="formgroup  padding-17">
					<view class="labletitletar"><label>审批意见</label></view>
					<view class="controlvalue  uni-textarea">
						<textarea v-model="flowTaskOperatorRecord.F_HandleOpinion" name="F_HandleOpinion" class="auditopiniontxt"
						 maxlength="200" placeholder-class="font-size32" placeholder="输入审批意见" @focus="focusTextarea" />
						</view>
				</view>
			</view>

			<view class="buttom-box">
				<view class="flow-button">
					<button formType="submit" class="btn-same btn-submit" form-type="submit">确认{{opinion}}</button>
				</view>
			</view>
		</form>
		<tki-tree ref="tree" :range="treelist" :multiple="multiple" :selectParent="selectParent" rangeKey="fullName"></tki-tree>
	</view>
</template>

<script>
	import helper from '@/common/helper.js'
	import graceChecker from '@/common/graceChecker.js'
    import tkiTree from '@/node_modules/parser/components/tki-tree/tki-tree.vue';
	let formRule=[
		{name:"F_HandleOpinion",checkType:"notnull",checkRule:"",errorMsg:"意见不能为空"},
	];
	export default {
		components:{
			tkiTree
		},
		data() {
			return {
				height: 0,
				opinion:'',
				flowTaskOperatorRecord:{
					F_HandleOpinion:'',
					F_UserId:'',
					userId:'',
					fullName:''
				},
				multiple: false, //多选
				selectParent: false, //父级可选
				UserIdList:[],
				treelist:[],
				isChoice:true
			}
		},
		onLoad(e) {
			this.opinion=e.opinion
			uni.setNavigationBarTitle({
				title: '确认'+e.opinion
			});
			helper.ajax({
				url: 'api/system/Permission/Users/Selector',
				success: res => {
					// console.log(res)
					this.UserIdList = res.data.data.list;
				}
			});
		},
		mounted() {
			let _this = this;
			// 获取设备宽度
			uni.getSystemInfo({
				success: function(res) {
					let auditopinion = uni.createSelectorQuery().select(".buttom-box");
					auditopinion.boundingClientRect(data => {
						_this.height = Math.ceil((res.windowHeight - data.height)-60)
					}).exec();
				}
			});
		},
		methods: {
			/* 选择审批人 */
			userId(e){
				if(!this.isChoice){
					this.isBtnClicks=true;
					this.treelist = this.UserIdList;
					this.$refs.tree._show();
					this.$eventHub.$off('treemodality');
					this.$eventHub.$on('treemodality', (data) => {
						this.flowTaskOperatorRecord.F_UserId=data[0].text;
						this.flowTaskOperatorRecord.userId=data[0].id;
						this.flowTaskOperatorRecord.fullName = data[0].fullName
						this.$eventHub.$off('treemodality');
					});
				}
			},
			/* 点击确认 */
			confirmagree(e){
				var formData = e.detail.value
				if (!graceChecker.check(formData,formRule)) {
					helper.msg('意见不能为空');
					return;
				}
				if (!this.isChoice && formData.F_UserId=='') {
					helper.msg('选择下一审批人');
				} else{
					formData.F_UserId = this.isChoice==true ? '': this.flowTaskOperatorRecord.userId;
					this.bus.$emit('auditopinion',formData);
					uni.navigateBack();
				}
			},

			focusTextarea(){
				this.height=200
			},

			changeexamine(e){
				this.isChoice =e.target.value;
				if(this.isChoice){
					this.flowTaskOperatorRecord.F_UserId='';
				}
			}
		}
	}
</script>

<style>
	.auditopinion{
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.auditopiniontxt{
		width: 92%;
	}
	.btn-same{
		width: 100%;
	}
</style>
