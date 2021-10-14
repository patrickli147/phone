export default (element) => {
    const offsetObj = {
        x: 0,
        y: 0
    };

    while (element) {
        //console.log(element.offsetLeft);
        offsetObj.x += element.offsetLeft;
        offsetObj.y += element.offsetTop;
        element = element.offsetParent;
    }

    //得到相对坐标
    offsetObj.x -= document.body.scrollLeft;
    offsetObj.y -= document.body.scrollTop;

    return offsetObj;
}
