<template>
	<view>
		<view class="auditopinion margin-top-20">
			<textarea v-model="flowTaskOperatorRecord.F_HandleOpinion" name="F_HandleOpinion" class="F_HandleOpinion" maxlength="200"
			 :style="'height:' + height + 'px ;'" placeholder-class="font-size32" placeholder="输入审批意见" @focus="focusTextarea" />
			</view>
		<view class="buttom-box">
			<view class="flow-button">
				<button formType="submit" class="btn-same btn-submit" @click="confirmagree">确认{{opinion}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	import graceChecker from '@/common/graceChecker.js'
	import helper from '@/common/helper.js'
	import { getAgree,postAgree } from "@/api/work.js";
	let formRule=[]
	export default {
		data() {
			return {
				height: 0,
				opinion:'',
				agree:'',
				enCode:'',
				pageSize: 15,
				currentPage: 1,
				agreeData:{
					handleOpinion:'this.flowTaskOperatorRecord.F_HandleOpinion',
					formData:{},
					enCode:''
				},
				id:this.flowfromId,
				flowTaskOperatorRecord:{
					F_HandleOpinion:'',
				}
			}
		},
		onLoad(e) {
			this.opinion=e.opinion,
			this.id = e.id,
			uni.setNavigationBarTitle({
				title: '确认'+e.opinion
			});
			if(e.opinion=='撤回'){
				formRule=[
					{name:"F_HandleOpinion",checkType:"notnull",checkRule:"",errorMsg:"意见不能为空"},
				];
			}
		},
		computed: {
			flowfromId: function() {
				return this.$store.state.workflow.flowfromId
			},
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
			confirmagree(){
				// console.log(this.flowfromId, "flowfromId");
				// console.log(this.flowTaskOperatorRecord);
				let auditopinion=this.flowTaskOperatorRecord;
				// this.bus.$emit('auditopinion',auditopinion);
				getAgree().then(res => {
						this.agree = res.data.data;
				});
				postAgree(this.flowfromId,this.agreeData).then(res => {
				}),
				uni.navigateBack();
			},
			focusTextarea(){
				this.height=200
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
