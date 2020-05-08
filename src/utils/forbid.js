//禁用后退

export default ()=> {
    //等待历史记录变化之后再添加空地址，使空地址能准确添加到栈顶
    setTimeout(() => {
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', ()=>{
            history.pushState(null, null, document.URL);
        });
    }, 500);
}

