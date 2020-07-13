//函数节流
export default (func, delay = 1000) => {
    var timer = null;
    var startTime = Date.now();
    
    return function(...args) {
        let currentTime = Date.now();
        let remainingTime = delay - (currentTime - startTime);
        let context = this;
                
        if (timer) {
            clearTimeout(timer);
        }

        if (remainingTime <= 0) {
            func.call(context, ...args);
            startTime = Date.now();
        }
        else {
            timer = setTimeout(function() {
                func.call(context, ...args);
                startTime = Date.now();
            }, remainingTime);
        }

    }
}
