<template>
	<view>
		<!-- <view class='search-input'><label class='iconfont icon-sousuo' />
			<input type='text' v-model='search' confirm-type='search' class='font-size30' placeholder='搜索' />
		</view> -->
		<view class='list' v-if='starflows.length'>
			<u-swipe-action>
				<u-swipe-action-item ref='swipeActionItem' v-for='(item, index) in starflows' :options='options'
					:key='index' @click='removeDetils(item, index)'>

					<view class='item' @click.stop='starflow(item)'>
						<view class='item-head item-part'>
							<text class='font-size30 color-3A3A3A'>
								{{ item.F_FullName }}
							</text>
							<view class='font-size24 color-9A9A9A'>
								{{ item.F_CreatorTime }}
							</view>
						</view>
						<view class='item-foot item-part'>
							<view class='font-size24 color-9A9A9A'>
								{{ item.F_EnCode }}
							</view>
							<view class='font-size24' :class='item.Status.statecss'>
								{{ item.Status.text }}
							</view>
						</view>
					</view>
				</u-swipe-action-item>
			</u-swipe-action>
		</view>

		<view class='noContent' v-else>
			<view class=''> 暂无数据</view>
		</view>
	</view>
</template>

<script>
	import {
		getFlowLaunch,
		delFlowLaunch
	} from '@/api/work.js';
	import helper from '@/common/helper.js';
	import config from '@/common/config.js';

	function flowUrgentlook(value) {
		let state;
		switch (value) {
			case 1:
				state = {
					urgstate: '普通',
					statecs: 'background-21B185'
				};
				break;
			case 2:
				state = {
					urgstate: '重要',
					statecs: 'background-FFAC05'
				};
				break;
			case 3:
				state = {
					urgstate: '紧急',
					statecs: 'background-FE5146'
				};
				break;
			default:
				state = {
					urgstate: '普通',
					statecs: 'background-21B185'
				};
				break;
		}
		return state;
	}

	export default {
		data() {
			return {
				isFirstShow: true,
				F_Id: null,
				processData: [{
						text: '编辑',
						status: 'edit'
					},
					{
						text: '提交审核',
						status: 'submit'
					}
				],
				rows: 10,
				page: 1,
				total: 1,
				height: 0,
				search: '',
				starflows: [],
				eventindex: 0,
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				status: "loadmore",
				databcolor: '',
				height1: '',
			};
		},
		computed: {
			starflowList: function() {
				let search = this.search;
				if (search) {
					return this.starflows.filter(function(product) {
						return Object.keys(product).some(function(key) {
							return String(product[key]).toLowerCase().indexOf(search) > -1;
						});
					});
				}
				return this.starflows;
			}
		},
		// #ifdef MP
		onUnload(e) {
			this.$helper.removeStorage();
		},
		// #endif
		onShow() {
			if (this.isFirstShow) {
				this.init().then(() => { this.isFirstShow = false })
			} else {
				this.page = 1
				this.starflows = []
				this.status = "loadmore"
				this.init()
			}
		},
		/* 监听返回 */
		onBackPress(e) {
			/* 删除缓存 */
			uni.removeStorageSync('startedTitle');
			uni.removeStorageSync('F_Status');
		},
		onReachBottom() {
			if (this.status == "loading" || this.status == "nomore") return
			this.status = "loading"
			this.init()
		},
		methods: {
			init() {
				return new Promise(resolve => {
					let _this = this;
					getFlowLaunch({
						pageSize: this.rows, //每页行数
						currentPage: this.page //当前页
					}).then((res) => {

						let _flows = res.data.list;
				 	// console.log(_flows)
						let starflows = []
						for (let i = 0; i < _flows.length; i++) {
							starflows.push({
								F_Id: _flows[i].id,
								F_FlowId: _flows[i].flowId,
								F_FullName: _flows[i].fullName,
								F_CreatorTime: helper.toDate(_flows[i].creatorTime, 'MM-dd'),
								F_EnCode: _flows[i].enCode,
								F_FlowCode: _flows[i].flowCode,
								F_Status: _flows[i].status,
								F_FormType: _flows[i].formType,
								Status: helper.flowStatus(_flows[i].status),
								F_FlowUrgent: flowUrgentlook(_flows[i].flowUrgent),
								FlowUrgent: flowUrgentlook(_flows[i].flowUrgent),
								type: 'started'
							});
						}
						if (this.starflows.length < res.data.pagination.total) {
							this.starflows = this.starflows.concat(starflows)
							this.page++
						}
						this.status = this.starflows.length == res.data.pagination.total ?
							"nomore" : 'loadmore'
							resolve()
					});
				})

			},

			starflow(e, index) {
				// console.log(e)
				/* 保存状态类型 */
				uni.setStorageSync('type', e.type);
				/* 保存状态类型 */
				uni.setStorageSync('F_Status', e.F_Status);
				/* 保存标题 */
				uni.setStorageSync('startedTitle', e.F_FullName);
				/* 保存列表id */
				this.F_Id = e.F_Id;
				const _flowname = e.F_FlowCode.toLowerCase();
				let status = e.F_Status;
				let disabled;
				switch (status) {
					case 1: //等待审核
						// status = 'started';
						disabled = true;
						break;
					case 2: //审核通过
						// status = 'end';
						disabled = true;
						break;
					case 3: //审核驳回
						// status = 'add';
						disabled = false;
						break;
					case 4: //审核撤回
						// status = 'add';
						disabled = false;
						break;
					case 5: //审核终止
						// status = 'add';
						disabled = false;
						break;
					default:
						//等待提交
						// status = 'add';
						disabled = false;
						break;
				}
				// console.log(e)
				let flowInfo = {
					disabled: disabled,
					operstate: 'info',
					status: status,
					flowId: e.F_FlowId,
					id: e.F_Id
				};
				let _url = '';
				if (e.F_FlowCode.indexOf('crmOrder') >= 0) {
					// console.log(status)
					if (status == null || status == 3 || status == 4) {
						_url =
							'/pages/apply/apply/ordermanagelist/formNew?id=' +
							e.F_Id +
							'&status=' +
							status;
					} else if (status == 1 || status == 2) {
						_url =
							'/pages/apply/apply/ordermanagelist/formNew?id=' +
							e.F_Id +
							'&status=' +
							status;
					}
				} else {
					this.$store.state.workflow.flowfromId = e.F_Id;
					if (e.F_FormType == 2) {
						flowInfo.initId = e.F_FlowId;
						_url =
							'/subPages/workflow/flowchart/form?flowInfo=' +
							JSON.stringify(flowInfo);
					} else {
						flowInfo.flowId = e.F_FlowId;
						flowInfo.id = e.F_Id;
						_url =
							'/subPages/workflow/flowchart/' +
							_flowname +
							'/' +
							'form?flowInfo=' +
							JSON.stringify(flowInfo);
					}
				}

				let pages = getCurrentPages();
				uni.navigateTo({
					url: _url,
					success: (res) => {},
					fail: () => {},
					complete: () => {}
				});
			},

			/* 流程选择取消事件 */
			cancel() {
				this.$refs.process.close();
			},

			/* 左滑删除 */
			removeDetils(item, index) {
				// console.log(item,index)
				// 关闭滑动
				this.$refs.swipeActionItem[index].status = 'close';
				if (item.F_Status == 1) {
					helper.msg('流程正在审核,请勿删除');
					return;
				}
				delFlowLaunch(item.F_Id).then((res) => {
					if (res.code == 200) {
						this.starflows.splice(index, 1);
						helper.msg('删除成功');
					}
				});

			}
		},
	};
</script>

<style lang='scss'>
	page {
		background-color: #f0f2f6;
	}

	/* 底部流程选择 */
	.uni-share {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		background-color: #fff;
	}

	.uni-share-content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: 15px;
	}

	.uni-share-content-image {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		width: 100%;
		padding: 20rpx 0;
		overflow: hidden;
		border-radius: 10rpx;
	}

	.uni-share-content-text {
		font-size: 26rpx;
		color: #333;
		padding-top: 5px;
		padding-bottom: 10px;
	}

	.uni-share-btn {
		height: 90rpx;
		line-height: 90rpx;
		font-size: 14px;
		border-top-color: #f5f5f5;
		border-top-width: 1px;
		border-top-style: solid;
		text-align: center;
		color: #666;
	}

	.uni-item-left-name {
		position: relative;
		/* float: left; */
		width: fit-content;
	}

	.uni-item-left-name .bg1 {
		background: #ff3b3b;
	}

	.cell-navigate::after {
		left: 0;
	}

	.uni-input-placeholder {
		color: #9a9a9a;
	}

	.search-input {
		background-color: #fff;
	}

	.list {
		.item {
			box-sizing: border-box;
			/* #ifndef MP-ALIPAY */
			width: 100%;
			/* #endif */
			box-shadow: 0px 3px 25px 2px rgba(159, 159, 159, 0.1);
			// border-radius: 10upx;
			background-color: #ffffff;
			padding: 0 20upx;

			uni-swipe-action-item,
			.uni-swipe-action {
				border-radius: 10upx;
			}

			.item-content {
				padding: 0 20upx;
			}

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
