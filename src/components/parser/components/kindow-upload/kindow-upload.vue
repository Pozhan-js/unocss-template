<template>
  <view>
    <view class="formgroup_upImage inputtext">
      <view class="border-bottom-E3E3E5" style="padding-bottom: 20rpx">
        <u-upload
		     :accept="accept"
          :maxSize="fileSize * 1024 * 1024"
          :fileList="fileList"
          @afterRead="afterRead"
          @delete="deletePic"
          v-model="valueTitle"
          name="1"
          multiple
          :maxCount="limit"
          :Status="Status"
          :disabled="disabled"
          ref="uUpload"
          class="upload"
        ></u-upload>
      </view>
    </view>
  </view>
</template>

<script>
import config from "@/common/config.js";
let baseUrl = process.env.VUE_APP_API_URL;
export default {
  props: {
    value: "",
	accept:{},
    formOperates: {
      type: Array,
      default() {
        return [];
      },
    },
    disabled: {
      type: Boolean,
      default() {
        return false;
      },
    },
    limit: {
      type: Number,
      default() {
        return 9;
      },
    },
    fileSize: {
      type: Number,
      default() {
        return 2;
      },
    },
    defaultValue:{},
    showLabel: {
      type: Boolean,
      default() {
        return true;
      },
    },
    label: {
      type: String,
      default() {
        return "图片上传";
      },
    },
    __vModel__: {
      type: String
    },
    required: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      valueTitle: "",
      fileList: [],
      action: baseUrl + "/api/mongoFile/Uploader/annexpic",
      showUploadList: false,
      upLoadImgList: [],
      deletable: true,
      Status: 0,
      showProgress: false,
    };
  },
  created() {
    this.setDefaultValue(this.defaultValue);
	  if(this.accept ==='file') {
		  //#ifndef H5
		  // this.fileList = this.value;
		  this.accept = 'all'
		  //#endif
	  }
   

    //动态显示图片删除按钮
    let Status = uni.getStorageSync("F_Status");
    if (Status) {
      this.Status = Status;
      if (this.Status == 1) {
        this.deletable = false;
      }
    }
  },
  watch: {
    value(val) {
		
      val.map((o) => {
        if (typeof o.thumb == "undefined") {
          o.thumb = baseUrl + o.url;
          o.url = o.thumb;
        }
        if (typeof o.url == "object") {
          o.thumb = baseUrl + o.url.url;
          o.url = o.thumb;
        }
      });
      
      this.fileList = val;
    },
  },

  methods: {
    setDefaultValue(val) {
    console.log("defaultValue",val);
       if (val) {
      this.fileList = val.map(item=>{
        item.url = baseUrl + item.url
        return item
      });
    }
    },
    // 删除图片
    deletePic(event) {
      this.fileList.splice(event.index, 1);
    },
	getFileList() {
		return this.fileList
	},
    // 新增图片
    async afterRead(event) {
      // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
      
      let lists = [].concat(event.file);
	  
      let fileListLen = this.fileList.length;
      lists.map((item) => {
        this.fileList.push({
          ...item,
          status: "uploading",
          message: "上传中",
        });
      });
      for (let i = 0; i < lists.length; i++) {
        let result = await this.uploadFilePromise(lists[i].url);
		// result.url = baseUrl + result.url
        
        let item = this.fileList[fileListLen];
        this.fileList.splice(
          fileListLen,
          1,
          Object.assign(item, {
            status: "success",
            message: "",
            url: baseUrl +result.url,
          })
        );
        fileListLen++;
      }
      const inputValArr = this.getValue()

      this.$emit("input", this.__vModel__,inputValArr);
    },
    getValue() {
      let inputValArr = []
      this.fileList.forEach(item=>{
        
        inputValArr.push({
          url: item.url.split(baseUrl)[1],
          name:item.name,
          fileId:item.url
        })
      })
      return inputValArr
    },
    uploadFilePromise(url) {
      return new Promise((resolve, reject) => {
        let a = uni.uploadFile({
          url: this.action, // 仅为示例，非真实的接口地址
          filePath: url,
          header: {
            Authorization: uni.getStorageSync( config.Global.cache + '_Token'),
          },
          name: "file",
          success: (res) => {
            
            resolve(JSON.parse(res.data).data);
          },
        });
      });
    },
  },
};
</script>

<style scoped>
.upload {
    margin: 18.75rpx !important;
}
.border-bottom-E3E3E5 {
    border-bottom: none !important;
}
</style>
