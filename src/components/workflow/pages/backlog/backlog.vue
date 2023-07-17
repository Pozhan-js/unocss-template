<template>
	<view>
		<!-- <view class="search-input"><label class="iconfont icon-sousuo" /><input type="text" v-model="search"
				confirm-type="search" class="font-size30" placeholder="搜索" /></view> -->

		<view class="list" v-if="backflows.length">
			<view class="item" hover-class="uni-list-cell-hover" v-for="(item, index) in backflows" :key="index"
				@tap="backflow(item)">
				<view class="item-head item-part">
					<view class="uni-item-left-name font-size30 color-3A3A3A">{{ item.F_FullName
            }}<!-- <text class="marks" :class="item.FlowUrgent.statecs"></text> -->
					</view>
					<view class="font-size24 color-9A9A9A">{{
            item.F_CreatorTime
          }}</view>
				</view>
				<view class="item-foot item-part">
					<view class="font-size24 color-9A9A9A">{{ item.F_EnCode }}</view>
					<view class="font-size24" :class="item.Status.statecss">{{
            item.Status.text
          }}</view>
				</view>
			</view>
		</view>
		<view class="noContent" v-else>

			<view class=""> 暂无数据 </view>
		</view>
	</view>
</template>

<script>
	import {
		getFlowBefore
	} from "@/api/work.js";
	import helper from "@/common/helper.js";
	import config from "@/common/config.js";

	function flowStatus(value) {
		let state;
		switch (value) {
			case 0:
				state = {
					text: "等待提交",
					statecss: "text-yellow",
				};
				break;
			case 1:
				state = {
					text: "等待审核",
					statecss: "text-yellow",
				};
				break;
			case 2:
				state = {
					text: "审核通过",
					statecss: "text-success",
				};
				break;
			case 3:
				state = {
					text: "审核驳回",
					statecss: "text-red",
				};
				break;
			case 4:
				state = {
					text: "审核撤回",
					statecss: "text-gray",
				};
				break;
			case 5:
				state = {
					text: "审核终止",
					statecss: "text-gray",
				};
				break;
			default:
				state = {
					text: "等待提交",
					statecss: "text-yellow",
				};
				break;
		}
		return state;
	}

	function flowUrgentlook(value) {
		let state;
		switch (value) {
			case 1:
				state = {
					urgstate: "普通",
					statecs: "background-21B185",
				};
				break;
			case 2:
				state = {
					urgstate: "重要",
					statecs: "background-FFAC05",
				};
				break;
			case 3:
				state = {
					urgstate: "紧急",
					statecs: "background-FE5146",
				};
				break;
			default:
				state = {
					urgstate: "普通",
					statecs: "background-21B185",
				};
				break;
		}
		return state;
	}
	export default {
		data() {
			return {
				rows: 10,
				page: 1,
				total: 1,
				height: 0,
				search: "",
				backflows: [],
				status: "loadmore",
				isFirst: true,
			};
		},
		computed: {
			backflowList: function() {
				let search = this.search;
				if (search) {
					return this.backflows.filter(function(product) {
						return Object.keys(product).some(function(key) {
							return String(product[key]).toLowerCase().indexOf(search) > -1;
						});
					});
				}

				return this.backflows;
			},
		},

		onReachBottom() {
			if (this.status == "loading" || this.status == "nomore") return
			this.status = "loading"
			this.init()
		},
		/* 点击返回按钮清除缓存 */
		onBackPress(e) {
			// this.$helper.removeStorage();
		},
		// #ifdef MP
		onUnload(e) {
			// this.$helper.removeStorage();
		},
		// #endif
		onShow() {
			if(this.isFirst) {
				this.init().then(()=>this.isFirst = false)
			} else {
				this.page = 1
				this.backflows = []
				this.status = "loadmore"
				this.init()
			}
		},
		methods: {
			init() {
				return new Promise((resolve) => {
					let _this = this;

					getFlowBefore(1, {
						pageSize: _this.rows, //每页行数
						currentPage: this.page, //当前页
					}).then((res) => {

						let _flows = res.data.list;
						let flows = []
						for (let i = 0; i < _flows.length; i++) {
							flows.push({
								F_Id: _flows[i].id,
								F_FlowId: _flows[i].flowId,
								F_FullName: _flows[i].fullName,
								F_CreatorTime: helper.toDate(_flows[i].creatorTime, "MM-dd"),
								F_EnCode: _flows[i].enCode,
								F_FlowCode: _flows[i].flowCode,
								F_Status: _flows[i].status,
								Status: flowStatus(_flows[i].status),
								F_ProcessId: _flows[i].processId,
								F_FormType: _flows[i].formType,
								F_FlowUrgent: flowUrgentlook(_flows[i].flowUrgent),
								FlowUrgent: flowUrgentlook(_flows[i].flowUrgent),
								type: "backlog",
							});
						}
						if (this.backflows.length < res.data.pagination.total) {
							this.backflows = this.backflows.concat(flows)
							this.page++
						}
						this.status = this.backflows.length == res.data.pagination.total ?
							"nomore" : 'loadmore'
							resolve()
					});
				})

			},

			backflow(e) {
				uni.setStorageSync("type", e.type);
				/* 保存状态类型 */
				uni.setStorageSync("F_Status", e.F_Status);
				// console.log(e)
				uni.setStorage({
					key: "F_FullName",
					data: e.F_FullName,
				});
				uni.setStorageSync("transferId", e.F_Id);
				const _flowname = e.F_FlowCode.toLowerCase();
				let flowInfo = {
					disabled: true,
					operstate: "info",
					id: e.F_ProcessId,
					status: e.F_Status,
					transferId: e.F_Id,
				};
				let _url;

				if (e.F_FlowCode.indexOf("crmOrder") >= 0) {
					this.$store.state.workflow.flowfromId = e.F_Id;
					_url =
						"/pages/apply/apply/ordermanagelist/formNew?id=" +
						flowInfo.id +
						"&status=" +
						e.F_Status;
				} else {
					this.$store.state.workflow.flowfromId = e.F_Id;
					if (e.F_FormType == 2) {
						flowInfo.initId = e.F_FlowId;
						_url =
							"/subPages/workflow/flowchart/form?flowInfo=" +
							JSON.stringify(flowInfo);
					} else {
						flowInfo.flowId = e.F_FlowId;
						flowInfo.id = e.F_ProcessId;
						_url =
							"/subPages/workflow/flowchart/" +
							_flowname +
							"/" +
							"form?flowInfo=" +
							JSON.stringify(flowInfo);
					}
				}
				this.$store.state.workflow.flowfromId = e.F_Id;
				uni.navigateTo({
					url: _url,
					success: (res) => {},
					fail: () => {},
					complete: () => {},
				});
			},
		},

	};
</script>

<style lang="scss">
	page {
		background-color: #f0f2f6;
	}

	.uni-item-left-name {
		position: relative;
		/* float: left; */
		width: fit-content;
	}

	.cell-navigate::after {
		left: 0;
	}

	.search-input {
		background-color: #fff;
	}

	.list {
		padding: 0 20upx;

		.item {
			margin-bottom: 20upx;
			box-shadow: 0px 3px 25px 2px rgba(159, 159, 159, 0.1);
			border-radius: 10upx;
			padding: 0 20upx;
			background-color: #fff;

			.item-part {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.item-head {
				border-bottom: 1upx solid #e5e5e5;
				height: 90upx;
			}

			.item-foot {
				height: 68upx;
			}
		}
	}
</style>
