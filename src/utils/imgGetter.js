import Mock from 'mockjs';    
    
/**
 * @func
 * @desc 利用url请求图片
 * @param {string} url 要请求的img的url
 * @param {object} ctx this
 * @returns {string} 返回供img标签使用的url（base64）
 */
export default async (url, ctx) => {
    let res = null;
    try {
        res = await ctx.axios.get(url, {
            responseType: 'arraybuffer'
        });
    } catch(err) {
        console.log(err);
        //请求失败，用mock代替
        let mockUrl = Mock.Random.dataImage();
        return Promise.resolve(mockUrl);
    }
    
    if (!res) {
        //请求失败，用mock代替
        let mockUrl = Mock.Random.dataImage();
        return Promise.resolve(mockUrl);
    }
    else {
        let resData = res.data;
        let resFormat = res.headers['content-type'];

        //转为base64
        let base64Url = await new Buffer(resData, 'binary').toString('base64');

        return Promise.resolve('data:' + resFormat + ';base64,' + base64Url);
    }
}