<template>
    <div>
        <img :src="uimg" alt="">
    </div>
</template>

<script>
import Unsplash, { toJson } from "unsplash-js";


export default {
    mounted() {
        //this.getData();
        //this.unsplash();
        
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
            path: "https://api.djapi.cn/wannianli/get?token=09ea075120bb237576097903e5d6b05d",
            //unsplash api
            uapi: 'https://unsplash.it/1600/900?random',
            //unsplash img
            uimg: '',
            //test
            testUrl: 'https://i.picsum.photos/id/1050/1600/900.jpg',
            ano: 'https://picsum.photos/200/300',
            dogApi: 'https://dog.ceo/api/breeds/image/random'

        }
    },
    methods: {
        getData() {
            // this.axios.get(this.url, this.paramObj).then((res)=> {
            //     console.log(res);
            // });
            // this.axios.get(this.path).then((res) => {
            //     c 
            // })

                        

            /*
            this.axios.get('https://api.djapi.cn/wannianli/get?token=09ea075120bb237576097903e5d6b05d', {
                date: '20200202'
            }).then((res)=> {
                console.log(res);
            })
            */

           
        },
        //comment
        comment() {
            /**
             * @func
             * @todo 这个函数需要优化
             * @desc 一个带参数的函数
             * @param {string} a - 参数a
             * @param {number} b=1 - 参数b默认值为1
             * @param {string} c=1 - 参数c有两种支持的取值</br>1—表示x</br>2—表示xx
             * @param {object} d - 参数d为一个对象
             * @param {string} d.e - 参数d的e属性
             * @param {string} d.f - 参数d的f属性
             * @param {object[]} g - 参数g为一个对象数组
             * @param {string} g.h - 参数g数组中一项的h属性
             * @param {string} g.i - 参数g数组中一项的i属性
             * @param {string} [j] - 参数j是一个可选参数 
             * @returns {boolean} 返回值为true
             */


        },
        //unsplash
        unsplash() {
            const unsplash = new Unsplash({
                accessKey: "GT_Bfahw73NpMk9NHvcCMqBIyZIpxdhY4qMbCV3TgPM",
                // Optionally you can also configure a custom header to be sent with every request
                headers: {
                    "X-Custom-Header": "foo"
                },
                timeout: 500 // values set in ms
            });

            unsplash.search.photos("dogs", 1, 10, { orientation: "portrait" })
                .then(toJson)
                .then(res => {
                    console.log(res);
                    localStorage.setItem("tempData", JSON.stringify(res));
            });
        }
    }
}
</script>

<style lang="scss" scoped>
div {
    color: rgb(18,150,219);
}
</style>