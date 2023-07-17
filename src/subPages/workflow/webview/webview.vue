<template>
    <view>
        <!--		webView-->
        <web-view :src='webUrl' class='webview' />
    </view>
</template>

<script>
export default {
    data() {
        return {
            webUrl: ''
        };
    },
    onLoad(e) {
        this.webUrl =e.url;
    },
    methods: {}
};
</script>

<style>
.webview {
    width: 100%;
    height: 100%;
}
</style>
