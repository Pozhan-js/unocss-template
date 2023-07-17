<template>
 	<view class="flex-column">
 		<view class="value" :style="'textAlign:'+position">{{defaultValue}}</view>
 		<u-divider text="" ></u-divider>
 	</view>
 </template>

 <script>
 	export default {
 		name: "",
 		data() {
 			return {}
 		},
 		props: {
 			defaultValue: {},
 			position: {}
 		},
 		methods: {

 		}
 	}
 </script>
 <style scoped>
 	.value {
 		color: #606266;
 		font-size: 36rpx;
 		line-height: 50rpx;
		font-weight: bold;
 	}
 </style>
