<template>
	<view class="main-size flex-column flex-sb">
		<image style="width: 100%; height: 550rpx;"
			src="https://kindoucloud.com:8011/api/file/Image/systemicon/test/20221107_96c4075c762e480aa27d42b6c9ae63f6.png">
		</image>
		<view class="flex-1 form flex-column">
			<view class="phone flex-ai">
				<image
					src="https://kindoucloud.com:8011/api/file/Image/systemicon/test/20221107_f8da3821c5424c3980921512ba7f3fbe.png">
				</image>
				<view class="fixed-phone">+86</view>
				<u--input placeholder="请输入手机号" type="number" border="none" maxlength="11" :customStyle="{'background':'#f6f6f6'}"
					v-model="phone" shape="circle">
				</u--input>
			</view>
			
			<view></view>
			<view class="code flex-ai">
				<view class="input-code flex-ai flex-1">
					<image
						src="https://kindoucloud.com:8011/api/file/Image/systemicon/test/20221107_8ac6abc12c1943c7a6a4a61dbf4dc9e6.png">
					</image>
					<u--input placeholder="请输入验证码" type="number" border="none" maxlength="6" :customStyle="{'background':'#f6f6f6'}"
						v-model="code" shape="circle">
					</u--input>
				</view>
				
				<view class="send-code flex-center" @click="getCode">
					{{tips}}
				</view>
			</view>
			
			<view class="login-btn flex-center" @click="login">
				立即登录
			</view>
			<view class="flex-ai margin-top-20" style="margin: 0 auto;">
				<u-checkbox-group placement="column"  v-model="agreement">
					<u-checkbox name="agreement" shape="circle" label="已阅读并同意" labelSize="24rpx">
					</u-checkbox>
				</u-checkbox-group>
				<u--text type="primary" text="《注册会员服务条款》" size="24rpx"></u--text>
			</view>
			<u-code :seconds="seconds" @start="start" ref="uCode" @change="codeChange"></u-code>
		</view>

		<image style="width: 100%; height: 260rpx;"
			src="https://kindoucloud.com:8011/api/file/Image/systemicon/test/20221107_2b4505308be040c2acdff9bb527f6cd4.png">
		</image>
	</view>
</template>

<script>
	import {
		userSendCode,
		userLogin
	} from '@/api/user'
	import {userMixin} from "@/common/user-mixin.js"
	export default {
		mixins:[userMixin],
		data() {
			return {
				agreement:[],
				tips:"发送验证码",
				phone: "",
				code: "",
				seconds: 60,
			}
		},
		methods: {
			login() {
				if(!this.$u.test.mobile(this.phone)) {
					uni.showToast({
						title:"手机号格式不正确",
						icon:"error"
					})
					return
				}
				if(uni.$u.test.isEmpty(this.code.length)) {
					uni.showToast({
						title:"验证码为空",
						icon:"error"
					})
					return
				}
				if(!this.agreement.length) {
					uni.showToast({
						title:"请阅读并同意下方协议",
						icon:"error"
					})
					return
				}
				this.mixinCodeLogin(this.code,this.phone).then(res=>{
					this.$u.toast("登录成功")
					setTimeout(()=>uni.reLaunch({url:"/pages/index/index"}),2000)
				})
			},
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
				if(!this.$u.test.mobile(this.phone)) {
					uni.showToast({
						title:"手机号格式不正确",
						icon:"error"
					})
					return
				}
				if (this.$refs.uCode.canGetCode) {
					this.$refs.uCode.start();
				}
			},
			start() {
				userSendCode(this.phone).then(res=>{
					uni.$u.toast('发送成功');
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.form {
		padding: 30rpx;
		.login-btn {
			margin: 50rpx auto;
			color: #FFFFFF;
			padding: 15rpx;
			border-radius: 40rpx;
			background: #1959F6;
			font-size: 30rpx;
			width: 95%;
		}
	}

	.phone {
		background: #f6f6f6;
		padding: 20rpx;
		width: 95%;
		margin: 0 auto;
		border-radius: 40rpx;

		&>image {
			width: 36rpx;
			height: 36rpx;
		}

		.fixed-phone {
			font-size: 28rpx;
			margin: 0 15rpx;
			color: #333333;
		}
	}

	.code {
		width: 90%;
		margin-top: 30rpx;
		margin-left: 15rpx;
		.input-code {
			border-radius: 40rpx;
			padding: 20rpx;
			background: #f6f6f6;
			&>image {
				margin-right: 10rpx;
				width: 36rpx;
				height: 36rpx;
			}
		}
		
		
		.send-code {
			margin-left: 15rpx;
			font-size: 28rpx;
			font-weight: 400;
			color: #1959F6;
			padding: 10rpx;
			background: #FFFFFF;
			border-radius: 50rpx;
			border: 1rpx solid #1959F6;
		}
	}
</style>
