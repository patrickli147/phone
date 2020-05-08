<template>
    <div>
        
    </div>
</template>

<script>
export default {
    mounted() {
        //this.getData();
    },
    data() {
        return {
            //params needed to request data
            paramObj: {
                params: {
                    appid:33879898,
                    appsecret:"YWL6vpDX",
                    version: "v1",
                    city:"重庆"
                }
            },
            //url 
            url: "https://tianqiapi.com/api",
            //another
            path: "http://api.djapi.cn/wannianli/get?token=09ea075120bb237576097903e5d6b05d",
        }
    },
    methods: {
        getData() {
            this.axios.get(this.url, this.paramObj).then((res)=> {
                console.log(res);
            });
        }
    }
}
</script>

<style lang="scss" scoped>

</style>