<script>

  export default {
		onLaunch: function() {
			console.log('App Launch')
    },
		onShow: function() {
			console.log('App Show')
      // 检查更新
      this.miniProgramCheckUpdate();
		},
		onHide: function() {
			console.log('App Hide')
		},
    methods:{
      // 检查更新
      miniProgramCheckUpdate() {
        const updateManager = uni.getUpdateManager();
        updateManager.onCheckForUpdate(function (res) {
          // 请求完新版本信息的回调
          console.log("onCheckForUpdater：是否有版本更新", res.hasUpdate);
        });
        updateManager.onUpdateReady(function (res) {
          uni.showModal({
            title: "更新提示",
            showCancel: false,
            confirmText: "马上重启",
            content: "新版本已经上线，需要您重启小程序以应用新版本。",
            success(res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate();
              }
            },
          });
        });

        updateManager.onUpdateFailed(function (res) {
          // 新的版本下载失败
          uni.$u.toast("新版本下载失败，请删除当前小程序，重新搜索打开。");
          console.log("onUpdateFailed", res);
        });
      }
    }
	}
</script>
<style>
.uno-start {
  --un: 0;
}
/* unocss 代码生成在这 */
.uno-end {
  --un: 0;
}

view,:before,:after {
  border-width: 0;
  border-style: solid;
  border-color: #e5e7eb
}
</style>

<style lang="scss">
@import "uview-ui/index.scss";
@import "@/static/css/iconfont.css";
@import "/static/css/common.css";


</style>
