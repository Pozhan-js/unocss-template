<template>
	<view>
		<u-loadmore :status="status" @loadmore="getMoreData" />
	</view>
</template>

<script>
/**
 * 	加载更多
 * 	@params requestUrl 请求地址
 * 	@params isDateFace 是否是数据接口，默认false
 * 	@params currentPage 当前页
 * 	@params pageSize 每页条数
 * 	@params extraParams 额外参数
 */
import { getModelList, createModel, updateModel, batchOperation } from "@/config/api";
import {
	previewDataInterfacePublic,
	getPublicModelList
} from "@/config/api.js";
export default {
	name: "my-loadmore",
	props: {
        immediate: {
            type: Boolean,
            default: true
        },
		requestUrl: {
			type: String,
			required: true
		},
		isDateFace: {
			type: Boolean,
			default: false
		},
		requestFunc: {
			type: Function,
			required: false
		},
		currentPage: {
			type: Number,
			default: 1
		},
		pageSize: {
			type: Number,
			default: 10
		},
		extraParams: {
			type: Object,
			default: () => {
				return {
					
				};
			}
		}
	},
	data() {
		return {
			status: 'loadmore',
			loadParams: {
				...this.extraParams,
				currentPage: this.currentPage,
				pageSize: this.pageSize,
			},
			loadList: []
		};
	},
	mounted() {
        if(this.immediate) this.getMoreData()
	},
	methods: {
		// 清空数组
		clearList() {
			this.loadList = []
		},
		// 重置参数,并清空数组
		reset(extraParams) {
			// 如果传入了额外参数，则使用传入的参数，否则使用默认参数
			let newExtraParams = extraParams || this.extraParams
            this.setParams(newExtraParams)
			this.loadParams.currentPage = 1
			this.status = 'loadmore'
			this.clearList()
		},
        setParams(params){
            this.loadParams = {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                ...params
			}
			console.log("setParams",this.loadParams);
        },
		// 获取更多数据
		getMoreData() {
			if (this.status == "loading" || this.status == "nomore") return
            console.log("loadParams",this.loadParams);
			this.status = "loading"
			if (this.requestFunc) {
				// 带参执行函数
				this.requestFunc.call(this, this.requestUrl, this.loadParams).then(res => {
					this.handleData(res)
				})
				return
			}
			if (this.isDateFace) {
				previewDataInterfacePublic(this.requestUrl, this.loadParams).then(res => {
					this.handleData(res)
				})
			} else {
				getModelList(this.requestUrl, this.loadParams).then(res => {
					this.handleData(res)
				})
			}

		},
		// 处理数据
		handleData({data}={}) {
			const {pagination={},list=[]} = (data||{});
			let {length}=this.loadList;
			if (length < +pagination.total) {
				this.loadList = this.loadList.concat(list);
				length += list.length;
				this.loadParams.currentPage++
			}
			const state = length === pagination.total>>0 ;
			this.status = state? "nomore" : 'loadmore';
			this.$emit('loadmore', this.loadList);
		}
	}
}
</script>

<style lang="scss">

</style>