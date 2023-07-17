 <template>
	 <!-- <view :style="style">{{defaultValue}}</view> -->
	 <view>
		 <u--text :customStyle="style" :text="defaultValue" :align="style['text-align']"></u--text>
	 </view>
	 <!-- customStyle -->
 </template>
 
 <script>
	 
 	export default{
 		name:"",
 		data(){
 			return{
				style:this.textStyle
 			}
 		},
 		props:{
 			defaultValue:{},
			textStyle:{}
 		},
		mounted() {
			
			this.style['line-height'] +='rpx'
		},
		methods:{
			
		}
 	}
 </script>
 <style scoped>
	 
 </style>